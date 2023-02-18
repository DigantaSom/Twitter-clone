export type PostType = 'Tweet' | 'Reply' | 'Inner-Reply';

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
