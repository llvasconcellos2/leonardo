# Generate Project README.md

Run this prompt in any project repository to generate a polished `README.md` for the Leonardo Vasconcellos portfolio.

---

## Instructions

You are going to create a comprehensive `README.md` for this project. **Do not write anything until Phase 2 is complete.** Work through each phase in order.

- You have to write the features based on me the developer that is enumerating key features that someone, the reader, would like to see in a project of this kind and hire me.
- Try to say more about how the development of this project features benefited the business.

---

## Phase 1 — Research

Read and analyze every available source before forming any opinion about the project:

1. **Archived `rip/` folder** - read the `.html` files for the website archived version that was crawled by wget.
2. **Existing `README.md`** — extract Getting Started, Learn More, and any project description.
3. **`package.json`** (or `composer.json`, `requirements.txt`, `build.gradle`, `pyproject.toml`, `Cargo.toml`, whichever applies) — extract `name`, `version`, all `dependencies` and `devDependencies` with exact versions. Identify the main language(s) and framework(s).
4. **`screenshots/` folder** — list every file with its filename. Note any that are clearly "hero" screenshots (large, full-page).
5. **Source tree** — scan the top-level directory structure to confirm tech stack, detect `app/`, `src/`, `pages/`, `www`, etc.
6. **`.github/`**, **`LICENSE`**, **`CONTRIBUTING.md`** — check if a license file exists and note it.
7. **Git history** — run `git log --oneline --format="%ad %s" --date=format:"%Y" | head -30` to infer creation year and project activity.
8. **Public assets** — look in `public/` for logos, icons, favicons. List any image files found there and in the project root.

After research, compile internally:

- Inferred project name (may differ from repo slug)
- Inferred release year
- Main language(s) and framework(s) with exact versions
- List of screenshots files
- List of candidate logo files

---

## Phase 2 — Interactive Q&A

**Pause here.** Before writing anything, send the user a single grouped message containing:

- Questions for the **4 items only you can know** (marked "Ask")
- Drafted answers for the **3 items you must synthesize from research** (marked "Draft — confirm or edit"), presented inline so the user can approve or correct in one reply

1. **Project Name** — What is the human-readable display name of this project? (Not the repository name — e.g. "Ebola-Response Records System", not "ebola-records")
2. **One-sentence description** *(Draft — confirm or edit)* — Based on your research, write a compelling one-sentence description of the project. Present it here for the user to approve or rewrite.
3. **Kicker line** — A short tagline that appears preceded by `//` on the portfolio card (e.g. `// medical records · doctors without borders`). This is typically `// {domain} · {client or context}`.
4. **Logo** — I found these image files: _{list the files you found}_. Which should be used as the centered logo (80×80)? If none are suitable, which emoji best represents this project?
5. **Release year** — I inferred _{year}_. Is that correct, or should it be different? (Some projects were started years before their first commit.)
6. **Key features** *(Draft — confirm or edit)* — Based on all project files, draft exactly 3 short bullet points framed from the developer's perspective: what you built and how it benefited the business. Present them here for the user to approve or edit.
7. **About text** *(Draft — confirm or edit)* — Write the full extended about section now, based on all archived files and research. Present it inline here. The user will approve or request edits — do not ask whether to write it.

Wait for the user's answers before proceeding.

---

## Phase 3 — Write README.md

Using the user's answers and your research, write `README.md` at the project root. Follow the structure and rules below exactly. Use HTML comments as section delimiters exactly as shown — they are used by the portfolio renderer to extract data.

### Full document structure

```
<!-- BACK TO TOP ANCHOR -->
<!-- LOGO -->
<!-- SHIELDS -->
<!-- TABLE OF CONTENTS -->
<!-- ABOUT THE PROJECT -->
<!-- SCREENSHOTS -->
<!-- BUILT WITH -->
<!-- GETTING STARTED -->       (only if original README had this — keep it verbatim)
<!-- LEARN MORE -->            (titled dynamically — see rule below)
<!-- ROADMAP -->
<!-- CONTRIBUTORS -->
<!-- CONTACT -->
<!-- MARKDOWN LINKS & IMAGES -->
```

---

### Section rules

#### `<!-- BACK TO TOP ANCHOR -->`

```html
<a id="readme-top"></a>
```

---

#### `<!-- LOGO -->`

```html
<div align="center">
  <a href="https://leonardo-vasconcellos.vercel.app/portfolio/{REPO_NAME}">
    <img src="{LOGO_PATH}" alt="Logo" height="80" />
  </a>

  <h1 align="center">{PROJECT_NAME}</h1>

  <p align="center">{ONE_SENTENCE_DESCRIPTION}</p>

  <p align="center">// {KICKER_LINE}</p>

  <br />

  <a href="https://leonardo-vasconcellos.vercel.app/portfolio/{REPO_NAME}"
    ><strong>View it live »</strong></a>
</div>

<br />
```

- If the logo is an emoji (no image file), use `<h1 align="center">{EMOJI}</h1>` in place of the `<img>` tag and omit the `<a>` wrapper.
- `{REPO_NAME}` is the bare repository directory name (e.g. `semprecomvoce-next`).

---

#### `<!-- SHIELDS -->`

Use [shields.io](https://shields.io) with `style=for-the-badge`. Include shields in this exact order — no others:

| Shield          | URL pattern                                                                                       | Color     | Link target                                  |
| --------------- | ------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------- |
| Creator Website | `https://img.shields.io/badge/Creator_Website-%E2%86%97-2eba7a?style=for-the-badge`               | `#2eba7a` | `https://leonardo-vasconcellos.vercel.app/`  |
| Contributors    | `https://img.shields.io/github/contributors/{USER}/{REPO}.svg?style=for-the-badge`                | default   | GitHub contributors page                     |
| Forks           | `https://img.shields.io/github/forks/{USER}/{REPO}.svg?style=for-the-badge`                       | default   | GitHub forks page                            |
| Issues          | `https://img.shields.io/github/issues/{USER}/{REPO}.svg?style=for-the-badge`                      | default   | GitHub issues page                           |
| LinkedIn        | `https://img.shields.io/badge/-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white` | `#0A66C2` | `https://www.linkedin.com/in/llvasconcellos` |
| Released        | `https://img.shields.io/badge/Released-{YEAR}-gray?style=for-the-badge`                           | gray      | (no link needed, use `#`)                    |

**Do NOT include:** stars shield, license shield, or any other shields.

Use reference-style links (defined at the bottom of the file).

---

#### `<!-- TABLE OF CONTENTS -->`

```html
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#screenshots">Screenshots</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <!-- omit if no Getting Started -->
    <li><a href="#learn-more">Learn More about {MAIN_FRAMEWORK}</a></li>
    <!-- omit if no Learn More -->
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributors">Contributors</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>
```

---

#### `<!-- ABOUT THE PROJECT -->`

```markdown
## About The Project

[![Product Screenshot][product-screenshot]](https://leonardo-vasconcellos.vercel.app/portfolio/{REPO_NAME})

<!-- PROJECT INTRO: 260 chars max -->

{INTRO — strictly 260 characters or fewer, written as a compelling lead sentence or two}

<!-- END INTRO -->

{EXTENDED DESCRIPTION — full about text, any length, from original README + user input}
```

- Choose the most representative screenshot for `product-screenshot`. It should be a full-page or hero screenshot.
- The `<!-- PROJECT INTRO -->` block is read by the portfolio renderer — enforce the 260-char limit strictly.

---

#### `<!-- SCREENSHOTS -->`

```markdown
## Screenshots

<div align="center" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">
  <a href="screenshots/{FILE}"><img src="screenshots/{FILE}" height="220" style="object-fit:cover;border-radius:6px;" /></a>
  ...
</div>
```

- List **all** screenshots found in `screenshots/`. Use `height="220"` for all so mixed aspect ratios display consistently.
- The screenshot used in "About The Project" must appear **last** in the gallery.
- Each thumbnail links to the raw file path in the repo (relative path, no domain).

---

#### `<!-- BUILT WITH -->`

```markdown
## Built With

<!-- LANGUAGES -->

**Languages**

|                                                                                                                | Language   | Version |
| -------------------------------------------------------------------------------------------------------------- | ---------- | ------- |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="20" /> | TypeScript | 5.x     |

<!-- FRAMEWORKS & LIBRARIES -->

**Frameworks & Libraries**

|                                                                                                                  | Framework    | Version |
| ---------------------------------------------------------------------------------------------------------------- | ------------ | ------- |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="20" />           | Next.js      | 16.2.4  |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="20" />             | React        | 19.2.4  |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="20" /> | Tailwind CSS | 4.x     |
```

Rules:

- List **languages first**, then frameworks/libraries. Use this order within languages: TypeScript → JavaScript → HTML → CSS → Python → other.
- **Always include HTML and CSS** for any web project (front-end, Next.js, React, Vue, etc.) — they are foundational even when primarily written via JSX or utility CSS. Use `html5` and `css3` as devicon slugs. Version is always `5` / `3`.
- **Include Python** if any `.py` files exist anywhere in the repo.
- **Include Node.js** (slug: `nodejs`, label `Node.js`, version `scripts`) if the project has a `scripts/` folder with `.js` files, or if `package.json` contains a custom script that calls `node` directly. Do not include Node.js for projects that merely use npm/pnpm as a package manager.
- Pull **exact versions** from `package.json` or config files. If only a range is specified (e.g. `^5`), write `5.x`. For HTML/CSS, always write `5` / `3`.
- Use devicon slugs from `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{slug}/{slug}-original.svg`. If no colored icon exists for a technology, try `-plain.svg` or `-wordmark.svg`.
- Include only languages and frameworks that are meaningful to the project — skip build tools like ESLint, PostCSS, etc. unless they are central to the project.

---

#### `<!-- GETTING STARTED -->` (conditional)

If the original README has a Getting Started section, reproduce it verbatim under this heading. If not, omit the section entirely.

---

#### `<!-- LEARN MORE -->` (conditional)

If the original README has a "Learn More" section, include it. Rename the heading to `Learn More about {MAIN_FRAMEWORK}` (e.g. "Learn More about Next.js"). If not present, omit the section.

---

#### `<!-- ROADMAP -->`

```markdown
## Roadmap

This project repository is for archive purposes only. No new features or issues are being tracked.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
```

---

#### `<!-- CONTRIBUTORS -->`

```markdown
## Contributors

<a href="https://github.com/{USER}/{REPO}/graphs/contributors">
  <img src="https://contrib.rocks/image?repo={USER}/{REPO}" alt="Contributors" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>
```

---

#### `<!-- CONTACT -->`

```markdown
## Contact

[Leonardo Vasconcellos - Website](https://leonardo-vasconcellos.vercel.app/) — [LinkedIn](https://www.linkedin.com/in/llvasconcellos)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
```

---

#### `<!-- MARKDOWN LINKS & IMAGES -->`

Define all reference-style links at the bottom:

```markdown
<!-- MARKDOWN LINKS & IMAGES -->

[website-shield]: https://img.shields.io/badge/Creator_Website-%E2%86%97-2eba7a?style=for-the-badge
[website-url]: https://leonardo-vasconcellos.vercel.app/
[contributors-shield]: https://img.shields.io/github/contributors/{USER}/{REPO}.svg?style=for-the-badge
[contributors-url]: https://github.com/{USER}/{REPO}/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/{USER}/{REPO}.svg?style=for-the-badge
[forks-url]: https://github.com/{USER}/{REPO}/network/members
[issues-shield]: https://img.shields.io/github/issues/{USER}/{REPO}.svg?style=for-the-badge
[issues-url]: https://github.com/{USER}/{REPO}/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white
[linkedin-url]: https://www.linkedin.com/in/llvasconcellos
[year-shield]: https://img.shields.io/badge/Released-{YEAR}-gray?style=for-the-badge
[year-url]: #
[product-screenshot]: screenshots/{HERO_SCREENSHOT_FILENAME}
```

---

## Notes for Claude

- Always ask questions in Phase 2 before writing. Never skip the Q&A.
- The `{USER}` GitHub username is `llvasconcellos` unless the repository remote URL says otherwise — check with `git remote get-url origin`.
- For the devicon URLs, the icon slug is usually the lowercase technology name. Common mappings: Next.js → `nextjs`, React → `react`, TypeScript → `typescript`, JavaScript → `javascript`, Tailwind → `tailwindcss`, Node.js → `nodejs`, PostgreSQL → `postgresql`, MongoDB → `mongodb`, Python → `python`, Java → `java`, Android → `android`, Docker → `docker`.
- After writing `README.md`, run `git remote get-url origin` to confirm `{USER}` and `{REPO}` and correct any placeholders.
- Do **not** create or modify any file other than `README.md` unless explicitly asked.
- This is the correct logo for joomla → `<img src="https://devicons.io/devicons/icons/joomla.svg" width="20" />`