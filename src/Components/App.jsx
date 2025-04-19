import { BrowserRouter, Route, Routes } from "react-router-dom"
import About from "./About";
import Login from "./Login";
import Body from "./Body";
import SignUp from "./SignUp";
import { Provider } from "react-redux";
import appStore from "../Utils/appStore";
import Feed from "./Feed";
import Profile from "./Profile";
import Connections from "./Connections";
import Requests from "./Requests";

function App() {

  return (
    <>
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element = {<Body/>}>
            <Route path="/" element = {<Feed/>} />
            <Route path="/profile" element = {<Profile/>}/>
            <Route path="connections" element = {<Connections/>}/>
            <Route path="/login" element = {<Login/>} />
            <Route path="/about" element = {<About/>}/>
            <Route path="/pendingRequests" element = {<Requests/>}/>
            <Route path ="/signUp" element = {<SignUp/>
          }/>
          </Route>
        </Routes>
      </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
