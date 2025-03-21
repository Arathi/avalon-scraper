import dayjs, { type Dayjs } from "dayjs";

import type { Game } from "./domains/game";
import type { Jeu } from "./domains/jeu";
import type { Language } from "./domains/language";
import type { BaseRequest, JeuInfosParams } from "./domains/request";
import type {
  JeuInfosData,
  JeuInfosResponse,
  Response,
} from "./domains/response";
import type { Region } from "./domains/region";
import { version } from "../package.json";
import type { Version } from "./domains/game/version";
import type { Genre } from "./domains/game/genre";
import type { Media, MediaType } from "./domains/game/media";

export type ScreenScraperOptions = {
  baseUrl?: string;
  proxy?: ProxyOptions;
} & Partial<BaseRequest>;

export type ProxyOptions = {
  protocol: "none" | "http" | "https" | "socks5";
  host: string;
  port: number;
  username?: string;
  password?: string;
};

const BASE_URL = 'https://api.screenscraper.fr/api2';
const DEV_ID_JELOS = "jelos";
const DEV_PASSWORD_JELOS = "jelos";
const DEFAULT_SOFT_NAME = `avalon-scraper ${version}`;

export abstract class ScreenScraperClient {
  baseURL: string;
  proxy?: ProxyOptions;

  devid: string;
  devpassword: string;
  softname: string;
  output: BaseRequest['output'];
  ssid?: string;
  sspassword?: string;

  constructor({
    baseUrl = BASE_URL,
    proxy,
    devid = DEV_ID_JELOS,
    devpassword = DEV_PASSWORD_JELOS,
    softname = DEFAULT_SOFT_NAME,
    output = "json",
    ssid,
    sspassword,
  }: ScreenScraperOptions) {
    this.baseURL = baseUrl;
    this.proxy = proxy;
    this.devid = devid;
    this.devpassword = devpassword;
    this.softname = softname;
    this.output = output;
    this.ssid = ssid;
    this.sspassword = sspassword;
  }

  get baseParams() {
    return {
      devid: this.devid,
      devpassword: this.devpassword,
      softname: this.softname,
      output: this.output,
      ssid: this.ssid,
      sspassword: this.sspassword,
    } satisfies BaseRequest;
  }

  jeuInfos(params: JeuInfosParams): Promise<JeuInfosResponse> {
    return this.get<JeuInfosParams, JeuInfosData>("/jeuInfos.php", params);
  }

  convertJeu(jeu: Jeu): Game {
    const names: Record<string, string> = {};
    for (const {region, text} of jeu.noms) {
      names[region] = text;
    }

    const synopsis: Record<string, string> = {};
    for (const {langue, text} of jeu.synopsis) {
      synopsis[langue] = text;
    }

    const releaseDates: Record<string, string> = {};
    for (const {region, text} of jeu.dates) {
      const day = dayjs(text)
      releaseDates[region] = day.format("YYYYMMDDT000000");
    }

    const genres: Genre[] = [];
    for (const {id, noms} of jeu.genres) {
      const names: Record<Region, string> = {};
      for (const {langue, text} of noms) {
        names[langue] = text;
      }
      const genre = {
        id: Number.parseInt(id),
        names,
      } satisfies Genre;
      genres.push(genre);
    }

    const series: Genre[] = [];
    for (const {id, noms} of jeu.familles) {
      const names: Record<Region, string> = {};
      for (const {langue, text} of noms) {
        names[langue] = text;
      }
      const genre = {
        id: Number.parseInt(id),
        names,
      } satisfies Genre;
      series.push(genre);
    }

    const medias: Media[] = [];
    for (const {
      type: ssType,
      url,
      region,
      crc,
      md5,
      sha1,
      size,
      format,
    } of jeu.medias) {
      let type: MediaType | undefined = undefined;
      switch (ssType) {
        case "sstitle":
          type = "screenshot-title";
          break;
        case "ss":
          type = "screenshot";
          break;
        case "screenmarquee":
          type = "title";
          break;
        case "screenmarqueesmall":
          type = "title-small";
          break;
        case "box-2D":
          type = "box-cover";
          break;
      }
      if (type === undefined) {
        continue;
      }
      
      const media = {
        type,
        url,
        region,
        crc,
        md5,
        sha1,
        size: Number.parseInt(size),
        format,
      } satisfies Media;
      medias.push(media);
    }

    const versions: Record<number, Version> = {};
    for (const {
      id,
      romsize,
      romfilename: fileName,
      romcrc: crc,
      rommd5: md5,
      romsha1: sha1,
      regions: jeuRegions,
      langues,
    } of jeu.roms) {
      const version = {
        id: Number.parseInt(id),
        size: Number.parseInt(romsize),
        fileName,
        crc,
        md5,
        sha1,
        regions: jeuRegions?.regions_shortname ?? [],
        languages: langues?.langues_shortname ?? [],
      } satisfies Version;
      versions[version.id] = version;
    }

    return {
      id: Number.parseInt(jeu.id),
      versionId: Number.parseInt(jeu.romid),
      names,
      publisher: jeu.editeur.text,
      developer: jeu.developpeur.text,
      players: jeu.joueurs.text,
      rating: jeu.note.text,
      synopsis,
      releaseDates,
      genres,
      series,
      medias,
      versions,
    } satisfies Game;
  }

  async getGameByDigest(type: DigestType, digest: string): Promise<Game> {
    const params = {
      [type]: digest,
    };
    const resp = await this.jeuInfos({
      ...params,
    });
    const { jeu } = resp.response;
    return this.convertJeu(jeu);
  }

  async getGameByCRC(crc: string) {
    return this.getGameByDigest("crc", crc);
  }

  async getGameByMD5(md5: string) {
    return this.getGameByDigest("md5", md5);
  }

  async getGameBySHA1(sha1: string) {
    return this.getGameByDigest("sha1", sha1);
  }

  abstract get<P, D>(uri: string, params: P): Promise<Response<D>>;
}

type DigestType = "crc" | "md5" | "sha1";
