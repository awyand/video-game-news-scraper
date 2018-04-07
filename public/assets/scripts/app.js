$(document).ready(function() {

  // When a save button is clicked, call saveArticle function
  $(document).on('click', '.save-btn', saveArticle);

  // When the scrape button is clicked, call scrapeArticles function
  $(document).on('click', '.scrape-btn', scrapeArticles);

  function scrapeArticles() {
    // AJAX call
    $.ajax({
      method: 'GET',
      url: '/scrape'
    })
      .then(location.reload());
  }

  function saveArticle() {
    // Grab id from button
    const mongoId = $(this).attr('data-id');
    // AJAX call to save article by ID
    $.ajax({
      method: 'PUT',
      url: `/articles/${mongoId}`,
      data: {
        saved: true
      }
    })
      .then(function(data) {
        // If save was successfull, notify user
        if (data.saved === true) {
          // modal here
          console.log('saved');
        } else {
          // error message here
        }
        // reload page
        location.reload();
      });

  }
});
