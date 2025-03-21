import type { Region } from "../region";
import type { Language } from "../language";
import type { Genre } from "./genre";
import type { Media } from "./media";
import type { Version } from "./version";

export type GameOptions = {
  id: number;
  versionId: number;
  names: Record<Region, string>;
  publisher: string;
  developer: string;
  players: string;
  rating: string;
  synopsis: Record<Language, string>;
  releaseDates: Record<Region, string>;
  genres: Genre[];
  series: Genre[];
  medias: Media[];
  versions: Record<number, Version>;
};

export class Game {
  /**
   * 编号
   */
  id: number;
  
  /**
   * ROM编号
   */
  versionId: number;
  
  /**
   * 名称
   */
  names: Record<Region, string>;
  
  /**
   * 发行商
   */
  publisher: string;

  /**
   * 开发商
   */
  developer: string;

  /**
   * 玩家人数
   */
  players: string;

  /**
   * 评分
   */
  rating: string;

  /**
   * 简介
   */
  synopsis: Record<Language, string>;

  /**
   * 发行日期
   */
  releaseDates: Record<Region, string>;

  /**
   * 分类
   */
  genres: Genre[];

  /**
   * 系列
   */
  series: Genre[];

  /**
   * 媒体文件
   */
  medias: Media[];

  /**
   * ROM列表
   */
  versions: Record<number, Version>;

  constructor({
    id,
    versionId,
    names,
    publisher,
    developer,
    players,
    rating,
    synopsis,
    releaseDates,
    genres,
    series,
    medias,
    versions,
  }: GameOptions) {
    this.id = id;
    this.versionId = versionId;
    this.names = names;
    this.publisher = publisher;
    this.developer = developer;
    this.players = players;
    this.rating = rating;
    this.synopsis = synopsis;
    this.releaseDates = releaseDates;
    this.genres = genres;
    this.series = series;
    this.medias = medias;
    this.versions = versions;
  }
};
