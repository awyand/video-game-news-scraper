// Set up dependencies
const axios = require('axios'),
      cheerio = require('cheerio'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      db = require("../models");

// Export route handling functionality
module.exports = (app) => {
  app.get('/scrape', function(req, res) {
    axios.get('https://kotaku.com/tag/video-games')
      .then(function(response) {
        const $ = cheerio.load(response.data);
        $('.post-wrapper').each(function(i, element) {

          const result = {
            title: $(this).find('h1.headline > .js_entry-link').text(),
            link: $(this).find('h1.headline > .js_entry-link').attr('href'),
            summary: $(this).find('.entry-summary > p').text(),
            numComments: parseInt($(this).find('.js_meta__data--comment > span.text').text()),
            numStars: parseInt($(this).find('.js_like_count').text()),
            imageLink: $(this).find('picture > source').attr('data-srcset'),
            dateTime: $(this).find('time > a').text()
          }

          console.log(result);

          db.Article.create(result)
            .then(function(dbArticle) {
              console.log(dbArticle);
            })
            .catch(function(err) {
              console.log(err);;
            });
        });
        res.send('Scrape complete!');
      });
  })


  // ** ROUTES ** //

  // GET route for scraping Kotaku video games site

  // app.get('/articles', getArticles);

  // ** FUNCTIONS ** //

  // scrapeSite function
  // const scrapeSite = (scrapeRequest, scrapeResponse) => {
  //   // Use Axios to get HTML from website
  //   axios.get('https://kotaku.com/tag/video-games')
  //     // When Axios responds with HTML, pass to Cheerio
  //     .then(loadHTMLInCheerio);
  //   // If scrape was successfull, send success message to client
  //   scrapeResponse.send('Kotaku scrape successfull!')
  // };
  //
  //
  //
  // const loadHTMLInCheerio = (htmlResponse) => {
  //   // Load htmlResponse into Cheerio and save data to $ variable
  //   const $ = cheerio.load(htmlResponse.data);
  //   // Grab every div with class of post-wrapper and pass to createPostObject
  //   $('.post-wrapper').each(createPostObject)
  // };
  //
  // const createPostObject = (i, cheerioElement) => {
  //   // Create empty result object
  //   const result = {};
  //   // Add values from post-wrapper elements
  //   result.title = $(this).children('.js_entry-link').text();
  //   // Create new Article using result object
  //   db.Article.create(result)
  //     .then(function(dbArticle) {
  //       console.log(dbArticle);
  //     })
  // }
  //
  // app.get('/scrape', scrapeSite);
}
