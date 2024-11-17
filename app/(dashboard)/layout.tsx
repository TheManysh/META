import React, { useEffect, useState } from 'react';

import Sidebar from '@/components/dashboard/sidebar';
import RightSidebar from '@/components/dashboard/right-sidebar';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype['toJSON'] = function () {
  return this.toString();
};
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex w-full h-full bg-white'>
      {/* Collapsible Sidebar */}
      <div className='w-1/4'>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className='w-1/2'>{children}</div>

      {/* Right Sidebar */}
      <div className='w-1/4'>
        <RightSidebar />
      </div>
    </div>
  );
}
