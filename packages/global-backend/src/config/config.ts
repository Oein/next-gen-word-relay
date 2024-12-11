import type { Config } from "./types";

const CFG: Config = {
  PORT: parseInt(process.env.PORT || "3004"),
  PING_INTERVAL: 5000,
  ORIGIN: process.env.ORIGIN || "http://localhost:5173",

  AUTH: {
    SUCCESS_REDIRECT: "http://localhost:5173/",
    FAILURE_REDIRECT: "/auth/signin.html",
  },

  channelServers: [
    {
      name: "워커 서버",
      url: "http://localhost:3005",
      access_key:
        "Access EdPhWFZ.2poo5D_aOSMwzMW0jjapRCdFsmXmbnLyiORXbgChMHEYXn_BWYXNkgh8",
    },
  ],
};

export default CFG;
