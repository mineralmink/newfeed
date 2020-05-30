var templates = {}
var userEid = window.location.search.substring(1);
var total_likes = 0;
var total_reaches = 0;
var total_posts = 0;


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
               data.created_time = relativeTime(data.created_time);
               if(data.user_eid == userEid){
                 total_likes += data.statistics.likes
                 total_reaches += data.statistics.reaches
                 total_posts += 1
                 itemCallback(data)
               }
           })
           sessionStorage.setItem('posts',total_posts);
           sessionStorage.setItem('likes',total_likes);
           sessionStorage.setItem('reaches',total_reaches);
           document.getElementById("posts").innerHTML = sessionStorage.getItem('posts');
           document.getElementById("likes").innerHTML = sessionStorage.getItem('likes');
           document.getElementById("reaches").innerHTML = sessionStorage.getItem('reaches');
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

function userProfile(){
  var request = new XMLHttpRequest()
  request.open('GET', apiUrl('/users/' + userEid), true)
  request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    console.log(data);
    if (request.status >= 200 && request.status < 400) {
      //store user detail to session storage
      sessionStorage.setItem('eid',data.eid);
      sessionStorage.setItem('name',data.name);
      sessionStorage.setItem('profile_picture_url',data.profile_picture_url);
      // Retrieve
      document.getElementById("name").innerHTML = sessionStorage.getItem('name');
      document.getElementById("profile_picture_url").src = sessionStorage.getItem('profile_picture_url');
    } else {
      console.log('error')
    }
  }
  request.send()
}

function handleBackIcon(){
    window.history.back();
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
   }).then(function(){
       userProfile()
   })
})
