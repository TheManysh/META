'use client';
import { Button, Input, Avatar } from '@nextui-org/react';
import {
  Image as ImageIcon,
  Smile,
  MapPin,
  BarChart2,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { useReadContract, useActiveAccount } from 'thirdweb/react';
import { Spinner } from '@nextui-org/react';
import { contract } from '@/utils/contracts';
import Post from '@/components/dashboard/post';

export default function Home() {
  const account = useActiveAccount();
  const { data: feed, isPending: isFeedPending } = useReadContract({
    contract,
    method:
      'function getUserFeedWithAuthors(address _user) view returns (((string title, string body, string files, string featuredImage, address userId, uint256 id) post, (address wallet, string name, string bio, string profileImage, address[] followers, address[] following) author)[])',
    params: [account?.address as string],
  });

  console.log(feed);

  return (
    <div className='col-span-8'>
      <div className='sticky top-0 p-4 text-black bg-white/80 backdrop-blur-md'>
        <h1 className='text-xl font-bold'>Home</h1>
      </div>
      <div className='p-4 m-4 bg-white border border-gray-300 rounded-2xl'>
        <div className='flex gap-4'>
          <Avatar className='w-12 h-12' src='/api/placeholder/48/48' />
          <div className='flex-1'>
            <Input
              classNames={{
                input: 'bg-transparent',
                inputWrapper: 'bg-transparent',
              }}
              placeholder="What's on your mind?"
              variant='bordered'
            />
            <div className='flex justify-between mt-4'>
              <div className='flex gap-2'>
                <Button isIconOnly size='sm' variant='light'>
                  <ImageIcon className='text-purple-500' size={20} />
                </Button>
                <Button isIconOnly size='sm' variant='light'>
                  <BarChart2 className='text-purple-500' size={20} />
                </Button>
                <Button isIconOnly size='sm' variant='light'>
                  <Smile className='text-purple-500' size={20} />
                </Button>
                <Button isIconOnly size='sm' variant='light'>
                  <Calendar className='text-purple-500' size={20} />
                </Button>
                <Button isIconOnly size='sm' variant='light'>
                  <MapPin className='text-purple-500' size={20} />
                </Button>
              </div>
              <Button
                className='text-white bg-purple-600'
                color='primary'
                size='sm'
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {isFeedPending && (
        <div className='flex items-center justify-center p-4 m-4 text-black'>
          <Spinner />
        </div>
      )}
      {feed &&
        feed.map((post) => (
          <Link href={`/feeds/${post.id}`}>
            <Post key={post.id} user={post.title} content={post.body} />
          </Link>
        ))}
      {!isFeedPending && feed?.length == 0 && (
        <div className='flex items-center justify-center p-4 m-4 text-black'>
          No Posts Found.
        </div>
      )}
    </div>
  );
}
