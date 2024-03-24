import { FC, PropsWithChildren } from 'react';
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import DashboardLayout from '@/components/layouts/dashboard';

const Dashboard: FC<PropsWithChildren> = async ({ children }) => {
  const authSession = await getServerAuthSession();
  console.log('[DEBUG] authSession', authSession);

  return (
    <DashboardLayout displayName={authSession?.user?.email || ''}>{children }</DashboardLayout>
  );
}

export default Dashboard;