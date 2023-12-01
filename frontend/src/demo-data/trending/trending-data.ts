import { Trending_ListItem } from '../../features/trending/trending.types';

const FifaImg = require('../../images/demo-1-whats-happening.jpeg');

const trendingData: Trending_ListItem[] = [
  {
    id: 1,
    title: 'Canada vs Morocco',
    context: 'FIFA World Cup',
    time: '1 hour ago',
    image: FifaImg,
  },
  {
    id: 2,
    title: '#JensenAckles',
    context: 'Entertainment',
    isTrending: true,
    numberOfTweets: 1521,
  },
  {
    id: 3,
    title: '#SpotifyWrapped2022',
    context: 'Music',
    isTrending: true,
  },
  {
    id: 4,
    title: 'Darkseid',
    context: 'Entertainment',
    isTrending: true,
    numberOfTweets: 355,
  },
  {
    id: 5,
    title: 'Israel',
    context: 'Politics',
    numberOfTweets: 260000,
    isTrending: true,
  },
  {
    id: 6,
    title: 'INDvAFG',
    context: 'Sports',
    isTrending: true,
  },
  {
    id: 7,
    title: 'BCCI',
    context: 'Sports',
    numberOfTweets: 26100,
    isTrending: true,
  },
  {
    id: 8,
    title: '#OMG2',
    context: 'Entertainment',
    numberOfTweets: 1551,
    isTrending: true,
  },
  {
    id: 9,
    title: 'The Last Jedi',
    context: 'Entertainment',
    numberOfTweets: 1442,
    isTrending: true,
  },
];

export default trendingData;
