After 21 failed deployments, ver 022 deploys to AWS Elastic Beanstalk without incident.

Zip file structure:
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


PS command to Zip based on backend directory structure:

```powershell
Compress-Archive -Path "./dist", "./package-lock.json", "./package.json", "./Procfile" -DestinationPath "reddit-clone-backend-022.zip"
```    

Then upload using AWS EB console