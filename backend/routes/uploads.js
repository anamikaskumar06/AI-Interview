const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const db = require("../config/db");

const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    }
  })
});

router.post("/", upload.single("certificate"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  db.query(
    "INSERT INTO uploads (filename, filepath) VALUES (?, ?)",
    [req.file.key, req.file.location],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Database upload failed" });
      }

      res.json({
        message: "Certificate uploaded successfully",
        url: req.file.location
      });
    }
  );
});

module.exports = router;
