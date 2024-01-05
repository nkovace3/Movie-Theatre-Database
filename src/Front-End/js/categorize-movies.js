function categorizeMovies() {
    // Get input value
    const numResults = document.getElementById('numResults').value;

    // Validate input
    if (!numResults) {
        alert('Please enter a valid category.');
        return;
    }

    // Send a request to the server to categorize movies
    fetch(`/api/categorized-movies/${numResults}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        // Process the categorized movies data as needed
        const movieContainer = document.getElementById('movieContainer');
        movieContainer.innerHTML = ''; // Clear previous results

        // If length is 0, alert the user.
        if (data.data.length === 0) {
            alert('No movies found for the given category.');
        } else {
            // Create DOM element for movie cards
            const movieCardsContainer = document.createElement('div');
            movieCardsContainer.id = 'movieCardsContainer';

            // Loop through each element of the list
            data.data.forEach(movie => {
                // Create a movie card
                const movieCard = document.createElement('div');
                movieCard.classList.add('card', 'movie-card');

                // Movie name and rating category
                const movieTitle = document.createElement('p');
                movieTitle.textContent = movie.movieName;
                const ratingCategory = document.createElement('p');
                ratingCategory.textContent = `Rating: ${movie.RatingCategory}`;

                // Append elements to the movie card
                movieCard.appendChild(movieTitle);
                movieCard.appendChild(ratingCategory);

                // Append the movie card to the container
                movieCardsContainer.appendChild(movieCard);
            });

            // Append the movie cards container to the main container
            movieContainer.appendChild(movieCardsContainer);
        }
    })
    .catch(error => {
        // Track errors
        console.error('Error:', error);
        alert('An error occurred while processing the request.');
    });
}
