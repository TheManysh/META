'use client';

import { Button } from '@nextui-org/button';
import { Home, Search, UserCircle, Wallet } from 'lucide-react';
import { ConnectButton, lightTheme } from 'thirdweb/react';

import SidebarItem from '@/components/sidebar/item';
import { client } from '@/services/thirdweb';
import { useState } from 'react';

const SidebarItems = [
  { icon: Home, label: 'Home', link: '/dashboard' },
  { icon: Search, label: 'Explore', link: '/explore' },
  { icon: UserCircle, label: 'Profile', link: '/profile' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className={`${collapsed ? 'col-span-1' : 'col-span-2'} sticky left-0 top-0 min-h-screen bg-white shadow-lg transition-all duration-300`}
    >
      <div className='flex flex-col justify-between h-full gap-2 p-4'>
        <div className='flex flex-col gap-2'>
          <div className='h-10' />
          {SidebarItems.map((item) => (
            <SidebarItem
              key={item.label}
              active={false}
              collapsed={collapsed}
              icon={item.icon}
              label={item.label}
              link={item.link}
            />
          ))}
          <Button
            className='w-full mt-4 text-white bg-purple-400 hover:bg-primary-purple-500'
            size='sm'
          >
            {collapsed ? '+' : 'Post'}
          </Button>
        </div>
        {collapsed ? (
          <Button>
            <Wallet size={16} />
          </Button>
        ) : (
          <ConnectButton client={client} theme={lightTheme()} />
        )}
      </div>
    </div>
  );
}
