import { FC, PropsWithChildren } from 'react';
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import AppLayout from '@/components/layouts/client';

const Dashboard: FC<PropsWithChildren> = async ({ children }) => {
  const authSession = await getServerAuthSession();
  console.log('[DEBUG] authSession', authSession);

  return (
    <AppLayout>{children }</AppLayout>
  );
}

export default Dashboard;