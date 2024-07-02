import express, { Request, Response, NextFunction } from "express";
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
import { body, validationResult } from "express-validator";
import { DecodedIdToken } from "firebase-admin/auth";
import { ParamsDictionary, Query } from "express-serve-static-core";
import path from "path";

dotenv.config();

interface Comment {
  _id: string;
  body: string;
  author: string;
  parentID: string;
  comments: string[];
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

interface RegisterBody {
  email: string;
  password: string;
  displayName: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface CommentBody {
  comment: {
    body: string;
    author: string;
  };
}

interface GetPostQuery {
  id: string;
}

interface AuthenticatedRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: DecodedIdToken;
}

// Firebase initialization
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

// Express
const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ["http://localhost:5173", "https://d5ngvcz90y0bk.cloudfront.net"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Authentication middleware
const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

app.use(express.static(path.join(__dirname)));

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("displayName").notEmpty(),
  ],
  async (req: Request<ParamsDictionary, any, RegisterBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, displayName } = req.body;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      const userDoc = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        postSubmissions: [],
        comments: [],
      };

      await db.collection("users").doc(user.uid).set(userDoc);

      res
        .status(201)
        .json({ message: "User registered successfully", user: userDoc });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  }
);

app.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req: Request<ParamsDictionary, any, LoginBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
      res.status(200).json({ displayName, token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(401).json({ error: "Invalid credentials" });
    }
  }
);

app.get("/get-posts", async (_req: Request, res: Response) => {
  try {
    const posts = await db.collection("posts").get();
    const postsArray = posts.docs.map((doc: { data: () => any; }) => doc.data());
    res.status(200).json(postsArray);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.get(
  "/get-post",
  async (
    req: Request<ParamsDictionary, any, any, GetPostQuery>,
    res: Response
  ) => {
    const postId = req.query.id;
    try {
      const post = await db.collection("posts").doc(postId).get();
      if (post.exists) {
        res.status(200).json(post.data());
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  }
);

app.get(
  "/users/:username",
  async (req: Request<{ username: string }>, res: Response) => {
    const username = req.params.username;
    try {
      const querySnapshot = await db
        .collection("users")
        .where("displayName", "==", username)
        .get();

      if (querySnapshot.empty) {
        return res.status(404).json({ error: "User not found" });
      }
      const userDoc = querySnapshot.docs[0];
      res.status(200).json(userDoc.data());
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
);

app.post(
  "/:postId/add-comment",
  authenticateToken,
  [body("comment.body").notEmpty(), body("comment.author").notEmpty()],
  async (
    req: AuthenticatedRequest<{ postId: string }, any, CommentBody>,
    res: Response
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
      const batch = db.batch();

      const postRef = db.collection("posts").doc(postId);
      batch.update(postRef, {
        comments: admin.firestore.FieldValue.arrayUnion(newComment),
      });

      // Ensure user exists and update comments array
      const userRef = db
        .collection("users")
        .where("displayName", "==", comment.author);
      const userDoc = await userRef.get();
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        const updatedComments = [...userData.comments, id];
        batch.update(userDoc.docs[0].ref, { comments: updatedComments });
      } else {
        console.error("User not found:", comment.author);
        return res.status(404).json({ error: "User not found" });
      }

      await batch.commit();

      res.status(201).json(newComment);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  }
);

app.get(
  "/users/:username/comments",
  async (req: Request<{ username: string }>, res: Response) => {
    const username = req.params.username;
    try {
      const postsSnapshot = await db.collection("posts").get();
      let comments: Comment[] = [];

      postsSnapshot.forEach((postDoc: { data: () => any; }) => {
        const post = postDoc.data();
        if (post.comments && Array.isArray(post.comments)) {
          const userComments = post.comments.filter(
            (comment: { author: string; }) => comment.author === username
          );
          comments = comments.concat(userComments);
        }
      });

      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching user comments:", error);
      res.status(500).json({ error: "Failed to fetch user comments" });
    }
  }
);

app.get(
  "/comments/:commentId/parent",
  async (req: Request<{ commentId: string }>, res: Response) => {
    const commentId = req.params.commentId;
    try {
      const postsSnapshot = await db.collection("posts").get();
      let parentTitle = "Post not found";

      postsSnapshot.forEach((postDoc: { data: () => any; }) => {
        const post = postDoc.data();
        if (post.comments && Array.isArray(post.comments)) {
          const comment = post.comments.find(
            (comment: { _id: string; }) => comment._id === commentId
          );
          if (comment) {
            parentTitle = post.title;
          }
        }
      });

      res.status(200).json({ parentTitle });
    } catch (error) {
      console.error("Error fetching parent title:", error);
      res.status(500).json({ error: "Failed to fetch parent title" });
    }
  }
);

app.get("/:postId", async (req: Request<{ postId: string }>, res: Response) => {
  const postId = req.params.postId;
  try {
    const doc = await db.collection("posts").doc(postId).get();
    if (doc.exists) {
      res.status(200).json(doc.data());
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

app.post(
  "/create-post",
  authenticateToken,
  async (
    req: AuthenticatedRequest<
      {},
      any,
      { title: string; body: string; displayName: string }
    >,
    res: Response
  ) => {
    const { title, body, displayName } = req.body;

    try {
      if (!displayName) {
        return res.status(400).json({ error: "Display name is required" });
      }

      const createdAt = new Date().toISOString();
      const lastActivity = new Date();
      const comments: Comment[] = [];

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

      await db.collection("posts").doc(postId).update({ _id: postId });

      const userRef = await db
        .collection("users")
        .where("displayName", "==", displayName)
        .get();

      if (userRef.empty) {
        return res.status(404).json({ error: "User not found" });
      }

      const userData = userRef.docs[0].data();
      const updatedPosts = [...userData.postSubmissions, postId];

      await userRef.docs[0].ref.update({ postSubmissions: updatedPosts });

      res.status(201).json({ message: "Post created successfully", postId });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  }
);

app.put(
  "/edit-post",
  authenticateToken,
  async (
    req: AuthenticatedRequest<
      {},
      any,
      { postId: string; title: string; body: string }
    >,
    res: Response
  ) => {
    const { postId, title, body } = req.body;
    try {
      await db.collection("posts").doc(postId).update({
        title,
        body,
        lastActivity: new Date(),
      });
      res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  }
);

app.delete(
  "/delete-post",
  authenticateToken,
  async (
    req: AuthenticatedRequest<{}, any, { postId: string }>,
    res: Response
  ) => {
    const { postId } = req.body;
    try {
      await db.collection("posts").doc(postId).delete();
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  }
);

app.post(
  "/posts/:postId/vote",
  authenticateToken,
  async (
    req: AuthenticatedRequest<{ postId: string }, any, { vote: "up" | "down" }>,
    res: Response
  ) => {
    const postId = req.params.postId;
    const { vote } = req.body;
    console.log("Received vote request for post:", postId);

    try {
      const postRef = await db.collection("posts").doc(postId).get();
      if (!postRef.exists) {
        return res.status(404).json({ error: "Post not found" });
      }

      const postData = postRef.data();
      if (!postData || typeof postData.upvotes !== "number") {
        return res.status(500).json({ error: "Invalid post data" });
      }

      const updatedUpvotes = postData.upvotes + (vote === "up" ? 1 : -1);

      await db.collection("posts").doc(postId).update({
        upvotes: updatedUpvotes,
      });

      const updatedPost = {
        ...postData,
        upvotes: updatedUpvotes,
      };
      console.log(`Updated post: ${postId} with vote (${updatedUpvotes})`);
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Error voting on post:", error);
      res.status(500).json({ error: "Failed to vote on post" });
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
