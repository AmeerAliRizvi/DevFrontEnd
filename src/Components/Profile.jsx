import { useDispatch, useSelector } from "react-redux";
import FeedCards from "./FeedCards";
import { useState, useEffect } from "react";
import { BaseUrl } from "../Utils/constants";
import axios from "axios";
import { addUser } from "../Utils/userSlice";

const Profile = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        photoUrl: "",
        gender: "",
        About: ""
    });
    
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                age: user.age || "",
                photoUrl: user.photoUrl || "",
                gender: user.gender || "",
                About: user.About || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            const res = await axios.patch(`${BaseUrl}/profile/edit`, formData, {
                withCredentials: true
            });
            
            if (res.data?.data) {
                dispatch(addUser(res.data.data));
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } else {
                throw new Error("No user data received");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.response?.data?.error || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row justify-center items-start min-h-screen p-6 gap-8">
            {/* Edit Form */}
            <div className="w-full md:w-1/2 bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
                
                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-white">First Name</span>
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="input input-bordered w-full bg-gray-700 text-white"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-white">Last Name</span>
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="input input-bordered w-full bg-gray-700 text-white"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-white">Age</span>
                        </label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="input input-bordered w-full bg-gray-700 text-white"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-white">Photo URL</span>
                        </label>
                        <input
                            type="text"
                            name="photoUrl"
                            value={formData.photoUrl}
                            onChange={handleChange}
                            className="input input-bordered w-full bg-gray-700 text-white"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-white">Gender</span>
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="select select-bordered w-full bg-gray-700 text-white"
                        >
                            <option value="" disabled>Select your gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_say">Prefer not to say</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-white">About</span>
                        </label>
                        <textarea
                            name="About"
                            value={formData.About}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full bg-gray-700 text-white"
                            rows="3"
                            placeholder="Tell us about yourself"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>

            {/* Profile Preview */}
            <div className="w-full md:w-1/3">
                <FeedCards 
                    user={formData} 
                    showButton={false}
                />
            </div>

            {showToast && (
                <div className="toast toast-top toast-center">
                    <div className="alert alert-success">
                        <span>Profile saved successfully!</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;