# contrast-css-react

Typed React components for the [contrast-css](https://www.npmjs.com/package/contrast-css)
monochrome template. Pure white/black paper tokens, thick rules, and inversion-based
emphasis — with the markup contracts enforced by types instead of by hand.

## Features

- **Styles are included.** `contrast-css` is a dependency and the components import it,
  so a single `npm install contrast-css-react` is all you need. No CSS import required.
- **Markup contracts enforced by types.** The `.ct-facts > div` wrapper, the 3-span
  structure of `.ct-pairs`, and the `thead`/`tbody` shape of `.ct-table` are generated
  by the components — you cannot get them wrong.
- **Paper tokens.** `<Paper tone="white" | "black">` sets the paper; inversion blocks
  (`.ct-em`, `.ct-band`, solid buttons) flip automatically with the paper.
- **Reveal, built in.** `<Reveal>` wraps the IntersectionObserver snippet
  (threshold 0.15, once by default). SSR-safe: environments without
  IntersectionObserver render immediately.

## Install

```bash
npm install contrast-css-react
```

Peer dependency: `react` 18 or 19.

## Usage

```tsx
import { Paper, Container, Section, Label, H1, Ruby, Rule, Facts, Reveal } from "contrast-css-react";

<Paper tone="white">
  <Container>
    <Section>
      <Label>PROFILE — 01</Label>
      <H1>Shinozawa Hiro</H1>
      <Ruby>counterweight / idle idol</Ruby>
      <Rule />
      <Reveal>
        <Facts
          items={[
            ["Club", "Ichieku Idol Division"],
            ["Hobby", "collecting capsule toys"],
          ] as const}
        />
      </Reveal>
    </Section>
  </Container>
</Paper>
```

Alternating `<Paper tone="black">` sections produce the inverted spread.

## Components

| Group | Components |
| --- | --- |
| Paper | `Paper` (tone: `"white" \| "black"`) |
| Layout | `Container`, `Section`, `Grid` (cols: 2 \| 4) |
| Typography | `H1`, `H2`, `H3`, `Label`, `Mono`, `Ruby`, `Sub` |
| Rules | `Rule`, `Frame`, `Outline`, `Rows`, `Pitch`, `Lined` |
| Inversion | `Em`, `Band`, `Chip`, `Badge` |
| Lists | `Pairs` (items), `Facts` (items) |
| Table | `Table` (columns, rows) |
| Forms | `Input`, `Select`, `Textarea` (forwardRef), `Btn` (variant: `"outline" \| "solid"`), `Error` |
| Motion | `Reveal` (once, threshold) |

All components pass through native props, and `className` is **merged**, never
overwritten — add your own spacing utilities freely.

## License

MIT
