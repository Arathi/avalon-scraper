import { describe, test, expect } from "vitest";
import { type ScreenScraperClient, ScreenScraperAxiosClient } from "../src";

const {
  SCREEN_SCRAPER_ID: ssid,
  SCREEN_SCRAPER_PASSWORD: sspassword,
} = process.env;

const CRC_0027 = "38231BC2";
const CRC_0058 = "240282E6";
const GAME_ID_0027_0058 = 3912;
const ROM_ID_0027 = 159657;
const ROM_ID_0058 = 159662;

describe("ScreenScraper Axios Client", async () => {
  const client: ScreenScraperClient = new ScreenScraperAxiosClient({
    ssid,
    sspassword,
  });

  test("jeuInfos", async () => {
    const startAt = new Date().valueOf();
    const resp = await client.jeuInfos({
      crc: CRC_0027,
    });
    const duration = new Date().valueOf() - startAt;
    console.info(`请求完成，耗时：${duration}ms`);

    const { jeu } = resp.response;
    expect(jeu.id).toBe(`${GAME_ID_0027_0058}`);
    expect(jeu.romid).toBe(`${ROM_ID_0027}`);
  });

  test("getGameByCRC", async () => {
    const startAt = new Date().valueOf();
    const game = await client.getGameByCRC(CRC_0027);
    const duration = new Date().valueOf() - startAt;
    console.info(`请求完成，耗时：${duration}ms`);

    expect(game.id).toBe(GAME_ID_0027_0058);
    expect(game.versionId).toBe(ROM_ID_0027);
    console.info(`获取游戏信息：\n${JSON.stringify(game, null, '  ')}`);
  });

  test("getGameByDigest", async () => {
    const startAt = new Date().valueOf();
    const game = await client.getGameByDigest("crc", CRC_0058);
    const duration = new Date().valueOf() - startAt;
    console.info(`请求完成，耗时：${duration}ms`);

    expect(game.id).toBe(GAME_ID_0027_0058);
    expect(game.versionId).toBe(ROM_ID_0058);
    console.info(`获取游戏信息：\n${JSON.stringify(game, null, '  ')}`);
  });
});
