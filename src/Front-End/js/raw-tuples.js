document.addEventListener("DOMContentLoaded", () => {
    //Async function
    const fetchData = async (endpoint) => {
        try {
            const response = await fetch(`/api/${endpoint}`);
            const data = await response.json();
            displayResults(data, endpoint);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const displayResults = (data, endpoint) => {
        const resultContainer = document.getElementById("result-container");
        resultContainer.innerHTML = formatData(data, endpoint);
    };

    const formatData = (data, endpoint) => {
        if (!Array.isArray(data)) {
            return "Invalid data format.";
        }

        const cards = data.map((item) => {
            const keys = Object.keys(item);
            const cardContent = keys.map((key) => `<p><strong>${key}:</strong> ${item[key]}</p>`).join("");
            return `<div class="card">${cardContent}</div>`;
        });
    
        return `<div id="result-cards">${cards.join("")}</div>`;
    };

    const toggleList = () => {
        const resultContainer = document.getElementById("result-container");
        resultContainer.innerHTML = "";
    };

    // Event handlers for each button
    const getCustomers = () => fetchData("customers");
    const getMovies = () => fetchData("movies");
    const getTheaters = () => fetchData("theaters");
    const getCinemas = () => fetchData("cinemas");
    const getStaff = () => fetchData("staff");
    const getShowings = () => fetchData("showings");
    const getTickets = () => fetchData("tickets");

    // Attach event listeners to buttons
    document.querySelector("button:nth-of-type(1)").addEventListener("click", getCustomers);
    document.querySelector("button:nth-of-type(2)").addEventListener("click", getMovies);
    document.querySelector("button:nth-of-type(3)").addEventListener("click", getTheaters);
    document.querySelector("button:nth-of-type(4)").addEventListener("click", getCinemas);
    document.querySelector("button:nth-of-type(5)").addEventListener("click", getStaff);
    document.querySelector("button:nth-of-type(6)").addEventListener("click", getShowings);
    document.querySelector("button:nth-of-type(7)").addEventListener("click", getTickets);
    document.querySelector("button:nth-of-type(8)").addEventListener("click", toggleList);
});
