import { blue, green, injectCss, injectScript, log, red } from "./utils";

interface pckInfo {
  code?: string; 
  type?: PKG_TYPE;
  version?: string; 
  url?: string; 
}

enum PKG_TYPE {
  JS,
  CSS,
  OTHER
}

function isCdn(pkg: string) {
  return /^https?:/.test(pkg)
}

function getPkgName(pkg: string) {
  const matches = pkg.match(/(^.+)(@[0-9]+($|\..*))/)
  return matches ? matches[1] : pkg
}

async function fetchCdn(pkg: string): Promise<pckInfo> {
  const res = await fetch(pkg);
  const type = detectPkgType(res)
  const code = await res.text();
  return { code, type, version: '', url: pkg };
}

async function fetchNpm(pkg: string): Promise<pckInfo> {
  const url = `https://cdn.jsdelivr.net/npm/${pkg}`
  const res = await fetch(url)
  const type = detectPkgType(res)
  const version = detectPkgVersion(res)
  const code = await res.text()
  return { code, type, version, url }
}

function detectPkgVersion(reponse: Response) {
  const version = reponse.headers.get('x-jsd-version')
  return version
}

function detectPkgType(reponse: Response) {
  const contentType = reponse.headers.get('content-type')
  if(contentType.includes('application/javascript')) {
    return PKG_TYPE.JS
  } else if(contentType.includes('text/css')) {
    return PKG_TYPE.CSS
  } else {
    return PKG_TYPE.OTHER
  }
}

async function loadPackage(pkg: string) {
  log(blue(`fetching ${pkg}`))
  const isCdnPkg = isCdn(pkg)
  try {
    const { type, version, url } = isCdnPkg ? await fetchCdn(pkg) : await fetchNpm(pkg)
    const fullPkgName = isCdnPkg ? pkg : getPkgName(pkg) + (version ? `@${version}` : '')
    if(type === PKG_TYPE.JS) {
      window.postMessage({ type: 'vars', data: { vars: Object.keys(window) } })
      await injectScript(url)
      window.postMessage({ type: 'pkg_load_success', data: { pkg: fullPkgName, vars: Object.keys(window) } })
      return
    }
    if(type === PKG_TYPE.CSS) {
      await injectCss(url)
      log(green('Pkg Loaded'), blue(fullPkgName), blue(' CSS has been injected into current page'))
      return
    }
    log(red('not support content type'))
  } catch (e) {
    log(red(`fail load ${pkg}, ${e.message}`))
  }
}

function injectPkg(namespace: string = '_pkg') {
  if(window[namespace]) {
    window.postMessage({ type: 'conflict', data: { namespace } })
  } else {
    window[namespace] = function(pkg) {
      window.postMessage({ type: 'pkg', data: { pkg } })
    }
    window[`${namespace}_esm`] = async (name: string) => {
      log(blue(`fetching esm module ${name}`))
      const res = await import(`https://esm.run/${name}`)
      log(green(`${name} esm Loaded`))
      return res
    }
  }
}

function listenTypeConflict (ev: MessageEvent) {
  const namespace = ev.data.data.namespace
  log(red(`\`${namespace}\` already existed, won't inject anything`))
}

function listenTypePkg (ev: MessageEvent) {
  const { pkg } = ev.data.data
  if(typeof pkg !== 'string') {
    log(red(`pkg name must be string`))
    return
  }
  loadPackage(pkg)
}

function listenMessage() {
  let preVars = []
  window.addEventListener('message', (ev) => {
    if(ev.source == window && ev.data?.type === 'pkg') {
      listenTypePkg(ev)
    }
    if(ev.source == window && ev.data?.type === 'pkg_load_success') {
      const { vars, pkg } = ev.data.data
      const addedVars = vars.filter(v => !preVars.includes(v))
      if(addedVars.length) {
        log(green('Pkg Loaded'), blue(pkg), blue(` Found added global namespace: ${addedVars.join(', ')}`))
      } else {
        log(green('Pkg Loaded'), blue(pkg), red(` No added global namespace found`))
      }
    }
    if(ev.source == window && ev.data?.type === 'vars') {
      preVars = ev.data.data.vars
    }
    if(ev.source === window && ev.data?.type === 'conflict') {
      listenTypeConflict(ev)
    }
  })
}

injectPkg()
listenMessage()

export { };

