/**
 * 游戏信息
 */
export type JeuInfos = {
  /**
   * CRC
   */
  crc?: string;

  /**
   * MD5
   */
  md5?: string;

  /**
   * SHA-1
   */
  sha1?: string;

  /**
   * 平台ID
   */
  systemeid?: string | number;

  /**
   * ROM类型
   */
  romtype?: string;

  /**
   * ROM名称
   */
  romnom?: string;

  /**
   * ?
   */
  romtaille?: string;

  /**
   * ?
   */
  serialnum?: string;

  /**
   * 游戏ID
   */
  gameid?: string | number;
};
