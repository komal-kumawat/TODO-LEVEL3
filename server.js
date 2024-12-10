const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./mongoSchema"); // Assuming this is your Mongoose model for tasks
const app = express();

// Use built-in Express middleware for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public')); // To serve static files like CSS

// Connect to MongoDB
mongoose.connect("mongodb+srv://komalK:komal%40123@atlascluster.fukzabb.mongodb.net/todoApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

// API to fetch all tasks
app.get("/", async (req, res) => {
    try {
        const tasks = await Task.find(); // Fetch tasks from MongoDB
        res.render('index', { tasks }); // Render the tasks using EJS
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// API to add a new task
app.post("/add", async (req, res) => {
    const task = new Task({ name: req.body.task, completed: false });
    try {
        await task.save(); // Save task to MongoDB
        res.redirect('/'); // Redirect to the main page after adding
    } catch (error) {
        res.status(400).json({ error: "Failed to create task" });
    }
});

// API to update a task as completed
app.post("/complete/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
        if (updatedTask) {
            res.redirect('/'); // Redirect back after marking as completed
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (error) {
        res.status(400).json({ error: "Failed to update task" });
    }
});

// API to delete a task
app.post("/delete/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (deletedTask) {
            res.redirect('/'); // Redirect back after deletion
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (error) {
        res.status(400).json({ error: "Failed to delete task" });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
