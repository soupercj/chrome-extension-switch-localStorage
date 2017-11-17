function Util() {}

Util.prototype = {
  isJSON: function(s) {
    let flag = true
    try {
      JSON.parse(s)
    } catch(err) {
      // console.log('----util.js-----');
      // console.log(err);
      flag = false
    }
    return flag
  },

  test: function() {
    console.log('--test---');
  },

  getAccountLiHtml: function(tag, value) {
    return '<li>\
      <span class="account-tag">' + tag + '</span>\
      <input type="text" value="' + value + '" hidden/>\
      <button class="switch-button btn" type="button">switch</button>\
      <button class="delete-button btn" type="button">delete</button>\
    </li>'
  }
}
