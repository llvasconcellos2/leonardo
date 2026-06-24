import fs from "node:fs";
import { SQL_DUMP_PATH, TABLE_PREFIX } from "./constants";
import { fixMojibake } from "./mojibake";

export type SqlValue = string | number | null;
export type SqlRow = Record<string, SqlValue>;

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

/**
 * Walk one VALUES blob (everything between the first row's opening "(" and the
 * statement-terminating ";", exclusive) and split it into raw row-tuple inner
 * texts, tracking quote state and paren depth so commas/parens inside quoted
 * text-column values never get mistaken for structural delimiters.
 */
function splitRows(valuesBlob: string): string[] {
  const rows: string[] = [];
  let depth = 0;
  let inString = false;
  let start = -1;
  for (let i = 0; i < valuesBlob.length; i++) {
    const ch = valuesBlob[i];
    if (inString) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === "'") {
        if (valuesBlob[i + 1] === "'") {
          i++;
          continue;
        }
        inString = false;
      }
      continue;
    }
    if (ch === "'") {
      inString = true;
      continue;
    }
    if (ch === "(") {
      if (depth === 0) start = i + 1;
      depth++;
      continue;
    }
    if (ch === ")") {
      depth--;
      if (depth === 0 && start !== -1) {
        rows.push(valuesBlob.slice(start, i));
        start = -1;
      }
      continue;
    }
  }
  return rows;
}

/** Split one row's raw inner text into top-level comma-separated field tokens. */
function splitFields(row: string): string[] {
  const fields: string[] = [];
  let depth = 0;
  let inString = false;
  let fieldStart = 0;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (inString) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === "'") {
        if (row[i + 1] === "'") {
          i++;
          continue;
        }
        inString = false;
      }
      continue;
    }
    if (ch === "'") {
      inString = true;
      continue;
    }
    if (ch === "(") {
      depth++;
      continue;
    }
    if (ch === ")") {
      depth--;
      continue;
    }
    if (ch === "," && depth === 0) {
      fields.push(row.slice(fieldStart, i));
      fieldStart = i + 1;
    }
  }
  fields.push(row.slice(fieldStart));
  return fields;
}

function decodeSqlField(raw: string): SqlValue {
  const trimmed = raw.trim();
  if (trimmed === "NULL") return null;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith("'") && trimmed.endsWith("'") && trimmed.length >= 2) {
    const inner = trimmed.slice(1, -1);
    let result = "";
    for (let i = 0; i < inner.length; i++) {
      const ch = inner[i];
      if (ch === "\\") {
        const next = inner[i + 1];
        switch (next) {
          case "n":
            result += "\n";
            i++;
            break;
          case "r":
            result += "\r";
            i++;
            break;
          case "t":
            result += "\t";
            i++;
            break;
          case "0":
            result += "\0";
            i++;
            break;
          case "Z":
            result += "\x1a";
            i++;
            break;
          case "'":
            result += "'";
            i++;
            break;
          case '"':
            result += '"';
            i++;
            break;
          case "\\":
            result += "\\";
            i++;
            break;
          default:
            // MySQL: backslash before any other char is just that char literally.
            if (next !== undefined) {
              result += next;
              i++;
            } else {
              result += "\\";
            }
        }
        continue;
      }
      if (ch === "'" && inner[i + 1] === "'") {
        result += "'";
        i++;
        continue;
      }
      result += ch;
    }
    return fixMojibake(result);
  }
  // Unquoted, non-numeric token (shouldn't normally occur in this dump's columns).
  return trimmed;
}

/**
 * Find every `INSERT INTO \`table\` VALUES (...);` statement for a table
 * (mysqldump may chunk a single table across several INSERT statements) and
 * return the raw VALUES-blob text of each, by scanning character-by-character
 * for the top-level statement-terminating semicolon rather than regex, since a
 * lazy regex could be fooled by literal ");" sequences inside text columns
 * (this dump's post_content/comment_content contain PHP/SQL code samples).
 */
function findInsertStatementBlobs(sql: string, table: string): string[] {
  const blobs: string[] = [];
  const marker = `INSERT INTO \`${table}\``;
  let searchFrom = 0;
  for (;;) {
    const idx = sql.indexOf(marker, searchFrom);
    if (idx === -1) break;
    const valuesIdx = sql.indexOf("VALUES", idx);
    if (valuesIdx === -1) break;
    let i = valuesIdx + "VALUES".length;
    while (i < sql.length && sql[i] !== "(") i++;
    const blobStart = i;
    let depth = 0;
    let inString = false;
    let end = -1;
    for (; i < sql.length; i++) {
      const ch = sql[i];
      if (inString) {
        if (ch === "\\") {
          i++;
          continue;
        }
        if (ch === "'") {
          if (sql[i + 1] === "'") {
            i++;
            continue;
          }
          inString = false;
        }
        continue;
      }
      if (ch === "'") {
        inString = true;
        continue;
      }
      if (ch === "(") {
        depth++;
        continue;
      }
      if (ch === ")") {
        depth--;
        continue;
      }
      if (ch === ";" && depth === 0) {
        end = i;
        break;
      }
    }
    if (end === -1) break;
    blobs.push(sql.slice(blobStart, end));
    searchFrom = end + 1;
  }
  return blobs;
}

/** Extract the ordered column names from a table's CREATE TABLE statement. */
function extractColumnNames(sql: string, table: string): string[] {
  const marker = `CREATE TABLE \`${table}\``;
  const idx = sql.indexOf(marker);
  if (idx === -1) {
    throw new Error(`CREATE TABLE statement not found for table "${table}"`);
  }
  const openParen = sql.indexOf("(", idx);
  let depth = 0;
  let i = openParen;
  for (; i < sql.length; i++) {
    if (sql[i] === "(") depth++;
    else if (sql[i] === ")") {
      depth--;
      if (depth === 0) break;
    }
  }
  const body = sql.slice(openParen + 1, i);
  const columns: string[] = [];
  for (const line of body.split(/,\r?\n/)) {
    const m = /^\s*`([^`]+)`/.exec(line);
    if (m) columns.push(m[1]);
  }
  return columns;
}

export function loadSqlDump(): string {
  const raw = fs.readFileSync(SQL_DUMP_PATH, "utf8");
  return stripBom(raw);
}

/** Parse every row of `ab3f44oy3_<tableSuffix>` into column-name-keyed objects. */
export function extractTableRows(sql: string, tableSuffix: string): SqlRow[] {
  const table = `${TABLE_PREFIX}${tableSuffix}`;
  const columns = extractColumnNames(sql, table);
  const blobs = findInsertStatementBlobs(sql, table);
  const rows: SqlRow[] = [];
  for (const blob of blobs) {
    for (const rawRow of splitRows(blob)) {
      const fields = splitFields(rawRow).map(decodeSqlField);
      const obj: SqlRow = {};
      columns.forEach((col, i) => {
        obj[col] = fields[i] ?? null;
      });
      rows.push(obj);
    }
  }
  return rows;
}
