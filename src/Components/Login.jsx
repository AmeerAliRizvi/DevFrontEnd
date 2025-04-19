import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../Utils/constants";

const Login = () => {
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await axios.post(BaseUrl + "/login", {
                emailId,
                password,
            }, {
                withCredentials: true,
            });
            
            if (res.data?.data) {
                dispatch(addUser(res.data.data));
                navigate("/");
            } else {
                throw new Error("No user data received");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.error || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await axios.post(BaseUrl + "/signup", {
                firstName,
                lastName,
                age,
                gender,
                emailId,
                password,
            }, {
                withCredentials: true,
            });

            if (res.data?.data) {
                dispatch(addUser(res.data.data));
                navigate("/profile");
            } else {
                throw new Error("No user data received");
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError(err.response?.data?.error || "Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center my-10 p-10">  
            <div className="card card-border bg-base-100 w-96 shadow-2xl">
                <div className="card-body">
                    <h2 className="card-title mb-3">{isLoginForm ? "Login" : "SignUp"}</h2>
                    {isLoginForm && <h4 className="mb-10">Welcome back you've been missed!!</h4>}
                    
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        {!isLoginForm && (
                            <>
                                <label className="fieldset-label my-1">First Name</label>
                                <input 
                                    type="text" 
                                    value={firstName} 
                                    onChange={(e) => setFirstName(e.target.value)} 
                                    className="input" 
                                    placeholder="Your first name" 
                                    required
                                />

                                <label className="fieldset-label my-1">Last Name</label>
                                <input 
                                    type="text" 
                                    value={lastName} 
                                    onChange={(e) => setLastName(e.target.value)} 
                                    className="input" 
                                    placeholder="Your last name" 
                                    required
                                />
                            </>
                        )}

                        <label className="fieldset-label mb-1">Email Id</label>
                        <input 
                            type="email" 
                            value={emailId} 
                            placeholder="example@gmail.com" 
                            onChange={(e) => setEmailId(e.target.value)} 
                            className="input" 
                            required
                        />

                        <label className="fieldset-label mb-1">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            placeholder="Password" 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="input" 
                            required
                            minLength="8"
                        />
                    </div>

                    {!isLoginForm && (
                        <> 
                            <label className="fieldset-label">Age</label>
                            <input 
                                type="number" 
                                value={age} 
                                onChange={(e) => setAge(e.target.value)} 
                                className="input" 
                                placeholder="Your current age" 
                            />
                            
                            <label className="fieldset-label mb-1">Gender</label>
                            <select 
                                value={gender} 
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full px-3 py-2 bg-base-300 text-white rounded-lg"
                            >
                                <option value="" disabled>Select your gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_say">Prefer not to say</option>
                            </select>
                        </>
                    )}

                    <div className="flex items-end gap-9 textarea-md my-6">
                        <p 
                            onClick={() => setIsLoginForm((value) => !value)} 
                            className="cursor-pointer hover:underline"
                        >
                            {isLoginForm ? "New User? Sign up" : "Existing user? Log In"}
                        </p>
                        {isLoginForm && <p className="cursor-pointer hover:underline">Forgot your password?</p>}
                    </div>
                    
                    <button 
                        className={`btn mr-3 bg-purple-500 rounded-l ${isLoading ? 'opacity-50' : ''}`} 
                        onClick={isLoginForm ? handleLogin : handleSignUp}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : isLoginForm ? "Login" : "Sign up"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;