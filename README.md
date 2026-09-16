# STARS shadcn/ui preset

A custom shadcn/ui preset for initial STARS applications. It is based on the `b5LDvbObY` builder settings
(Rhea style, Mist base, Phosphor icons, default radius, default/solid menu,
subtle menu accent) and swaps in the STARS palette, STARS chart colours and brand font (Rubik) for both body and headings.
This repository also contains the STARS logos and "S"-mark logos in multiple colours.

## Why this is a URL and not a short code

Short preset codes such as `b5LDvbObY` are bit-packed indexes into fixed option
lists (`shadcn preset decode b5LDvbObY` shows style=rhea, baseColor=mist,
theme=sky, chartColor=sky, iconLibrary=phosphor, font=inter). The code format
has 6 bits for "theme" and 6 bits for "font" – it can only name one of the
built-in themes and one of ~26 built-in fonts. There is no way to encode custom
OKLCH values or Rubik in a code.

The `--preset` flag, however, accepts three kinds of value in shadcn CLI v4:

1. a built-in preset name (`nova`, `rhea`, …),
2. a short code from shadcn/create, or
3. **a URL to a `registry:base` item.**

Option 3 is what the builder itself uses under the hood (`ui.shadcn.com/init?…`
returns a `registry:base` payload). So the "custom preset" is simply a
`registry:base` JSON file that you host, and its URL is the preset value.

## Files

```
registry.json                – optional index (for `shadcn build` / registry listing)
r/stars.json                 – the preset (type: registry:base)
r/font-rubik.json            – Rubik → --font-sans
r/font-heading-rubik.json    – Rubik → --font-heading, applied to h1–h6
```

All four validate against `registryItemSchema` / `registrySchema` from
`shadcn@4.21.0`.

## Hosting

The files only need to be reachable over HTTPS as static JSON. A public GitHub
repo served through `raw.githubusercontent.com` is enough, as is any static
host (Cloudflare Pages, S3, the Preflight platform, etc.).

1. Put `r/` (and optionally `registry.json`) in a repo, e.g.
   `github.com/STARSAirAmbulance/stars-shadcn-preset`.
2. The two
   `registryDependencies` URLs point at
   `https://raw.githubusercontent.com/STARSAirAmbulance/stars-shadcn-preset/main/r/…`.
   Adjust these if you host somewhere other than that repo.
3. Commit and push.

If the host is private, the CLI supports authenticated registries via
`components.json` → `registries` (headers / tokens). Public is simpler for a
public theme file that contains no secrets.

## Usage

New React Router project:

```bash
pnpm dlx shadcn@latest init \
  --preset https://raw.githubusercontent.com/STARSAirAmbulance/stars-shadcn-preset/main/r/stars.json \
  --template react-router
```

Apply to an existing project (re-themes, re-installs UI components):

```bash
pnpm dlx shadcn@latest init --preset <same-url> --force
# or theme/fonts only, leave components alone:
pnpm dlx shadcn@latest apply --preset <same-url> --only theme
pnpm dlx shadcn@latest apply --preset <same-url> --only font
```

Inspect before committing to it:

```bash
pnpm dlx shadcn@latest view <same-url>
pnpm dlx shadcn@latest add <same-url> --dry-run   # inside an existing project
```

## What the CLI does with it

- `config` → merged into `components.json`
  (`style: base-rhea`, `iconLibrary: phosphor`, `menuColor: default`,
  `menuAccent: subtle`, `tailwind.baseColor: mist`).
  Note: when scaffolding a brand-new project from a template the CLI currently
  rewrites `baseColor` to `neutral` after merging. That is cosmetic here because
  the preset ships every token explicitly, so nothing depends on the Mist
  defaults being fetched.
- Because the item does **not** set `extends: "none"`, the CLI also installs the
  Rhea style index (component styles, radius scale, `@import` lines), then lays
  the preset's `cssVars` on top.
- `iconLibrary: phosphor` makes the CLI install `@phosphor-icons/react` and
  generate components with Phosphor imports.
- The two `registry:font` items are non-Next aware: in a React Router project the
  CLI adds `@fontsource-variable/rubik`, inserts `@import "@fontsource-variable/rubik"`,
  sets `--font-sans` / `--font-heading` in `@theme`, and adds
  `h1…h6 { @apply font-heading }` in `@layer base`.

## Palette

Brand inputs (converted to OKLCH):

| Brand colour        | Hex       | OKLCH                    |
| ------------------- | --------- | ------------------------ |
| Midnight Blue       | `#0c2e3f` | `oklch(0.286 0.049 234)` |
| Hopeful Blue        | `#91decf` | `oklch(0.846 0.079 181)` |
| Misty White         | `#f6f4f3` | `oklch(0.968 0.003 49)`  |
| Saving Grey         | `#e0d9d1` | `oklch(0.889 0.013 71)`  |
| Critical Care Red   | `#f20808` | `oklch(0.605 0.246 29)`  |

Design logic:

- **Light mode** is "paper and ink": Misty White is the page, Midnight Blue is
  text and the primary action, colours derived from Saving Grey provide borders / inputs /
  secondary surfaces, and Hopeful Blue appears only as a tint for hover/selected
  (`accent`, `sidebar-accent`) and as the focus ring. Cards are near-white so
  they lift off the mist.
- **Dark mode** inverts around the brand: a deeper midnight for the page, brand
  Midnight Blue for cards/popovers, Misty White text, and Hopeful Blue becomes
  the primary action colour.
- **Critical Care Red** is used for exactly one semantic token, `destructive`,
  plus the opt-in brand token and two utilities below.
- **Charts** (light): Midnight → Hopeful → deep teal bridge → steel blue →
  warm sand (Saving Grey lineage). Dark swaps the order so Hopeful leads and
  mist provides the light series. No red in charts.

Key contrast ratios (WCAG): foreground/background 12.96 (light) and 15.77
(dark); muted-foreground on muted 4.97 / 5.25; primary-foreground on primary
12.96 / 11.16.

### Extra brand tokens

The preset adds five raw brand colours as Tailwind colours so you can use them without overriding the the semantic color tokens:

`bg-stars-midnight` `text-stars-hopeful` `border-stars-red` `bg-stars-grey`
`bg-stars-mist` (and every other colour utility).

Two utilities for the "rare red accent line" use case:

```html
<hr class="stars-rule" />        <!-- 2px Critical Care Red rule -->
<hr class="stars-rule-thin" />   <!-- 1px -->
```

## Tweaking later

Edit `r/stars.json`, push, and re-run `apply --preset <url> --only theme` in
each app. Hex ↔ OKLCH: any value in the file can be replaced with a hex string
if that is easier to maintain; the CLI passes values through verbatim.
