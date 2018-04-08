// Set up dependencies
const express = require('express'),
      exphbs = require('express-handlebars'),
      axios = require('axios'),
      cheerio = require('cheerio'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      db = require("../models");

// Export route handling functionality
module.exports = (app) => {
  // ** ROUTES ** //

  // GET route for homepage (i.e. grab all articles and render on page)
  app.get('/', getAllArticles);
  // GET route for saved page (i.e. grab all saved articles and render on page)
  app.get('/saved', getSavedArticles);
  // GET route for scraping Kotaku video games site
  app.get('/scrape', scrapeSite);
  // PUT route for saving an article by ID
  app.put('/articles/:id', updateArticle);

  function getSavedArticles(request, response) {
    db.Article.find({saved: true})
      .then(function(data) {
        if (data.length === 0) {
          // render a 'no saved articles' message view
          return response.render('empty-save');
        }
        response.render('saved', {articles: data});
      })
      .catch(function(error) {
        response.json(error);
      });
  }

  function updateArticle(request, response) {
    db.Article.findByIdAndUpdate({_id: request.params.id}, {$set: request.body}, {new: true}, function(error, dbArticle) {
      if (error) {
        response.send(error);
      }
      response.send(dbArticle);
    });
  }

  function getAllArticles(request, response) {
    // Find all documents in Article collection
    db.Article.find({})
      .then(function(data) {
        // If database is empty
        if (data.length === 0) {
          // Render empty view
          return response.render('empty');
        }
        // Render index and pass data array to index view as articles
        response.render('index', {articles: data});
      })
      .catch(function(error) {
        // Catch and send error to client
        response.json(error);
      });
  }

  // ** FUNCTIONS ** //

  function scrapeSite(request, response) {
    // Use Axios to get HTML from site
    axios.get('https://kotaku.com/tag/video-games')

      // When Axios responds with HTML, pass to Cheerio
      .then(function(html) {

        // Load html into Cheerio and save data to $ variable
        const $ = cheerio.load(html.data);

        let articleCount = 0;
        // Grab every div with class of post-wrapper
        $('.post-wrapper').each(function(i, element) {
          // Create article object that holds information from html elements
          const articleObject = {
            title: $(this).find('h1.headline > .js_entry-link').text(),
            link: $(this).find('h1.headline > .js_entry-link').attr('href'),
            summary: $(this).find('.entry-summary > p').text(),
            numComments: parseInt($(this).find('.js_meta__data--comment > span.text').text()),
            numStars: parseInt($(this).find('.js_like_count').text()),
            imageLink: $(this).find('picture > source').attr('data-srcset'),
            dateTime: $(this).find('time > a').text(),
            saved: false
          };

          // Find by article title
          db.Article.find({title: articleObject.title}, function(err, docs) {
            // If article not already in database
            if (!docs.length) {
              // Insert article object into Article collection as a document
              db.Article.create(articleObject)
                .then(function(dbArticle) {
                  // Log article to console
                  console.log(dbArticle);
                  // Increment counter
                  articleCount++;
                })
                .catch(function(error) {
                  // Catch and log error to console
                  console.log(error);;
                });
            }
          });
        });

        // I'm using setTimeout because I don't understand Promises yet and I'm frustrated
        setTimeout(function() {
          response.json(articleCount);
        }, 2000);
      });
  }
}
