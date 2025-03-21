import type { Language } from "../language";
import type { Region } from "../region";

/**
 * ROM版本
 */
export type Version = {
  /**
   * 编号
   */
  id: number;

  /**
   * 文件大小
   */
  size: number;

  /**
   * 文件名
   */
  fileName: string;
  
  /**
   * CRC
   */
  crc: string;

  /**
   * MD5
   */
  md5: string;

  /**
   * SHA-1
   */
  sha1: string;

  /**
   * 地区列表
   */
  regions: Region[];

  /**
   * 语言列表
   */
  languages: Language[];
};
