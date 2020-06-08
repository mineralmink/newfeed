var main = require('../js/main.js');
const axios = require('axios');

jest.mock('axios');

axios.get.mockResolvedValue({
    data: [
      {
          uuid: "72a78030-ad80-4de8-a3d3-d29790816881",
          type: "Link",
          description: "Accusantium consequatur perferendis sit aut voluptatem. http://pmYyvgD.ru/PSMXzwZ.html Aut accusantium perferendis consequatur voluptatem sit.",
          user_eid: "zBOrHPE0",
          link_url: "http://pmYyvgD.ru/PSMXzwZ.html",
          statistics: {
              reaches: 5338,
              likes: 996
          },
          created_time: "2020-05-30T12:22:30.321213809Z"
      },
      {
          uuid: "ebe318c8-bba2-4ac9-b748-84401c3fefeb",
          type: "Post",
          description: "Consequatur sit perferendis aut accusantium voluptatem. Accusantium consequatur voluptatem aut sit perferendis. Consequatur perferendis aut voluptatem sit accusantium.",
          user_eid: "uShcNNr35",
          statistics: {
              reaches: 7186,
              likes: 882
          },
          created_time: "2020-05-24T19:54:11.342954832Z"
      }
    ]
  });


  $.ajax = jest.fn().mockImplementation(() => {
       const fakeResponse = {
           id: 1,
           name: "All",
           value: "Dummy Data"
       };
       return Promise.resolve(fakeResponse);
   });

describe("Test D1: Test Relative time in main", () => {
 test("try using load url",()=>{
    //main.loadDiscovery('http://localhost:5555/feeds')
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
    main.loadFeed(1,renderFeedItem)
 })
})
