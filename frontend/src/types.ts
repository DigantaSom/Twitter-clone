export type MonthType =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export interface TokenPayloadUser {
  id: string;
  twitterHandle: string;
  fullName: string;
}

export interface TokenPayload {
  user: TokenPayloadUser | null;
}

export type NavigationOption =
  | 'home'
  | 'explore'
  | 'settings'
  | 'notifications'
  | 'messages'
  | 'bookmarks'
  | 'lists'
  | 'profile'
  | 'more';

export type ProfilePageTab = 'Tweets' | 'Replies' | 'Media' | 'Likes';

export type FollowPageTab = 'Followers you know' | 'Followers' | 'Following';

export type PhotoType = 'Profile' | 'Header';
