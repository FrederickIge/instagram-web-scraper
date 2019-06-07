const options = {
  filename: 'log.txt',
  appendFile: true
};

const Logger = require('logplease');
const logger = Logger.create('utils',options);
const scraper = require('./helpers/scraper.js');
const puppeteer = require('puppeteer');
const myArgs = process.argv[2];
var fs = require('fs');

var folderArray = myArgs.match(/([A-Za-z]+)([0-9]+)/);
if(!folderArray){
  var path =  __dirname + "/data/" + myArgs + "/"+ myArgs +"-S.json";
     console.log(path)
}
if(folderArray){
  var convetionName = folderArray[1];
  var conventionYear = folderArray[2];
  var path = __dirname + "/data/" + convetionName + "/"+ conventionYear;
  console.log(path)
}
if (fs.existsSync( path)) {
  logger.log(path + ' exists, skipping!')
  process.exit();
}
else{
    logger.log('working on '+ path)
}


(async () => {

  console.log('scraping ' + myArgs)
  //opens chrome blank page
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  //opens Instagram page based on otakon tag argument e.i. https://www.instagram.com/explore/tags/otakon2018/
  var url = 'https://www.instagram.com/explore/tags/' + myArgs + '/?__a=1'

  await page.goto(url, {waitLoad: true,waitNetworkIdle: true});

  await scraper.startScrape(page);

  await browser.close();
})();
