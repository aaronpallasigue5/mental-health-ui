import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { db } from './db.js'; // Ensure your db.js uses port 23648

dotenv.config();
const app = express();

// 1. Configure CORS to allow your GitHub Pages link
app.use(cors({
  origin: ["https://aaronpallasigue5.github.io", "http://localhost:5173"],
  methods: ["GET", "POST"]
}));

app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 2. The POST route your frontend is calling
app.post('/mood', async (req, res) => {
  const { full_name, mood_text } = req.body;

  try {
    // 3. Generate the AI Response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful and empathetic mental health assistant." },
        { role: "user", content: `My name is ${full_name}. I am feeling: ${mood_text}` }
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    // 4. Try to save to Database, but don't crash if it fails
    try {
      await db.query(
        "INSERT INTO name_moods (user_name, message, ai_response) VALUES (?, ?, ?)",
        [full_name, mood_text, aiResponse]
      );
    } catch (dbError) {
      console.error("Database Save Failed, but sending AI response anyway:", dbError);
    }

    // 5. Send back the response (Your frontend expects 'ai_message')
    res.json({ ai_message: aiResponse });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "The AI is resting right now. Please try again." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});