import { GetServerSideProps } from 'next';
import { withAuth } from '../../utils/withAuth';
import { getCommonProps } from '../../utils/getCommonProps';
import { PrismaClient, Item } from '@prisma/client';
import {
  SerializableUser,
  SerializableItem
} from '../../types/types';
import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Modal from '../../components/modal/Modal';
import { TextField } from '../../components/form/Input';
import { AccentBtn } from '../../components/button/Button';
import { Header, Breadcrumb } from '../../components/header/Header';

const prisma = new PrismaClient();

type Props = {
  user: SerializableUser;
  item: SerializableItem;
};

const ItemPage: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation('common');
  const modelName: string = t('models.item');

  type FormInput = {
    name: string;
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput>();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [item, setitem] = useState<SerializableItem>(props.item);

  const updateitem = async (data) => {
    try {
      const response = await axios.put(`/api/private/items/${item.id}`, data, {
        withCredentials: true,
      });
      setIsOpenEditModal(!isOpenEditModal);
      setitem(response.data);
      toast.success('更新しました');
    } catch (error) {
      toast.error('エラーが発生しました');
      console.error('An error occurred while updating the item:', error);
    }
  };

  const deleteitem = async (itemId) => {
    try {
      if (window.confirm('本当に削除してよろしいですか？')) {
        await axios.delete(`/api/private/items/${itemId}`, { withCredentials: true });
        router.push('/items?deleted=true');
      }
    } catch (error) {
      toast.error('エラーが発生しました');
      console.error('An error occurred while deleting the item:', error);
    }
  };

  const toggleEditModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpenEditModal(!isOpenEditModal);
      setValue('name', item.name);
    }
  };

  return (
    <Layout title={`${modelName}: ${item.name}`}>
      <Header>
        <h1>{item.name}</h1>
        <div className='ml-auto mr-4'>
          <button onClick={(e) => toggleEditModal(e)}>
            <i className='icon-pen events-none text-2xl mr-1' />
          </button>
          <button onClick={() => deleteitem(item.id)}>
            <i className='icon-trash text-2xl' />
          </button>
        </div>
      </Header>
      <Breadcrumb>
        <span>
          <Link href='/items'>{modelName}</Link>
        </span>
        <i className='icon-right_arrow' />
        <span>{item.name}</span>
      </Breadcrumb>

      {isOpenEditModal && (
        <Modal close={toggleEditModal} title='話題の編集'>
          <div className='px-4'>
            <form onSubmit={handleSubmit(updateitem)}>
              <TextField
                {...register('name', {
                  required: '必須項目です',
                  validate: (value) => value.trim() !== '' || 'Name cannot be empty',
                })}
              />
              {errors.name && <p>{errors.name.message}</p>}
              <p className='text-center'>
                <AccentBtn type='submit'>更新</AccentBtn>
              </p>
            </form>
          </div>
        </Modal>
      )}
    </Layout>
  );
};
export default ItemPage;

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const commonProps = await getCommonProps(context);
  if (!commonProps) {
    return { props: {} };
  }

  const { itemId } = context.params;
  const item: Item = await prisma.item.findUnique({
    where: {
      id: Number(itemId),
    },
  });

  if (!item) {
    return {
      notFound: true,
    };
  }

  const props: Props = {
    ...commonProps,
    item: {
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }
  };

  return {
    props: props,
  };
});
