import type { Game } from "./game";

export type GameListDocument = {
  gameList: {
    game?: Game | Game[];
  };
};
