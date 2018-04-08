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

  // ** FUNCTIONS ** //

  // Function for handling GET request to /saved endpoint
  function getSavedArticles(request, response) {
    // Retrieve all saved articles
    db.Article.find({saved: true})
      .then(function(data) {
        // If there are no saved articles
        if (data.length === 0) {
          // Render empty-save view and exit function
          return response.render('empty-save');
        }
        // Otherwise, there are saved articles
        // Render saved view with response array as articles
        response.render('saved', {articles: data});
      })
      .catch(function(error) {
        // Minimal error handling
        response.json(error);
      });
  }

  // Function for handling PUT request to /articles/:id endpoint
  function updateArticle(request, response) {
    // Find article by ID in database and set requested values
    db.Article.findByIdAndUpdate({_id: request.params.id}, {$set: request.body}, {new: true}, function(error, dbArticle) {
      if (error) {
        // Minimal error handling
        response.send(error);
      }
      // Send response to client
      response.send(dbArticle);
    });
  }

  // Function for handling GET request to / endpoint
  function getAllArticles(request, response) {
    // Find all documents in Article collection
    db.Article.find({})
      .then(function(data) {
        // If database is empty
        if (data.length === 0) {
          // Render empty view and exit function
          return response.render('empty');
        }
        // Otherwise, there are articles in the database
        // Render index view with response array as articles
        response.render('index', {articles: data});
      })
      .catch(function(error) {
        // Minimal error handling
        response.json(error);
      });
  }

  // Function to handle GET request to /scrape endpoint
  function scrapeSite(request, response) {
    // Use Axios to get HTML from site
    axios.get('https://kotaku.com/tag/video-games')

      // When Axios responds with HTML, pass to Cheerio
      .then(function(html) {

        // Load html into Cheerio and save data to $ variable
        const $ = cheerio.load(html.data);

        // Initialize articleCount variable
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
            saved: false,
            author: $(this).find('.author > a').text()
          };

          // Search for article title in database
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
