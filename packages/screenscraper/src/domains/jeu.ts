type Region = string;

/**
 * 游戏
 */
export type Jeu = {
  /**
   * 编号
   */
  id: string;

  /**
   * ROM编号
   */
  romid: string;

  /**
   * 是否为游戏
   */
  notgame: string;

  /**
   * 名称
   */
  noms: {
    region: Region;
    text: string;
  }[];

  /**
   * 克隆自
   */
  cloneof: string;

  /**
   * 系统（平台）
   */
  systeme: {
    id: string;
    text: string;
  };

  /**
   * 发行商
   */
  editeur: {
    id: string;
    text: string;
  };

  /**
   * 开发商
   */
  developpeur: {
    id: string;
    text: string;
  };

  /**
   * 玩家人数
   */
  joueurs: {
    text: string;
  };

  /**
   * 评分（满分20）
   */
  note: {
    text: string;
  };

  /**
   * ?
   */
  topstaff: string;

  /**
   * ?
   */
  rotation: string;

  /**
   * 简介
   */
  synopsis: {
    langue: string;
    text: string;
  }[];

  /**
   * 分级
   */
  classifications: {
    type: string;
    text: string;
  }[];

  /**
   * 发行日期
   */
  dates: {
    region: Region;
    text: string;
  }[];

  /**
   * 分类
   */
  genres: Genre[];

  /**
   * 系列
   */
  familles: Genre[];

  /**
   * 文件
   */
  medias: Media[];

  /**
   * ROM
   */
  roms: ROM[];
};

/**
 * 分类
 */
type Genre = {
  id: string;
  nomcourt: string;
  principale: string;
  parentid: string;
  noms: {
    langue: string;
    text: string;
  }[];
};

type MediaType = 
  | "sstitle"
  | "ss"
  | "screenmarquee"
  | "screenmarqueesmall"
  | "steamgrid"
  | "wheel"
  | "wheel-carbon"
  | "wheel-steel"
  | "box-2D"
  | "box-2D-side"
  | "box-2D-back"
  | "box-texture"
  | "box-3D"
  | string
  ;

/**
 * 媒体文件
 */
type Media = {
  /**
   * 分类
   */
  type: MediaType;

  /**
   * 父类型
   */
  parent: string;

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
   * 文件大小（字节）
   */
  size: string;

  /**
   * 文件格式（扩展名）
   */
  format: string;
};

/**
 * ROM
 */
type ROM = {
  /**
   * 编号
   */
  id: string;

  /**
   * 文件大小
   */
  romsize: string;

  /**
   * 文件名
   */
  romfilename: string;

  /**
   * ?
   */
  romnumsupport: string;

  /**
   * ?
   */
  romtotalsupport: string;

  /**
   * ?
   */
  romcloneof: string;

  /**
   * CRC
   */
  romcrc: string;

  /**
   * MD5
   */
  rommd5: string;

  /**
   * SHA-1
   */
  romsha1: string;

  /**
   * 是否为beta版
   */
  beta: string;

  /**
   * 是否为试玩版
   */
  demo: string;

  /**
   * 是否为原型版
   */
  proto: string;

  /**
   * ?
   */
  trad: string;

  /**
   * 是否为Hack版
   */
  hack: string;

  /**
   * 地址
   */
  unl: string;

  /**
   * ?
   */
  alt: string;

  /**
   * ?
   */
  best: string;

  /**
   * ?
   */
  netplay: string;

  /**
   * 区域
   */
  regions?: Regions;

  /**
   * 语言
   */
  langues?: Langues;
};

/**
 * 区域
 */
type Regions = {
  regions_id: string[];
  regions_shortname: string[];
  [key: string]: string[];
};

/**
 * 语言
 */
type Langues = {
  langues_id: string[];
  langues_shortname: string[];
  [key: string]: string[];
};
