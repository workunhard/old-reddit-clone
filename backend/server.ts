import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import auth from "./firebase-config";
import { v4 as uuidv4 } from "uuid";
import Comment from "./util/Comment";

dotenv.config();

// Horrible hack to parse private keys with newlines
let serviceAccount;
let privateKey;
if (process.env.NODE_ENV === "production") {
  privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }
}
serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: privateKey || process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};
// End horrible hack

// Init Firebase + Firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

const port = process.env.PORT || 8080;
const app = express();
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

// Registration
app.post("/register", async (req, res) => {
  const { email, password, displayName } = req.body;
  const postSubmissions: string[] = [];
  const comments: string[] = [];

  try {
    // Step 1: Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update user profile (optional)
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      postSubmissions: postSubmissions, // Array of post submissions, initialized as empty
      comments: comments, // Array of comments, initialized as empty
    };

    await db.collection("users").doc(user.uid).set(userDoc);

    console.log("User registered with display name:", displayName);
    res.status(201).send(user);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send(error);
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();
    const { displayName } = user;
    res.status(200).send({ displayName, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send(error);
  }
});

// Get all posts
app.get("/get-posts", async (_req, res) => {
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

// Get Profile
app.get("/users/:username", async (req, res) => {
  const username = req.params.username;
  console.log("Fetching user:", username);
  try {
    // Query Firestore for user document where displayName equals username
    const querySnapshot = await db
      .collection("users")
      .where("displayName", "==", username)
      .get();

    if (querySnapshot.empty) {
      res.status(404).send("User not found");
      return;
    }
    const userDoc = querySnapshot.docs[0];
    console.log(userDoc.data());
    res.status(200).send(userDoc.data());
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Error fetching user");
  }
});

// Add comment to post
app.post("/:postId/add-comment", async (req, res) => {
  const postId = req.params.postId;
  const { comment } = req.body;
  const id = uuidv4();
  const newComment: Comment = {
    _id: id,
    body: comment.body,
    author: comment.author,
    parentID: postId,
    comments: [],
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
  };

  try {
    await db
      .collection("posts")
      .doc(postId)
      .update({
        comments: admin.firestore.FieldValue.arrayUnion(newComment),
      });
    res.send(newComment);
  } catch (error) {
    res.status(500).send(error);
  }

  // Add to commenter's comments array
  const userRef = db
    .collection("users")
    .where("displayName", "==", comment.author);
  const userDoc = await userRef.get();
  if (userDoc.empty) {
    return res.status(404).send("User not found");
  } else {
    const userData = userDoc.docs[0].data();
    const updatedComments = [...userData.comments, id];
    await userDoc.docs[0].ref.update({ comments: updatedComments });
  }
});

// Get user's comment history
app.get("/users/:username/comments", async (req, res) => {
  const username = req.params.username;
  try {
    const postsSnapshot = await db.collection("posts").get();
    let comments: Comment[] = [];

    postsSnapshot.forEach(postDoc => {
      const post = postDoc.data();
      // Check if the post has comments
      if (post.comments && Array.isArray(post.comments)) {
        // Filter comments where author matches username
        const userComments = post.comments.filter(comment => comment.author === username);
        comments = comments.concat(userComments);
      }
    });

    // Respond with the filtered comments
    res.status(200).send(comments);
  } catch (error) {
    console.error("Error fetching user comments:", error);
    res.status(500).send("Error fetching user comments");
  }
});

// TODO: Get comment's parent's title (WIP)
app.get("/comments/:commentId/parent", async (req, res) => {
  const commentId = req.params.commentId;
  try {
    const postsSnapshot = await db.collection("posts").get();
    let parentTitle = "Post not found";

    postsSnapshot.forEach(postDoc => {
      const post = postDoc.data();
      // Check if the post has comments
      if (post.comments && Array.isArray(post.comments)) {
        // Find the comment with the matching ID
        const comment = post.comments.find(comment => comment._id === commentId);
        if (comment) {
          parentTitle = post.title;
        }
      }
    });

    res.status(200).send(parentTitle);
  } catch (error) {
    console.error("Error fetching parent title:", error);
    res.status(500).send("Error fetching parent title");
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

/* Create a Post
-Create a new doc in the 'posts' collection
-add the post's ID to the submitter's postSubmissions array 
*/
app.post("/create-post", async (req, res) => {
  const { title, body, displayName } = req.body;

  try {
    if (!displayName) {
      return res.status(400).send("Display name is required");
    }

    const createdAt = new Date().toISOString();
    const lastActivity = new Date();
    const comments: string[] = [];

    // Create the post in the 'posts' collection
    const newDocRef = await db.collection("posts").add({
      title,
      author: displayName,
      body,
      createdAt,
      lastActivity,
      comments,
      upvotes: 0,
      downvotes: 0,
    });

    const postId = newDocRef.id;

    // Update the post document to include its own ID (_id)
    await db.collection("posts").doc(postId).update({ _id: postId });

    // Update the user document in the 'users' collection
    const userRef = await db
      .collection("users")
      .where("displayName", "==", displayName)
      .get();

    if (userRef.empty) {
      return res.status(404).send("User not found");
    }

    const userData = userRef.docs[0].data();

    // Update postSubmissions array with postId
    const updatedPosts = [...userData.postSubmissions, postId];

    // Update the user document with updated postSubmissions array
    await userRef.docs[0].ref.update({ postSubmissions: updatedPosts });

    res.status(201).send("Post created successfully");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send(error || "Error creating post");
  }
});

// Edit Post (WIP)
app.put("/edit-post", async (req, res) => {
  const { postId, title, body } = req.body;
  try {
    await db.collection("posts").doc(postId).update({
      title,
      body,
      lastActivity: new Date(),
    });
    res.status(200).send("Post updated successfully");
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send(error);
  }
});

// Delete Post (WIP)
app.delete("/delete-post", async (req, res) => {
  const postId = req.body.postId;
  try {
    await db.collection("posts").doc(postId).delete();
    res.status(200).send("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send(error);
  }
});

// Vote on a post
app.post("/posts/:postId/vote", async (req, res) => {
  const postId = req.params.postId;
  const vote = req.body.vote;
  console.log("Received upvote request for post:", postId);

  try {
    const postRef = await db.collection("posts").doc(postId).get();
    if (!postRef.exists) {
      return res.status(404).send("Post not found");
    }

    let postData = postRef.data();
    if (!postData || typeof postData.upvotes !== "number") {
      postData = { upvotes: 0 };
    }

    const updatedUpvotes = postData.upvotes + (vote === "up" ? 1 : -1);

    await db.collection("posts").doc(postId).update({
      upvotes: updatedUpvotes,
    });

    const updatedPost = {
      ...postData,
      upvotes: updatedUpvotes,
    };
    console.log(
      "Updated post:" + postId + " with upvote (" + updatedUpvotes + ")"
    );
    res.status(200).send(updatedPost);
  } catch (error) {
    console.error("Error upvoting post:", error);
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
