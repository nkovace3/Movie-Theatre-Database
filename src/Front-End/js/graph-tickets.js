async function searchTickets() {
    try {
        const showDate = document.getElementById('showDate').value;
        const response = await fetch('/api/graph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ showDate: showDate }),
        });
        const responseData = await response.json();

        if (responseData.message === "Graph information retrieved successfully") {
            const data = responseData.data;

            const existingChart = Chart.getChart("ticketChart");
            if (existingChart) {
                existingChart.destroy();
            }

            const ratings = data.map(entry => parseFloat(entry.rating));
            const avgTicketsSold = data.map(entry => parseFloat(entry.avgTicketsSold));

            const regressionData = linearRegression(ratings, avgTicketsSold);
            const regressionLine = ratings.map(x => regressionData.slope * x + regressionData.intercept);

            const ctx = document.getElementById('ticketChart').getContext('2d');
            const ticketChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ratings,
                    datasets: [
                        {
                            label: 'Average Tickets Sold',
                            data: avgTicketsSold,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Trendline',
                            data: regressionLine,
                            backgroundColor: 'rgba(255, 0, 0, 0.2)',
                            borderColor: 'rgba(255, 0, 0, 1)',
                            borderWidth: 1,
                            fill: false,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            document.getElementById('chartName').innerHTML = `Average Tickets Sold vs Rating`;
        } else {
            console.error(`Error in searchMovies: ${responseData.message}`);
        }
    } catch (error) {
        console.error(`Error in searchMovies: ${error.message}`);
    }
}

function linearRegression(x, y) {
    const n = x.length;

    const sumX = x.reduce((acc, val) => acc + val, 0);
    const sumY = y.reduce((acc, val) => acc + val, 0);

    const sumXY = x.reduce((acc, val, index) => acc + val * y[index], 0);
    const sumX2 = x.reduce((acc, val) => acc + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}
