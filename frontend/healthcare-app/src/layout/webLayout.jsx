import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/web/header';
import Footer from '../components/web/footer';

const WebLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default WebLayout;