import Post from '@/components/dashboard/post';
import { useActiveAccount, useReadContract } from 'thirdweb/react';
import { contract } from '@/constants/contract';

export default function Explore() {
  const account = useActiveAccount();
  const { data: explorePosts, isPending: isPostsLoading } = useReadContract({
    contract,
    method:
      'function getUserFeedWithAuthors(address _user) view returns (((string title, string body, string files, string featuredImage, address userId, uint256 id) post, (address wallet, string name, string bio, string profileImage, address[] followers, address[] following) author)[])',
    params: [account?.address as string],
  });

  return (
    <div className='col-span-8 border-x'>
      <div className='sticky top-0 p-4 text-black border-b bg-white/80 backdrop-blur-md'>
        <h1 className='text-xl font-bold'>Explore</h1>
      </div>
      {isPostsLoading ? (
        <div>Loading...</div>
      ) : (
        <div className='grid grid-cols-3 gap-4 p-4'>
          {explorePosts?.map((post: any) => <div>{post.post.title}</div>)}
        </div>
      )}
    </div>
  );
}
