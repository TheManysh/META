import React from 'react';
import { Button } from '@nextui-org/react';
import { MessageSquare } from 'lucide-react';
import { MediaRenderer } from 'thirdweb/react';
import { client } from '@/services/thirdweb';
import { contract } from '@/constants/contract';
import { prepareContractCall } from 'thirdweb';
import { useSendTransaction } from 'thirdweb/react';

const Cardd = ({
  user,
  handle,
  bio,
  followerscount,
  followingcount,
  profileImage,
  walletUser,
}: any) => {
  const { mutate: sendTransaction } = useSendTransaction();

  const followProfile = () => {
    const transaction = prepareContractCall({
      contract,
      method: 'function followUser(address _userToFollow)',
      params: [handle as string],
    });
    sendTransaction(transaction);
  };

  return (
    <div className='px-12 py-4 mb-2 text-black transition-all rounded-none shadow-none cursor-pointer bg-purple'>
      <div className='flex flex-row items-center justify-between w-full gap-8'>
        <div className='w-24 h-24 border border-gray-300 rounded-full'>
          {profileImage && (
            <MediaRenderer
              client={client}
              src={
                'ipfs://QmYudwi8BMVCzwCNTRGkzSszWEwQETJ3Cef5kSALw6W2kZ/elon.jpg'
              }
              className='w-24 h-24 rounded-full'
            />
          )}
        </div>
        <div className='flex-1'>
          <div className='flex flex-col mb-2'>
            <div className='text-xl font-bold'>{user}</div>
            <div className='text-sm text-default-500'>{handle}</div>
          </div>

          <div className='flex items-center gap-4 mb-2'>
            <span className='text-default-500'>{bio}</span>
          </div>

          <div className='flex items-center gap-4 mb-2'>
            <span className='text-xl text-default-500'>Followers</span>
            <span className='text-xl text-default-500'>{followerscount}</span>
            <span className='text-xl text-default-500'>Following</span>
            <span className='text-xl text-default-500'>{followingcount}</span>
          </div>
          <div className='flex gap-x-2'>
            <Button className='text-white rounded-full shadow-lg h-9 w-9 bg-purple-600/80 backdrop-blur-sm hover:bg-purple-700/80'>
              <MessageSquare className='w-6 h-6' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cardd;
