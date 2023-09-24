import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { signOut } from 'next-auth/react';
import styled from 'styled-components';
import Color from './const/Color';

const Wrap = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  background-color: ${Color.BG_COLOR};
`;

const SiteNav = styled.nav`
  width: 64px;
  min-height: 100vh;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
`;
const Icon = styled.i`
  font-size: 32px;
  position: relative;
  &::before {
    color: ${Color.SECONDARY};
  }
  &:hover::before,
  &.current:before {
    color: ${Color.ACCENT};
  }
  &.current:after {
    display: block;
    content: ' ';
    width: 5px;
    height: 5px;
    border-radius: 100%;
    background: ${Color.ACCENT};
    position: absolute;
    top: calc(50% - 2px);
    left: -6px;
  }
`;

type Props = {
  children?: ReactNode;
  title?: string;
  accountType?: string;
};

const Layout: React.FC<Props> = ({
  children,
  title = 'GPT APP',
  accountType = 'PERSONAL',
}: Props) => {
  const router = useRouter();

  return (
    <Wrap>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <SiteNav className='pt-8'>
        <ul>
          <li className='mb-4'>
            <Link href='/'>
              <Icon className={`icon-home ${router.pathname === '/' ? 'current' : ''}`} />
            </Link>
          </li>
          <li className='mb-4'>
            <Link href='/items'>
              <Icon
                className={`icon-list ${router.pathname.startsWith('/items') ? 'current' : ''}`}
              />
            </Link>
          </li>
        </ul>

        <button
          className='mt-auto'
          onClick={() => {
            signOut({ callbackUrl: '/auth/signin' }); // 任意のログアウト後に遷移するページへの URL
          }}
        >
          <Icon className='icon-sign_out' />
        </button>
      </SiteNav>
      <MainContent className='w-full'>{children}</MainContent>
    </Wrap>
  );
};

export default Layout;
