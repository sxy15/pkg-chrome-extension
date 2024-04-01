import type { PlasmoCSConfig } from "plasmo";
import injectUrl from 'url:~./inject.ts';
import { green, injectScript, log } from "./utils";

const init = async () => {
  await injectScript(injectUrl)
  log(green('pkg chrome extension script load success'))
}

init()

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}
