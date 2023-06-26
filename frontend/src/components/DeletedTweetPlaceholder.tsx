import { Link } from 'react-router-dom';

const DeletedTweetPlaceholder = () => {
  return (
    <div className='p-2 ph_sm:p-4 border-b-[1px] border-gray-200 hover:cursor-auto'>
      <div className='p-2 ph_sm:p-4 bg-gray-100 text-gray-500 rounded-2xl'>
        <p>
          This Tweet was deleted by the Tweet author.{' '}
          <Link to='#' className='text-twitter'>
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DeletedTweetPlaceholder;
