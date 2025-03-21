import type { Region } from "../region";

/**
 * 媒体类型
 */
export type MediaType =
  | "screenshot-title" // 截图（标题界面）
  | "screenshot"       // 截图（游戏中）
  | "title"            // 标题
  | "title-small"      // 标题（小）
  | "box-cover"        // 包装盒（封面）
  | "box-side"         // 包装盒（侧面）
  | "box-back"         // 包装盒（背面）
  | string
  ;

/**
 * 媒体
 */
export type Media = {
  /**
   * 类型
   */
  type: MediaType;

  /**
   * 下载地址
   */
  url: string;

  /**
   * 区域
   */
  region: Region;

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
   * 文件大小
   */
  size: number;

  /**
   * 文件格式（扩展名）
   */
  format: string;
};
