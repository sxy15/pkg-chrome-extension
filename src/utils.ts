import logsty from "logsty";

export const green = (message: string) => logsty.bgGreen.white(message)
export const red = (message: string) => logsty.bgRed.white(message)
export const blue = (message: string) => logsty.bgBlue.white(message)
export const log = logsty.log

export const injectScript = async (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.onload = resolve
    script.onerror = reject
    script.src = url
    document.body.appendChild(script)
    script.remove()
  })
}

export const injectCss = async (url) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.onload = resolve
    link.onerror = reject
    link.href = url
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  })
}
