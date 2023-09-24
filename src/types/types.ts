import { User, Item } from '@prisma/client';

export type UserForToken = Pick<User, 'id' | 'email'>;

export type SerializableUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export type SerializableItem = Omit<Item, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
