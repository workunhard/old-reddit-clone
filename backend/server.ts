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

app.get("/get-post", async (req, res) => {
  const postId = req.query.id as string;
  try {
    const post = await db.collection("posts").doc(postId).get();
    if (post.exists) {
      res.status(200).send(post.data());
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/:id/add-comment", async (req, res) => {
  const postId = req.params.id;
  const comment = req.body.comment;
  try {
    await db
      .collection("posts")
      .doc(postId)
      .update({
        comments: admin.firestore.FieldValue.arrayUnion(comment),
      });
    res.send("Comment added successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});


app.get("/:postId", (req, res) => {
  const postId = req.params.postId;
  db.collection("posts")
    .doc(postId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.status(200).send(doc.data());
      } else {
        res.status(404).send("Post not found");
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.post("/create-post", async (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const createdAt = new Date().toISOString() as string;
  const lastActivity = new Date();
  const comments: string[] = [];

  const newDocRef = await db
    .collection("posts")
    .add({ title, body, createdAt, lastActivity, comments });
  
  const _id = newDocRef.id;
  await db.collection("posts").doc(_id).update({ _id });
  res.send("Post created successfully");
  
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
