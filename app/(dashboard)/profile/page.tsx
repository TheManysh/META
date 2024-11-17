'use client';

import { Button } from '@/components/ui/button';
import { contract } from '@/constants/contract';
import { upload } from 'thirdweb/storage';
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from 'thirdweb/react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSendTransaction } from 'thirdweb/react';
import { useState } from 'react';
import { prepareContractCall } from 'thirdweb';
import { client } from '@/services/thirdweb';

export default function ProfilePage() {
  const account = useActiveAccount();

  const { data: user, isPending: isUserLoading } = useReadContract({
    contract,
    method:
      'function getUser(address _user) view returns ((address wallet, string name, string bio, string profileImage, address[] followers, address[] following))',
    params: [account?.address as string],
  });

  // create post
  const { mutate: sendTransaction } = useSendTransaction();

  const [_title, setTitle] = useState<string>('');
  const [_body, setBody] = useState<string>('');
  const [_featuredImage, setFeaturedImage] = useState<string>('');
  const [featuredImageFile, setFeaturedImageFile] = useState<any>('');
  const [_files, setFiles] = useState<string>('');

  const createPost = () => {
    const transaction = prepareContractCall({
      contract,
      method:
        'function createPost(string _title, string _body, string _files, string _featuredImage)',
      params: [_title, _body, _files, _featuredImage],
    });
    console.log({
      title: _title,
      body: _body,
      files: _files,
      featuredImage: _featuredImage,
    });
    sendTransaction(transaction);
  };

  const { data: posts, isPending: isPostLoaded } = useReadContract({
    contract,
    method:
      'function getPostsWithAuthorsByUser(address _user) view returns (((string title, string body, string files, string featuredImage, address userId, uint256 id) post, (address wallet, string name, string bio, string profileImage, address[] followers, address[] following) author)[])',
    params: [account?.address as string],
  });

  const uploadData = async () => {
    const uri = await upload({
      client, // thirdweb client
      files: [featuredImageFile as File],
    });
    setFeaturedImage(uri);
  };

  if (isUserLoading) <div>Loading...</div>;

  return (
    <div className='min-h-screen p-6 text-gray-700 bg-gray-50'>
      <div className='max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md'>
        <div className='p-6'>
          {/* Header Section */}
          <div className='mb-8'>
            <div className='relative w-24 h-24 overflow-hidden border border-gray-300 rounded-full'>
              {user?.profileImage && (
                <MediaRenderer
                  client={client}
                  src={user.profileImage}
                  className='absolute inset-0 object-cover w-full h-full'
                />
              )}
            </div>
            <div className='text-gray-900'>
              <h1 className='mb-2 text-2xl font-bold'>{user?.name}</h1>
              <h3 className='mb-2 text-2xl font-bold'>
                {user?.wallet.slice(0, 7) + '...'}
              </h3>
            </div>
            <p className='mb-4'>{user?.bio}</p>

            <div className='flex flex-row justify-between'>
              <p>
                Followers: <span>{user?.followers.length}</span>
              </p>
              <p>
                Following: <span>{user?.following.length}</span>
              </p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className='text-white bg-purple-500'>Create Post</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Create Post</DialogTitle>
              </DialogHeader>
              <div className='flex flex-col gap-y-4'>
                <div className='items-center gap-4'>
                  <Label htmlFor='title' className='text-right'>
                    Title
                  </Label>
                  <Input
                    id='title'
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='How to start innovating'
                    className='col-span-3'
                  />
                </div>
                <div>
                  <Label htmlFor='body' className='text-right'>
                    Body
                  </Label>
                  <Textarea
                    id='body'
                    onChange={(e) => {
                      setBody(e.target.value);
                    }}
                    placeholder='Start thinking with first principle...'
                    cols={10}
                    rows={10}
                  />
                </div>
                {/* upload featuredImage */}
                <div>
                  <Label htmlFor='featuredImage' className='text-right'>
                    Featured Image
                  </Label>
                  <Input
                    id='featuredImage'
                    onChange={(e) => setFeaturedImageFile(e.target.value)}
                    type='file'
                  />
                  <div className='my-2'>
                    <Button onClick={uploadData}>Upload</Button>
                  </div>
                </div>
                {/* upload files */}
                <div>
                  <Label htmlFor='file' className='text-right'>
                    Files (optional)
                  </Label>
                  <Input
                    id='file'
                    onChange={(e) => {
                      setFeaturedImageFile(e.target.value);
                    }}
                    type='file'
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={createPost} type='submit'>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className='mt-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Posts</h2>
            {posts?.map((post: any) => (
              <div
                key={post.id}
                className='p-4 mb-4 border border-gray-300 rounded-lg shadow-md'
              >
                <h3 className='text-lg font-semibold'>{post.post.title}</h3>
                <p>{post.post.body}</p>
                {post.post.featuredImage && (
                  <MediaRenderer
                    client={client}
                    src={post.post.featuredImage}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
