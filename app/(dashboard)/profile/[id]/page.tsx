'use client';

import { useReadContract } from 'thirdweb/react';
import { contract } from '@/constants/contract';
import { useParams, useRouter } from 'next/navigation';
import Chat from '@/components/ai/chat';
import { MediaRenderer } from 'thirdweb/react';
import { client } from '@/services/thirdweb';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { id } = useParams();
  console.log(id);

  const { data: user, isPending: isUserLoading } = useReadContract({
    contract,
    method:
      'function getUser(address _user) view returns ((address wallet, string name, string bio, string profileImage, address[] followers, address[] following))',
    params: [id as string],
  });

  const { data: posts, isPending: isPostLoaded } = useReadContract({
    contract,
    method:
      'function getPostsWithAuthorsByUser(address _user) view returns (((string title, string body, string files, string featuredImage, address userId, uint256 id) post, (address wallet, string name, string bio, string profileImage, address[] followers, address[] following) author)[])',
    params: [id as string],
  });

  if (isUserLoading) return <div>Loading...</div>;
  console.log(user);

  return (
    <div className=''>
      <div className='sticky top-0 p-4 text-black'>
        <h1 className='text-xl font-bold'>Profile</h1>
      </div>
      {/* Posts */}{' '}
      <div className='mb-8 text-gray-900'>
        <div className='relative w-24 h-24 overflow-hidden border border-gray-300 rounded-full'>
          {user?.profileImage && (
            <MediaRenderer
              client={client}
              src={user.profileImage}
              className='absolute inset-0 object-cover w-full h-full'
            />
          )}
        </div>
        <div className=''>
          <h1 className='mb-2 text-2xl font-bold'>{user?.name}</h1>
          <h3 className='mb-2 text-2xl font-bold'>
            {user?.wallet.slice(0, 7) + '...'}
          </h3>
        </div>
        <p className='mb-4'>{user?.bio}</p>

        <div className='flex flex-row justify-between text-'>
          <p>
            Followers: <span>{user?.followers.length}</span>
          </p>
          <p>
            Following: <span>{user?.following.length}</span>
          </p>
        </div>
        {/* check the current user and user id and add follow button */}
        {
          // @ts-ignore
          user.wallet !== id && (
            <Button className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'>
              Follow
            </Button>
          )
        }
      </div>
      <Chat postId={id as string} />
      <p className='flex justify-center mt-1 text-xl text-black'>Posts</p>
      <div className='text-black'>
        {posts?.map((post: any) => (
          <div>
            <h1>{post.post.title}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
