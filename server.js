const express = require("express");
const mongoose = require("mongoose");

const app = express();

// View Engine Setup
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Schema Definition
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleSlug: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  yearPublished: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
});

const Book = mongoose.model("Book", bookSchema);

// Routes
app.get("/", (req, res) => res.redirect("/books"));

app.get("/books", async (req, res) => {
  try {
    const allBooks = await Book.find();
    console.log("Books found:", allBooks.length);
    res.render("index", { books: allBooks });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Server error");
  }
});

app.get("/books/:titleSlug", async (req, res) => {
  try {
    const book = await Book.findOne({ titleSlug: req.params.titleSlug });
    if (!book) return res.status(404).send("Book not found");
    res.render("book", { book });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).send("Server error");
  }
});

app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

// ===============================
// MongoDB Connection (Atlas/Render)
// ===============================
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/books";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((error) => console.log("❌ Database connection error:", error));

// ===============================
// სერვერის გაშვება
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
