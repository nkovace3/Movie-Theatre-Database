const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/customers', controller.getCustomers);
router.post('/customers', controller.createCustomer);

router.get('/movies', controller.getMovies);
router.post('/movies', controller.createMovie);

router.get('/theaters', controller.getTheaters);
router.post('/theaters', controller.createTheater);

router.get('/cinemas', controller.getCinemas);
router.post('/cinemas', controller.createCinema);

router.get('/staff', controller.getStaff);
router.post('/staff', controller.createStaff);

router.get('/showings', controller.getShowings);
router.post('/showings', controller.createShowing);

router.get('/tickets', controller.getTickets);
router.post('/tickets', controller.createTicket);

//Complex functionality
router.post('/increase-salaries', controller.increaseSalaries);
router.post('/recent-shows', controller.getRecentShows);
router.get('/categorized-movies/:X', controller.getCategorizedMovies);
router.put('/update-movie-awards', controller.updateMovieAwardsBasedOnTicketSales);
router.get('/graph/:id', controller.getMovieRevenueGraph);
router.post('/graph', controller.getAvgTicketsByRatingGraph);

module.exports = router;
