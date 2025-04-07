import { useEffect, useState } from 'react';

const Navbar = ({ toggleTheme, theme }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="w-full bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">🩺 Diabetes Predictor</h1>
      <button
        onClick={toggleTheme}
        className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200 transition duration-200"
      >
        {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>
    </nav>
  );
};

export default Navbar;
