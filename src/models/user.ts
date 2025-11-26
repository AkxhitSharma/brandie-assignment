export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
}

export interface UserRequest {
    email: string;
    password: string;
    username: string;
}

export interface UserResponse {
    id: string;
    username: string;
    email: string;
    totalFollowers : number;
    totalPosts : number;
}