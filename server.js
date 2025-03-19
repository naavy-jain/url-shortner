const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const shortid = require("shortid");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  const shortCode = shortid.generate();
  await ShortUrl.create({ full: req.body.fullUrl, short: shortCode });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// MONGO_URL= mongodb+srv://naavyjain174:uei8yoP3pjaYIIvU@cluster0.knijk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
