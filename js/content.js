$(function() {
  const utilObject = new Util()
  // console.log('content.js loaded...')
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'add') {
      const localStorage = window.localStorage
      const messageContent = {}
      const keys = Object.keys(localStorage)
      for (const index in keys) {
        if (utilObject.isJSON(localStorage[keys[index]])) {
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
      window.localStorage.clear()
      const keys = Object.keys(switchMessageContent)
      for (const index in keys) {
        window.localStorage.setItem(keys[index], JSON.stringify(switchMessageContent[keys[index]]))
      }
      window.location.reload()
    } else {
      sendResponse({})
    }
  })
})
