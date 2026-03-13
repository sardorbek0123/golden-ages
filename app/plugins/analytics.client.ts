const GTAG_ID = 'AW-17928071140'
const FB_PIXEL_ID = '1607287043845190'

const loadScript = (src: string) => {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

const initAnalytics = () => {
  const win = window as any

  if (win.__analyticsLoaded) {
    return
  }

  win.__analyticsLoaded = true

  loadScript(`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`)

  win.dataLayer = win.dataLayer || []
  win.gtag = function gtag(...args: unknown[]) {
    win.dataLayer.push(args)
  }

  win.gtag('js', new Date())
  win.gtag('config', GTAG_ID)

  if (!win.fbq) {
    const fbq = function (...args: unknown[]) {
      if ((fbq as any).callMethod) {
        ;(fbq as any).callMethod.apply(fbq, args)
      } else {
        ;(fbq as any).queue.push(args)
      }
    }

    ;(fbq as any).push = fbq
    ;(fbq as any).loaded = true
    ;(fbq as any).version = '2.0'
    ;(fbq as any).queue = []

    win.fbq = fbq
    win._fbq = fbq

    loadScript('https://connect.facebook.net/en_US/fbevents.js')
  }

  win.fbq('init', FB_PIXEL_ID)
  win.fbq('track', 'PageView')
}

export default defineNuxtPlugin(() => {
  window.addEventListener('load', () => {
    window.setTimeout(initAnalytics, 3000)
  }, { once: true })
})
