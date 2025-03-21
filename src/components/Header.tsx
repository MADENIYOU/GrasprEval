// @ts-nocheck

import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gray-900 mb-6">
      <nav className="items-center pt-5 px-4 mx-auto max-w-screen-xl sm:px-8 sm:flex sm:space-x-6">
        <h1 className="text-white font-bold text-4xl xl:text-5xl">
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
            Graspr
          </span>
          <span className="text-white font-extrabold">Etu</span>
        </h1>
        <ul className="py-4 flex-1 items-center flex space-x-3 sm:space-x-6 sm:justify-end">
          <li className="text-gray-200">
            <a href="/Dashboard" className="text-blue-700">Dashboard</a>
          </li>
          <li className="text-gray-200">
            <a href="/Matieres">Matières</a>
          </li>
          <li className="text-gray-200">
            <a href="https://chat-delta-rose.vercel.app/chat">ChatBot</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
