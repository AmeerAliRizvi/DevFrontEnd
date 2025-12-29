import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import { Outlet } from "react-router-dom";
import Login from "./Login";
import Signup from "./SignUp";
import VerifyEmail from "./VerifyEmail";

import Feed from "./Feed";
import Connections from "./Connections";
import Requests from "./Requests";
import SideBar from "./SideBar";
import Profile from "./Profile";
import UserProfile from "./UserProfile";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        {/* LAYOUT ROUTE */}
        <Route
          element={
            <div className="flex">
              <SideBar />
              <div className="flex-1">
                <Outlet />
              </div>
            </div>
          }
        >
          <Route path="/feed" element={<Feed />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path = "/profile/view/:userId" element = {<UserProfile/>}/>
        </Route>
      </Route>

    </Routes>
  );
}

export default App;
