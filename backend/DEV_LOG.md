# Dev Log - Backend

## June 24, 2024 - Redeploy + Refactor + New Routes

Second Deploy (ver023): [http://reddit-clone-backend-023.us-west-2.elasticbeanstalk.com/](http://reddit-clone-backend-023.us-west-2.elasticbeanstalk.com/)

Completions:
- Added new routes for comments
- Refactored some routes to use async/await
- Refactored some routes to explicitly use Comment and Post interfaces

Notes:
- Authentication is implemented, but only roughly. The token is generated and sent back to the client and stored locally, but validation/verification is sloppily implemented between front/backend. Need to read Firebase docs.
- Data models for users and posts are suboptimal. Initial thought was to have a user model with an array of post/comment ids, but this requires a lot of extra querying; comment and post details are stored in the post model, while only ids are stored in the user model. So, getting all comments made by a specific user means querying the user's list of comment/post ids, then querying ALL posts in the database just to see if any of the ids show up. Not ideal. Need to rethink and ponder data redundancy.


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
