import { describe, it, expect } from "vitest";
import {
  PLATFORM_META,
  MVP_PLATFORMS,
  ALL_PLATFORMS,
  SORT_OPTIONS,
  CATEGORIES,
  CATEGORY_TREE,
  isCategoryGroup,
  PRICE_PRESETS,
  PAGE_SIZE,
} from "@/lib/constants";

describe("PLATFORM_META", () => {
  const expectedPlatforms = ["bungae", "danggeun", "joonggonara", "hellomarket", "vinted"] as const;

  it("5개 플랫폼 정의", () => {
    expect(Object.keys(PLATFORM_META)).toHaveLength(5);
  });

  it.each(expectedPlatforms)("%s: label·bg·text 필드 존재", (platform) => {
    const meta = PLATFORM_META[platform];
    expect(meta).toBeDefined();
    expect(meta.label).toBeTruthy();
    expect(meta.bg).toMatch(/^#/);
    expect(meta.text).toMatch(/^#/);
  });

  it("지정된 브랜드 색상 정확성", () => {
    expect(PLATFORM_META.bungae.bg).toBe("#FF6B2C");
    expect(PLATFORM_META.danggeun.bg).toBe("#1DBE6B");
    expect(PLATFORM_META.joonggonara.bg).toBe("#3478F6");
    expect(PLATFORM_META.vinted.bg).toBe("#7B61FF");
  });
});

describe("MVP_PLATFORMS", () => {
  it("vinted 포함", () => {
    expect(MVP_PLATFORMS).toContain("vinted");
  });

  it("hellomarket 미포함 (MVP 제외)", () => {
    expect(MVP_PLATFORMS).not.toContain("hellomarket");
  });

  it("주요 3개 플랫폼 포함", () => {
    expect(MVP_PLATFORMS).toContain("bungae");
    expect(MVP_PLATFORMS).toContain("danggeun");
    expect(MVP_PLATFORMS).toContain("joonggonara");
  });

  it("ALL_PLATFORMS의 부분집합", () => {
    for (const p of MVP_PLATFORMS) {
      expect(ALL_PLATFORMS).toContain(p);
    }
  });
});

describe("SORT_OPTIONS", () => {
  it("최소 4개 정렬 옵션", () => {
    expect(SORT_OPTIONS.length).toBeGreaterThanOrEqual(4);
  });

  it("각 옵션에 value·label 필드", () => {
    for (const opt of SORT_OPTIONS) {
      expect(opt.value).toBeTruthy();
      expect(opt.label).toBeTruthy();
    }
  });

  it("latest 옵션 포함", () => {
    expect(SORT_OPTIONS.map((o) => o.value)).toContain("latest");
  });

  it("price_asc 옵션 포함", () => {
    expect(SORT_OPTIONS.map((o) => o.value)).toContain("price_asc");
  });
});

describe("CATEGORIES", () => {
  it("'all' 카테고리 포함", () => {
    expect(CATEGORIES[0].value).toBe("all");
  });

  it("13개 이상 카테고리 (기존 8 + 가구 5)", () => {
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(13);
  });

  it("각 카테고리에 value·label 필드", () => {
    for (const cat of CATEGORIES) {
      expect(cat.value).toBeTruthy();
      expect(cat.label).toBeTruthy();
    }
  });

  it("가구 카테고리 포함 (sofa, bed, desk, storage, lighting)", () => {
    const values = CATEGORIES.map((c) => c.value);
    expect(values).toContain("sofa");
    expect(values).toContain("bed");
    expect(values).toContain("desk");
    expect(values).toContain("storage");
    expect(values).toContain("lighting");
  });
});

describe("CATEGORY_TREE", () => {
  it("최상위 노드 6개 (all + clothing group + 신발·가방·액세서리 + furniture group)", () => {
    expect(CATEGORY_TREE).toHaveLength(6);
  });

  it("의류 그룹 존재 및 자식 4개", () => {
    const clothing = CATEGORY_TREE.find(
      (n) => isCategoryGroup(n) && n.group === "clothing"
    );
    expect(clothing).toBeDefined();
    expect(isCategoryGroup(clothing!)).toBe(true);
    if (isCategoryGroup(clothing!)) {
      expect(clothing.children).toHaveLength(4);
    }
  });

  it("가구 그룹 존재 및 자식 5개", () => {
    const furniture = CATEGORY_TREE.find(
      (n) => isCategoryGroup(n) && n.group === "furniture"
    );
    expect(furniture).toBeDefined();
    expect(isCategoryGroup(furniture!)).toBe(true);
    if (isCategoryGroup(furniture!)) {
      expect(furniture.children).toHaveLength(5);
    }
  });

  it("리프 노드에 group 필드 없음", () => {
    for (const n of CATEGORY_TREE) {
      if (!isCategoryGroup(n)) {
        expect("group" in n).toBe(false);
        expect("value" in n).toBe(true);
      }
    }
  });
});

describe("PRICE_PRESETS", () => {
  it("첫 번째 프리셋은 '전체' (min·max 없음)", () => {
    const first = PRICE_PRESETS[0];
    expect(first.label).toBe("전체");
    expect(first.min).toBeUndefined();
    expect(first.max).toBeUndefined();
  });

  it("프리셋 범위 단조 증가", () => {
    const withRange = PRICE_PRESETS.filter((p) => p.max !== undefined);
    for (let i = 1; i < withRange.length; i++) {
      expect(withRange[i].max!).toBeGreaterThan(withRange[i - 1].max!);
    }
  });
});

describe("PAGE_SIZE", () => {
  it("양수", () => {
    expect(PAGE_SIZE).toBeGreaterThan(0);
  });
});
