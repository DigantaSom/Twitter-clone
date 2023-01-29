import { Tweet } from './features/tweet/tweet.types';

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

export interface Reply extends Tweet {
  inner_replies: Reply[];
}
