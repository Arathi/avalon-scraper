import { resolve } from "node:path";
import { readFile } from "node:fs/promises";

import { unzipSync } from "fflate";
import CRC32 from 'crc-32';
import CryptoJS from 'crypto-js';

export class ROM {
  dir: string;
  fileName: string;
  rawBytes?: Uint8Array;
  romBytes?: Uint8Array;

  constructor(dir: string, fileName: string) {
    this.dir = dir;
    this.fileName = fileName;
  }

  get ext() {
    const dot = this.fileName.lastIndexOf(".");
    const extName = this.fileName.substring(dot + 1);
    return extName.toLocaleLowerCase();
  }

  get zip() {
    return this.ext === "zip";
  }

  get length() {
    if (this.rawBytes === undefined) {
      return undefined;
    }
    return this.rawBytes.length;
  }

  get size() {
    if (this.romBytes === undefined) {
      return undefined;
    }
    return this.romBytes.length;
  }

  async load() {
    const path = resolve(this.dir, this.fileName);
    const buffer = await readFile(path);
    this.rawBytes = new Uint8Array(buffer.buffer);
    if (this.zip) {
      const unzipped = unzipSync(this.rawBytes);
      const files = Object.keys(unzipped);
      const [file] = files;
      this.romBytes = unzipped[file];
    } else {
      this.romBytes = this.rawBytes;
    }
  }

  get crc() {
    if (this.romBytes === undefined) {
      return undefined;
    }
    const crc32 = CRC32.buf(this.romBytes);
    return crc32.toString(16).padStart(8, '0').toUpperCase();
  }

  get md5() {
    if (this.romBytes === undefined) {
      return undefined;
    }
    const wordArray = CryptoJS.lib.WordArray.create(this.romBytes);
    const hash = CryptoJS.MD5(wordArray);
    return hash.toString();
  }

  // async getFileNames(bytes: Uint8Array): Promise<string[]> {
  //   const unzipper = new Unzip();
  //   const files: string[] = [];
  //   unzipper.onfile = (file) => {
  //     let name = file.name;
  //     files.push(name);
  //   };
  //   unzipper.register(AsyncUnzipInflate);
  //   unzipper.push(bytes);
  //   return files;
  // }
}
