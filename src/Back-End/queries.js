exports.getAllCustomers = `
SELECT c.customerID, c.fName, c.lName, c.email, p.phoneNo
FROM customer c
LEFT JOIN PhoneNumber p ON c.customerID = p.customerID;`;

exports.getMovies = 'SELECT * FROM Movie';
exports.getTheaters = 'SELECT * FROM Theater';
exports.getCinemas = 'SELECT * FROM Cinema';
exports.getStaff = 'SELECT * FROM Staff';
exports.getShowings = 'SELECT * FROM Showing';
exports.getTickets = 'SELECT * FROM Ticket';

exports.getMaxCustomerId = 'SELECT MAX(customerID) as maxCustomerId FROM customer';
exports.createCustomer = 'INSERT INTO customer (customerID, fName, lName, email) VALUES (?, ?, ?, ?)';
exports.createPhoneNumber = 'INSERT INTO PhoneNumber (phoneNo, customerID) VALUES (?, ?)';

exports.getMaxMovieId = `SELECT RIGHT('0000000' + CONVERT(MAX(CAST(SUBSTRING(movieID, 3) AS SIGNED)) + 1, CHAR), 7) AS next_movie_number
FROM Movie
WHERE movieID LIKE 'tt%'
  AND SUBSTRING(movieID, 3, 7) REGEXP '^[0-9]+$';`;
exports.createMovie = 'INSERT INTO Movie (movieID, movieName, description, rating, awards) VALUES (?, ?, ?, ?, ?);';

exports.getMaxTheaterId = 'SELECT MAX(theaterID) AS maxTheaterId FROM Theater';
exports.createTheater = 'INSERT INTO Theater (theaterID, type, numSeats, description) VALUES (?, ?, ?, ?)';

exports.getMaxCinemaId = 'SELECT MAX(cinemaID) AS maxCinemaId FROM Cinema';
exports.createCinema = 'INSERT INTO Cinema (cinemaID, cinemaName, location, managerID) VALUES (?, ?, ?, ?)';
exports.checkManagerById = 'SELECT * FROM Staff WHERE staffID = ? AND position = "Manager"';
exports.getManagerAssignedToCinema = `
SELECT cinemaID FROM Cinema WHERE managerID = ?;
`;
exports.updateStaffCinemaID = `
  UPDATE Staff
  SET cinemaID = ?
  WHERE staffID = ?;
`;

exports.checkCinemaById = 'SELECT * FROM Cinema WHERE cinemaID = ?';
exports.getMaxStaffId = 'SELECT MAX(staffID) AS maxStaffId FROM Staff';
exports.createStaff = `INSERT INTO Staff (staffID, fName, lName, dateOfBirth, salary, position, cinemaID)
VALUES (?, ?, ?, ?, ?, ?, ?);`;
exports.getCinemaManager = `
SELECT managerID FROM Cinema WHERE cinemaID = ?;
`;
exports.updateCinemaManagerID = `
  UPDATE Cinema
  SET managerID = ?
  WHERE cinemaName = ?;
`;

exports.checkTheaterById = 'SELECT * FROM Theater WHERE theaterID = ?';
exports.checkMovieById = 'SELECT * FROM Movie WHERE movieID = ?';
exports.getMaxShowId = 'SELECT MAX(showID) AS maxShowId FROM Showing';
exports.createShowing = `
INSERT INTO Showing (showID, showTime, showDate, cinemaID, theaterID, movieID)
VALUES (?, ?, ?, ?, ?, ?);
`;

exports.checkCustomerById = 'SELECT * FROM Customer WHERE customerID = ?';
exports.checkShowingById = 'SELECT * FROM Showing WHERE showID = ?';
exports.getShowingDetails = `
SELECT s.theaterID, t.numSeats
FROM Showing s
JOIN Theater t ON s.theaterID = t.theaterID
WHERE s.showID = ?;
`;
exports.getNumTicketsForShowing = 'SELECT COUNT(*) AS numTickets FROM Ticket WHERE showID = ?';
exports.getMaxTicketId = 'SELECT MAX(ticketID) AS maxTicketId FROM Ticket';
exports.createTicket = `
INSERT INTO Ticket (ticketID, customerID, seatNo, price, showID)
VALUES (?, ?, ?, ?, ?);
`;


// COMPLEX FUNCTIONALITY
exports.updateSalaries = (X, cinemaID) => `
UPDATE Staff
SET salary = 
    CASE
        WHEN position = 'Manager' THEN ROUND(salary * (1 + ${X}/100 * 1.2), 2)
        WHEN position = 'Custodian' THEN ROUND(salary * (1 + ${X}/100 * 1.1), 2)
        WHEN position = 'Sales' THEN ROUND(salary * (1 + ${X}/100), 2)
    END
WHERE
    cinemaID = ${cinemaID};
`;

exports.findRecentShowsWithNames = (X, movieName, cinemaName) => `
SELECT c.cinemaName, m.movieName, ranked.showDate
FROM (
    SELECT cinemaID, movieID, showDate,
        ROW_NUMBER() OVER (PARTITION BY cinemaID, movieID ORDER BY showDate DESC) as rn
    FROM Showing
) AS ranked
JOIN Cinema c ON c.cinemaID = ranked.cinemaID
JOIN Movie m ON m.movieID = ranked.movieID
WHERE ranked.rn <= ${X}
${movieName && movieName !== '' ? `AND m.movieName = '${movieName}'` : ''}
${cinemaName && cinemaName !== '' ? `AND c.cinemaName = '${cinemaName}'` : ''};
`;

exports.categorizeMoviesByRating = (X) => `
SELECT 
    movieName,
    CASE 
        WHEN rating >= 9.0 THEN 'Excellent'
        WHEN rating >= 8.5 THEN 'Good'
        ELSE 'Average'
    END AS RatingCategory
FROM 
    Movie
WHERE
    rating >= 8.0
ORDER BY
    rating DESC
LIMIT ${X};
`;

exports.updateMovieAwardsBasedOnTicketSales = (X, awardName) => `
UPDATE Movie
SET awards = 
    CASE
        WHEN (
            SELECT SUM(T.price)
            FROM Ticket AS T
            JOIN Showing AS S ON T.showID = S.showID
            WHERE S.movieID = Movie.movieID
        ) > ${X} THEN 
            CASE 
                WHEN awards IS NOT NULL AND awards != '' THEN CONCAT(awards, ', ${awardName}')
                ELSE '${awardName}'
            END
        ELSE awards
    END;
`;

exports.existingAwardCheck = `
  SELECT movieID
  FROM Movie
  WHERE awards LIKE ? OR awards LIKE ?;
`;

exports.getMovieRevenueGraph =(movieID)=> `
SELECT s.showDate, SUM(t.price) AS totalRevenue
FROM Showing s
JOIN Ticket t ON s.showID = t.showID
WHERE s.movieID = '${movieID}'
GROUP BY s.showDate
ORDER BY s.showDate;
    `;

exports.getAvgTicketsByRatingGraph = (showDate)=>`
SELECT
    m.rating,
    AVG(ticket_count) AS avgTicketsSold
FROM
    Movie m
JOIN
    Showing s ON m.movieID = s.movieID
JOIN
    (SELECT
        t.showID,
        COUNT(t.ticketID) AS ticket_count
     FROM
        Ticket t
     GROUP BY
        t.showID) ticket_counts ON s.showID = ticket_counts.showID
WHERE
    s.showDate >= IFNULL('${showDate}', s.showDate)
GROUP BY
    m.rating
ORDER BY
    m.rating;
`;
