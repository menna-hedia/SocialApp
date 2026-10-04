import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext, useState } from "react";
import { SyncLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { LuMail, LuLock, LuEye, LuEyeOff, LuLogIn } from "react-icons/lu";
import { authContext } from "../../context/AuthContext";

const inputClass =
    "w-full rounded-xl bg-gray-100 py-3.5 ps-11 pe-4 text-sm text-gray-800 outline-indigo-500 transition focus:bg-white";

const Login = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
        defaultValues: { email: "", password: "" },
        mode: "onChange",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessResponse, setIsSuccessResponse] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { setAuthenticatedUserToken } = useContext(authContext);

    function signIn(values) {
        setIsLoading(true);
        setErrorMessage(null);
        setIsSuccessResponse(false);

        axios
            .post("https://route-posts.routemisr.com/users/signin", values)
            .then(function (resp) {
                setAuthenticatedUserToken(resp.data.data.token);
                localStorage.setItem("token", resp.data.data.token);
                setIsSuccessResponse(true);
                setTimeout(() => {
                    setIsSuccessResponse(false);
                    navigate("/home");
                }, 1500);
            })
            .catch(function () {
                setErrorMessage("Invalid Email or Password");
            })
            .finally(function () {
                setIsLoading(false);
            });
    }

    return (
        <div className="flex min-h-[60vh] w-full items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-md sm:p-10">
                {/* heading */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <LuLogIn className="text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to your account to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit(signIn)} noValidate>
                    {/* response */}
                    {isSuccessResponse && (
                        <div className="mb-5 w-full rounded-xl bg-green-500 px-4 py-3 text-center text-sm text-white">
                            <p>Login Successful</p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-5 w-full rounded-xl bg-red-500 px-4 py-3 text-center text-sm text-white">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="email">
                                Email
                            </label>
                            <div className="relative">
                                <LuMail className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="Enter your email"
                                    className={inputClass}
                                    {...register("email", {
                                        required: { value: true, message: "Email is required" },
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <LuLock className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className={`${inputClass} pe-12`}
                                    {...register("password", {
                                        required: { value: true, message: "Password is required" },
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute end-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 transition hover:text-indigo-500"
                                >
                                    {showPassword ? <LuEyeOff /> : <LuEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    {/* submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`mt-8 flex w-full items-center justify-center rounded-4xl bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 ${
                            isLoading ? "cursor-not-allowed opacity-70" : ""
                        }`}
                    >
                        {isLoading ? <SyncLoader color="#ffffff" size={8} speedMultiplier={1} /> : "Sign in"}
                    </button>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-indigo-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;