/**
 * Some dumps have UTF-8 multibyte sequences (e.g. "á" = 0xC3 0xA1) that were,
 * at some point before the dump was created, decoded one byte at a time as
 * CP850 (the classic DOS Latin-1 codepage) and re-saved as UTF-8 — turning
 * "está" into "est├í". This is baked into the dump's bytes; no read-encoding
 * choice in Node fixes it.
 *
 * IMPORTANT: this can only be reversed by anchoring on the lead-byte artifact
 * characters "┬" (0xC2) and "├" (0xC3) — the cp850 decoding of the only two
 * UTF-8 lead bytes used by the Latin-1 Supplement range (which covers every
 * accented Portuguese letter). Those two characters never legitimately occur
 * standalone in prose, so seeing one is an unambiguous corruption signal,
 * consuming exactly one following character as its continuation byte.
 *
 * Earlier versions of this function instead matched on ANY character that
 * happened to be a cp850 table value (e.g. "Í", "ã" — both real, correct
 * Portuguese letters that are *also* values in the cp850 byte table, since
 * cp850 itself is the Latin-American/Portuguese DOS codepage). That treated
 * already-correct standalone accented letters as corruption and "reversed"
 * them into a single stray byte, which is invalid UTF-8 on its own and
 * decodes to U+FFFD ("�") — i.e. it introduced real data loss into clean
 * text. Only ever match on the lead-byte artifacts, never on a lone
 * continuation-byte character.
 */

const CP850_HIGH_BYTES: Record<number, string> = {
  0x80: "É", 0x81: "ü", 0x82: "é", 0x83: "â", 0x84: "ä", 0x85: "à", 0x86: "å",
  0x87: "ç", 0x88: "ê", 0x89: "ë", 0x8a: "è", 0x8b: "ï", 0x8c: "î", 0x8d: "ì",
  0x8e: "Ä", 0x8f: "Å", 0x90: "É", 0x91: "æ", 0x92: "Æ", 0x93: "ô", 0x94: "ö",
  0x95: "ò", 0x96: "û", 0x97: "ù", 0x98: "ÿ", 0x99: "Ö", 0x9a: "Ü", 0x9b: "ø",
  0x9c: "£", 0x9d: "Ø", 0x9e: "×", 0x9f: "ƒ", 0xa0: "á", 0xa1: "í", 0xa2: "ó",
  0xa3: "ú", 0xa4: "ñ", 0xa5: "Ñ", 0xa6: "ª", 0xa7: "º", 0xa8: "¿", 0xa9: "⌐",
  0xaa: "¬", 0xab: "½", 0xac: "¼", 0xad: "¡", 0xae: "«", 0xaf: "»", 0xb0: "░",
  0xb1: "▒", 0xb2: "▓", 0xb3: "│", 0xb4: "┤", 0xb5: "Á", 0xb6: "Â", 0xb7: "À",
  0xb8: "©", 0xb9: "╣", 0xba: "║", 0xbb: "╗", 0xbc: "╝", 0xbd: "¢", 0xbe: "¥",
  0xbf: "┐", 0xc0: "└", 0xc1: "┴", 0xc2: "┬", 0xc3: "├", 0xc4: "─", 0xc5: "┼",
  0xc6: "ã", 0xc7: "Ã", 0xc8: "╚", 0xc9: "╔", 0xca: "╩", 0xcb: "╦", 0xcc: "╠",
  0xcd: "═", 0xce: "╬", 0xcf: "¤", 0xd0: "ð", 0xd1: "Ð", 0xd2: "Ê", 0xd3: "Ë",
  0xd4: "È", 0xd5: "ı", 0xd6: "Í", 0xd7: "Î", 0xd8: "Ï", 0xd9: "┘", 0xda: "┌",
  0xdb: "█", 0xdc: "▄", 0xdd: "¦", 0xde: "Ì", 0xdf: "▀", 0xe0: "Ó", 0xe1: "ß",
  0xe2: "Ô", 0xe3: "Ò", 0xe4: "õ", 0xe5: "Õ", 0xe6: "µ", 0xe7: "þ", 0xe8: "Þ",
  0xe9: "Ú", 0xea: "Û", 0xeb: "Ù", 0xec: "ý", 0xed: "Ý", 0xee: "¯", 0xef: "´",
  0xf0: "­", 0xf1: "±", 0xf2: "‗", 0xf3: "¾", 0xf4: "¶", 0xf5: "§", 0xf6: "÷",
  0xf7: "¸", 0xf8: "°", 0xf9: "¨", 0xfa: "·", 0xfb: "¹", 0xfc: "³", 0xfd: "²",
  0xfe: "■", 0xff: " ",
};

const CHAR_TO_CP850_BYTE = new Map<string, number>();
for (const [byte, ch] of Object.entries(CP850_HIGH_BYTES)) {
  CHAR_TO_CP850_BYTE.set(ch, Number(byte));
}

/** The only two cp850-decoded lead-byte artifacts that can appear from corrupting a Latin-1 Supplement (accented Portuguese letter) UTF-8 sequence. */
const LEAD_BYTE_ARTIFACTS: Record<string, number> = {
  "┬": 0xc2,
  "├": 0xc3,
};

export function fixMojibake(input: string): string {
  if (!input || !/[┬├]/.test(input)) return input;
  const chars = Array.from(input);
  let result = "";
  let changed = false;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const leadByte = LEAD_BYTE_ARTIFACTS[ch];
    if (leadByte !== undefined) {
      const next = chars[i + 1];
      const continuationByte = next !== undefined ? CHAR_TO_CP850_BYTE.get(next) : undefined;
      if (continuationByte !== undefined) {
        result += Buffer.from([leadByte, continuationByte]).toString("utf8");
        changed = true;
        i++; // consumed the continuation char too
        continue;
      }
    }
    result += ch;
  }
  return changed ? result : input;
}
