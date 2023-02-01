import { UserID } from '../user/user.types';
import { Reply } from '../../types';

export interface TweetState {
  newTweetData: AddNewTweetArg;
}

interface TweetSkeleton {
  userId: string;
  fullName: string;
  twitterHandle: string;
  profilePicture: string;
  caption: string;
  media: string[];
  creationDate: string;
  likes: UserID[];
  replies: Reply[];
  retweets: UserID[];
}

export interface Tweet extends TweetSkeleton {
  _id: string;
}

export interface TweetDisplay extends TweetSkeleton {
  id: string;
}

export type TweetResponse = {
  ids: [string];
  entities: Record<string, TweetDisplay>;
};

export type AddNewTweetArg = {
  caption: string;
  media: [string];
};

export type DeleteTweetArg = {
  tweetId: string;
};

export type LikeTweetArg = {
  tweetId: string;
};

export type LikeResponse = { userId: UserID }[];
