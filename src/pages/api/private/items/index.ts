import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });


  switch (req.method) {
    case 'GET':
      const items = await prisma.item.findMany();
      res.status(200).json(items);
      break;
    case 'POST':
      const { name, content } = req.body;
      const item = await prisma.item.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          name,
          content
        },
      });
      res.status(200).json(item);
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}
