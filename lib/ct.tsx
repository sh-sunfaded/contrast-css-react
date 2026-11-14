import React, { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import "contrast-css";

// ── 内部ユーティリティ ──────────────────────────────────

/** @param {...(string | boolean | null | undefined)} parts */
const cx = (...parts: (string | boolean | null | undefined)[]): string => {
  return parts.filter(Boolean).join(" ");
}

type Tone = "white" | "black";
type BtnVariant = "outline" | "solid";

// ── 1. レイアウト ──────────────────────────────────────

/** 紙面。tone が紙面トークン(背景・文字・罫・反転)を一括定義する */
export const Paper = ({
  tone,
  ...rest
}: ComponentPropsWithoutRef<"section"> & { tone: Tone })=> {
  return <section className={cx(rest.className, `ct-paper-${tone}`)} {...rest} />;
}

/** 中央寄せコンテナ(ct-container) */
export const Container =  (props: ComponentPropsWithoutRef<"div">) => {
  const { className, ...rest } = props;
  return <div className={cx(className, "ct-container")} {...rest} />;
}

/** セクション縦幅(ct-section)— Container の内側で使う */
export const Section = (props: ComponentPropsWithoutRef<"div">) => {
  const { className, ...rest } = props;
  return <div className={cx(className, "ct-section")} {...rest} />;
}

/** 段組グリッド(ct-grid-2 / ct-grid-4) */
export const Grid = ({
  cols = 2,
  ...rest
}: ComponentPropsWithoutRef<"div"> & { cols?: 2 | 4 }) => {
  const { className, ...rest2 } = rest;
  return <div className={cx(className, `ct-grid-${cols}`)} {...rest2} />;
}

// ── 2. タイポ ──────────────────────────────────────────

export const H1 = (props: ComponentPropsWithoutRef<"h1">) => {
  const { className, ...rest } = props;
  return <h1 className={cx(className, "ct-h1")} {...rest} />;
}

export const H2 = (props: ComponentPropsWithoutRef<"h2">) => {
  const { className, ...rest } = props;
  return <h2 className={cx(className, "ct-h2")} {...rest} />;
}

export const H3 = (props: ComponentPropsWithoutRef<"h3">) => {
  const { className, ...rest } = props;
  return <h3 className={cx(className, "ct-h3")} {...rest} />;
}

/** ラベル(英大文字 — 「 — 」区切り) */
export const Label = (props: ComponentPropsWithoutRef<"p">) => {
  const { className, ...rest } = props;
  return <p className={cx(className, "ct-label")} {...rest} />;
}

/** 等幅 */
export const Mono = (props: ComponentPropsWithoutRef<"span">) => {
  const { className, ...rest } = props;
  return <span className={cx(className, "ct-mono")} {...rest} />;
}

/** ルビ・サブキャプション(h1/h2直下の小さめ等幅行) */
export const Ruby = (props: ComponentPropsWithoutRef<"p">) => {
  const { className, ...rest } = props;
  return <p className={cx(className, "ct-ruby")} {...rest} />;
}

/** 副本文(階調は白黒の不透明度のみ) */
export const Sub = (props: ComponentPropsWithoutRef<"p">) => {
  const { className, ...rest } = props;
  return <p className={cx(className, "ct-sub")} {...rest} />;
}

// ── 3. 罫線 ────────────────────────────────────────────

/** 見出し下の太罫(4px) */
export const Rule = (props: ComponentPropsWithoutRef<"div">) => {
  const { className, ...rest } = props;
  return <div className={cx(className, "ct-rule")} {...rest} />;
}

/** 額縁(4px) */
export const Frame = (props: ComponentPropsWithoutRef<"div">) => {
  const { className, ...rest } = props;
  return <div className={cx(className, "ct-frame")} {...rest} />;
}

/** 小枠(2px) */
export const Outline = (props: ComponentPropsWithoutRef<"div">) => {
  const { className, ...rest } = props;
  return <div className={cx(className, "ct-outline")} {...rest} />;
}

// ── 4. リスト ──────────────────────────────────────────

/** 上下太罫の1行リスト(子要素間に細罫を自動付与) */
export const Rows = (props: ComponentPropsWithoutRef<"ul">) => {
  const { className, ...rest } = props;
  return <ul className={cx(className, "ct-rows")} {...rest} />;
}

/** 左太罫ピッチ */
export const Pitch = (props: ComponentPropsWithoutRef<"div">) => {
  const { className, ...rest } = props;
  return <div className={cx(className, "ct-pitch")} {...rest} />;
}

/** 細罫の枠(罫の色だけ欲しい場合) */
export const Lined = (props: ComponentPropsWithoutRef<"div">) => {
  const { className, ...rest } = props;
  return <div className={cx(className, "ct-lined")} {...rest} />;
}

/**
 * 対立ペアのリスト。li 内の 3スパン構造(左 / ⇄ / 右)をコンポーネントが保証する。
 */
export const Pairs = ({
  items,
  ...rest
}: ComponentPropsWithoutRef<"ul"> & {
    items: readonly (readonly [ReactNode, ReactNode])[];
  }) => {
  const { className, ...rest2 } = rest;
  return (
    <ul className={cx(className, "ct-pairs")} {...rest2}>
      {items.map((pair) => (
        <li key={String(pair[0])}>
          <span>{pair[0]}</span>
          <span>⇄</span>
          <span>{pair[1]}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * FACTSの定義リスト。dt/dd を div で包む契約(.ct-facts > div)を強制する。
 * 上下の太罫も同時に付く(ct-rows 併用)。
 */
export const Facts = ({
  items,
  ...rest
}: ComponentPropsWithoutRef<"dl"> & {
  items: readonly (readonly [ReactNode, ReactNode])[];
}) => {
  const { className, ...rest2 } = rest;
  return (
    <dl className={cx(className, "ct-facts", "ct-rows")} {...rest2}>
      {items.map((fact) => (
        <div key={String(fact[0])}>
          <dt>{fact[0]}</dt>
          <dd>{fact[1]}</dd>
        </div>
      ))}
    </dl>
  );
}

// ── 5. 反転ブロック(強調は反転で行う) ────────────────────

/** 強調スパン(紙面トークンで自動反転) */
export const Em = (props: ComponentPropsWithoutRef<"span">) => {
  const { className, ...rest } = props;
  return <span className={cx(className, "ct-em")} {...rest} />;
}

/** タグライン帯 */
export const Band = (props: ComponentPropsWithoutRef<"span">) => {
  const { className, ...rest } = props;
  return <span className={cx(className, "ct-band")} {...rest} />;
}

/** 見出し番号チップ */
export const Chip = (props: ComponentPropsWithoutRef<"span">) => {
  const { className, ...rest } = props;
  return <span className={cx(className, "ct-chip")} {...rest} />;
}

/** 成果バッジ */
export const Badge = (props: ComponentPropsWithoutRef<"span">) => {
  const { className, ...rest } = props;
  return <span className={cx(className, "ct-badge")} {...rest} />;
}

// ── 6. 表 ──────────────────────────────────────────────

/** 枠付き表。th/td の構造をコンポーネントが生成する */
export const Table = ({
  columns,
  rows,
  ...rest
}: ComponentPropsWithoutRef<"table"> & {
  columns: readonly ReactNode[];
  rows: readonly (readonly ReactNode[])[];
}) => {
  const { className, ...rest2 } = rest;
  return (
    <table className={cx(className, "ct-table")} {...rest2}>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={i}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── 7. フォーム ────────────────────────────────────────

export const Input = React.forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cx(className, "ct-input")} {...rest} />;
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  ComponentPropsWithoutRef<"select">
>(function Select({ className, ...rest }, ref) {
  return <select ref={ref} className={cx(className, "ct-select")} {...rest} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  ComponentPropsWithoutRef<"textarea">
>(function Textarea({ className, ...rest }, ref) {
  return (
    <textarea ref={ref} className={cx(className, "ct-textarea")} {...rest} />
  );
});

/** ボタン(outline=枠 / solid=反転)。hoverはCSS側 */
export const Btn = ({
  variant = "outline",
  ...rest
}: ComponentPropsWithoutRef<"button"> & { variant?: BtnVariant }) => {
  const { className, ...rest2 } = rest;
  return (
    <button
      className={cx(className, variant === "solid" ? "ct-btn-solid" : "ct-btn")}
      {...rest2}
    />
  );
}

/** エラー(唯一の例外色) */
export const Error = (props: ComponentPropsWithoutRef<"p">) => {
  const { className, ...rest } = props;
  return <p className={cx(className, "ct-error")} {...rest} />;
}

// ── 8. 出現演出 ────────────────────────────────────────

/**
 * 一度きりのフェード(IntersectionObserver / しきい値0.15)。
 * contrast.css の .ct-reveal / .is-shown を使用。SSR安全・unmount時はcleanup。
 * once=false なら領域出入りで表示/非表示を繰り返す。
 */
export const Reveal = ({
  once = true,
  threshold = 0.15,
  ...rest
}: ComponentPropsWithoutRef<"div"> & { once?: boolean; threshold?: number }) => {
  const { className, children } = rest;
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              setShown(true);
              if (once) io.disconnect();
            } else if (!once) {
              setShown(false);
            }
          }
        },
        { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold]);

  return (
    <div ref={ref} className={cx(className, "ct-reveal", shown ? "is-shown" : null)}>
      {children}
    </div>
  );
}
