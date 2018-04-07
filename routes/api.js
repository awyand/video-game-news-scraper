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

  // GET route for grabbing all articles from DB and rendering home page
  app.get('/', getAllArticles);
  // GET route for scraping Kotaku video games site
  app.get('/scrape', scrapeSite);
  // PUT route for saving an article by ID
  app.put('/articles/:id', updateArticle);

  function updateArticle(request, response) {
    console.log(request.body);
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

  // Function to scrape site
  // Accepts an API request
  function scrapeSite(request, response) {
    // Use Axios to get HTML from site
    axios.get('https://kotaku.com/tag/video-games')
      // When Axios responds with HTML, pass to Cheerio
      .then(createArticleObject);
      // Response message
      response.send('Kotaku scrape successfull!');
  }

  // Function to load HTML in Cheerio and create Article object
  // Accepts an HTML response from Axios
  function createArticleObject(response) {
    // Load htmlResponse into Cheerio and save data to $ variable
    const $ = cheerio.load(response.data);
    // Grab every div with class of post-wrapper and pass to insertIntoDB
    $('.post-wrapper').each(function(i, element) {
      // Fill in articleObject with values from cheerioElement
      const articleObject = {
        title: $(this).find('h1.headline > .js_entry-link').text(),
        link: $(this).find('h1.headline > .js_entry-link').attr('href'),
        summary: $(this).find('.entry-summary > p').text(),
        numComments: parseInt($(this).find('.js_meta__data--comment > span.text').text()),
        numStars: parseInt($(this).find('.js_like_count').text()),
        imageLink: $(this).find('picture > source').attr('data-srcset'),
        dateTime: $(this).find('time > a').text(),
        saved: false
      }

      // Pass articleObject to insertIntoDB
      insertIntoDB(articleObject);
    });
  }

  // Function to insert articleObject into MongoDB
  // Accepts an articleObject
  function insertIntoDB(articleObject) {
    // Create new document in Articles collection
    db.Article.create(articleObject)
      .then(function(dbArticle) {
        // Log dbArticle to console
        console.log(dbArticle);
      })
      .catch(function(error) {
        // Catch and log error to console
        console.log(error);;
      });
  }
}
