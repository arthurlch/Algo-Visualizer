import { ReactElement, ReactNode } from 'react';
import Header from './Header';
import { Footer } from './Footer';

function Layout({ children }: { children: ReactNode }): ReactElement {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default Layout;
