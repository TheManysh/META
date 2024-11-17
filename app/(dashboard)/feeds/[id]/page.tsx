'use client';

import { Card } from '@nextui-org/react';

import { MediaRenderer, useReadContract } from 'thirdweb/react';
import { contract } from '@/constants/contract';
import { useParams } from 'next/navigation';
import { client } from '@/services/thirdweb';
import Link from 'next/link';

export default function Post() {
  const { id } = useParams();

  const { data: post, isPending: isPostLoading } = useReadContract({
    contract,
    method:
      'function getPostWithAuthorById(uint256 _postId) view returns (((string title, string body, string files, string featuredImage, address userId, uint256 id) post, (address wallet, string name, string bio, string profileImage, address[] followers, address[] following) author))',
    params: [BigInt(id as string)],
  });

  return (
    <div className='col-span-8'>
      <div className='w-full p-4 md:p-6'>
        <Card className='max-w-full mx-auto bg-white border border-gray-300 shadow-lg'>
          <div className='p-4 space-y-6 md:p-6'>
            <div className='space-y-2'>
              <h1 className='text-2xl font-bold tracking-tight text-black md:text-3xl lg:text-4xl'>
                {post?.post.title}
              </h1>
              <div className='flex flex-col text-sm sm:flex-row sm:items-center sm:gap-4'>
                <div className='flex items-center gap-2'>
                  <div className='w-16 h-16 overflow-hidden border border-gray-300 rounded-full'>
                    <MediaRenderer
                      client={client}
                      src={post?.author.profileImage}
                      className='object-cover w-full h-full'
                    />
                  </div>
                  <div className='font-medium text-gray-700'>
                    <Link href={`/profile/${post?.author.wallet}`}>
                      {post?.author.name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {post?.post?.featuredImage?.length > 0 && (
              <div className='relative aspect-[2/1] w-full overflow-hidden rounded-lg'>
                <MediaRenderer
                  client={client}
                  alt='Article cover'
                  className='object-cover'
                  src={post?.post.featuredImage}
                />
              </div>
            )}
            <div className='text-lg text-black'>
              <p>{post?.post.body}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
