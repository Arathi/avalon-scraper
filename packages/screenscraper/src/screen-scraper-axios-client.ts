import Axios, { type AxiosInstance, type AxiosProxyConfig } from "axios";

import type { Response } from "./domains/response";
import {
  type ProxyOptions,
  ScreenScraperClient,
  type ScreenScraperOptions,
} from "./screen-scraper-client";

function createHttpClient(baseURL: string, proxyOptions?: ProxyOptions) {
  let proxy: AxiosProxyConfig | false = false;
  if (proxyOptions !== undefined) {
    const { protocol, host, port, username, password } = proxyOptions;
    let auth: AxiosProxyConfig['auth'] = undefined;
    if (
      protocol !== "none" &&
      username !== undefined &&
      password !== undefined
    ) {
      auth = {
        username,
        password,
      };
    }
    proxy = {
      protocol,
      host,
      port,
      auth,
    };
    console.debug("使用代理服务器：", proxy);
  }
  return Axios.create({
    baseURL,
    proxy,
  });
}

export class ScreenScraperAxiosClient extends ScreenScraperClient {
  axios: AxiosInstance;

  constructor(options: ScreenScraperOptions) {
    super(options);
    this.axios = createHttpClient(
      this.baseURL,
      this.proxy,
    );
  }

  async get<P, D>(uri: string, params: P): Promise<Response<D>> {
    const req = {
      ...this.baseParams,
      ...params,
    };
    const resp = await this.axios.get<Response<D>>(uri, {
      params: req,
    });
    return resp.data;
  }
}
