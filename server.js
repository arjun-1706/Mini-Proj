// Import necessary modules
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 5000;
const mongoose = require('mongoose');

// Define Student model schema
const studentSchema = new mongoose.Schema({
    rollNo: String,
    name: String,
    degree: String,
    city: String
});
const Student = mongoose.model('Student', studentSchema);

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/StudentDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

// Route to render the index page with student data
app.get('/', async (req, res) => {
    try {
        const students = await Student.find(); // Fetch all student data from the database
        res.render('index', { students: students });
    } catch (error) {
        res.status(500).send('Error fetching student data');
    }
});

// Route to handle form submission and save new student data to the database
app.post('/save', async (req, res) => {
    const { rollNo, name, degree, city } = req.body;
    try {
        const student = new Student({ rollNo, name, degree, city });
        await student.save(); // Save new student data to the database
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error saving student data');
    }
});

// Route to handle editing student data
app.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const student = await Student.findById(id); // Find student data by ID
        res.render('edit', { student: student });
    } catch (error) {
        res.status(500).send('Error fetching student data');
    }
});



// Route to delete a student
app.post('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Student.findByIdAndDelete(id); // Delete the student from the database
        res.redirect('/'); // Redirect back to the student list page
    } catch (error) {
        res.status(500).send('Error deleting student data');
    }
});

// Route to update a student
app.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    const { rollNo, name, degree, city } = req.body;
    try {
        await Student.findByIdAndUpdate(id, { rollNo, name, degree, city }); // Update the student data in the database
        res.redirect('/'); // Redirect back to the student list page
    } catch (error) {
        res.status(500).send('Error updating student data');
    }
});


// Start the server
app.listen(port, () => console.log(`Server is running on port no ${port}`));
