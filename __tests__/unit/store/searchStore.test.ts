import { describe, it, expect, beforeEach } from "vitest";
import { useSearchStore } from "@/store/searchStore";

const reset = () => useSearchStore.setState({ recentKeywords: [] });

describe("useSearchStore", () => {
  beforeEach(reset);

  describe("addKeyword", () => {
    it("키워드 추가", () => {
      useSearchStore.getState().addKeyword("나이키");
      expect(useSearchStore.getState().recentKeywords).toEqual(["나이키"]);
    });

    it("최신 키워드가 앞에 위치", () => {
      useSearchStore.getState().addKeyword("나이키");
      useSearchStore.getState().addKeyword("아디다스");
      expect(useSearchStore.getState().recentKeywords[0]).toBe("아디다스");
    });

    it("중복 키워드 → 앞으로 이동 (중복 제거)", () => {
      useSearchStore.getState().addKeyword("나이키");
      useSearchStore.getState().addKeyword("아디다스");
      useSearchStore.getState().addKeyword("나이키");
      const kws = useSearchStore.getState().recentKeywords;
      expect(kws[0]).toBe("나이키");
      expect(kws.filter((k) => k === "나이키")).toHaveLength(1);
    });

    it("최대 10개 유지 (초과 시 잘라냄)", () => {
      for (let i = 0; i < 12; i++) {
        useSearchStore.getState().addKeyword(`키워드${i}`);
      }
      expect(useSearchStore.getState().recentKeywords).toHaveLength(10);
    });

    it("11번째 추가 시 가장 오래된 항목 삭제", () => {
      for (let i = 0; i < 10; i++) {
        useSearchStore.getState().addKeyword(`키워드${i}`);
      }
      useSearchStore.getState().addKeyword("새키워드");
      const kws = useSearchStore.getState().recentKeywords;
      expect(kws).toContain("새키워드");
      expect(kws).not.toContain("키워드0");
    });
  });

  describe("removeKeyword", () => {
    it("특정 키워드 삭제", () => {
      useSearchStore.getState().addKeyword("나이키");
      useSearchStore.getState().addKeyword("아디다스");
      useSearchStore.getState().removeKeyword("나이키");
      expect(useSearchStore.getState().recentKeywords).not.toContain("나이키");
      expect(useSearchStore.getState().recentKeywords).toContain("아디다스");
    });

    it("없는 키워드 삭제 시 무변화", () => {
      useSearchStore.getState().addKeyword("나이키");
      useSearchStore.getState().removeKeyword("없는키워드");
      expect(useSearchStore.getState().recentKeywords).toHaveLength(1);
    });
  });

  describe("clearKeywords", () => {
    it("전체 초기화", () => {
      useSearchStore.getState().addKeyword("나이키");
      useSearchStore.getState().addKeyword("아디다스");
      useSearchStore.getState().clearKeywords();
      expect(useSearchStore.getState().recentKeywords).toHaveLength(0);
    });

    it("빈 상태에서 초기화 시 오류 없음", () => {
      expect(() => useSearchStore.getState().clearKeywords()).not.toThrow();
    });
  });
});
