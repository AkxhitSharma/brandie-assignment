import { User } from "./user";

export interface Followers{
    followerId: string;
    followeeId: string; 
    createdAt: string;
}

export interface FollowersRequest{
    followerId: string;
    followeeId: string;
}

export interface FollowersResponse{
    follower: User;
    followee: User;
    createdAt: string;
}