import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";

import { unzipSync } from "fflate";
import * as CRC32 from "crc-32";
import dayjs from "dayjs";

import {
  type ScreenScraperClient,
  ScreenScraperAxiosClient,
  type Game as GameInfo,
} from "@avalon-scraper/screenscraper";

import type { Game as GameListItem } from "./domains/game";

type ScraperOptions = {
  username?: string;
  password?: string;
  languages?: string[];
};

export class Scraper {
  client: ScreenScraperClient;
  languages: string[];

  constructor({
    username,
    password,
    languages = ["en"],
  }: ScraperOptions) {
    this.client = new ScreenScraperAxiosClient({
      ssid: username,
      sspassword: password,
    });
    this.languages = languages;
  }

  async getCRC(path: string): Promise<string> {
    const buffer = await readFile(path);
    let bytes = new Uint8Array(buffer.buffer);
    if (path.endsWith(".zip")) {
      const unzipped = unzipSync(bytes);
      const files = Object.keys(unzipped);
      if (files.length !== 1) {
        throw new Error(`压缩包中不止一个文件：${path}`);
      }
      bytes = unzipped[files[0]];
    }

    const crc = CRC32.buf(bytes);
    return crc.toString(16).padStart(8, '0').toUpperCase();
  }

  async loadCache(crc: string, baseDir: string) {
    const prefix = crc.substring(0, 2);
    const fileName = `${crc}.json`;
    const path = resolve(baseDir, ".cache", prefix, fileName);
    if (existsSync(path)) {
      const content = await readFile(path, {
        encoding: "utf-8",
      });
      const gameInfo = JSON.parse(content) as GameInfo;
      return gameInfo;
    }
    return null;
  }

  async saveCache(crc: string, baseDir: string, game: GameInfo) {
    const prefix = crc.substring(0, 2);
    const fileName = `${crc}.json`;
    const path = resolve(baseDir, ".cache", prefix, fileName);
    const dir = resolve(path, "..");
    if (!existsSync(dir)) {
      console.info("目录不存在：", dir);
      await mkdir(dir);
    }

    const content = JSON.stringify(game, null, "  ");
    await writeFile(path, content, {
      encoding: "utf-8",
    });
    console.info("缓存保存成功：", path);
  }

  async download(path: string, baseDir: string, url: string) {
    const fullPath = resolve(baseDir, path);
    if (existsSync(fullPath)) {
      console.info("文件已存在：", path);
      return;
    }

    console.info('开始下载：', url);
  }

  fromDictionary(dict: Record<string, string>, source = "") {
    let text: string | undefined = undefined;
    for (const lang of this.languages) {
      text = dict[lang];
      if (text !== undefined) {
        return text;
      }
    }
    const langs = Object.keys(dict);
    const [lang] = langs;
    console.info(`${source}没有找到偏好语言对应的文本，使用默认语言：${lang}`);
    return dict[lang];
  }

  async scrape(path: string, baseDir: string) {
    const fullPath = resolve(baseDir, path);
    console.info("正在刮削", fullPath);

    const crc = await this.getCRC(fullPath);
    console.info("根据CRC搜索ROM:", crc);

    let info: GameInfo | null = await this.loadCache(crc, baseDir);
    if (info === null) {
      info = await this.client.getGameByCRC(crc);
      this.saveCache(crc, baseDir, info);
    }

    const version = info.versions[info.versionId];
    if (version === undefined) {
      throw new Error(`未找到的版本：${info.id}/${info.versionId}`);
    }

    if (version.regions.length > 1) {
      console.warn(`${info.id}/${info.versionId}包含多个地区信息`);
    }
    const region = version.regions[0];
    if (region === undefined) {
      throw new Error(`未找到地区信息：${info.id}/${info.versionId}`);
    }

    const name = info.names[region];
    if (name === undefined) {
      throw new Error(`名称获取失败，${info.id}/${region}`);
    }

    const desc = this.fromDictionary(info.synopsis, `${info.id}/synopsis`);

    let image: string | undefined = undefined;
    let screenshot = info.medias.find(
      m => m.type === "screenshot" && m.region === region
    );
    if (screenshot === undefined) {
      screenshot = info.medias.find(
        m => m.type === "screenshot" && m.region === 'wor'
      );
    }
    if (screenshot === undefined) {
      screenshot = info.medias.find(
        m => m.type === "screenshot-title" && m.region === region
      );
    }
    if (screenshot === undefined) {
      screenshot = info.medias.find(
        m => m.type === "screenshot-title" && m.region === 'wor'
      );
    }
    if (screenshot !== undefined) {
      image = `./.images/${info.id}-image-${screenshot.sha1}.${screenshot.format}`;
      this.download(image, baseDir, screenshot.url);
    } else {
      console.warn(`截图获取失败：${info.id}/${info.versionId}`);
    }

    let marquee: string | undefined = undefined;
    let title = info.medias.find(
      m => m.type === "title" && m.region === region
    );
    if (title === undefined) {
      title = info.medias.find(
        m => m.type === "title" && m.region === 'wor'
      );
    }
    if (title === undefined) {
      title = info.medias.find(
        m => m.type === "title-small" && m.region === region
      );
    }
    if (title === undefined) {
      title = info.medias.find(
        m => m.type === "title-small" && m.region === 'wor'
      );
    }
    if (title !== undefined) {
      marquee = `./.images/${info.id}-marquee-${title.sha1}.${title.format}`;
      this.download(marquee, baseDir, title.url);
    } else {
      console.warn(`标题图片获取失败：${info.id}/${info.versionId}`);
    }

    let thumbnail: string | undefined = undefined;
    let cover = info.medias.find(
      m => m.type === "box-cover" && m.region === region
    );
    if (cover === undefined) {
      cover = info.medias.find(
        m => m.type === "box-cover" && m.region === 'wor'
      );
    }
    if (cover !== undefined) {
      thumbnail = `./.images/${info.id}-thumb-${cover.sha1}.${cover.format}`;
      this.download(thumbnail, baseDir, cover.url);
    } else {
      console.warn(`包装盒封面获取失败：${info.id}/${info.versionId}`);
    }

    if (info.genres.length > 1) {
      console.debug(`${info.id}存在多个分类`);
    }
    const [primaryGenre] = info.genres;
    const genre = this.fromDictionary(primaryGenre.names, `genre-${primaryGenre.id}`);
    
    if (info.series.length > 1) {
      console.debug(`${info.id}存在多个系列`);
    }
    const [series] = info.series;
    const family = this.fromDictionary(series.names, `family-${series.id}`);

    let lang: string | undefined = undefined;
    if (version.languages.length > 0) {
      [lang] = version.languages;
    }
    if (lang === undefined) {
      switch (region) {
        case "us":
        case "eu":
          lang = 'en';
          break;
        case "jp":
          lang = "jp";
          break;
        case "cn":
          lang = "cn";
          break;
      }
      console.warn(`${info.id}/${info.versionId}未找到语言，根据区域信息生成语言：`, lang);
    }

    const now = dayjs();

    const game = {
      path: `./${path}`,
      id: info.id,
      name,
      desc,
      image,
      marquee,
      thumbnail,
      releasedate: info.releaseDates[region],
      developer: info.developer,
      publisher: info.publisher,
      genre,
      family,
      players: info.players,
      md5: version.md5,
      lang,
      region,
      scraps: [{
        name: "ScreenScraper",
        date: now.format('YYYYMMDDTHHmmss'),
      }],
    } satisfies GameListItem;

    // console.info("生成游戏列表项如下：", game);
    return game;
  }

  /**
   * 扫描ROM
   */
  async scanROMs(dir: string, filters?: string[]) {
    const dirents = await readdir(dir, {
      withFileTypes: true,
      recursive: true,
    });

    let files: string[] = [];
    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        continue;
      }

      const {
        name,
        parentPath,
      } = dirent;
      const absolutePath = resolve(parentPath, name);
      let relativePath = relative(dir, absolutePath);
      if (sep === '\\') {
        relativePath = relativePath.replaceAll(sep, '/');
      }

      files.push(relativePath);
    }

    if (filters !== undefined) {
      files = files.filter((file) => {
        for (const filter of filters) {
          const f = file.toLowerCase();
          const ext = filter.toLowerCase();
          if (f.endsWith(ext)) {
            return true;
          }
        }
        return false;
      });
    }

    return files;
  }
}
