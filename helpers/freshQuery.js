const puppeteer = require('puppeteer');
var shortcode = process.argv[2];
var url = require('url');
var scrollDown = true;



exports.setListeners = async function(page) {
  page.on('response', response => {
    const req = response.request();
    if (req.url.indexOf('query_id') > -1) {
      scrollDown = false;
      var q = url.parse(req.url, true);
      console.log(q.query.query_id);
      return q.query.query_id;
    }
  });
}

exports.getQueryId = async function(queryPage) {
  var tagUrl = 'https://www.instagram.com/explore/tags/anime/'
  await queryPage.goto(tagUrl, {waitLoad: true,waitNetworkIdle: true});
  await queryPage.click('._1cr2e._epyes');
  await queryPage.waitFor(3000);

  while (scrollDown) {
    console.log("loop")
    var loadMore = await queryPage.$('._1cr2e._epyes');
    if(loadMore){
      console.log("found button");
      loadMore.click();
      await queryPage.click('._1cr2e._epyes');
    }
    queryPage.evaluate(_ =>
      {window.scrollBy(0, window.innerHeight);
    });
    await queryPage.waitFor(1000);
  }
}
