'use client';

import { Button, User, Input, Card, CardBody } from '@nextui-org/react';
import { Search } from 'lucide-react';
import { useReadContract } from 'thirdweb/react';
import { contract } from '@/constants/contract';

export default function RightSidebar() {
  const { data: usersToFollow, isPending: isUsersToFollowPending } =
    useReadContract({
      contract,
      method:
        'function getUsersToFollow() view returns ((address wallet, string name, string bio, string profileImage, address[] followers, address[] following)[])',
      params: [],
    });

  if (isUsersToFollowPending) return <div>Loading...</div>;

  console.log(usersToFollow);

  return (
    <div className='sticky top-0 right-0 flex-1 w-full p-4 text-black bg-white'>
      <div>
        <div className='bg-white'>
          <Input
            className='mb-4'
            classNames={{
              input: 'bg-white',
              inputWrapper: 'bg-white border-2 hover:border-purple-500',
            }}
            placeholder='Search'
            startContent={<Search size={18} />}
          />
        </div>

        <Card className='p-4 text-black bg-white border border-gray-300'>
          <CardBody>
            <h2 className='mb-4 text-xl font-bold'>Who to follow</h2>
            <div className='space-y-4'>
              {/* Suggested users */}
              {usersToFollow ? (
                usersToFollow.map((user) => (
                  <div
                    key={user.wallet}
                    className='flex items-center justify-between'
                  >
                    <User
                      avatarProps={{
                        src: '/api/placeholder/32/32',
                      }}
                      description='@username'
                      name={user.name}
                    />
                    <Button className='text-white bg-purple-600' size='sm'>
                      Follow
                    </Button>
                  </div>
                ))
              ) : (
                <div>No users to follow</div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
