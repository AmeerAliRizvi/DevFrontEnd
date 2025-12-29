// src/components/Feed.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../Utils/feedSlice";
import api from "../utils/axiosClient";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Code2 } from "lucide-react";
import UserCard from "./UserCard";
import SearchUsers from "./SearchUsers";
import {useNavigate } from "react-router-dom";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Use a ref to track if we are currently fetching to prevent race conditions
  // that simple state sometimes misses in strict mode
  const isFetchingRef = useRef(false);

  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);

  const getFeed = useCallback(async () => {
    // Strict check to prevent double fetching
    if (isFetchingRef.current || !hasMore) return;

    try {
      setIsLoading(true);
      isFetchingRef.current = true;

      // Only send IDs present in the current Redux store to avoid duplicates in this session
      const seenUserIds = feed.map((u) => u._id);

      const res = await api.post("/feed", {
        seenUserIds,
        limit: 10, // Keep limit small for snappier feeling
      });

      const users = res?.data?.data || [];

      if (users.length === 0) {
        setHasMore(false);
      } else {
        dispatch(addFeed(users));
      }
    } catch (err) {
      console.error("Feed Error:", err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [feed, hasMore, dispatch]);

  // ✅ INITIAL LOAD
  useEffect(() => {
    // Only fetch if feed is empty and we haven't determined there is no more data
    if (feed.length === 0 && hasMore) {
      getFeed();
    }
  }, []); // Run once on mount

  // ✅ INFINITE SCROLL
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current) {
          getFeed();
        }
      },
      { threshold: 1.0 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => observerRef.current?.disconnect();
  }, [getFeed, hasMore]);

  const handleAction = async (status, userId) => {
    // Optimistic UI update: Remove immediately
    dispatch(removeUserFromFeed(userId));
    
    // Automatically fetch more if feed gets low after action
    if (feed.length <= 3 && hasMore) {
        getFeed(); 
    }

    try {
      await api.post(`/request/send/${status}/${userId}`);
    } catch (err) {
      console.error("Action Error:", err);
      // Optional: Add toast notification for error
    }
  };

  if (feed.length === 0 && isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" size={40} />
      </div>
    );
  }

  if (feed.length === 0 && !hasMore) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center text-gray-500">
        <Code2 size={48} />
        <h2 className="mt-4 text-xl font-bold">No more developers found!</h2>
        <p className="text-sm">Check back later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
    <SearchUsers />

    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 🔴 REMOVED 'layout' prop from this div below */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {feed.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onAction={handleAction}
              onClick = {()=>navigate(`/profile/view/${user._id}`)}
              /* 🟢 ADD 'layout' here if you want smooth removal animations */
              layout 
            />
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-10">
          {isLoading && <Loader2 className="animate-spin" />}
        </div>
      )}
    </div>
  </div>
  );
};

export default Feed;