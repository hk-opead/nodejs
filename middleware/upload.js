// // In your multer configuration file (e.g., upload.js)
// const multer = require("multer");
// const path = require("path");

// // Configure storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let folder = "files/";
//     if (file.fieldname === "img") {
//       folder = "images/";
//     }
//     cb(null, path.join(__dirname, "../public/uploads", folder));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// // File filter (optional)
// const fileFilter = (req, file, cb) => {
//   // Add your validation logic here
//   cb(null, true);
// };

// // Configure upload middleware
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
// }).fields([
//   { name: "img", maxCount: 1 },
//   { name: "file", maxCount: 1 },
// ]);

// module.exports = upload;
