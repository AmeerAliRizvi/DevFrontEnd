import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BaseUrl } from "../Utils/constants";
import { removeUser } from "../Utils/userSlice";
import axios from "axios";

const NavBar = () => {

  const user = useSelector((store)=>store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async()=>{
    try{ 
      await axios.post(BaseUrl + "/logout",{},{
        withCredentials: true,
      })
      dispatch(removeUser());
      return navigate("/login");
    }
    catch(err){
      console.error(err);
    }
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">DevConnect</Link>
      </div>
      {user && <div className="flex gap-2 items-center">
      <p>Welcome,{user.firstName}</p>
        
        <div className="dropdown dropdown-end mx-5">
          
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src={user.photoUrl}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to= "/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link to="/pendingRequests">Requests</Link>
            </li>
            <li>
              <Link to="/connections">Connections</Link>
            </li>
            <li>
              <a onClick={handleLogOut}>Logout</a>
            </li>
          </ul>
        </div>
      </div>}
    </div>
  );
};

export default NavBar;
