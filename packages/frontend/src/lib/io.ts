import { io } from "socket.io-client";
import { log } from "./log";
import { browser } from "$app/environment";

class IO {
  private socket: any;

  constructor() {
    if (!browser) return;
    log("IO constructor");
    this.socket = io({
      autoConnect: false,
    });

    this.socket.on("connect", () => {
      log("Connected to server");
    });
  }

  public getSocket() {
    if (!browser) return null as any;
    return this.socket;
  }

  public connect(svurl: string, ak: string) {
    if (!browser) return;
    this.socket.io.opts.extraHeaders = {
      Authorization: ak,
    };
    this.socket.io.uri = svurl;
    this.socket.connect();
  }

  public disconnect() {
    if (!browser) return;
    this.socket.disconnect();
  }

  eventListener(event: string, cb: (...data: any) => void) {
    if (!browser) return () => {};
    this.socket.on(event, cb);

    return () => {
      this.socket.off(event, cb);
    };
  }
}

const ioInstance = new IO();
export default ioInstance;
