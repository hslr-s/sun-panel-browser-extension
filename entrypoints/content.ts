export default defineContentScript({
  matches: ['https://*/*', 'http://*/*', '*://*'],
  main() {
    // const iframe = document.getElementById('iframe-sun-panel')

    // console.log('Iframe66666', iframe)
    // if (iframe) {
    //   console.log('Iframe存在', iframe)
    //   let previousSrc = iframe.src

    //   const observer = new MutationObserver(() => {
    //     if (iframe.src !== previousSrc) {
    //       previousSrc = iframe.src
    //       window.open(iframe.src, '_blank')
    //     }
    //   })

    //   observer.observe(iframe, {
    //     attributes: true,
    //     attributeFilter: ['src'],
    //   })
    // }
  },
})
