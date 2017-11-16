$(function() {
  // 打开popup后立即取出chrome extension的localStorage然后渲染界面
  chrome.storage.local.get(null, function(res) {
    // console.log(res);
    if (res) {
      const keys = Object.keys(res)
      for (const index in keys) {
        const key = keys[index]
        let value = res[keys[index]]
        // 正则表达式将双引号换成单引号
        value = value.replace(/\"/g, '\'')
        // value = JSON.parse(value)
        $('#account-list').append('\
          <li>\
            <span class="account-tag">' + key + '</span>\
            <input type="text" value="' + value + '" hidden/>\
            <button class="switch-button btn" type="button">切换</button>\
            <button class="delete-button btn" type="button">删除</button>\
          </li>\
        ')
      }
    }
  })

  /*
   * delete
   */
  $('#account-list').on('click', 'li .delete-button', function() {
    // 获取li下的span text 也就是标签
    const spanElement = ($(this).siblings('span'))[0];
    const spanText = $(spanElement).text()
    chrome.storage.local.remove(spanText, function() {
      console.log('删除成功');
      const parentLiElement = $(spanElement).parent('li')
      $(parentLiElement).remove()
    })
  })

  /*
   * 切换
   */
  $('#account-list').on('click', 'li .switch-button', function() {
    // 获取li下的input的value
    const inputElement = ($(this).siblings('input'))[0];
    const inputValue = $(inputElement).val()
    const switchMessageContent = JSON.parse(inputValue.replace(/\'/g, '\"'))
    // 发送消息
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'switch', content: switchMessageContent}, function(response) {
        console.log('switch successfully');
      })
    })
  })
  /*
   * 添加
   */
  $('#add').click(function() {
    let tagContent = $('#tag').val()
    if (tagContent.trim() === '') {
      console.log('内容不允许为空');
    } else {
      // 发送消息给content_scripts获取native localstorage
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'add'}, function(response) {
          const messageContent = response.content
          let d = {}
          d[tagContent] = JSON.stringify(messageContent)
          chrome.storage.local.set(d, function() {
            const value = d[tagContent].replace(/\"/g, '\'')
            $('#account-list').append('\
              <li>\
                <span class="account-tag">' + tagContent + '</span>\
                <input type="text" value="' + value + '" hidden/>\
                <button class="switch-button btn" type="button">切换</button>\
                <button class="delete-button btn" type="button">删除</button>\
              </li>\
            ')
            $('#tag').val('')
          })
        })
      })
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
