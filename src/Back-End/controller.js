const db = require('./db');
const queries = require('./queries');

// Reusable function to handle database queries
const handleQuery = (query, res, successMessage, params = []) => {
  db.query(query, params, (error, results) => {
    if (error) {
      console.error(`Error executing query: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (successMessage) {
        res.status(200).json({ message: successMessage, data: results });
      } else {
        res.status(200).json(results);
      }
    }
  });
};

exports.getCustomers = async (req, res) => {
  handleQuery(queries.getAllCustomers, res);
};

exports.getMovies = async (req, res) => {
  handleQuery(queries.getMovies, res);
};

exports.getTheaters = async (req, res) => {
  handleQuery(queries.getTheaters, res);
};

exports.getCinemas = async (req, res) => {
  handleQuery(queries.getCinemas, res);
};

exports.getStaff = async (req, res) => {
  handleQuery(queries.getStaff, res);
};

exports.getShowings = async (req, res) => {
  handleQuery(queries.getShowings, res);
};

exports.getTickets = async (req, res) => {
  handleQuery(queries.getTickets, res);
};

exports.createCustomer = async (req, res) => {
  try {
    const { fName, lName, email, phoneNo } = req.body;

    // Validate input
    if (!fName || !lName || !email || !phoneNo) {
      return res.status(400).json({ error: 'Incomplete customer information provided' });
    }

    const [maxCustomerIdResult] = await db.promise().query(queries.getMaxCustomerId);
    const currentMaxCustomerId = maxCustomerIdResult[0].maxCustomerId || 0;
    const newCustomerId = currentMaxCustomerId + 1;

    // Insert the new customer info
    await db.promise().query(queries.createCustomer, [newCustomerId, fName, lName, email]);

    // Insert the new phone number
    await db.promise().query(queries.createPhoneNumber, [phoneNo, newCustomerId]);

    res.status(200).json({ message: 'Customer and phone number created successfully', data: { customerID: newCustomerId } });
  } catch (error) {
    console.error(`Error in createCustomer: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const { movieName, description, rating, awards } = req.body;

    // Validate input
    if (!movieName || !description || !rating ) {
      return res.status(400).json({ error: 'Incomplete movie information provided' });
    }

    // Get the current highest movie ID
    const maxMovieIdResult = await db.promise().query(queries.getMaxMovieId);
    const maxMovieId = maxMovieIdResult[0][0].next_movie_number;

    const paddedNumericPart = String(maxMovieId).padStart(7, '0');
    const newMovieId = 'tt' + paddedNumericPart;

    // Insert the new movie info
    handleQuery(queries.createMovie,
      res,
      'Movie created successfully',
      [newMovieId, movieName, description, rating, awards])
  } catch (error) {
      console.error('Error creating movie:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }

    };

exports.createTheater = async (req, res) => {
  const { type, numSeats, description } = req.body;

  // Get the current highest theater ID
  const [maxTheaterIdResult] = await db.promise().query(queries.getMaxTheaterId);
  const currentMaxTheaterId = maxTheaterIdResult[0].maxTheaterId || 0;

  // Generate a new theater ID
  const newTheaterId = currentMaxTheaterId + 1;

  // Insert the new theater info
  handleQuery(
    queries.createTheater,
    res,
    'Theater created successfully',
    [newTheaterId, type, numSeats, description]
  );
};

exports.createCinema = async (req, res) => {
  try {
    let { cinemaName, location, managerID } = req.body;

    // Validate input
    if (!cinemaName || !location) {
      return res.status(400).json({ error: 'Incomplete cinema information provided' });
    }

    if (managerID) {
      // Check if managerID exists in Staff and has position 'Manager'
      const [managerCheckResult] = await db.promise().query(queries.checkManagerById, [managerID]);
      const isManagerValid = managerCheckResult.length > 0 && managerCheckResult[0].position === 'Manager';
  
      if (!isManagerValid) {
        return res.status(400).json({ error: 'Invalid managerID. Staff ID must exist and have the position "Manager".' });
      }
  
      // Check if the manager is already assigned to a cinema
      const [existingManagerResult] = await db.promise().query(queries.getManagerAssignedToCinema, [managerID]);
      const hasExistingManager = existingManagerResult.length > 0 && existingManagerResult[0].cinemaID;
  
      if (hasExistingManager) {
        return res.status(400).json({ error: 'The manager is already assigned to a cinema. Cannot assign to another cinema.' });
      }
    } else {
      managerID = null;
    }

    // Get the current highest cinema ID
    const [maxCinemaIdResult] = await db.promise().query(queries.getMaxCinemaId);
    const currentMaxCinemaId = maxCinemaIdResult[0].maxCinemaId || 0;

    // Generate a new cinema ID
    const newCinemaId = currentMaxCinemaId + 1;

    // Insert the new cinema info
    handleQuery(
      queries.createCinema,
      res,
      'Cinema created successfully',
      [newCinemaId, cinemaName, location, managerID]
    );
  } catch (error) {
    console.error(`Error in createCinema: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createStaff = async (req, res) => {
  try {
    let { fName, lName, dateOfBirth, salary, position, cinemaID } = req.body;

    // Validate input
    if (!fName || !lName || !dateOfBirth || !salary || !position) {
      return res.status(400).json({ error: 'Incomplete staff information provided' });
    }

    // Check if cinema with the provided ID exists
    const [cinemaCheckResult] = await db.promise().query(queries.checkCinemaById, [cinemaID]);
    const isCinemaValid = cinemaCheckResult.length > 0;

    if (cinemaID && !isCinemaValid) {
      return res.status(400).json({ error: 'Invalid cinemaID. Cinema ID does not exist.' });
    }

    if (!cinemaID) {
      cinemaID = null;
    }

    // If the position is 'Manager', check if the cinema already has a manager
    if (position === 'Manager' && cinemaID) {
      const [existingManagerResult] = await db.promise().query(queries.getCinemaManager, [cinemaID]);
      const hasExistingManager = existingManagerResult.length > 0 && existingManagerResult[0].managerID;

      if (hasExistingManager) {
        return res.status(400).json({ error: 'The cinema already has a manager. Cannot assign another manager.' });
      }
    }

    // Get the current highest staff ID
    const [maxStaffIdResult] = await db.promise().query(queries.getMaxStaffId);
    const currentMaxStaffId = maxStaffIdResult[0].maxStaffId || 0;

    // Generate a new staff ID
    const newStaffId = currentMaxStaffId + 1;

    // Insert the new staff info
    handleQuery(
      queries.createStaff,
      res,
      'Staff created successfully',
      [newStaffId, fName, lName, dateOfBirth, salary, position, cinemaID]
    );
  } catch (error) {
    console.error(`Error in createStaff: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createShowing = async (req, res) => {
  try {
    const { showTime, showDate, cinemaID, theaterID, movieID } = req.body;

    // Validate input
    if (!showTime || !showDate || !cinemaID || !theaterID || !movieID) {
      return res.status(400).json({ error: 'Incomplete showing information provided' });
    }

    // Check if cinema, theater, and movie with the provided IDs exist
    const [cinemaCheckResult] = await db.promise().query(queries.checkCinemaById, [cinemaID]);
    const isCinemaValid = cinemaCheckResult.length > 0;

    const [theaterCheckResult] = await db.promise().query(queries.checkTheaterById, [theaterID]);
    const isTheaterValid = theaterCheckResult.length > 0;

    const [movieCheckResult] = await db.promise().query(queries.checkMovieById, [movieID]);
    const isMovieValid = movieCheckResult.length > 0;

    if (!isCinemaValid || !isTheaterValid || !isMovieValid) {
      return res.status(400).json({ error: 'Invalid cinema, theater, or movie ID. Check your input.' });
    }

    // Get the current highest show ID
    const [maxShowIdResult] = await db.promise().query(queries.getMaxShowId);
    const currentMaxShowId = maxShowIdResult[0].maxShowId || 0;

    // Generate a new show ID
    const newShowId = currentMaxShowId + 1;

    // Insert the new showing info
    handleQuery(
      queries.createShowing,
      res,
      'Showing created successfully',
      [newShowId, showTime, showDate, cinemaID, theaterID, movieID]
    );
  } catch (error) {
    console.error(`Error in createShowing: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { customerID, showID, price } = req.body;

    // Validate input
    if (!customerID || !showID || !price) {
      return res.status(400).json({ error: 'Incomplete ticket information provided' });
    }

    // Check if customer and showing with the provided IDs exist
    const [customerCheckResult] = await db.promise().query(queries.checkCustomerById, [customerID]);
    const isCustomerValid = customerCheckResult.length > 0;

    const [showingCheckResult] = await db.promise().query(queries.checkShowingById, [showID]);
    const isShowingValid = showingCheckResult.length > 0;

    if (!isCustomerValid || !isShowingValid) {
      return res.status(400).json({ error: 'Invalid customer or showing ID. Check your input.' });
    }

    // Check if showing is sold out
    const [showingDetailsResult] = await db.promise().query(queries.getShowingDetails, [showID]);
    const showingDetails = showingDetailsResult[0];

    if (!showingDetails) {
      return res.status(400).json({ error: 'Invalid showID. Showing does not exist.' });
    }

    const { theaterID, numSeats } = showingDetails;

    const [numTicketsResult] = await db
      .promise()
      .query(queries.getNumTicketsForShowing, [showID]);
    const numTicketsSold = numTicketsResult[0].numTickets || 0;

    const seatNo = numTicketsSold + 1;

    if (seatNo > numSeats) {
      return res.status(400).json({ error: 'Showing is sold out. No more available seats.' });
    }

    // Get the current highest ticket ID
    const [maxTicketIdResult] = await db.promise().query(queries.getMaxTicketId);
    const currentMaxTicketId = maxTicketIdResult[0].maxTicketId || 0;

    // Generate a new ticket ID
    const newTicketId = currentMaxTicketId + 1;

    // Insert the new ticket info
    handleQuery(
      queries.createTicket,
      res,
      'Ticket created successfully',
      [newTicketId, customerID, seatNo, price, showID]
    );
  } catch (error) {
    console.error(`Error in createTicket: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.increaseSalaries = async (req, res) => {
  try {
    const { X, cinemaID } = req.body;

    // Validate input
    if (!X || !cinemaID) {
      return res.status(400).json({ error: 'Incomplete information provided' });
    }

    // Execute the update query to increase staff salaries
    handleQuery(
      queries.updateSalaries(X, cinemaID),
      res,
      'Salaries increased successfully'
    );

  } catch (error) {
    console.error(`Error in increaseSalaries: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getRecentShows = async (req, res) => {
  try {
    let { X, movieName, cinemaName } = req.body;

    // Validate input
    if (!X) {
      return res.status(400).json({ error: 'Incomplete information provided' });
    }

    // Execute the updated query to find recent shows with names
    handleQuery(
      queries.findRecentShowsWithNames(X, movieName, cinemaName),
      res,
      'Recent shows with names retrieved successfully'
    );

  } catch (error) {
    console.error(`Error in getRecentShowsWithNames: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCategorizedMovies = async (req, res) => {
  try {
    const { X } = req.params;

    // Validate input
    if (!X) {
      return res.status(400).json({ error: 'Incomplete information provided' });
    }

    // Execute the query to categorize, sort, and limit movies by rating
    handleQuery(
      queries.categorizeMoviesByRating(X),
      res,
      `Top ${X} movies categorized, sorted, and limited successfully`
    );

  } catch (error) {
    console.error(`Error in getCategorizedSortedAndLimitedMovies: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateMovieAwardsBasedOnTicketSales = async (req, res) => {
  try {
    const { X, awardName } = req.body;

    // Validate input
    if (!X || isNaN(X) || !awardName) {
      return res.status(400).json({ error: 'Invalid input provided' });
    }

    // Check if the specified awardName already exists in the awards column
    const [existingAwardCheckResult] = await db.promise().query(queries.existingAwardCheck, [`%${awardName}%`, `%${awardName}%`]);

    if (existingAwardCheckResult.length > 0) {
      return res.status(400).json({ error: `Movie already has the award: ${awardName}` });
    }

    // Execute the query to update Movie awards based on total ticket sales
    handleQuery(
      queries.updateMovieAwardsBasedOnTicketSales(X, awardName),
      res,
      `Movie awards updated based on total ticket sales (Threshold: ${X})`
    );

  } catch (error) {
    console.error(`Error in updateMovieAwardsBasedOnTicketSales: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMovieRevenueGraph = async (req, res) => {
  try {
    const movieID = req.params.id;

    // Validate input
    if (!movieID) {
      return res.status(400).json({ error: 'Incomplete information provided' });
    }

    const [movieCheckResult] = await db.promise().query(queries.checkMovieById, [movieID]);
    const isMovieValid = movieCheckResult.length > 0;

    if (!isMovieValid) {
      return res.status(400).json({ error: 'This movie does not exist in the database.' });
    }

    // Execute the query to get graph information
    handleQuery(
      queries.getMovieRevenueGraph(movieID),
      res,
      'Graph information retrieved successfully'
    );

  } catch (error) {
    console.error(`Error in getMovieRevenueGraph: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAvgTicketsByRatingGraph = async (req, res) => {
  try {
    const showDate = req.body.showDate;

    // Execute the query to get graph information
    handleQuery(
      queries.getAvgTicketsByRatingGraph(showDate),
      res,
      'Graph information retrieved successfully'
    );

  } catch (error) {
    console.error(`Error in getAvgTicketsByRatingGraph: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};