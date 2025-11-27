import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./db.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Test API
app.get("/", (req, res) => {
  res.send("Bike Backend Running!");
});

// Get all bikes
app.get("/getbikes", (req, res) => {
  connection.query("SELECT * FROM bikes ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Insert new bike
app.post("/newbike", (req, res) => {
  const { bikename, bikeprice, bikecolor } = req.body;

  connection.query(
    "INSERT INTO bikes (bikename, bikeprice, bikecolor) VALUES (?, ?, ?)",
    [bikename, bikeprice, bikecolor],
    (err) => {
      if (err) return res.status(500).json({ error: err });

      connection.query(
        "SELECT * FROM bikes ORDER BY id DESC",
        (err2, results) => {
          res.json(results);
        }
      );
    }
  );
});

// Delete
app.delete("/deletebike/:id", (req, res) => {
  const { id } = req.params;

  connection.query("DELETE FROM bikes WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });

    connection.query("SELECT * FROM bikes ORDER BY id DESC", (err2, results) => {
      res.json(results);
    });
  });
});

// Update
app.put("/updatebike/:id", (req, res) => {
  const { id } = req.params;
  const { bikename, bikeprice, bikecolor } = req.body;

  connection.query(
    "UPDATE bikes SET bikename=?, bikeprice=?, bikecolor=? WHERE id=?",
    [bikename, bikeprice, bikecolor, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });

      connection.query("SELECT * FROM bikes ORDER BY id DESC", (err2, results) => {
        res.json(results);
      });
    }
  );
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
