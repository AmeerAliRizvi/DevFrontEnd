import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addUser } from "../Utils/userSlice";
import api from "../utils/axiosClient";
import Header from "./Header";
import { motion } from "framer-motion";
import MergeGraphicSection from "./MergeGraphicSection";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

function Particles() {
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 500; i++) {
      arr.push((Math.random() - 0.5) * 10);
      arr.push((Math.random() - 0.5) * 10);
      arr.push((Math.random() - 0.5) * 10);
    }
    return new Float32Array(arr);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#4ade80" size={0.03} />
    </points>
  );
}

export default function LandingPage() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // If user already in redux, go to feed
    if (user?._id) {
      navigate("/feed");
      return;
    }

    // Try restoring session if cookies are valid
    const checkSession = async () => {
      try {
        const res = await api.get("/me");
        dispatch(addUser(res.data.data));
        navigate("/feed");
      } catch (err) {
        // Not logged in, stay on landing
        console.log("No active session");
      }
    };
    checkSession();
  }, [user]);

  return (
    <div className="bg-gray-950 text-white">
      <Header />
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight />
            <Particles />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>

        <motion.div
          className="z-10 text-center px-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-extrabold leading-tight bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Build Your Dream Hackathon Team
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Connect, collaborate, and conquer hackathons with the perfect teammates.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(34,197,94,0.8)" }}
            className="mt-8 px-6 py-3 bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            <Link to="/login">Get Started</Link>
          </motion.button>
        </motion.div>
      </section>

      <MergeGraphicSection />

      {/* Other sections same as before */}
    </div>
  );
}
