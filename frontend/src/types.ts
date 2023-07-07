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
  profilePicture: string;
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

export type ProfileTab = 'Tweets' | 'Replies' | 'Media' | 'Likes';
