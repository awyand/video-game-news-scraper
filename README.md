# Mongo Scraper: Kotaku Edition
A web scraper built on Express and MongoDB, served up in Handlebars.

## Description

Mongo Scraper: Kotaku Edition scrapes the Kotaku video games blog (https://kotaku.com/tag/video-games) for articles, stores them in a MongoDB database, and serves them up in the browser. Scraping is accomplished with Axios and Cheerio, database schema and queries are managed by the Mongoose Object Data Model (ODM), and view rendering is done with Handlebars.

## User Guide

### Scraping
When a user clicks the Scrape button at the top of the page, the application scrapes the Kotaku website for articles and checks to see if they exist in the database. If the article is not already saved, it adds it and informs the user of how many new articles have been added (including if there were no new articles scraped).

[insert image of scrape button]
[insert image of results modal]

### Article Results
When a user first loads the page, the articles currently in the database are displayed as cards. The cards contain a number of details on the article, including:

* Title/Headline
* Image
* Author
* Published date/time
* Number of comments on Kotaku
* Number of stars on Kotaku

[insert image of article result]

The card also provide the user with two buttons:
* Read: will open the article in Kotaku in a new tab
* Save: will add the article to the saved page and display a bookmark icon on the card to signify that the article has been saved.

[insert image of saved article]

If there are no articles in the database, the view reflects that fact and provides the user with another Scrape button.

[insert image of empty main]

### Saved Articles
The Saved page is very similar to the main page in terms of article cards, however the Save button is replaced with a Remove button, which removes it from the Saved page.

[insert image of saved article]

If there are no saved articles in the database, the view reflect that fact and provides the user with a message and another link to the home page, where they can scrape and save articles.

[insert image of empty saved]

### Video Walkthrough

[insert video walkthrough]

## Architecture

![Architecture](https://github.com/awyand/friend-finder/blob/master/app/public/assets/images/architecture.png)

## Packages and Libraries
This application uses the following packages and libraries:

### Back End
  * [express](https://www.npmjs.com/package/express)
  * [mongoose]()
  * [axios]()
  * [cheerio]()
  * [body-parser](https://www.npmjs.com/package/body-parser)
  * [express-handlebars]

### Front End
  * [jQuery]
  * [Bootstrap]
  * [Google Fonts]
  * [Font Awesome]
