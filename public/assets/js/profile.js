var templates = {}
var userEid = window.location.search.substring(1);
var total_likes = 0;
var total_reaches = 0;
var total_posts = 0;
var endPage = 6; // This should change to number that related to the feed pages accprding to the api

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
     }).fail(function() {
       console.log('Fail at page ' + page);
       return
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


function userProfile(userEid){
  var request = new XMLHttpRequest()
  request.open('GET', apiUrl('/users/' + userEid), true)
  request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
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
  console.log(document);
  function infScrollLoader() {
       if (!infScrollLoader.page) {
           infScrollLoader.page = 1
       }
       //this loadfeed is not optimize
       while(infScrollLoader.page <= endPage){
         loadFeed(infScrollLoader.page++,renderFeedItem)
       }
   }

   templateLoading.then(function () {
       infScrollLoader()
   }).then(function(){
       userProfile(this.userEid)
   })
})



module.exports = {
  relativeTime,
  apiUrl,
  userProfile
}
