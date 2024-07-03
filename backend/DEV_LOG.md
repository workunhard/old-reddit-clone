# Dev Log - Backend

## July 2, 2024 Pt 2 - Rethought, Rehosted

Backend successfully re-hosted on Elastic Beanstalk, this time with HTTPS. Purchased a domain through Route 53 and configured everything in ~30min -- very satisfying when something 'just works'.
The frontend (https://codes-test-domain.com) communicates seamlessly with the backend (https://orc-api.codes-test-domain.com), however now that I'm able to easily view the hosted project on my phone, it has exposed a ton of UI/CSS issues. Shifting focus to the frontend before extending and tightening up the backend logic.

## July 2, 2024 - Rethinking Hosting

With the frontend successfully deployed to AWS Cloudfront via S3 (HTTPS), the final piece of the puzzle is getting it to cooperate with the backend, which it won't due to [Mixed Content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content). Cue troubles with AWS Elastic Beanstalk:

My server isn't explicitly configured for HTTPS. Naively, I hoped the solution would be as simple as the frontend deploy (i.e., uploading the files to S3 + creating a distro in Cloudfront == boom; HTTPS).

But no. The backend is a different beast. I've been hit with a surprise AWS bill before was therefore hoping that it would be possible to host the backend on the free tier (Single Instance). However, configuring HTTPS on an EB environment requires a load balancer, which is not free and frankly overkill for a demo project. I'm stubbornly insisting on EB because of the time already sunk into searching for a solution, and ultimately I want to learn how to do it properly for future projects that might enjoy more than a couple users.

To get a SSL via AWS Certificate Manager (ACM), I can't use the default domain assigned by EB; I need to buy/register my own. With the cert, I can then configure the load balancer.

When I get this to work, I'll be looking at a more cost-effective alternative in serverless (Lambda + API Gateway); seems more appropriate small-scale projects.

Anyways, here's the current backend over glorious HTTP: 
* http://old-reddit-backend.us-west-2.elasticbeanstalk.com

## June 25, 2024 - The AI Update

AI code completion is helpful for sketching basic routes and writing trivial code, but it's not a panacea. More often than not, it chases its tail with overconfident and outdated Buzzfeed listicles. After feeling like ChatGPT was giving me the first 5 google results on repeat, I gave Claude a try and was surprised. One careful query and it made multiple, genuine enhancements while introducing only easily-squashed bugs. It helped me figure out what I was trying to achieve with the AuthContext, and it created a sorely needed AuthenticatedRequest interface; tokens now work as they should.

LocalStorage is no longer being used to store what should've belonged solely to the AuthContext (i.e., displayName, token). No discernible performance gain, but the code is now far cleaner and more secure.

Remaining in experimental branch until all changes are verified as stable.

## June 24, 2024 - Redeploy + Refactor + New Routes

[DEFUNCT] ~~Second Deploy (ver023): [http://reddit-clone-backend-023.us-west-2.elasticbeanstalk.com/]~~

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
