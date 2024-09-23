const express = require("express");
const cors = require("cors");
const connectDB = require("./database");
const Todo = require("./todo");
const userRouter = require("./userRouter"); // Import userRouter


const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();


// Use user routes
app.use('/api/users', userRouter); // Use userRouter for /api/users

// CRUD operations

// Create a Todo
app.post("/todos", async (req, res) => {
  const { text, userId } = req.body; // Expecting userId from the request
  try {
    const newTodo = new Todo({ text, user: userId }); // Associate the todo with the user
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read all Todos for a specific user
app.get("/todos", async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters
  try {
    const todos = await Todo.find({ user: userId }); // Filter todos by user
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single Todo by ID
app.get('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await Todo.findById(id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Update a Todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { text, completed },
      { new: true }
    );
    if (!updatedTodo)
      return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a Todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo)
      return res.status(404).json({ message: "Todo not found" });
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
