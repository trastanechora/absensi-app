import { FC, PropsWithChildren } from 'react';
import AppLayout from '@/components/layouts/client';

const ClientSideApplication: FC<PropsWithChildren> = async ({ children }) => {
  return (
    <AppLayout>{children}</AppLayout>
  );
}

export default ClientSideApplication;