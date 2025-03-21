import type { Language } from "../language";

export type Genre = {
  id: number;
  names: Record<Language, string>;
};
