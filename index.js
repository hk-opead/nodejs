const express = require("express");
const app = express();
const { initializeDatabase } = require("./model/User");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

const cors = require("cors");
const coursesRoute = require("./routes/courses");
const aboutRoute = require("./routes/about");
const bookRoute = require("./routes/books");
const applicationRoute = require("./routes/application");
const projectRoute = require("./routes/project");
app.use(cors());
const productRoute = require("./routes/Product");
const path = require("path");
app.use(express.json()); // Middleware to parse JSON bodies

initializeDatabase().then((success) => {
  if (success) {
    app.listen(5000, () => {
      console.log("Server is running on http://localhost:5000");
    });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/about", aboutRoute);
app.use("/api/courses", coursesRoute);
app.use("/api/book", bookRoute);
app.use("/api/application", applicationRoute);
app.use("/api/project", projectRoute);

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
