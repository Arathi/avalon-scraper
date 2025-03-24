export type Game = {
  /**
   * 路径
   */
  path: string;

  /**
   * ScreenScraper平台游戏编号
   */
  '@id'?: number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 描述
   */
  desc?: string;

  /**
   * 截图
   */
  image?: string;

  /**
   * 标题图片
   */
  marquee?: string;

  /**
   * 封面图片
   */
  thumbnail?: string;

  /**
   * 发布时间
   * 
   * 格式: YYYYMMDDTHHmmss
   */
  releasedate?: string;

  /**
   * 开发商
   */
  developer?: string;

  /**
   * 发行商
   */
  publisher?: string;

  /**
   * 分类
   */
  genre?: string;

  /**
   * 系列
   */
  family?: string;

  /**
   * 玩家人数
   */
  players?: string;

  /**
   * MD5（ROM文件，非压缩包）
   */
  md5?: string;

  /**
   * CRC-32
   */
  crc?: string;

  /**
   * 语言
   */
  lang?: string;

  /**
   * 地区
   */
  region?: string;

  /**
   * 刮削记录
   */
  scrap?: Scrap | Scrap[];

  /**
   * 是否收藏
   */
  favorite?: boolean;

  /**
   * 游玩次数
   */
  playcount?: number;

  /**
   * 上次游玩时间
   * 
   * 格式: YYYYMMDDTHHmmss
   */
  lastplayed?: string;
};

/**
 * 刮削记录
 */
type Scrap = {
  /**
   * 平台名称
   */
  '@name': string;

  /**
   * 刮削日期时间
   */
  '@date': string;
};
