var request = require("request");
var fs = require("fs");
var url =
    "http://lj.scu.edu.cn/cdwxxy1.2/index.php?app=default&act=article_view&id=0006BF5AE9ADB13D2EC36BBF60C79BDF&cate_id=C87B31A5B538412CFCAA01570A8645D8";

var cheerio = require("cheerio");
var i = 0;

function pc() {
    request(url, (error, response, body) => {
        if (error) {
            console.log(error)
        } else {
            i = i + 1;
            $ = cheerio.load(body);
            var title = $(".pd-detail h2").text().replace(/\"/ig, " ");
            var article = $(".ft5").text();
            var nextLink = $(".fz.red.am-padding-left-xs").attr("href");
            fs.writeFile("./data/" + title + ".txt", article, (error) => {
                if (error) {
                    console.log(error);
                }
            })
            var images = $(".ft5 img");
            images.each(function () {
                var img_filename = $(this).attr("alt");
                var img_src = $(this).attr("src");
                request(img_src).pipe(
                    fs.createWriteStream("./image/" + img_filename)
                ); //
            })
            console.log(i);
            if (i < 30) {
                url = nextLink;
                pc();
            }
        }
    })
}

pc()