import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import type { Game } from "./game";
import { ROM } from "./rom";
import { type ROMFilter, ZIPFilter } from "./rom-filter";

const DefaultFileName = "gamelist.xml";

type GameListOptions = {
  dir: string;
  fileName?: string;
  games?: Game[];
  loadImmediately?: boolean;
};

export class GameList {
  dir: string;
  fileName: string;
  games: Game[];

  constructor({
    dir,
    fileName = DefaultFileName,
    games = [],
    loadImmediately = false,
  }: GameListOptions) {
    this.dir = dir;
    this.fileName = fileName;
    this.games = games;
    if (loadImmediately) {
      this.load(fileName);
    }
  }

  get length() {
    return this.games.length;
  }

  async scan(filter: (path: string) => boolean) {
    const entries = await readdir(this.dir, {
      recursive: true,
      withFileTypes: true,
    });

    const files: string[] = [];
    for (const entry of entries) {
      if (entry.isDirectory()) {
        continue;
      }

      const { name, parentPath } = entry;
      const fullPath = resolve(parentPath, name);
      let path = relative(this.dir, fullPath);
      if (sep === "\\") {
        path = path.replaceAll("\\", "/");
      }
      path = `./${path}`;
      if (filter(path)) {
        files.push(path);
      }
    }

    for (const path of files) {
      const startAt = new Date().valueOf();
      const rom = new ROM(this.dir, path);
      await rom.load();
      const duration = new Date().valueOf() - startAt;
      console.debug(`${path} 加载完成，耗时：${duration} ms`);

      const lastSlash = path.lastIndexOf("/");
      const lastDot = path.lastIndexOf(".");
      const name = path.substring(lastSlash + 1, lastDot);

      let region: string | undefined = undefined;
      let lang: string | undefined = undefined;
      if (name.indexOf("(JP)") > 0) {
        region = "jp";
        lang = "jp";
      } else if (name.indexOf("(US)") > 0) {
        region = "us";
        lang = "en";
      } else if (name.indexOf("(EU)") > 0 || name.indexOf("(UE)") > 0) {
        region = "eu";
        lang = "en";
      } else if (name.indexOf("(FR)")) {
        region = "eu";
        lang = "fr";
      } else if (name.indexOf("(DE)")) {
        region = "eu";
        lang = "de";
      } else {
        console.warn("无法从文件名获取地区：", name);
      }

      const { md5, crc } = rom;

      const game = {
        path,
        name,
        region,
        lang,
        md5,
        crc,
      } satisfies Game;
      await this.update(game, false);
    }
  }

  async load(fileName?: string) {
    const path = resolve(this.dir, fileName ?? this.fileName);
    console.debug("正在读取游戏列表：", path);
    const content = await readFile(path, {
      encoding: "utf-8",
    });
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@",
    });
    const doc = parser.parse(content);
    this.games = doc.gameList.game;
  }

  async save(fileName?: string) {
    const path = resolve(this.dir, fileName ?? this.fileName);
    console.debug("正在保存游戏列表：", path);
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: "@",
      suppressEmptyNode: true,
      format: true,
      indentBy: '\t',
    });
    const doc = builder.build({
      gameList: {
        game: this.games,
      },
    });
    const content = `<?xml version="1.0"?>\n${doc}`;
    await writeFile(path, content, {
      encoding: "utf-8",
    });
  }

  async update(game: Game, saveImmediately = false) {
    const index = this.games.findIndex((g) => g.path === game.path);
    if (index !== -1) {
      this.games[index] = game;
    } else {
      this.games.push(game);
    }
    if (saveImmediately) {
      await this.save();
    }
  }

  static async from({
    dir,
    fileName = DefaultFileName,
    filter = ZIPFilter,
  }: {
    dir: string,
    fileName?: string,
    filter?: ROMFilter,
  }) {
    const list = new GameList({
      dir,
      fileName,
    });

    const path = resolve(dir, fileName);
    if (existsSync(path)) {
      console.info(`${fileName}已存在`);
      await list.load();
    } else {
      console.warn(`${fileName}不存在，扫描ROM目录生成列表文件`);
      await list.scan(filter);
      await list.save();
    }

    return list;
  }
}
