export default interface Comment {
    _id: string;
    body: string;
    author: string;
    parentID: string;
    children: Comment[];
    createdAt: string;
}