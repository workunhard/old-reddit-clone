# old-reddit-clone
A simple (Old) Reddit clone built with React, Express, and Firebase (auth + Firestore)

## Background
I've always preferred the aesthetic and functionality of Old Reddit over the 2018 redesign, specifically its use of screen real estate. In Old Reddit, each post is allocated its own compact row, allowing users to view approximately 15 post titles simultaneously on desktop. This layout facilitates a quick and comprehensive overview of content, minimizing the need for excessive scrolling. In contrast, the redesign emphasizes prolonged scrolling -- not unlike virtually every other social media app today -- and displays more content from individual posts (including sponsored/promoted ads) than I find necessary. Examples:

How it was:
![Glorious Old Reddit](./resources/image-2.png)

Hows it's going:
![New Reddit](./resources/image-1.png)

I felt like recreating the Old Reddit aesthetic was complex enough to be gratifying while simple enough so as not to draw away from the main purpose of this exercise: to rapidly design/build a full-stack application with React in the front, and Express + Firebase in the back.

## Features
* User authentication
* Create, read, update, and delete(TODO) posts
* Comment on posts
* Upvote and downvote posts/comments (TODO: limit votes to one per user)
* TODO: View user profiles, post/comment history
* TODO: Edit and delete comments

## Technologies
* TypeScript
* Vite
* React
* Express
* Firebase (auth + Firestore)
* Good ol' CSS

## Learnings
* Designing component interactions by the seat of your pants / "drawing from reference" is bad -- diagramming data models and pre-emptively identifying common functionalities makes for lighter refactoring.
* Firebase is criminally easy to set up, but Firestore reads can quickly get out of hand if you're not careful with your queries and/or you have multiple tabs of the Firestore Console open.
* The upvote/downvote system is roughly implemented; votes can be cast and are appropriately stored, however I need to solve the issue of users being able to cast multiple votes on the same post/comment. This will likely involve storing a list of users who have voted on a post/comment and checking that list before allowing a vote to be cast. The Post/Comment interfaces must grow.

## Setup
1. Clone the repository
2. Install dependencies
```bash
npm install
```
3. Create a Firebase project and enable Firestore and email/password authentication
4. Create a firebase-config.ts file in the root directory with the following structure (refer to [Firebase Docs](https://firebase.google.com/docs/auth/web/start)):
```typescript
export const firebaseConfig = {
    apiKey: YOUR_KEY
    authDomain: YOUR_DOMAIN
    projectId: YOUR_PROJECT_ID
    storageBucket: YOUR_STORAGE_BUCKET
    messagingSenderId: YOUR_MESSAGING_SENDER_ID
    appId: YOUR_APP_ID
}
```

5. Start the development server
```bash
npm run dev
```

