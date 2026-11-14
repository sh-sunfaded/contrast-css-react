import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import * as C from "./ct";

afterEach(() => {
  cleanup(); // RTL の自動 cleanup は globals: true の場合のみなので手動で
  vi.unstubAllGlobals();
});

// ── レイアウト ────────────────────────────────────────────

describe("レイアウト契約", () => {
  it("Paper は tone から紙面クラスを出す", () => {
    const { container } = render(<C.Paper tone="black" />);
    expect(container.querySelector("section.ct-paper-black")).not.toBeNull();
  });

  it("className はライブラリ側クラスに追記合成される(上書きしない)", () => {
    const { container } = render(
      <C.Container className="my-class">
        <C.Section>
          <C.Grid cols={4}>x</C.Grid>
        </C.Section>
      </C.Container>
    );
    const el = container.querySelector("div.my-class") as HTMLElement;
    expect(el.classList.contains("ct-container")).toBe(true);
    expect(el.querySelector("div.ct-section")).not.toBeNull();
    expect(el.querySelector("div.ct-grid-4")).not.toBeNull();
  });

  it("Grid はデフォルトで ct-grid-2", () => {
    const { container } = render(<C.Grid>x</C.Grid>);
    expect(container.querySelector("div.ct-grid-2")).not.toBeNull();
  });

  it("残る見出し・罫線部品 — H1/H3/Frame/Outline/Rows/Pitch/Lined", () => {
    const { container } = render(
      <C.Section>
        <C.H1>大見出し</C.H1>
        <C.H3>小見出し</C.H3>
        <C.Frame>額縁の中</C.Frame>
        <C.Outline>小枠の中</C.Outline>
        <C.Rows>
          <li>行1</li>
          <li>行2</li>
        </C.Rows>
        <C.Pitch>左太罫ピッチ</C.Pitch>
        <C.Lined>40%罫</C.Lined>
      </C.Section>
    );
    for (const cls of [
      "h1.ct-h1",
      "h3.ct-h3",
      "div.ct-frame",
      "div.ct-outline",
      "ul.ct-rows",
      "div.ct-pitch",
      "div.ct-lined",
    ]) {
      expect(container.querySelector(cls)).not.toBeNull();
    }
  });

  it("タイポ — H2/Ruby/Rule/Label/Mono/Sub/Em/Band/Chip/Badge が対応クラスを持つ", () => {
    const { container } = render(
      <C.Section>
        <C.Label>SECTION — 01</C.Label>
        <C.H2>見出し</C.H2>
        <C.Ruby>caption</C.Ruby>
        <C.Rule />
        <C.Sub>副本文</C.Sub>
        <p>
          本文 <C.Em>強調</C.Em> <C.Band>帯</C.Band> <C.Chip>01</C.Chip>{" "}
          <C.Badge>成果</C.Badge> <C.Mono>mono</C.Mono>
        </p>
      </C.Section>
    );
    for (const cls of [
      "p.ct-label",
      "h2.ct-h2",
      "p.ct-ruby",
      "div.ct-rule",
      "p.ct-sub",
      "span.ct-em",
      "span.ct-band",
      "span.ct-chip",
      "span.ct-badge",
      "span.ct-mono",
    ]) {
      expect(container.querySelector(cls)).not.toBeNull();
    }
  });
});

// ── マークアップ契約(手書きすると間違える構造を型+テストで釘付け) ──

describe("マークアップ契約", () => {
  it("Facts は dt/dd を div で包む(.ct-facts > div 契約)+上下太罫", () => {
    const { container } = render(
      <C.Facts
        items={[
          ["形態", "オンライン"],
          ["設立", "2023年"],
        ] as const}
      />
    );
    const dl = container.querySelector("dl.ct-facts") as HTMLDListElement;
    expect(dl.classList.contains("ct-rows")).toBe(true);
    const wraps = dl.querySelectorAll("div");
    expect(wraps).toHaveLength(2);
    expect(wraps[0].querySelector("dt")!.textContent).toBe("形態");
    expect(wraps[0].querySelector("dd")!.textContent).toBe("オンライン");
  });

  it("Pairs は li 内に3スパン構造(左/⇄/右)を強制する", () => {
    const { container } = render(
      <C.Pairs
        items={[
          ["白", "黒"],
          ["影", "光"],
        ] as const}
      />
    );
    const li = container.querySelector("ul.ct-pairs li") as HTMLLIElement;
    const spans = li.querySelectorAll("span");
    expect(spans).toHaveLength(3);
    expect(spans[0].textContent).toBe("白");
    expect(spans[1].textContent).toBe("⇄");
    expect(spans[2].textContent).toBe("黒");
  });

  it("Table は thead/th と tbody/td を生成する", () => {
    const { container } = render(
      <C.Table
        columns={["年度", "成果"] as const}
        rows={[["2024", "サイト公開"]] as const}
      />
    );
    const table = container.querySelector("table.ct-table") as HTMLTableElement;
    expect(table.querySelector("thead th")!.textContent).toBe("年度");
    expect(table.querySelector("tbody td")!.textContent).toBe("2024");
  });
});

// ── フォーム ──────────────────────────────────────────────

describe("フォーム契約", () => {
  it("Btn は variant で ct-btn / ct-btn-solid を切り替える", () => {
    const { container } = render(<C.Btn>送信</C.Btn>);
    expect(container.querySelector("button.ct-btn")).not.toBeNull();
    const solid = render(<C.Btn variant="solid">反転</C.Btn>).container;
    expect(solid.querySelector("button.ct-btn-solid")).not.toBeNull();
  });

  it("Input は forwardRef で ref を通し ct-input を付ける", () => {
    const ref: { current: HTMLInputElement | null } = { current: null };
    render(<C.Input ref={ref} className="extra" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current!.classList.contains("ct-input")).toBe(true);
    expect(ref.current!.classList.contains("extra")).toBe(true);
  });

  it("Select / Textarea も同様(ref転送 + クラス付与)", () => {
    const sel: { current: HTMLSelectElement | null } = { current: null };
    const ta: { current: HTMLTextAreaElement | null } = { current: null };
    render(
      <>
        <C.Select ref={sel} />
        <C.Textarea ref={ta} />
      </>
    );
    expect(sel.current!.classList.contains("ct-select")).toBe(true);
    expect(ta.current!.classList.contains("ct-textarea")).toBe(true);
  });

  it("Error は唯一の例外色クラスを出す", () => {
    const { container } = render(<C.Error>入力エラー</C.Error>);
    expect(container.querySelector("p.ct-error")).not.toBeNull();
  });
});

// ── Reveal(SSR安全) ───────────────────────────────────────

describe("Reveal", () => {
  it("IO が無い環境では即表示に倒れる(SSR安全)", () => {
    // jsdom には IntersectionObserver が無い = この状態で検証できる
    const { container } = render(<C.Reveal>本文</C.Reveal>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.classList.contains("ct-reveal")).toBe(true);
    expect(el.classList.contains("is-shown")).toBe(true);
  });

  it("IO コールバックで is-shown が付く", () => {
    // noinspection JSUnusedGlobalSymbols ─ モックはInterface実装のため
    // 全メソッドが必須(Revealのcleanupで disconnect は実際に呼ばれる)
    class MockIO {
      cb: IntersectionObserverCallback;
      constructor(cb: IntersectionObserverCallback) {
        this.cb = cb;
      }
      observe() {
        this.cb(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver
        );
      }
      disconnect() {}
      unobserve() {}
    }
    vi.stubGlobal("IntersectionObserver", MockIO);
    const { container } = render(<C.Reveal once>現れる</C.Reveal>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.classList.contains("is-shown")).toBe(true);
  });
});
