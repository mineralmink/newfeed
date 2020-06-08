var templates = {}

function handlebarsLoadTemplate(templateIds) {
    var loading = $.map(templateIds, function (templateId) {
        var src = '/assets/js/templates/' + templateId + '.handlebars'
        return $.get(src, function (data) {
            templates[templateId] = Handlebars.compile(data);

        })
    })
    return $.when.apply(this, loading)
}

var listTemplates = ["feed-item-link", "feed-item-post", "feed-item-checkin"]
var templateLoading = handlebarsLoadTemplate(listTemplates)

function apiUrl(path) {
    return 'http://localhost:5555' + path
}

function loadDiscovery(url) {

  var defer = $.Deferred()
  $.getJSON(apiUrl('/feeds?page=' + 1), function (resp) {
      console.log(resp.data);
      var userByEids = {}
      var loadUsers = $.map(resp.data, function (val) {
          return $.getJSON(apiUrl('/users/' + val.user_eid), function (userResp) {
              userByEids[val.user_eid] = userResp
          })
      })
      $.when.apply(this, loadUsers).then(function () {
          $.each(resp.data, function (key, val) {
              var data = $.extend({}, val, { user: userByEids[val.user_eid] })
              data.created_time = relativeTime(data.created_time);
              itemCallback(data)
          })
          defer.resolve()
      })
  })
  return defer
}


function loadFeed(page, itemCallback) {
    if (!page) {
        page = 1
    }
    var defer = $.Deferred()
    $.getJSON(apiUrl('/feeds?page=' + page), function (resp) {
        console.log(resp.data);
        var userByEids = {}
        var loadUsers = $.map(resp.data, function (val) {
            return $.getJSON(apiUrl('/users/' + val.user_eid), function (userResp) {
                userByEids[val.user_eid] = userResp
            })
        })
        $.when.apply(this, loadUsers).then(function () {
            $.each(resp.data, function (key, val) {
                var data = $.extend({}, val, { user: userByEids[val.user_eid] })
                data.created_time = relativeTime(data.created_time);
                itemCallback(data)
            })
            defer.resolve()
        })
    })
    return defer
}

function renderFeedItem(item) {
    var feedContent = $('#feed-content')
    if (item.type === "Checkin") {
        feedContent.append(templates["feed-item-checkin"](item))
    } else if (item.type === "Post") {
        feedContent.append(templates["feed-item-post"](item))
    } else if (item.type === "Link") {
        feedContent.append(templates["feed-item-link"](item))
    }
}

function relativeTime(post_time) {
    var current = new Date();
    var previous = new Date(post_time);
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;
    if(elapsed < 0){
      return 'This date is not valid'
    }
    else if(Math.round(elapsed/1000) == 0){
      return 'Just now';
    } else if (elapsed < msPerMinute) {
      if(Math.round(elapsed/1000) == 1)
         return Math.round(elapsed/1000) + ' second ago';
      else
         return Math.round(elapsed/1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        if(Math.round(elapsed/msPerMinute) == 1)
         return Math.round(elapsed/msPerMinute) + ' minute ago';
        else
         return Math.round(elapsed/msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay ) {
      if(Math.round(elapsed/msPerHour) == 1)
         return Math.round(elapsed/msPerHour ) + ' hour ago';
      else
         return Math.round(elapsed/msPerHour ) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        if (Math.round(elapsed/msPerDay) == 1)
         return Math.round(elapsed/msPerDay) + ' day ago';
        else
         return Math.round(elapsed/msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        if (Math.round(elapsed/msPerMonth) == 1)
         return Math.round(elapsed/msPerMonth) + ' month ago';
        else
         return Math.round(elapsed/msPerMonth) + ' months ago';
    } else{
        if (Math.round(elapsed/msPerYear) == 1)
         return Math.round(elapsed/msPerYear) + ' year ago';
        else
         return Math.round(elapsed/msPerYear) + ' years ago';
    }
}



$(document).ready(function () {
    function infScrollLoader() {
        sessionStorage.clear();
        if (infScrollLoader.loading === true) {
            return
        }
        if (!infScrollLoader.page) {
            infScrollLoader.page = 1
        }

        infScrollLoader.loading = true
        loadFeed(infScrollLoader.page++, renderFeedItem)
            .then(function () {
                infScrollLoader.loading = false
            })
    }

    $(window).on('scroll resize', function () {
        var scrollHeight = $(document).height();
        var scrollPos = $(window).height() + $(window).scrollTop();
        if (scrollHeight - scrollPos <= 200) {
            infScrollLoader()
        }
    })

    templateLoading.then(function () {
        infScrollLoader()
    })
})

module.exports = {
  relativeTime,
  apiUrl,
  loadDiscovery,
  loadFeed
}
