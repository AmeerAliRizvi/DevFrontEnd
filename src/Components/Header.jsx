import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/70 backdrop-blur-lg px-10 py-5 flex items-center justify-between border-b border-white/10 shadow-sm">
      <h1 className="text-3xl font-extrabold text-white tracking-wider">
        Devly
      </h1>
      <div className="space-x-6 text-sm">
        <Link
          to="/login"
          className="hover:text-[#ff6a3d] transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-[#ff6a3d] px-5 py-2 rounded-full hover:bg-[#ff8c5a] text-black font-semibold transition"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Header;
