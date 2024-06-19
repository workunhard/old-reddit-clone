export default interface Comment {
    _id: string;
    body: string;
    author: string;
    parentID: string;
    comments?: Comment[];
    createdAt: string;
  }
  