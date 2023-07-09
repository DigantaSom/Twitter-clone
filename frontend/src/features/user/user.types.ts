export interface UserID {
  userId: string;
}

export interface UserBasicInfo {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
  bio: string;
  isFollowedByLoggedInUser: boolean;
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

export interface GetProfileArgs extends UsernameArg {
  loggedInUserId: string | undefined;
}

export interface FollowUserArgs {
  targetUserId: string | undefined;
  loggedInUserId: string | undefined;
}

export interface FollowUserResponse {
  message: string;
}
