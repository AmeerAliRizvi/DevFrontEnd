import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { BaseUrl } from "../Utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Utils/userSlice";
import { useEffect } from "react";
import axios from "axios";

const Body = () => {

  const dispatch = useDispatch();
  const userData = useSelector((store)=> store.user); 
  const navigate = useNavigate();

  const fetchUser = async ()=>{
    try{
      if(userData) return;

      const res = await axios.get(BaseUrl + "/profile/view",{
        withCredentials: true,
      });
      dispatch(addUser(res.data));

    } catch(err){
      if(err.status === 401){
        navigate("/login")
      }
      console.error(err)
    }
  }

  useEffect(()=>{
    fetchUser();
  },[]); 

  return (
    <div className = "flex flex-col min-h-screen">
      <NavBar />
      <main className = "flex-grow p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
