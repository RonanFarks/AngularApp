const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS module
const connect = require('./db');

const app = express();
const port = 7000;

// Enable CORS for all origins (or specify the origins you want to allow)
app.use(cors());

app.use(bodyParser.json());

// Your login endpoint (unchanged)
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const pool = await connect();
        const result = await pool.request()
            .input('username', username)
            .input('password', password)
            .query('SELECT * FROM logins WHERE username = @username AND password = @password');

        if (result.recordset.length > 0) {
            res.json({ success: true, user: result.recordset[0] });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).json({ message: "A server error occurred. Please try again later." });
    }
});

// Change POST to GET for listing data retrieval
app.get('/api/listing', async (req, res) => {
    try {
        const pool = await connect();

        // Execute the SELECT query to fetch the list of items
        const result = await pool.request()
            .query('select per.*, acc.account_number from Persons per inner join Accounts acc on per.code = acc.code');  // Adjust table name as necessary

        // Send the result back in the response
        res.status(200).json(result.recordset);  // Use recordset to get the result rows
    } catch (err) {
        console.error('Error fetching data:', err.message);
        res.status(500).json({ message: "A server error occurred. Please try again later." });
    }
});

// Change POST to GET for listing data retrieval
app.get('/api/personsdetails/:id', async (req, res) => {
    const personId = req.params.id; // Get the ID from the URL parameter

    try {
        const pool = await connect();
        const result = await pool.request()
            .input('id_number', personId)  // Use the ID from the URL parameter
            .query('select * from Persons per inner join Accounts acc on per.code = acc.code where per.id_number = @id_number'); // Query based on IDNumber

        console.log('Query Result:', result.recordset);  // Log the query result to check the returned data

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]); // Return the first result (person details)
        } else {
            res.status(404).json({ message: 'Person not found' }); // Handle case where no record is found
        }
    } catch (err) {
        console.error('Server error:', err.message);  // Log the error message
        res.status(500).json({ message: "A server error occurred. Please try again later.", error: err.message });
    }
});

// Change POST to GET for listing data retrieval
app.post('/api/personsdetailsinsert', async (req, res) => {
    const { name, surname, id_number } = req.body;
    
    try {
        const pool = await connect();

        // Execute the UPDATE query
        const result = await pool.request()
            .input('name', name)
            .input('surname', surname)
            .input('id_number', id_number)
            .query(`
                INSERT INTO Persons
                VALUES( @name
		        ,	  @surname
                ,     @id_number)
            `);

        console.log('Rows Affected:', result.rowsAffected); // Log the number of rows affected

        // Check if any rows were deleted
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Person add successfully' });
        } else {
            res.status(404).json({ message: 'Person not found or does not meet the add condition' });
        }
    } catch (err) {
        console.error('Server error:', err.message); // Log the error message
        res.status(500).json({ 
            message: "A server error occurred. Please try again later.", 
            error: err.message 
        });
    }
});

// Change POST to GET for listing data retrieval
app.put('/api/personsdetailsupdate/:id', async (req, res) => {
    const personId = req.params.id; // Get the ID from the URL parameter
    const { name, surname, account_number } = req.body;
    
    try {
        const pool = await connect();

        // Execute the UPDATE query
        const result = await pool.request()
            .input('id_number', personId)
            .input('name', name)
            .input('surname', surname)
            .query(`
                UPDATE Persons
                SET   name = @name
		        ,	  surname = @surname
                WHERE id_number = @id_number
            `);

        console.log('Rows Affected:', result.rowsAffected); // Log the number of rows affected

        // Check if any rows were deleted
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Person add successfully' });
        } else {
            res.status(404).json({ message: 'Person not found or does not meet the delete condition' });
        }
    } catch (err) {
        console.error('Server error:', err.message); // Log the error message
        res.status(500).json({ 
            message: "A server error occurred. Please try again later.", 
            error: err.message 
        });
    }
});

// Change POST to GET for listing data retrieval
app.delete('/api/personsdetailsdelete/:id', async (req, res) => {
    const personId = req.params.id; // Get the ID from the URL parameter

    try {
        const pool = await connect();

        // Execute the DELETE query
        const result = await pool.request()
            .input('id_number', personId)  // Use the ID from the URL parameter
            .query(`
                DELETE FROM Persons
                WHERE id_number = @id_number 
                  AND EXISTS (
                      SELECT 1 FROM Accounts 
                      WHERE Persons.code = Accounts.code
                  );
            `);

        console.log('Rows Affected:', result.rowsAffected); // Log the number of rows affected

        // Check if any rows were deleted
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Person deleted successfully' });
        } else {
            res.status(404).json({ message: 'Person not found or does not meet the delete condition' });
        }
    } catch (err) {
        console.error('Server error:', err.message); // Log the error message
        res.status(500).json({ 
            message: "A server error occurred. Please try again later.", 
            error: err.message 
        });
    }
});

app.get('/api/accounts/:id', async (req, res) => {
    const id_number = req.params.id; // Get the ID from the URL parameter

    try {
        const pool = await connect();
        const result = await pool.request()
        .input('id_number', id_number)
        .query('SELECT acc.* FROM Accounts acc INNER JOIN Persons per ON per.code = acc.person_code where per.id_number = @id_number');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching accounts:', err.message);
        res.status(500).json({ message: 'Failed to fetch accounts' });
    }
});

// Change POST to GET for listing data retrieval
app.get('/api/accountdetails/:id', async (req, res) => {
    const account_number = req.params.id; // Get the ID from the URL parameter

    try {
        const pool = await connect();
        const result = await pool.request()
            .input('account_number', account_number)  // Use the ID from the URL parameter
            .query('select * from Accounts WHERE account_number = @account_number'); // Query based on IDNumber

        console.log('Query Result:', result.recordset);  // Log the query result to check the returned data

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]); // Return the first result (person details)
        } else {
            res.status(404).json({ message: 'Person not found' }); // Handle case where no record is found
        }
    } catch (err) {
        console.error('Server error:', err.message);  // Log the error message
        res.status(500).json({ message: "A server error occurred. Please try again later.", error: err.message });
    }
});

// Change POST to GET for listing data retrieval
app.post('/api/accountdetailsinsert', async (req, res) => {
    const { person_code, account_number, outstanding_balance } = req.body;
    
    try {
        const pool = await connect();

        // Execute the UPDATE query
        const result = await pool.request()
            .input('person_code', person_code)
            .input('account_number', account_number)
            .input('outstanding_balance', outstanding_balance)
            .query(`
                INSERT INTO Accounts
                (person_code, account_number, outstanding_balance)
                VALUES( 
                      @person_code
		        ,	  @account_number
                ,     @outstanding_balance)
            `);

        console.log('Rows Affected:', result.rowsAffected); // Log the number of rows affected

        // Check if any rows were deleted
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Person add successfully' });
        } else {
            res.status(404).json({ message: 'Person not found or does not meet the add condition' });
        }
    } catch (err) {
        console.error('Server error:', err.message); // Log the error message
        res.status(500).json({ 
            message: "A server error occurred. Please try again later.", 
            error: err.message 
        });
    }
});

// Change POST to GET for listing data retrieval
app.put('/api/accountdetailsupdate/:id', async (req, res) => {
    const code = req.params.id; // Get the ID from the URL parameter
    const { person_code, account_number, outstanding_balance } = req.body;
    
    try {
        const pool = await connect();

        // Execute the UPDATE query
        const result = await pool.request()
            .input('person_code', person_code)
            .input('account_number', account_number)
            .input('outstanding_balance', outstanding_balance)
            .input('code', code)
            .query(`
                UPDATE Accounts
                SET   person_code = @person_code
		        ,	  account_number = @account_number
                ,     outstanding_balance = @outstanding_balance
                WHERE code = @code
            `);

        console.log('Rows Affected:', result.rowsAffected); // Log the number of rows affected

        // Check if any rows were deleted
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Account added successfully' });
        } else {
            res.status(404).json({ message: 'Account not found or does not meet the add condition' });
        }
    } catch (err) {
        console.error('Server error:', err.message); // Log the error message
        res.status(500).json({ 
            message: "A server error occurred. Please try again later.", 
            error: err.message 
        });
    }
});

// Change POST to GET for listing data retrieval
app.delete('/api/accountdetailsdelete/:id', async (req, res) => {
    const person_code = req.params.id; // Get the ID from the URL parameter

    try {
        const pool = await connect();

        // Execute the DELETE query
        const result = await pool.request()
            .input('person_code', person_code)  // Use the ID from the URL parameter
            .query(`
                DELETE FROM Accounts
                WHERE person_code = @person_code
            `);

        console.log('Rows Affected:', result.rowsAffected); // Log the number of rows affected

        // Check if any rows were deleted
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Account deleted successfully' });
        } else {
            res.status(404).json({ message: 'Account not found or does not meet the delete condition' });
        }
    } catch (err) {
        console.error('Server error:', err.message); // Log the error message
        res.status(500).json({ 
            message: "A server error occurred. Please try again later.", 
            error: err.message 
        });
    }
});

app.get('/api/transactions/:id', async (req, res) => {
    try {
        const account_number = req.params.id;
        const pool = await connect();
        const result = await pool.request()
        .input('account_number', account_number)
        .query('SELECT trans.* FROM Transactions trans inner join Accounts acc on trans.account_code = acc.code where acc.account_number = @account_number');
        res.json(result.recordset);
        console.log('Query result:', result.recordset);
    } catch (err) {
        console.error('Error fetching transactions:', err.message);
        res.status(500).json({ message: 'Failed to fetch accounts' });
    }
});

// Change POST to GET for listing data retrieval
app.get('/api/transactiondetails/:id', async (req, res) => {
    const code = req.params.id; // Get the ID from the URL parameter

    try {
        const pool = await connect();
        const result = await pool.request()
            .input('code', code)  // Use the ID from the URL parameter
            .query('select * from Transactions WHERE code = @code'); // Query based on IDNumber

        console.log('Query Result:', result.recordset);  // Log the query result to check the returned data

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]); // Return the first result (person details)
        } else {
            res.status(404).json({ message: 'Person not found' }); // Handle case where no record is found
        }
    } catch (err) {
        console.error('Server error:', err.message);  // Log the error message
        res.status(500).json({ message: "A server error occurred. Please try again later.", error: err.message });
    }
});

// Change POST to GET for listing data retrieval
app.put('/api/transactiondetailsinsert', async (req, res) => {
    const { account_code, transaction_date, capture_date, amount, description } = req.body;
    
    try {
        const pool = await connect();

        // Execute the UPDATE query
        const result = await pool.request()
            .input('account_code', account_code)
            .input('transaction_date', transaction_date)
            .input('capture_date', capture_date)
            .input('amount', amount)
            .input('description', description)
            .query(`
                INSERT INTO Transactions (account_code, transaction_date, capture_date, amount, description)
                VALUES(   @account_code
		        ,	  (SELECT CONVERT(DATETIME, REPLACE(@transaction_date, 'T', ' '), 120))
                ,     (SELECT CONVERT(DATETIME, REPLACE(@capture_date, 'T', ' '), 120))
                ,     @amount
                ,     @description)
            `);

        console.log('Rows Affected:', result.rowsAffected); // Log the number of rows affected

        // Check if any rows were deleted
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Transaction added successfully' });
        } else {
            res.status(404).json({ message: 'Transaction not found or does not meet the add condition' });
        }
    } catch (err) {
        console.error('Server error:', err.message); // Log the error message
        res.status(500).json({ 
            message: "A server error occurred. Please try again later.", 
            error: err.message 
        });
    }
});

// Change POST to GET for listing data retrieval
app.put('/api/transactiondetailsupdate/:id', async (req, res) => {
    const code = req.params.id; // Get the ID from the URL parameter
    const { account_code, transaction_date, capture_date, amount, description } = req.body;
    
    try {
        const pool = await connect();

        // Execute the UPDATE query
        const result = await pool.request()
            .input('account_code', account_code)
            .input('transaction_date', transaction_date)
            .input('capture_date', capture_date)
            .input('amount', amount)
            .input('description', description)
            .input('code', code)
            .query(`
                UPDATE Transactions
                SET   account_code = @account_code
		        ,	  transaction_date = @transaction_date
                ,     capture_date = @capture_date
                ,     amount = @amount
                ,     description = @description
                WHERE code = @code
            `);

        console.log('Rows Affected:', result.rowsAffected); // Log the number of rows affected

        // Check if any rows were deleted
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Transaction added successfully' });
        } else {
            res.status(404).json({ message: 'Transaction not found or does not meet the add condition' });
        }
    } catch (err) {
        console.error('Server error:', err.message); // Log the error message
        res.status(500).json({ 
            message: "A server error occurred. Please try again later.", 
            error: err.message 
        });
    }
});

// Change POST to GET for listing data retrieval
app.delete('/api/transactiondetailsdelete/:id', async (req, res) => {
    const code = req.params.id; // Get the ID from the URL parameter

    try {
        const pool = await connect();

        // Execute the DELETE query
        const result = await pool.request()
            .input('code', code)  // Use the ID from the URL parameter
            .query(`
                DELETE FROM Transactions
                WHERE code = @code
            `);

        console.log('Rows Affected:', result.rowsAffected); // Log the number of rows affected

        // Check if any rows were deleted
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Transaction deleted successfully' });
        } else {
            res.status(404).json({ message: 'Transaction not found or does not meet the delete condition' });
        }
    } catch (err) {
        console.error('Server error:', err.message); // Log the error message
        res.status(500).json({ 
            message: "A server error occurred. Please try again later.", 
            error: err.message 
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
