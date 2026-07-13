import React from "react";

/**
 * Minimal inline-markdown renderer for the copy that flows out of `data/work.ts`
 * (README-sourced). It handles exactly the two inline marks that content uses —
 * `**bold**` and `` `code` `` — and nothing else. This is deliberately not a full
 * markdown parser: the work catalog only ever emits these two marks inline, and the
 * blog has its own proper unified/remark pipeline for real documents.
 */
export function renderInline(text: string, keyPrefix = "im"): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|`([^`]+)`/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{m[1]}</strong>);
    } else {
      nodes.push(<code key={`${keyPrefix}-${i++}`}>{m[2]}</code>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
