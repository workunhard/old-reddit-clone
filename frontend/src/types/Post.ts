export default interface Post {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  numComments: number;
  upvotes: number;
  downvotes: number;
  author: string;
  comments: Comment[];
}