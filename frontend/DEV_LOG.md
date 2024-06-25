# Dev Log - Frontend

## June 24, 2024 - Undeployed but getting there

The frontpage:
![frontpage](./readme_resources/frontpage_ui_06242024.png)

Post view:
![post](./readme_resources/postpage_ui_06242024.png)

User profile + activity log:
![profile](./readme_resources/profile_ui_06242024.png)


Wins:
- Basic front page UI complete
- Basic dedicated post page UI complete
- Basic profile page UI complete
- Authentication implemented (Firebase)
- Set up React Router, fixed unnecessary full page rerenders
- Implemented auth logic / token storage
- Implemented basic fetching of posts, comments, and user details

Notes:
- Voting works, but renders slowly because I wait for the vote to be processed in Firebase. Inadvertently learning about optimistic vs pessimistic rendering.
- CSS spaghetti; almost a dozen stylesheets, some unused, redundant rules that will only get tougher to manage as new components are created. Likewise, implementing light/dark mode will be harder the longer I procrastinate.


TODO:
- Create more robust data models and let those inform state management and component redesigns
- Implement light/dark mode + refactor css
- Write utils for rendering lists of posts/comments -- code duplication will become an issue

