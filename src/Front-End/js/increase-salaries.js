function increaseSalaries() {
    // Get input values
    const threshold = parseInt(document.getElementById('threshold').value);
    const cinemaID = document.getElementById('cinemaID').value;

    // Validate input
    if (!threshold || isNaN(threshold) || !cinemaID) {
        alert('Please enter valid values for Threshold and Cinema ID.');
        return;
    }

    // Send a request to the server to increase salaries
    fetch('/api/increase-salaries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ X: threshold, cinemaID }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing the request.');
    });
}