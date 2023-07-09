export interface UserID {
  userId: string;
}

export interface UserBasicInfo {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
  bio: string;
  numberOfFollowers: number;
  numberOfFollowing: number;
}

export interface UserProfile extends UserBasicInfo {
  headerPhoto: string;
  birthday: string | null; // TODO: remove nullable functionality
  joiningDate: string;
  numberOfTweets: number;
}

export interface UsernameArg {
  username: string | undefined;
}
