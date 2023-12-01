export interface TrendingState {
  trendingList: Trending_ListItem[];
  whoToFollow: IWhoToFollow[];
}

export interface Trending_ListItem {
  id: number;
  title: string;
  context?: string;
  isTrending?: boolean;
  time?: string; // TODO: to be changed later
  numberOfTweets?: number;
  image?: any; // TODO: to be changed to string (uri) later
}

export interface IWhoToFollow {
  id: string;
  fullName: string;
  handle: string;
  profilePicture: string;
  isPromoted: boolean;
}

export interface GetTrendingListPayload {
  type: 'trending-list' | 'whats-happening';
}

export interface RemoveATrendingItemPayload {
  itemId: number;
}
