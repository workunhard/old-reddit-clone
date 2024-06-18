import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
const serviceAccount = require("./serviceAccountKey.json");
import auth from "./firebase-config";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

dotenv.config();

const port = process.env.PORT || 5000;
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

// Registration
app.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    console.log('User registered with display name:', displayName);
    res.status(201).send(user);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send(error);
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();
    const { displayName } = user;

    res.status(200).send({ displayName, token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send(error);
  }
});

// Get all posts
app.get("/get-posts", async (req, res) => {
  try {
    const posts = await db.collection("posts").get();
    const postsArray = posts.docs.map((doc) => doc.data());
    res.status(200).send(postsArray);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get single post
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

// Add comment to post
app.post("/:id/add-comment", async (req, res) => {
  const postId = req.params.id;
  const { comment, user } = req.body;
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

// Get post by ID
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

// Create post
app.post("/create-post", async (req, res) => {
  const { title, body, displayName } = req.body; // Assuming displayName is provided via auth

  // Check if displayName is provided
  if (!displayName) {
    return res.status(400).send("Display name is required");
  }

  const createdAt = new Date().toISOString();
  const lastActivity = new Date();
  const comments: string[] = [];

  try {
    const newDocRef = await db.collection("posts").add({
      title,
      author: displayName,
      body,
      createdAt,
      lastActivity,
      comments,
    });

    const postId = newDocRef.id;
    await db.collection("posts").doc(postId).update({ _id: postId });

    res.status(201).send("Post created successfully");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
