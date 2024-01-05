import pandas as pd
import pymysql

if __name__ == "__main__":
    # Arrays with all of the info
    customer_array = []
    tickets_array = []
    cinema_array = []
    staff_array = []
    theater_array = []

    # SQL Connection with parameters
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'port': 3306,
        'password': 'Password1!',
        'database': '3309db',
    }
    # Connect to the MySQL database
    connection = pymysql.connect(**db_config)

    # Create a cursor object to execute SQL statements
    cursor = connection.cursor()


    # Commit after each batch of INSERT statements
    excel_file_path = 'allcustomers.xlsx'
    # Read dataframe
    df = pd.read_excel(excel_file_path)
    # Load to dictionary
    customer_array = df.to_dict(orient='records')
    for node in customer_array:
        sql_statement = "INSERT INTO customer (customerID, fName, lName, email)" \
                            "VALUES (%s, %s, %s, %s)"
        # Execute the SQL statement with parameters
        cursor.execute(sql_statement, (node['customerID'], node['customerFName'], node['customerLName'], node['email']))

    # Commit after each batch of INSERT statements
    excel_file_path = 'allcustomers.xlsx'
    df = pd.read_excel(excel_file_path)
    customer_array = df.to_dict(orient='records')


    #Iterare through each array
    for node in customer_array:

        # Convert 'customerID' to integer
        node['customerID'] = int(node['customerID'])

        # Convert phone numbers to integers
        node['phone1'] = int(node['phone1'])
        node['phone2'] = int(node['phone2'])
        node['phone3'] = int(node['phone3'])

        phone_statements = [
            "INSERT INTO PhoneNumber (phoneNo, customerID) VALUES (%s, %s)",
            "INSERT INTO PhoneNumber (phoneNo, customerID) VALUES (%s, %s)",
            "INSERT INTO PhoneNumber (phoneNo, customerID) VALUES (%s, %s)"
        ]

        # Execute the SQL statements with parameters
        for statement in phone_statements:
            phone_number = node['phone1']
            customer_id = node['customerID']

            # Check if the entry already exists
            cursor.execute("SELECT * FROM PhoneNumber WHERE phoneNo = %s AND customerID = %s", (phone_number, customer_id))
            result = cursor.fetchone()

            if not result:
                cursor.execute(statement, (phone_number, customer_id))

                # Commit after each INSERT statement

    # Read ticket data from Excel file
    excel_file_path = 'All tickets.xlsx'
    df = pd.read_excel(excel_file_path)
    tickets_array = df.to_dict(orient='records')

    # Adding to Ticket table
    for node in tickets_array:
        sql_statement = "INSERT INTO Ticket (ticketID, customerID, seatNo, price, showID)" \
                        "VALUES (%s, %s, %s, %s, %s)"
        # Execute the SQL statement with parameters
        cursor.execute(sql_statement, (node['ticketID'], node['customerID'], node['seatNo'], node['price'], node['showID']))

        # Commit after each INSERT statement

    # Read cinema data from Excel file
    excel_file_path = 'CinemaData.xlsx'
    df = pd.read_excel(excel_file_path)
    cinema_array = df.to_dict(orient='records')

    # Adding to Cinema table
    for node in cinema_array:
        sql_statement = "INSERT INTO Cinema (cinemaID, cinemaName, location)" \
                        "VALUES (%s, %s, %s)"
        # Execute the SQL statement with parameters
        cursor.execute(sql_statement, (node['cinemaID'], node['cinemaName'], node['location']))

        # Commit after each INSERT statement

    # Read staff data from Excel file
    excel_file_path = 'CinemaStaff.xlsx'
    df = pd.read_excel(excel_file_path)
    staff_array = df.to_dict(orient='records')

    # Adding to Staff table
    for node in staff_array:
        sql_statement = "INSERT INTO Staff (staffID, fName, lName, dateOfBirth, salary, position, cinemaID)" \
                        "VALUES (%s, %s, %s, %s, %s, %s, %s)"
        # Execute the SQL statement with parameters
        cursor.execute(sql_statement, (node['staffID'], node['staffFName'], node['staffLName'], node['dateOfBirth'], node['wage'], node['position'], node['cinemaID']))

        # Commit after each INSERT statement

    # Read theater data from Excel file
    excel_file_path = 'TheaterData.xlsx'
    df = pd.read_excel(excel_file_path)
    theater_array = df.to_dict(orient='records')

    # Adding to Theater table
    for node in theater_array:
        sql_statement = "INSERT INTO Theater (theaterID, type, numSeats, description)" \
                        "VALUES (%s, %s, %s, %s)"
        # Execute the SQL statement with parameters
        cursor.execute(sql_statement, (node['theaterID'], node['type'], node['numSeats'], node['description']))

        # Commit after each INSERT statement


    # Read movie data from Excel file
    excel_file_path = 'All tickets.xlsx'
    df = pd.read_excel(excel_file_path)
    movie_array = df.to_dict(orient='records')

    # Adding to Movie table
    # Adding to Movie table with duplicate check

    for node in movie_array:
        # Check if the entry already exists
        cursor.execute("SELECT * FROM Movie WHERE movieID = %s", (node['movieID'],))
        result = cursor.fetchone()

        if not result:
            sql_statement = "INSERT INTO Movie (movieID, movieName, description, rating, awards)" \
                            "VALUES (%s, %s, %s, %s, %s)"
            # Execute the SQL statement with parameters
            cursor.execute(sql_statement, (node['movieID'], node['movieName'], node['movieDescription'], node['rating'], node.get('awards', None)))
        else:
            print(f"Movie with ID {node['movieID']} already exists. Skipping insertion.")


    # Read showing data from Excel file
    excel_file_path = 'All tickets.xlsx'
    df = pd.read_excel(excel_file_path)
    showing_array = df.to_dict(orient='records')

   # Adding to Showing table with duplicate check
    for node in showing_array:
        # Check if the entry already exists
        cursor.execute("SELECT * FROM Showing WHERE showID = %s", (node['showID'],))
        result = cursor.fetchone()

        if not result:
            sql_statement = "INSERT INTO Showing (showID, showTime, showDate, cinemaID, theaterID, movieID)" \
                            "VALUES (%s, %s, %s, %s, %s, %s)"
            # Execute the SQL statement with parameters
            cursor.execute(sql_statement, (node['showID'], node['showTime'], node['showDate'], node['cinemaID'], node['theaterID'], node['movieID']))
        else:
            print(f"Showing with ID {node['showID']} already exists. Skipping insertion.")

    
    # Close the connection after all INSERT statements
    connection.commit()
    connection.close()
