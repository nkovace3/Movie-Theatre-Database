function updateMovieAwards() {
    // Get input values
    const threshold = document.getElementById('threshold').value;
    const awardName = document.getElementById('awardName').value;

    // Validate inputs
    if (!threshold || isNaN(threshold) || !awardName) {
        alert('Please enter valid values for Threshold and Award Name.');
        return;
    }

    // Send a request to the server to update movie awards
    fetch('/api/update-movie-awards', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            X: threshold,
            awardName: awardName,
        }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing the request.');
    });
}
