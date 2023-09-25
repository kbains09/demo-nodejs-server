const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

const app = express();
const port = process.env.PORT || 3000;

const User = mongoose.model('User', {
  username: String,
  password: String, // Store hashed passwords securely
});

// Secret key for JWT signing (should be stored securely)
const jwtSecret = 'your-secret-key';

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  // Get the token from the request header
  const token = req.header('Authorization');

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Store user information in the request object
    next(); // Continue with the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect('mongodb://localhost/task_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error: ' + err);
});

// Create a Task model
const Task = mongoose.model('Task', {
  title: String,
  description: String,
  completed: Boolean,
});

// Middleware
app.use(bodyParser.json());

// API routes
// User registration (Add this route)
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    // Hash and save the password securely
    // You can use a library like bcrypt for password hashing
    // ...
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// User login (Add this route)
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
     // Compare the provided password with the stored hashed password
     const passwordMatch = await bcrypt.compare(password, user.password);
    
     if (!passwordMatch) {
       return res.status(401).json({ error: 'Invalid credentials' });
     }
    // If the password is valid, generate a JWT and send it back
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example route with authentication
app.get('/secure-route', authenticateUser, (req, res) => {
  // Access user information using req.user
  res.json({ message: 'Authenticated Route', user: req.user });
});

//get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//create a new task
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
});

// Get a specific task by ID
app.get('/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      const notFoundError = new Error('Task not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    res.json(task);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// Update a task by ID
app.patch('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated task
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
});

// Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Error handling middleware (Your existing error handler)
const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Internal Server Error' });
};

app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


//Make sure you have defined the User model and implemented password hashing properly according to your chosen library (e.g., bcrypt) before using it in the registration and login routes.
//You can use the following code to generate a hashed password:
