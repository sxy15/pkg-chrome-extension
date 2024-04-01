import clsty from "clsty";

export const green = (message: string) => clsty.bgGreen.white(message)
export const red = (message: string) => clsty.bgRed.white(message)
export const blue = (message: string) => clsty.bgBlue.white(message)
export const log = clsty.log

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
