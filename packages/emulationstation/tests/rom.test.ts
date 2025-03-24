import { describe, test, expect } from "vitest";
import { ROM } from "../src";

const baseDir = "E:\\Games\\roms\\gba\\No-Intro";

describe("ROM测试", async () => {
  test("zip测试", async () => {
    const rom = new ROM(
      baseDir,
      "0058 - 炸弹人传说 Bomberman Tournament(UE)(Activision)(32Mb).zip",
    );
    await rom.load();
    expect(rom.ext).toBe("zip");
    expect(rom.zip).toBeTruthy();
    expect(rom.rawBytes).not.toBeUndefined();
    expect(rom.romBytes).not.toBeUndefined();
    
    expect(rom.length).not.toBeUndefined();
    expect(rom.length).toBe(2_482_680);
    
    expect(rom.size).not.toBeUndefined();
    expect(rom.size).toBe(4_194_304);

    expect(rom.crc).not.toBeUndefined();
    expect(rom.crc).toBe('240282E6');

    expect(rom.md5).not.toBeUndefined();
    expect(rom.md5).toBe('79aef9bbe1378adfbd688cd66e11a7be');

    console.info("rom = ", {
      ext: rom.ext,
      length: rom.length,
      size: rom.size,
      crc: rom.crc,
      md5: rom.md5,
    });
  });

  test("gba测试", async () => {
    const rom = new ROM(
      baseDir,
      "0045 - 恶魔城-月之轮回 Castlevania - Circle of the Moon(US)(Konami)(64Mb).gba",
    );
    await rom.load();
    expect(rom.ext).toBe("gba");
    expect(rom.zip).toBeFalsy();
    expect(rom.rawBytes).not.toBeUndefined();
    expect(rom.romBytes).not.toBeUndefined();

    expect(rom.length).not.toBeUndefined();
    expect(rom.length).toBe(8_388_608);

    expect(rom.size).not.toBeUndefined();
    expect(rom.size).toBe(8_388_608);

    expect(rom.crc).not.toBeUndefined();
    expect(rom.crc).toBe('1CC059A4');

    expect(rom.md5).not.toBeUndefined();
    expect(rom.md5).toBe('50a1089600603a94e15ecf287f8d5a1f');

    console.info("gba = ", {
      ext: rom.ext,
      length: rom.length,
      size: rom.size,
      crc: rom.crc,
      md5: rom.md5,
    });
  });
});
