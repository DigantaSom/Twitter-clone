export interface UserID {
  userId: string;
}

export interface AccessToken {
  accessToken: string;
}

export interface SignupArgs {
  name: string;
  email: string;
  password: string;
  username: string;
  birthday: string;
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
  birthday: string;
  joiningDate: string;
  numberOfTweets: number;
  location: string;
  website: string;
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

export interface SingleMessageResponse {
  message: string;
}

export type FollowObjectArray = {
  _id: string;
  userId: string;
  addedDate: string;
}[];

export interface EditProfileRequestBody {
  userId: string; // just to invalidate the cache after success
  name: string;
  bio: string;
  location: string;
  website: string;
  profilePhoto: string;
  headerPhoto: string;
}

export interface GetMyBasicInfoResponse {
  _id: string;
  name: string;
  profilePicture: string;
}

export type GetSearchedUsersResponse = {
  _id: string;
}[];
export interface GetSearchedUsersArg {
  q: string | null;
}
