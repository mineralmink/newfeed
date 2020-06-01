var main = require('../js/main.js');
var profile = require('../js/profile.js');

describe("Test D1: Test Relative time in main", () => {
  test("it should calculate relative time", () => {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var now = new Date();
    var multiply = 2;
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)

    expect(main.relativeTime(new Date(tomorrow))).toEqual('This date is not valid');

    expect(main.relativeTime(new Date())).toEqual('Just now');
    expect(main.relativeTime(new Date(now - 1000))).toEqual('1 second ago');
    expect(main.relativeTime(new Date(now - msPerMinute))).toEqual('1 minute ago');
    expect(main.relativeTime(new Date(now - msPerHour))).toEqual('1 hour ago');
    expect(main.relativeTime(new Date(now - msPerDay))).toEqual('1 day ago');
    expect(main.relativeTime(new Date(now - msPerMonth))).toEqual('1 month ago');
    expect(main.relativeTime(new Date(now - msPerYear))).toEqual('1 year ago');

    expect(main.relativeTime(new Date(now - 1000))).toEqual('1 second ago');
    expect(main.relativeTime(new Date(now - multiply * msPerMinute))).toEqual(multiply + ' minutes ago');
    expect(main.relativeTime(new Date(now - multiply * msPerHour))).toEqual(multiply + ' hours ago');
    expect(main.relativeTime(new Date(now - multiply * msPerDay))).toEqual(multiply + ' days ago');
    expect(main.relativeTime(new Date(now - multiply * msPerMonth))).toEqual(multiply + ' months ago');
    expect(main.relativeTime(new Date(now - multiply * msPerYear))).toEqual(multiply + ' years ago');

  });
});


describe("Test D2: Test Relative time in user profile page", () => {
  test("it should calculate relative time on profile page", () => {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var now = new Date();
    var multiply = 2;
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)

    expect(main.relativeTime(new Date(tomorrow))).toEqual('This date is not valid');

    expect(profile.relativeTime(new Date())).toEqual('Just now');
    expect(profile.relativeTime(new Date(now - 1000))).toEqual('1 second ago');
    expect(profile.relativeTime(new Date(now - msPerMinute))).toEqual('1 minute ago');
    expect(profile.relativeTime(new Date(now - msPerHour))).toEqual('1 hour ago');
    expect(profile.relativeTime(new Date(now - msPerDay))).toEqual('1 day ago');
    expect(profile.relativeTime(new Date(now - msPerMonth))).toEqual('1 month ago');
    expect(profile.relativeTime(new Date(now - msPerYear))).toEqual('1 year ago');

    expect(profile.relativeTime(new Date(now - 1000))).toEqual('1 second ago');
    expect(profile.relativeTime(new Date(now - multiply * msPerMinute))).toEqual(multiply + ' minutes ago');
    expect(profile.relativeTime(new Date(now - multiply * msPerHour))).toEqual(multiply + ' hours ago');
    expect(profile.relativeTime(new Date(now - multiply * msPerDay))).toEqual(multiply + ' days ago');
    expect(profile.relativeTime(new Date(now - multiply * msPerMonth))).toEqual(multiply + ' months ago');
    expect(profile.relativeTime(new Date(now - multiply * msPerYear))).toEqual(multiply + ' years ago');

  });
});

describe("Test E:Test API path", () => {
  test("apiUrl return the right path", () => {
    var path = 'path'
    expect(main.apiUrl(path)).toEqual('http://localhost:5555' + path);
  });
  test("apiUrl return the right path", () => {
    var path = 'path'
    expect(profile.apiUrl(path)).toEqual('http://localhost:5555' + path);
  });
});
