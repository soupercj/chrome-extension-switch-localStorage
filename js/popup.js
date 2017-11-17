$(function() {
  const utilObject = new Util()
  // open popup then get extension localStorage immediately
  chrome.storage.local.get(null, function(res) {
    if (res) {
      const keys = Object.keys(res)
      for (const index in keys) {
        const key = keys[index]
        let value = res[keys[index]]
        // regular expression to change double quotes into single quotes
        value = value.replace(/\"/g, '\'')
        $('#account-list').append(utilObject.getAccountLiHtml(key, value))
      }
    }
  })

  /*
   * delete
   */
  $('#account-list').on('click', 'li .delete-button', function() {
    const spanElement = ($(this).siblings('span'))[0];
    const spanText = $(spanElement).text()
    chrome.storage.local.remove(spanText, function() {
      const parentLiElement = $(spanElement).parent('li')
      $(parentLiElement).remove()
    })
  })

  /*
   * 切换
   */
  $('#account-list').on('click', 'li .switch-button', function() {
    const inputElement = ($(this).siblings('input'))[0];
    const inputValue = $(inputElement).val()
    const switchMessageContent = JSON.parse(inputValue.replace(/\'/g, '\"'))
    // send message
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'switch', content: switchMessageContent}, function(response) {
        // console.log('switch successfully');
      })
    })
  })
  /*
   * add
   */
  $('#add').click(function() {
    let tagContent = $('#tag').val()
    if (tagContent.trim() === '') {
      $('#error').text('null is not allowed')
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'add'}, function(response) {
          const messageContent = response.content
          let d = {}
          d[tagContent] = JSON.stringify(messageContent)
          chrome.storage.local.set(d, function() {
            const value = d[tagContent].replace(/\"/g, '\'')
            $('#account-list').append(utilObject.getAccountLiHtml(tagContent, value))
            $('#tag').val('')
            $('#error').text('')
          })
        })
      })
    }
  })
})
