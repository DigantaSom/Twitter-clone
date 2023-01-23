import { IWhatsHappening } from '../../features/trending/trending.types';

const FifaImg = require('../../images/demo-1-whats-happening.jpeg');

const whatsHappening: IWhatsHappening[] = [
  {
    id: '1',
    title: 'Canada vs Morocco',
    context: 'FIFA World Cup',
    time: '1 hour ago',
    image: FifaImg,
  },
  {
    id: '2',
    title: '#JensenAckles',
    context: 'Entertainment',
    isTrending: true,
    numberOfTweets: 1521,
  },
  {
    id: '3',
    title: '#SpotifyWrapped2022',
    context: 'Music',
    isTrending: true,
  },
  {
    id: '4',
    title: 'Darkseid',
    context: 'Entertainment',
    isTrending: true,
    numberOfTweets: 355,
  },
];

export default whatsHappening;
