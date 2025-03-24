import {
  type Game as GameListItem,
  GameList,
  ROM,
  type ROMFilter,
} from "@avalon-scraper/emulationstation";

import {
  type ScreenScraperClient,
  ScreenScraperAxiosClient,
  type Game as GameInfo,
} from "@avalon-scraper/screenscraper";

type ScraperOptions = {
  username?: string;
  password?: string;
  languages?: string[];
};

export class Scraper {
  client: ScreenScraperClient;
  languages: string[];

  constructor({
    username,
    password,
    languages = ["en"],
  }: ScraperOptions) {
    this.client = new ScreenScraperAxiosClient({
      ssid: username,
      sspassword: password,
    });
    this.languages = languages;
  }

  async scrapeDir(dir: string, filter: ROMFilter) {
    const list = await GameList.from({
      dir,
      filter,
    });
  }

  async scrapeROM(rom: ROM) {
    
  }
}
