//we gonna use urls like this to get all the comments a search for hashtags https://www.instagram.com/p/BHYNvnhDAAE/?__a=1
//1) takes an IG shrotcode

//2) opens the api page

//3) scraps out any hashtag text

const puppeteer = require('puppeteer');
var shortcode = process.argv[2];
var hashtagArray =[];

(async () => {
  //opens chrome blank page
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  var url = 'https://www.instagram.com/p/' + shortcode + '/?__a=1'

  await page.goto(url, {waitLoad: true,waitNetworkIdle: true});
  var preData = await page.evaluate(() => document.querySelector('pre').innerText);
  var jsonData = JSON.parse(preData);

  
  var commentArray = jsonData.graphql.shortcode_media.edge_media_to_comment.edges;

  commentArray.forEach(function(element) {
    console.log(findHashtags(element.node.text));
});

})();


function findHashtags(searchText) {
  var regexp = /(\s|^)\#\w\w+\b/gm
  result = searchText.match(regexp);
  if (result) {
    result = result.map(function(s) {
      return s.trim();
    });
    return result;
  } else {
    return false;
  }
}
