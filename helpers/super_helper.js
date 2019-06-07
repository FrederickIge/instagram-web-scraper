const dataFormatter = require('./dataFormatter.js');
const myArgs = process.argv[2];
var pageNumber = 0;

var urlBase = 'https://www.instagram.com/graphql/query/?';
var urlQuery = 'query_id=17875800862117404';
var base = '&variables=%7B%22tag_name%22%3A%22otakon2017%22%2C%22first%22%3A3%2C%22after%22%3A%22J0HWjLy6wAAAF0HWiso0QAAAFnIA%22%7D';




exports.traversePages = async function(page, cursor) {

  // var nextPage = 'https://www.instagram.com/explore/tags/' + myArgs + '/?__a=1&max_id=' + cursor;

  var nextPage = urlBase + urlQuery +'&variables=%7B%22tag_name%22%3A%22otakon2017%22%2C%22first%22%3A100%2C%22after%22%3A%22'+ cursor +'%22%7D'
  console.log(nextPage)
  await page.goto(nextPage, {waitLoad: true,waitUntil: 'networkidle2'});
  await exports.startScrape(page);
}

exports.startScrape = async function(page) {
  var preData = await page.evaluate(() => document.querySelector('pre').innerText);
  var jsonData = JSON.parse(preData);


  if(jsonData.data){
  dataFormatter.formatPage(jsonData);
  var pageInfo = jsonData.data.hashtag.edge_hashtag_to_media.page_info;
}

  if(jsonData.tag){
  dataFormatter.formatStaticPage(jsonData);
  var pageInfo = jsonData.tag.media.page_info;
}

  await exports.checkForNextPage(page, pageInfo);
}

exports.checkForNextPage = async function(page, pageInfo) {
  if (pageInfo.has_next_page) {
    pageNumber++
    // console.log('page Number ' + pageNumber)
    // console.log('traverse' )
    await exports.traversePages(page, pageInfo.end_cursor);
  } else {
    console.log('end');
    dataFormatter.save();
  }
}
