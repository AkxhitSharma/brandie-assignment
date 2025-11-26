export interface Post {
    id: string;
    authorId: string;
    text: string;
    mediaUrl: string | null;
    createdAt: string;
}

export interface PostRequest {
    text: string;
    mediaUrl: string | null;
}

export interface PostResponse {
    id: string;
    authorId: string;
    text: string;
    mediaUrl: string | null;
    createdAt: string;
}