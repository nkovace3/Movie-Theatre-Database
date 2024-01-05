async function addCustomer() {
    const firstName = document.getElementById('customerFirstName').value;
    const lastName = document.getElementById('customerLastName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;

    try {
        const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fName: firstName, lName: lastName, email, phoneNo: phone }),
        });

        if (response.ok) {
            alert('Customer added successfully!');
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error(`Error adding customer: ${error.message}`);
        alert('An error occurred while adding the customer.');
    }
}

async function addMovie() {
    const movieName = document.getElementById('movieName').value;
    const description = document.getElementById('movieDescription').value;
    const rating = parseFloat(document.getElementById('movieRating').value);
    const awards = document.getElementById('movieAwards').value;

    try {
        const response = await fetch('/api/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieName, description, rating, awards }),
        });

        if (response.ok) {
            alert('Movie added successfully!');
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error(`Error adding movie: ${error.message}`);
        alert('An error occurred while adding the movie.');
    }
}

async function addTheater() {
    const theaterType = document.getElementById('theaterType').value;
    const numSeats = parseInt(document.getElementById('theaterNumSeats').value);
    const theaterDescription = document.getElementById('theaterDescription').value;

    try {
        const response = await fetch('/api/theaters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: theaterType, numSeats, description: theaterDescription }),
        });

        if (response.ok) {
            alert('Theater added successfully!');
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error(`Error adding theater: ${error.message}`);
        alert('An error occurred while adding the theater.');
    }
}

async function addCinema() {
    const cinemaName = document.getElementById('cinemaName').value;
    const cinemaLocation = document.getElementById('cinemaLocation').value;
    const cinemaManagerID = document.getElementById('cinemaManagerID').value;

    try {
        const response = await fetch('/api/cinemas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cinemaName, location: cinemaLocation, managerID: cinemaManagerID }),
        });

        if (response.ok) {
            alert('Cinema added successfully!');
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error(`Error adding cinema: ${error.message}`);
        alert('An error occurred while adding the cinema.');
    }
}

async function addStaff() {
    const staffFirstName = document.getElementById('staffFirstName').value;
    const staffLastName = document.getElementById('staffLastName').value;
    const staffDateOfBirth = document.getElementById('staffDateOfBirth').value;
    const staffSalary = parseFloat(document.getElementById('staffSalary').value);
    const staffPosition = document.getElementById('staffPosition').value;
    const staffCinemaID = document.getElementById('staffCinemaID').value;

    try {
        const response = await fetch('/api/staff', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fName: staffFirstName,
                lName: staffLastName,
                dateOfBirth: staffDateOfBirth,
                salary: staffSalary,
                position: staffPosition,
                cinemaID: staffCinemaID,
            }),
        });

        if (response.ok) {
            alert('Staff added successfully!');
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error(`Error adding staff: ${error.message}`);
        alert('An error occurred while adding the staff.');
    }
}

async function addShowing() {
    const showingTime = document.getElementById('showingTime').value;
    const showingDate = document.getElementById('showingDate').value;
    const showingCinemaID = document.getElementById('showingCinemaID').value;
    const showingTheaterID = document.getElementById('showingTheaterID').value;
    const showingMovieID = document.getElementById('showingMovieID').value;

    try {
        const response = await fetch('/api/showings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                showTime: showingTime,
                showDate: showingDate,
                cinemaID: showingCinemaID,
                theaterID: showingTheaterID,
                movieID: showingMovieID,
            }),
        });

        if (response.ok) {
            alert('Showing added successfully!');
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error(`Error adding showing: ${error.message}`);
        alert('An error occurred while adding the showing.');
    }
}

async function addTicket() {
    const ticketCustomerID = document.getElementById('ticketCustomerID').value;
    const ticketShowID = document.getElementById('ticketShowID').value;
    const ticketPrice = parseFloat(document.getElementById('ticketPrice').value);

    try {
        const response = await fetch('/api/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerID: ticketCustomerID,
                showID: ticketShowID,
                price: ticketPrice,
            }),
        });

        if (response.ok) {
            alert('Ticket added successfully!');
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error(`Error adding ticket: ${error.message}`);
        alert('An error occurred while adding the ticket.');
    }
}

