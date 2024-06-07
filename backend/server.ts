import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

dotenv.config();

const port = process.env.PORT;
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/get-posts", async (req, res) => {
  try {
    const posts = await db.collection("posts").get();
    const postsArray = posts.docs.map((doc) => doc.data());
    res.status(200).send(postsArray);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/create-post", async (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const createdAt = new Date().toISOString() as string;
  const lastActivity = new Date();
  const comments: string[] = [];

  await db.collection("posts")
    .add({ title, body, createdAt, lastActivity, comments })
    .then(() => {
      res.send("Post created");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
