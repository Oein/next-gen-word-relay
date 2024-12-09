import chalk from "chalk";

class Logger {
  timeStr() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
  }
  colorTime() {
    return `[${this.timeStr()}]`;
  }
  log(...args: any[]) {
    console.log(this.colorTime(), chalk.gray("(default) "), ...args);
  }
  info(...args: any[]) {
    console.info(this.colorTime(), chalk.blue("(   info) "), ...args);
  }
  success(...args: any[]) {
    console.info(this.colorTime(), chalk.green("(success) "), ...args);
  }
  warn(...args: any[]) {
    console.warn(this.colorTime(), chalk.yellow("(   warn) "), ...args);
  }
  error(...args: any[]) {
    console.error(this.colorTime(), chalk.red("(  error) "), ...args);
  }
  loading(...args: any[]) {
    console.log(this.colorTime(), chalk.gray("(loading) "), ...args);
  }
}

const logger = new Logger();
export default logger;
