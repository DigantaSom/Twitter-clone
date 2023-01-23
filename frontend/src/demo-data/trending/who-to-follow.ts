import { IWhoToFollow } from '../../features/trending/trending.types';

import constants from '../../constants';

const whoToFollow: IWhoToFollow[] = [
  {
    id: '1',
    fullName: 'Visit Oman',
    handle: 'visitoman_vo',
    profilePicture: constants.placeholder_profilePicture,
    isPromoted: true,
  },
  {
    id: '2',
    fullName: 'No Context Brits',
    handle: 'NoContextBrits',
    profilePicture: constants.placeholder_profilePicture,
    isPromoted: false,
  },
  {
    id: '3',
    fullName: 'Bros Helping Bros',
    handle: 'HelpingChads',
    profilePicture: constants.placeholder_profilePicture,
    isPromoted: false,
  },
];

export default whoToFollow;
