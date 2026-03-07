import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();

// 1. MIDDLEWARE - This must be at the top!
app.use(cors()); 
app.use(express.json());

// 2. DATABASE CONNECTION
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'wellness_db'
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed: " + err.message);
  } else {
    console.log("✅ Connected to MySQL Database (wellness_db)!");
  }
});

// 3. TEST ROUTE (Type http://localhost:3000 in your browser to check this)
app.get('/', (req, res) => {
  res.send("Backend is officially running and reachable!");
});

// 4. MOOD POST ROUTE
app.post('/mood', (req, res) => {
  const { full_name, mood_text } = req.body;

  // Simple AI Logic
  const ai_message = `Hi ${full_name}, I hear that you're feeling "${mood_text}". Take a deep breath!`;

  const sql = 'INSERT INTO moods (full_name, mood_text, ai_response) VALUES (?, ?, ?)';
  
  db.query(sql, [full_name, mood_text, ai_message], (err, result) => {
    if (err) {
      console.error("❌ SQL Insert Error:", err.message);
      return res.status(500).json({ error: "Database saving failed" });
    }
    
    console.log(`✅ Mood saved for: ${full_name}`);
    res.json({ ai_message }); 
  });
});

// 5. START SERVER
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying at http://localhost:${PORT}`);
});