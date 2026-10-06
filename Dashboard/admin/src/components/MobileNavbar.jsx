import React from "react";

const MobileNavbar = ({ onMenu }) => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between bg-green-900 px-5 shadow lg:hidden">
      <div className="rounded-xl bg-yellow-300 px-3 py-2 text-xl font-black text-black">
        blinkit
      </div>

      <button
        onClick={onMenu}
        className="text-2xl text-white"
      >
        ☰
      </button>
    </nav>
  );
};

export default MobileNavbar;
