export type IChannelServer = {
  name: string;
  url: string;
  access_key: string;
};

export type Config = {
  PORT: number;
  PING_INTERVAL: number;

  channelServers: IChannelServer[];
};
