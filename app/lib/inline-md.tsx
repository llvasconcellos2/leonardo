import React from "react";

/**
 * Minimal inline-markdown renderer for the copy that flows out of `data/work.ts`
 * (README-sourced). It handles exactly the inline marks that content uses —
 * `**bold**`, `` `code` ``, and `_italic_` — and nothing else. This is deliberately
 * not a full markdown parser: the work catalog only ever emits these marks inline, and
 * the blog has its own proper unified/remark pipeline for real documents.
 */
export function renderInline(text: string, keyPrefix = "im"): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|`([^`]+)`|_(.+?)_/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      nodes.push(<code key={`${keyPrefix}-${i++}`}>{m[2]}</code>);
    } else {
      nodes.push(<em key={`${keyPrefix}-${i++}`}>{m[3]}</em>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
