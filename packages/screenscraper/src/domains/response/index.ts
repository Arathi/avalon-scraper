import type { JeuInfos } from "./jeu-infos";

type Header = {
  APIversion: string;
  dateTime: string;
  commandRequested: string;
  success: string;
  error: string;
};

type Serveurs = {
  cpu1: string;
  cpu2: string;
  cpu3: string;
  cpu4: string;
  threadsmin: string;
  nbscrapeurs: string;
  apiacces: string;
  closefornomember: string;
  closeforleecher: string;
  maxthreadfornonmember: string;
  threadfornonmember: string;
  maxthreadformember: string;
  threadformember: string;
};

type SSUser = {
  id: string;
  numid: string;
  niveau: string;
  contribution: string;
  uploadsysteme: string;
  uploadinfos: string;
  romasso: string;
  uploadmedia: string;
  propositionok: string;
  propositionko: string;
  quotarefu: string;
  maxthreads: string;
  maxdownloadspeed: string;
  requeststoday: string;
  requestskotoday: string;
  maxrequestspermin: string;
  maxrequestsperday: string;
  maxrequestskoperday: string;
  visites: string;
  datedernierevisite: string;
  favregion: string;
};

export type Response<D = undefined> = {
  header: Header;
  response: {
    serveurs: Serveurs;
    ssuser: SSUser;
  } & D;
};

export type JeuInfosResponse = Response<JeuInfos>;

export type {
  JeuInfos as JeuInfosData,
};
