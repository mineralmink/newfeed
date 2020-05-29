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
        var userByEids = {}
        var loadUsers = $.map(resp.data, function (val) {
            return $.getJSON(apiUrl('/users/' + val.user_eid), function (userResp) {
                userByEids[val.user_eid] = userResp
            })
        })
        $.when.apply(this, loadUsers).then(function () {
            $.each(resp.data, function (key, val) {
                var data = $.extend({}, val, { user: userByEids[val.user_eid] })
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

$(document).ready(function () {
    function infScrollLoader() {
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
