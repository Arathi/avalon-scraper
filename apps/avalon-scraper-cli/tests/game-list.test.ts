import { describe, test, expect } from 'vitest';
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from 'node:path';
import { XMLParser, XMLBuilder } from "fast-xml-parser";

import type { Game } from '../src';

describe("GameList 测试", async () => {
  //

  test("加载gamelist.xml", async () => {
    const dir = "E:\\Downloads\\Games";
    const path = resolve(dir, "gamelist.xml");
    const content = await readFile(path, { encoding: "utf-8" });
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@",
    });
    const doc = parser.parse(content);
    const games = doc.gameList.game as Game[];
    const [gba0058, gba0005, gba0333, gba0997, gba0996, gba0027, ss3820] = games;
    console.info("ss3820信息如下：\n", ss3820);
  });

  test("生成gamelist.xml", async () => {
    const dir = "E:\\Downloads\\Games";
    const games: Game[] = [
      {
        path: "./rom1.gba",
        name: "ROM 1",
        region: "jp",
        lang: "jp",
      },
      {
        path: "./rom2.zip",
        name: "ROM 2",
        region: "us",
        lang: "en",
      },
      {
        path: "./rom3.gba",
        '@id': 3,
        name: "ROM 3",
        region: "jp",
        lang: "jp",
        scrap: {
          '@name': "FakeScraper",
          '@date': "20230324T102700",
        }
      },
      {
        path: "./rom4.zip",
        '@id': 4,
        name: "ROM 4",
        region: "us",
        lang: "en",
        scrap: [{
          '@name': "FakeScraper",
          '@date': "20230324T102701",
        }, {
          '@name': "MockScraper",
          '@date': "20230324T102702",
        }]
      },
    ];
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: "@",
      format: true,
      indentBy: "\t",
      suppressEmptyNode: true,
    });
    const doc = builder.build({
      gameList: {
        game: games,
      },
    });
    console.info("doc信息如下：\n", doc);
    const path = resolve(dir, "gamelist1.xml");
    const content = `<?xml version="1.0"?>\n${doc}`;
    await writeFile(path, content, {
      encoding: "utf-8",
    });
  });
});
