function getRecentShows() {
    // Get input values
    const numResults = document.getElementById('numResults').value;
    const movieName = document.getElementById('movieName').value;
    const cinemaName = document.getElementById('cinemaName').value;

    // Validate input
    if (!numResults) {
        alert('Please enter a valid number of shows.');
        return;
    }

    // Send a request to the server to get recent shows
    fetch(`/api/recent-shows`, {
        method: 'POST', // Change method to POST
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            X: numResults,
            movieName: movieName,
            cinemaName: cinemaName,
        }),
    })
    .then(response => response.json())
    .then(data => {
        // Process the recent shows data as needed
        const recentShowsContainer = document.getElementById('recentShowsContainer');
        recentShowsContainer.innerHTML = ''; // Clear previous results

        if (data.data.length === 0) {
            alert('No recent shows found for the given criteria.');
        } else {
            data.data.forEach(show => {
                const card = createRecentShowCard(show);
                recentShowsContainer.appendChild(card);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing the request.');
    });
}

function createRecentShowCard(show) {
    const card = document.createElement('div');
    card.classList.add('recent-show');

    const showDate = new Date(show.showDate).toLocaleDateString();

    const content = `
        <p><strong>Movie:</strong> ${show.movieName}</p>
        <p><strong>Cinema:</strong> ${show.cinemaName}</p>
        <p><strong>Show Date:</strong> ${showDate}</p>
    `;

    card.innerHTML = content;

    return card;
}
