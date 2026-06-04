import "./LowPolyField.css";

interface LowPolyFieldProps {
  seed?: number;
  label?: string;
  style?: React.CSSProperties;
}

export function LowPolyField({ seed = 1, label, style }: LowPolyFieldProps) {
  const rand = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  const cols = 6, rows = 4, w = 100, h = 100;
  const pts: [number, number][] = [];
  for (let r = 0; r <= rows; r++)
    for (let c = 0; c <= cols; c++) {
      const jx =
        r === 0 || r === rows || c === 0 || c === cols
          ? 0
          : (rand(r * 7 + c) - 0.5) * 14;
      const jy =
        r === 0 || r === rows || c === 0 || c === cols
          ? 0
          : (rand(r * 13 + c * 3) - 0.5) * 14;
      pts.push([(c / cols) * w + jx, (r / rows) * h + jy]);
    }
  const idx = (r: number, c: number) => r * (cols + 1) + c;
  const tris: { p: string; f: string }[] = [];
  const shades = [
    "#061a3c",
    "#082451",
    "#0e2c5e",
    "#173a76",
    "#1f4585",
    "#2b4f8f",
    "#395584",
  ];
  const fmt = (n: number) => Math.round(n * 1e4) / 1e4;
  const pt = ([x, y]: [number, number]) => `${fmt(x)},${fmt(y)}`;
  let k = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const a = pts[idx(r, c)],
        b = pts[idx(r, c + 1)],
        d = pts[idx(r + 1, c)],
        e = pts[idx(r + 1, c + 1)];
      tris.push({
        p: `${pt(a)} ${pt(b)} ${pt(d)}`,
        f: shades[Math.floor(rand(k++) * shades.length)],
      });
      tris.push({
        p: `${pt(b)} ${pt(e)} ${pt(d)}`,
        f: shades[Math.floor(rand(k++) * shades.length)],
      });
    }
  return (
    <div className="lv-lowpoly" style={style}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
      >
        {tris.map((t, i) => (
          <polygon key={i} points={t.p} fill={t.f} />
        ))}
      </svg>
      {label && <span className="lv-lowpoly-tag">{label}</span>}
      <span className="lv-lowpoly-ph">placeholder · screenshot pending</span>
    </div>
  );
}
