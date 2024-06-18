export default interface Post {
    _id: string;
    title: string;
    body: string;
    createdAt: string;
    numComments: { length: number };
    comments: string[];
  }