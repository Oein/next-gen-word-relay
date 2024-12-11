import { writable } from "svelte/store";

const logsWritable = writable<[string, string][]>([]);

export const log = (...messages: any[]) => {
  logsWritable.update((logs) => {
    const time = new Date();
    const timeStr = `[${time.getHours().toString().padStart(2, "0")}:${time
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}]`;
    const newLogs: [string, string][] = [
      ...logs,
      [
        timeStr,
        messages
          .map((x) => (typeof x == "object" ? JSON.stringify(x, null, 2) : x))
          .join(" "),
      ],
    ];

    if (newLogs.length > 50) {
      newLogs.shift();
    }

    return newLogs;
  });
};

export { logsWritable };
