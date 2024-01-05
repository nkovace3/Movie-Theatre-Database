async function searchMovies() {
    try {
        // Get movieID from the input field
        const movieID = document.getElementById('movieID').value;

        // Check if movieID is not empty
        if (!movieID) {
            alert('Please enter a Movie ID');
            return;
        }

        // Make API call to retrieve graph information
        const response = await fetch(`/api/graph/${movieID}`);
        const responseData = await response.json();

        if (responseData.message === "Graph information retrieved successfully") {
            const data = responseData.data;

            const existingChart = Chart.getChart("revenueChart");
            if (existingChart) {
                existingChart.destroy();
            }

            const showDates = data.map(entry => {
                const date = new Date(entry.showDate);
                return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            });

            const totalRevenues = data.map(entry => parseFloat(entry.totalRevenue));

            const ctx = document.getElementById('revenueChart').getContext('2d');
            const revenueChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: showDates,
                    datasets: [{
                        label: 'Total Revenue',
                        data: totalRevenues,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            document.getElementById('chartName').innerHTML = `${movieID} - Revenue`;
        } else {
            // Display an alert for backend errors
            console.error(`Error in searchMovies: ${responseData.message}`);
            alert(`Error: ${responseData.message}`);
        }
    } catch (error) {
        console.error(`Error in searchMovies: ${error.message}`);
        alert(`Error: ${error.message}`);
    }
}
