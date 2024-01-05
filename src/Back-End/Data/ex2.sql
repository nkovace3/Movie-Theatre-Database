CREATE TABLE customer
(
customerID int NOT NULL,
fName char(30),
lName char(30),
email char(50),
Primary Key (customerID));

CREATE TABLE PhoneNumber 
(phoneNo bigint NOT NULL,
customerID int NOT NULL,
Primary Key (phoneNo, customerID),
Foreign Key (customerID) references Customer(customerID));

CREATE TABLE Movie 
(movieID varchar(100) NOT NULL, 
movieName char(100), 
description char(255), 
rating decimal(2,1), 
awards varchar(100),
Primary Key (movieID));

CREATE TABLE Theater 
(theaterID int NOT NULL, 
type char(30), 
numSeats int, 
description char(100),
Primary Key (theaterID));

CREATE TABLE Cinema (
cinemaID int NOT NULL,
cinemaName char(30), 
location char(50), 
managerID int,
Primary Key (cinemaID));

CREATE TABLE Staff 
(staffID int NOT NULL, 
fName char(30), 
lName char(30), 
dateOfBirth date, 
salary int, 
position char(30), 
cinemaID int,
Primary Key (staffID),
Foreign Key (cinemaID) references Cinema(cinemaID));

ALTER TABLE Cinema
ADD FOREIGN KEY (managerID) references Staff(staffID);

CREATE TABLE Showing(
showID int NOT NULL, 
showTime TIME, 
showDate date, 
cinemaID int, 
theaterID int,
movieID varchar(100),
Primary Key (showID),
Foreign Key (cinemaID) references Cinema(cinemaID),
Foreign Key (theaterID) references Theater(theaterID),
Foreign Key (movieID) references Movie(movieID));

CREATE TABLE Ticket 
(ticketID int NOT NULL,
customerID int, 
seatNo int, 
price decimal (5,2), 
showID int,
Primary Key (ticketID),
Foreign Key (customerID) references Customer(customerID),
Foreign Key (showID) references Showing(showID));