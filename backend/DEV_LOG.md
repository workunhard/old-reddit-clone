# Dev Log

## June 20, 2024 - Initial Deploy

First Deploy (ver022): [http://reddit-clone-backend-022.us-west-2.elasticbeanstalk.com/](http://reddit-clone-backend-022.us-west-2.elasticbeanstalk.com/)

- Deployed backend to AWS Elastic Beanstalk
- Grappled with parsing firebase keys from environment variables
- Blamed NGINX for several hours though it wasn't really NGINX's fault
- General deployment pipeline established

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

TODO:
* [] Set up dev + prod branches
* [] Improve deployment pipeline (ebcli or github actions)

