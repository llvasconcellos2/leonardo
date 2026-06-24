/**
 * The SQL dump has UTF-8 multibyte sequences (e.g. "á" = 0xC3 0xA1) that were,
 * at some point before this dump was created, decoded one byte at a time as
 * CP850 (the classic DOS Latin-1 codepage) and re-saved as UTF-8 — turning
 * "está" into "est├í". This is baked into the dump's bytes; no read-encoding
 * choice in Node fixes it. Reversing it: re-encode each CP850-artifact
 * character back to its original CP850 byte, then decode that byte sequence
 * as UTF-8 to recover the real character. Characters not part of this
 * artifact set (plain ASCII, or already-correct text) pass through unchanged,
 * which makes this safe to apply unconditionally to every text field.
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

export function fixMojibake(input: string): string {
  if (!input) return input;
  const bytes: number[] = [];
  let changed = false;
  for (const ch of input) {
    const code = ch.codePointAt(0)!;
    if (code < 0x80) {
      bytes.push(code);
      continue;
    }
    const byte = CHAR_TO_CP850_BYTE.get(ch);
    if (byte !== undefined) {
      bytes.push(byte);
      changed = true;
      continue;
    }
    // Not a recognized mojibake artifact char — keep its real UTF-8 bytes.
    bytes.push(...Buffer.from(ch, "utf8"));
  }
  if (!changed) return input;
  return Buffer.from(bytes).toString("utf8");
}
