export interface IWhatsHappening {
  id: string;
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

export interface TrendingState {
  whatsHappening: IWhatsHappening[];
  whoToFollow: IWhoToFollow[];
}
