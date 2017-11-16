$(function() {
  console.log('content.js loaded...')
  // 监听来自popup的add switch消息
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('我收到popup发来的消息了')
    if (request.type === 'add') {
      // 获取localstorage
      const localStorage = window.localStorage
      const messageContent = {}
      const keys = Object.keys(localStorage)
      for (const index in keys) {
        if (isJSON(localStorage[keys[index]])) {
          messageContent[keys[index]] = JSON.parse(localStorage[keys[index]])
        } else {
          messageContent[keys[index]] = localStorage[keys[index]]
        }
      }
      sendResponse({
        content: messageContent
      })
    } else if (request.type === 'switch') {
      const switchMessageContent = request.content
      // update native localStorage
      console.log('我收到了switch的消息了');
      console.log(switchMessageContent)
      window.localStorage.clear()
      const keys = Object.keys(switchMessageContent)
      for (const index in keys) {
        window.localStorage.setItem(keys[index], JSON.stringify(switchMessageContent[keys[index]]))
      }
      // 重新加载页面
      window.location.reload()
    } else {
      sendResponse({})
    }
  })
})

function isJSON(s) {
  let flag = true
  try {
    JSON.parse(s)
  } catch(err) {
    flag = false
  }
  return flag
}
