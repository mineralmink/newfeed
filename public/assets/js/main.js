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

function loadFeed(page, itemCallback) {
    if (!page) {
        page = 1
    }
    var defer = $.Deferred()

    $.getJSON(apiUrl('/feeds?page=' + page), function (resp) {
      console.log('page' + page);
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

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';
    } else if (elapsed < msPerMonth) {
         return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
         return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';
    } else{
         return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';
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
