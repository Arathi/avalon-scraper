export type ROMFilter = (fileName: string) => boolean;

export const NESRegex = /^.*\.(nes|zip)$/i;
export const FDSRegex = /^.*\.(fds|zip)$/i;
export const SNESRegex = /^.*\.(smc|zip)$/i;
export const GBRegex = /^.*\.(gb|zip)$/i;
export const GBCRegex = /^.*\.(gbc|zip)$/i;
export const GBARegex = /^.*\.(gba|zip)$/i;
export const CompressRegex = /^.*\.(gz|zip)$/i; // 7z|bz2|gz|xz|zip
export const ZIPRegex = /^.*\.(zip)$/i;

export const NESFilter = (fileName: string) => NESRegex.test(fileName);
export const FDSFilter = (fileName: string) => FDSRegex.test(fileName);
export const SNESFilter = (fileName: string) => SNESRegex.test(fileName);
export const GBFilter = (fileName: string) => GBRegex.test(fileName);
export const GBCFilter = (fileName: string) => GBCRegex.test(fileName);
export const GBAFilter = (fileName: string) => GBARegex.test(fileName);
export const ZIPFilter = (fileName: string) => ZIPRegex.test(fileName);
