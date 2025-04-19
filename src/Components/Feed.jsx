import { useDispatch, useSelector } from "react-redux";
import { BaseUrl } from "../Utils/constants";
import axios from "axios";
import { addFeed, removeFeed } from "../Utils/feedSlice";
import { useEffect } from "react";
import FeedCards from "./FeedCards";

const Feed = ()=>{

    const feed = useSelector((store)=>store.feed);
    const dispatch = useDispatch();
    const loggedInUser = useSelector((store)=>store.user);

    const getFeed = async()=>{
            
        try{
            if(feed.length > 0) return;
            const res = await axios.get(BaseUrl + "/feed",{
            withCredentials:true,
            })
            
            dispatch(addFeed(res?.data?.data || []))
        }catch(err){
            console.log(err);
        }

    }

    useEffect(()=>{
        getFeed();
    },[])

    return(
        <div>
            {feed.length > 0 ? (
                <FeedCards user={feed[0]} showButton = {true} />
            ) : (
                <p>No User Found</p>  // ✅ Shows a fallback message instead of crashing
            )}
        </div>
    )
}
export default Feed;