import { describe, test, expect } from 'vitest';
import { Scraper } from "../src";

const {
  SCREEN_SCRAPER_ID: ssid,
  SCREEN_SCRAPER_PASSWORD: sspassword,
} = process.env;

describe("Scraper 测试", async () => {
  const scraper = new Scraper({
    username: ssid,
    password: sspassword,
  });

  test("测试获取ROM列表", async () => {
    const files = await scraper.scanROMs("E:\\Games\\roms\\gba", [".gba", ".zip"]);
    console.info("文件如下");
    for (const file of files) {
      console.info(file);
    }
  });

  test("测试刮削指定文件", async () => {
    const baseDir = "E:\\Games\\roms\\gba";
    const path = "No-Intro/0019 - 寂静岭 Silent Hill - Play Novel(JP)(Konami)(64Mb).zip";
    await scraper.scrape(path, baseDir);
  });
});
