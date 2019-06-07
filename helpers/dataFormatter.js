var fs = require('fs');
const makeDir = require('make-dir');
exports.postArray = [];

//parse caption for hashtags
function findHashtags(searchText) {
  var regexp = /(\s|^)\#\w\w+\b/gm
  result = searchText.match(regexp);
  if (result) {
    result = result.map(function(s) {
      return s.trim().toLowerCase();
    });
    // console.log(result);
    return result;
  } else {
    return false;
  }
}


exports.formatPage = function (page) {

    var edges = page.data.hashtag.edge_hashtag_to_media.edges

    edges.forEach(function (node) {

        //create the instagram object to be stored in mongo
        var gram = {};
        gram.gramId = node.node.id;
        if (node.node.edge_media_to_caption.edges[0]) {
            gram.caption = node.node.edge_media_to_caption.edges[0].node.text;
        }
        gram.shortcode = node.node.shortcode;
        gram.commentsCount = node.node.edge_media_to_comment.count;
        gram.takenTimestamp = node.node.taken_at_timestamp;
        gram.likes = node.node.edge_liked_by.count;
        gram.ownerId = node.node.owner.id;
        gram.displayUrl = node.node.display_url;
        gram.thumbnailUrl = node.node.thumbnail_src;

        //push to tag array
        exports.postArray.push(gram);

    });

}





//create the instagram object to be stored in mongo
exports.formatStaticPage = function(page) {

  var nodes = page.tag.media.nodes

  nodes.forEach(function(node) {
    var gram = {};
    gram.gramId = node.id;
    gram.caption = node.caption;
    gram.shortcode = node.code;
    gram.commentsCount = node.comments.count;
    gram.takenTimestamp = node.date;
    gram.convention = process.argv[2].replace(/[0-9]/g, '').toLowerCase();
    gram.year = process.argv[2].replace(/\D+/g, '');
    gram.likes = node.likes.count;
    gram.ownerId = node.owner.id;
    gram.displayUrl = node.display_src;
    gram.thumbnailUrl = node.thumbnail_src;

    if (node.caption) {gram.hashtags = findHashtags(node.caption)}

    exports.postArray.push(gram);
  });
}

//Make folder and file names
exports.save = function() {
  console.log(exports.postArray.length + " photos scraped!");
  var folderArray = process.argv[2].match(/([A-Za-z]+)([0-9]+)/);
  console.log(folderArray)

  if(folderArray){
  var fileName = folderArray[0];
  var convetionName = folderArray[1];
  var conventionYear = folderArray[2];
  var folderPath = __dirname + "/../data/" + convetionName + "/"+ conventionYear;
  var filePath = __dirname + "/../data/" + convetionName + "/"+ conventionYear + "/" + fileName + "-S.json";
}
  if(!folderArray){
    var fileName = process.argv[2];
    var convetionName = process.argv[2];
    var folderPath = __dirname + "/../data/" + convetionName
    var filePath = __dirname + "/../data/" + convetionName + "/"+ fileName + "-S.json";
  }


  exports.postArray = JSON.stringify(exports.postArray, null, 4);
  exports.writeToFile(filePath,folderPath)
}

//Make folder hiearchy, write data to file
exports.writeToFile = function(filePath,folderPath) {
  makeDir(folderPath).then(path => {
      fs.writeFile(filePath, exports.postArray, 'utf8', function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
  });
}
