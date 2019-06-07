const dataFormatter = require('./dataFormatter.js');
const myArgs = process.argv[2];
var pageNumber = 0;

exports.traversePages = async function(page, cursor) {
  var nextPage = 'https://www.instagram.com/explore/tags/' + myArgs + '/?__a=1&max_id=' + cursor;
  await page.goto(nextPage, {waitLoad: true,waitUntil: 'networkidle2'});
  await exports.startScrape(page);
}

exports.startScrape = async function(page) {
  var preData = await page.evaluate(() => document.querySelector('pre').innerText);
  var jsonData = JSON.parse(preData);
  dataFormatter.formatStaticPage(jsonData);
  var pageInfo = jsonData.tag.media.page_info;
  await exports.checkForNextPage(page, pageInfo);
}

exports.checkForNextPage = async function(page, pageInfo) {
  if (pageInfo.has_next_page) {
    pageNumber++
    console.log('page Number ' + pageNumber +" for " + myArgs)
    await exports.traversePages(page, pageInfo.end_cursor);
  } else {
    console.log('end');
    dataFormatter.save();
  }
}
