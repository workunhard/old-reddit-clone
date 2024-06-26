# Dev Log - Backend

## June 25, 2024 - The AI Update

AI code completion is helpful for sketching basic routes and writing trivial code, but it's not a panacea. More often than not, when faced with a tough read, it butchers its own troubleshooting steps and fails miserably at retaining the context of previous questions/answers. After feeling like ChatGPT was giving me the first 5 google results on repeat, I gave Claude a try and was surprised. One thorough query and it made multiple, genuine enhancements while introducing only easily-squashed bugs. It helped me figure out what I was trying to achieve with the AuthContext, and it created a sorely needed AuthenticatedRequest interface; tokens now work as they should.

LocalStorage no longer being used to store what should've belonged solely to the AuthContext (i.e., displayName, token). No discernible performance gain, but the code is now far cleaner and more secure.

Remaining in experimental branch until all changes are verified as stable.

## June 24, 2024 - Redeploy + Refactor + New Routes

Second Deploy (ver023): [http://reddit-clone-backend-023.us-west-2.elasticbeanstalk.com/](http://reddit-clone-backend-023.us-west-2.elasticbeanstalk.com/)

Completions:

- Added new routes for comments
- Refactored some routes to use async/await
- Refactored some routes to explicitly use Comment and Post interfaces

Notes:

- Authentication is implemented, but only roughly. The token is generated and sent back to the client and stored locally, but validation/verification is sloppily implemented between front/backend. Need to read Firebase docs.
- Data models for users and posts are suboptimal. Initial thought was to have a user model with an array of post/comment ids, but this requires a lot of extra querying; comment and post details are stored in the post model, while only ids are stored in the user model. So, getting all comments made by a specific user means querying the user's list of comment/post ids, then querying ALL posts in the database just to see if any of the ids show up. Not ideal. Need to ponder data redundancy.

TODO:

- Fix auth
- Refactor data models
- Add more routes
- Add more error handling
- Add meaningful tests

## June 20, 2024 - Initial Deploy

First Deploy (ver022): [http://reddit-clone-backend-022.us-west-2.elasticbeanstalk.com/](http://reddit-clone-backend-022.us-west-2.elasticbeanstalk.com/)

- Deployed backend to AWS Elastic Beanstalk
- Grappled with parsing firebase keys from environment variables
- Blamed NGINX for several hours though it wasn't really NGINX's fault
- General deployment pipeline established

## Deploy Instructions

Environment was created in AWS Console. Dist files are manually zipped and uploaded to an S3 bucket. The Zip file structure:

```
└── dist/
    ├── .ebextensions
    ├── util/
    │   └── Comment.js
    ├── server.js
    ├── nginx.conf
    ├── package-lock.json
    ├── package.json
    ├── firebase-config.js
    └── Procfile
```

PowerShell command to zip based on backend directory structure:

```powershell
Compress-Archive -Path "./dist", "./package-lock.json", "./package.json", "./Procfile" -DestinationPath "reddit-clone-backend-022.zip"
```
