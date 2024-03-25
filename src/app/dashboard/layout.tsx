import { FC, PropsWithChildren } from 'react';
import { getServerAuthSession } from "@/app/lib/auth";
import DashboardLayout from '@/components/layouts/dashboard';

const Dashboard: FC<PropsWithChildren> = async ({ children }) => {
  const authSession = await getServerAuthSession();

  return (
    <DashboardLayout displayName={authSession?.user?.email || ''}>{children }</DashboardLayout>
  );
}

export default Dashboard;