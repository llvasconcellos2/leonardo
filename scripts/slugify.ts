import slugify from "slugify";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: pnpm slugify "Some Title"');
  process.exit(1);
}

console.log(slugify(title, { lower: true, strict: true }));
