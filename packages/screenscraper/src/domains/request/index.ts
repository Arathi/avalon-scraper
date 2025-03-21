import type { JeuInfos } from "./jeu-infos";

type OutputType = "json" | "xml";

export type BaseRequest = {
  devid: string;
  devpassword: string;
  softname: string;
  output: OutputType;
  ssid?: string;
  sspassword?: string;
};

export type Request<P = undefined> = BaseRequest & P;

export type JeuInfosRequest = Request<JeuInfos>;

export type {
  JeuInfos as JeuInfosParams,
};
