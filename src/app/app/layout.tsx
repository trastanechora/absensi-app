import { FC, PropsWithChildren } from 'react';
// import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import AppLayout from '@/components/layouts/client';

const ClientSideApplication: FC<PropsWithChildren> = async ({ children }) => {
  // const authSession = await getServerAuthSession();

  return (
    <AppLayout>{children}</AppLayout>
  );
}

export default ClientSideApplication;