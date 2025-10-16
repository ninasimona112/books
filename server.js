const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const bookSchema = mongoose.Schema({
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

app.get("/", function (req, res) {
  res.redirect("/books");
});

app.get("/books", async function (req, res) {
  const allBooks = await Book.find();
  console.log("Books found:", allBooks.length);
  res.render("index", { books: allBooks });
});

// წიგნის დეტალური გვერდი
app.get("/books/:titleSlug", async (req, res) => {
  const book = await Book.findOne({ titleSlug: req.params.titleSlug });
  if (!book) return res.status(404).send("Book not found");
  res.render("book", { book });
});

// ========================================================
// MongoDB მონაცემთა ბაზასთან დაკავშირება (ლოკალური ვერსია)
// ========================================================
mongoose
  .connect("mongodb://127.0.0.1:27017/books")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((error) => console.log("❌ Database connection error:", error));

// ========================================================
// სერვერის გაშვება
// ========================================================
const PORT = 3000;
app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);
