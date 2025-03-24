import { describe, test, expect } from "vitest";
import { GameList } from "../src";

describe("GameList测试", async () => {
  const list = new GameList({
    dir: "E:\\Games\\roms\\gba",
  });

  test("ROM扫描测试", async () => {
    const startAt = new Date().valueOf();
    const regex = /^\.\/No-Intro\/\d{4}.*\.(gba|zip)$/i;
    await list.scan((path) => regex.test(path));
    expect(list.length).toBe(100);
    const duration = new Date().valueOf() - startAt;
    console.info(`${list.length} 个ROM扫描完成，累计耗时：${duration} ms`);
    await list.save();
  });
});
