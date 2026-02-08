import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import HomeIcon from "../assets/HomeIcon";
import ChatIcon from "../assets/ChatIcon";
import ConnectionsIcon from "../assets/ConnectionsIcon";
import RequestsIcon from "../assets/RequestsIcon";
import LogoutButton from "./LogoutButton";
import { useSelector } from "react-redux";

const menuItems = [
  { name: "Home", path: "/feed", icon: HomeIcon },
  { name: "Chats", path: "/chat", icon: ChatIcon },
  { name: "Connections", path: "/connections", icon: ConnectionsIcon },
  { name: "Requests", path: "/requests", icon: RequestsIcon },
];


const MenuItem = ({ name, path, Icon, active, index }) => {
 
  const baseClasses = "flex items-center gap-4 px-8 py-3.5 transition-all duration-300 ease-in-out cursor-pointer relative group rounded-r-xl";
  

  const iconClasses = "w-15 h-15 transition-all duration-300 ease-in-out";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      role="listitem"
    >
      <NavLink to={path} aria-current={active ? "page" : undefined}>
        <motion.div
          layout 
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`
            ${baseClasses}
            ${active 
              ? "bg-purple-50 text-purple-800 font-bold shadow-inner shadow-purple-100" 
              : "text-gray-600 font-medium hover:bg-[#f2efff]"
            }
          `}
        >
          {active && (
            <motion.div
              layoutId="accent-line" 
              className="absolute top-0 bottom-0 left-0 w-1 bg-purple-600 rounded-r-lg"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3 }}
              aria-hidden="true"
            />
          )}

          <Icon
            className={`
              ${iconClasses} 
              ${active ? "text-purple-700" : "text-gray-500 group-hover:text-purple-600"}
            `}
            aria-hidden="true"
          />

          <span className="text-lg">
            {name}
          </span>
        </motion.div>
      </NavLink>
    </motion.div>
  );
};

export default function SideBar() {

  const user = useSelector((store)=>store.user);
  const location = useLocation();

  const sidebarClasses = `
    w-72 h-screen bg-[#faf7ff]
    flex flex-col
    font-inter
    shadow-[6px_0_30px_rgba(150,120,200,0.12)] sticky top-0
  `;

  return (
    <div className={sidebarClasses} aria-label="Main Navigation Sidebar">
      
      <div className="px-8 pt-12 pb-10">
        <div className="flex items-center gap-3">
          <div className="
            w-12 h-12 rounded-xl 
            bg-gradient-to-br from-purple-200 via-purple-100 to-white
            border border-purple-200
            flex items-center justify-center
            shadow-sm
          ">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 shadow" aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Hack<span className="text-purple-700">Mate</span>
            </h1>
            <p className="text-xs text-gray-500">Find your hack partner</p>
          </div>
        </div>
      </div>

      <hr className="mx-8 border-t border-[#ede7f6] mb-2" aria-hidden="true" />

      <nav className="flex flex-col gap-1" role="navigation" aria-label="Main Menu">
        <ul role="list">
          {menuItems.map((item, i) => (
            <MenuItem
              key={item.name}
              index={i}
              name={item.name}
              path={item.path}
              Icon={item.icon}
              active={location.pathname === item.path}
            />
          ))}
        </ul>
      </nav>
      <LogoutButton/>
      <div className="flex-1" aria-hidden="true" /> 

      {/* 👤 Profile Section */}
      <div className="px-8 py-8 border-t border-[#ede7f6]">
        <NavLink to="/profile">
          {({ isActive }) => (
            <div
              className={`
                flex items-center gap-4 p-3 rounded-xl
                transition-all duration-200
                ${isActive ? "bg-purple-100" : "hover:bg-[#f8f4ff]"}
              `}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-purple-100">
                  <img
                    src={user.photoUrl}
                    alt="Ameer Rizvi's profile picture"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="
                  absolute -bottom-1 -right-1 
                  w-4 h-4 bg-emerald-500 
                  border-2 border-[#faf7ff]
                  rounded-full
                " title="Online Status" />
              </div>

              <div>
                <p className="font-semibold text-gray-900">{user.firstName + " " + user.lastName}</p>
                <p className="text-xs text-gray-500">{user.title}</p>
              </div>

              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="ml-auto w-2 h-2 rounded-full bg-purple-700"
                  aria-hidden="true"
                />
              )}
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );
}