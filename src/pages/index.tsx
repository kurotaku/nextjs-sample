import { GetServerSideProps } from 'next';
import { withAuth } from '../utils/withAuth';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import axios from 'axios';
import fetchCurrentUser from '../utils/fetchCurrentUser';
import { formatDate } from '../utils/formatDate';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Modal from '../components/modal/Modal';
import { Header } from '../components/header/Header';
import FloatingActionButton from '../components/button/FloatingActionButton';

const ChatItem = styled.div`
  cursor: pointer;
  margin-bottom: 2px;
`;

const IndexPage = () => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <Layout title={t('home')} accountType={user?.accountType}>
      <Header>
        <h1>{t('home')}</h1>
      </Header>

    </Layout>
  );
};
export default IndexPage;

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }


  return {
    props: {
      ...(await serverSideTranslations(context.defaultLocale || 'ja', ['common'])),
    },
  };
});
