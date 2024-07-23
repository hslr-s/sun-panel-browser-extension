export default defineBackground(() => {
  console.log('加载了 background')
  browser.webNavigation.getFrame({
    tabId: 1,
    frameId: 2,
  }).then((details) => {
    if (browser.runtime.lastError) {
      console.error('Error: ', browser.runtime.lastError)
    }
    else {
      console.log('Frame Details: ', details)
    }
  })

  browser.webNavigation.onBeforeNavigate.addListener((details) => {
    // `details` 是一个包含有关导航的信息的对象
    console.log('Navigating to:', details.url)
  }, { url: [{ urlMatches: '.*' }] })
})
