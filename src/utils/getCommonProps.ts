import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient, User} from '@prisma/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SerializableUser } from '../types/types';

const prisma = new PrismaClient();

export async function getCommonProps(context: GetServerSidePropsContext): Promise<{
  user: SerializableUser;
}> {
  const session = await getSession(context);
  if (!session) {
    return null;
  }

  const user: User = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return {
    ...(await serverSideTranslations(context.defaultLocale || 'ja', ['common'])),
    user: {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
  };
}
