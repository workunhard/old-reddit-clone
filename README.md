# old-reddit-clone | [Live Link](https://codes-test-domain.com)
A simple Old Reddit clone built with React, Express, GCP and AWS

## Background
I Like using Reddit on desktop, specificallly 'Old' Reddit which you can still experience if you 'opt out' of the 2018 redesign (see user preferences). Old Reddit's layout offers a better, more comprehensive overview of content, minimizing the need for excessive scrolling. In contrast, the 2018 redesign is unabashedly mobile-first, displaying more content from individual posts (including sponsored/promoted ads) which makes for worse viewing on bigger screens. Examples circa June 2024:

How it was (Old):
![Glorious Old Reddit](./resources/image-2.png)

How it's going (New):
![New Reddit](./resources/image-1.png)

At first I simply wanted to recreate the Old Reddit aesthetic in React with manual CSS, but it quickly turned into a full-stack exercise through which I'm deepening my knowledge of system design and cloud services.

## Features
* User authentication
* Create, read, update, and delete(TODO) posts
* Comment on posts
* Upvote and downvote posts/comments (TODO: limit votes to one per user)
* View user profiles, post/comment history
* TODO: Edit and delete comments

## Technologies
* TypeScript
* CSS
* AWS | EC2, Elastic Beanstalk, Cloudfront, S3, Route 53, ACM
* GCP | Firebase (Auth + Firestore)
* React
* Express

## Dev Logs
* [Frontend](./frontend/DEV_LOG.md)
* [Backend](./backend/DEV_LOG.md)

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

