import { writable } from "svelte/store";

const svURL = writable<string>("");
const svAccessKey = writable<string>("");

export { svURL, svAccessKey };
