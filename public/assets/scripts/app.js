$(document).ready(function() {

  // When an change-status-btn is clicked, called changeStatus function
  $(document).on('click', '.change-status-btn', changeStatus);

  // When the scrape button is clicked, call scrapeArticles function
  $(document).on('click', '.scrape-btn', scrapeArticles);

  // When reload button clicked, reload page
  $(document).on('click', '.reload-btn', function() {
    location.reload();
  });

  // Function to send GET request to /scrape route and handle response
  function scrapeArticles() {
    // AJAX call
    $.ajax({
      method: 'GET',
      url: '/scrape'
    }).then(function(res) {
      // Style and display a modal with scrape results
      $('.articles-added-div').empty();
      if (res === 0) {
        $('.articles-added-div').text('No new articles. Please check back later!');
      } else {
        $('.articles-added-div').text(`We added ${res} new articles!`);
      }
      $('#articles-modal').modal('show');
    });
  }

  // Function to send PUT request to /articles/:id route and handle response
  function changeStatus() {
    // Grab id and new status from button
    // Attribute data-new-status holds "true" for save button and "false" for remove button
    const mongoId = $(this).attr('data-id');
    const newStatus = $(this).attr('data-new-status');
    // AJAX call to update article by ID
    $.ajax({
      method: 'PUT',
      url: `/articles/${mongoId}`,
      data: {
        saved: newStatus
      }
    })
      .then(function(data) {
        // If save was successfull, notify user
        if (data.saved === true) {
          // modal here
          console.log('saved');
        } else {
          // error message here
          console.log('something went wrong.');
        }
        // reload page
        location.reload();
      });
  }

});
