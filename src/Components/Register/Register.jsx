import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { SyncLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import {
    LuUser,
    LuAtSign,
    LuMail,
    LuCalendar,
    LuLock,
    LuEye,
    LuEyeOff,
    LuUserPlus,
} from "react-icons/lu";

const inputClass =
    "w-full rounded-xl bg-gray-100 py-3.5 ps-11 pe-4 text-sm text-gray-800 outline-indigo-500 transition focus:bg-white";

const iconClass =
    "pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-lg text-gray-400";

// label + input wrapper + error message
function Field({ id, label, icon: Icon, error, children }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor={id}>
                {label}
            </label>
            <div className="relative">
                <Icon className={iconClass} />
                {children}
            </div>
            {error && <p className="mt-1.5 text-sm text-red-500">{error.message}</p>}
        </div>
    );
}

function PasswordToggle({ shown, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={shown ? "Hide password" : "Show password"}
            className="absolute end-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 transition hover:text-indigo-500"
        >
            {shown ? <LuEyeOff /> : <LuEye />}
        </button>
    );
}

function getAge(date) {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) age -= 1;
    return age;
}

const Register = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        getValues,
    } = useForm({
        defaultValues: {
            name: "",
            username: "",
            email: "",
            dateOfBirth: "",
            gender: "",
            password: "",
            rePassword: "",
        },
        mode: "onChange",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessResponse, setIsSuccessResponse] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const navigate = useNavigate();

    function signUp(values) {
        setIsLoading(true);
        setErrorMessage(null);
        setIsSuccessResponse(false);

        axios
            .post("https://route-posts.routemisr.com/users/signup", values)
            .then(function () {
                setIsSuccessResponse(true);
                setTimeout(() => {
                    setIsSuccessResponse(false);
                    navigate("/login");
                }, 1500);
            })
            .catch(function (err) {
                setErrorMessage(
                    err.response?.data?.message || "Error occurred ... try again later"
                );
            })
            .finally(function () {
                setIsLoading(false);
            });
    }

    const genderRules = { required: { value: true, message: "Gender is required" } };

    return (
        <div className="flex w-full items-center justify-center px-4 py-10">
            <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow-md sm:p-10">
                {/* heading */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <LuUserPlus className="text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                        Create your account
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Join the community and start sharing
                    </p>
                </div>

                <form onSubmit={handleSubmit(signUp)} noValidate>
                    {/* response */}
                    {isSuccessResponse && (
                        <div className="mb-5 w-full rounded-xl bg-green-500 px-4 py-3 text-center text-sm text-white">
                            <p>Account Created Successfully</p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-5 w-full rounded-xl bg-red-500 px-4 py-3 text-center text-sm text-white">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <div className="grid gap-5 sm:grid-cols-2">
                        {/* name */}
                        <Field id="name" label="Name" icon={LuUser} error={errors.name}>
                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                placeholder="Enter your name"
                                className={inputClass}
                                {...register("name", {
                                    required: { value: true, message: "Name is required" },
                                    minLength: { value: 3, message: "Min length is 3" },
                                    maxLength: { value: 20, message: "Max length is 20" },
                                })}
                            />
                        </Field>

                        {/* username */}
                        <Field id="username" label="Username" icon={LuAtSign} error={errors.username}>
                            <input
                                id="username"
                                type="text"
                                autoComplete="username"
                                placeholder="Choose a username"
                                className={inputClass}
                                {...register("username", {
                                    required: { value: true, message: "Username is required" },
                                    minLength: { value: 3, message: "Min length is 3" },
                                    maxLength: { value: 20, message: "Max length is 20" },
                                })}
                            />
                        </Field>

                        {/* email */}
                        <Field id="email" label="Email" icon={LuMail} error={errors.email}>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your email"
                                className={inputClass}
                                {...register("email", {
                                    required: { value: true, message: "Email is required" },
                                    pattern: {
                                        // eslint-disable-next-line no-useless-escape
                                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                        message: "Invalid email",
                                    },
                                })}
                            />
                        </Field>

                        {/* date of birth */}
                        <Field id="dateOfBirth" label="Date of Birth" icon={LuCalendar} error={errors.dateOfBirth}>
                            <input
                                id="dateOfBirth"
                                type="date"
                                autoComplete="bday"
                                className={inputClass}
                                {...register("dateOfBirth", {
                                    required: { value: true, message: "Date of birth is required" },
                                    valueAsDate: true,
                                    validate: (value) => {
                                        if (!value || isNaN(value)) return "Date of birth is required";
                                        return getAge(value) >= 18 || "You must be 18 or older";
                                    },
                                })}
                            />
                        </Field>

                        {/* password */}
                        <Field id="password" label="Password" icon={LuLock} error={errors.password}>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Enter your password"
                                className={`${inputClass} pe-12`}
                                {...register("password", {
                                    required: { value: true, message: "Password is required" },
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
                                        message:
                                            "At least 8 characters with uppercase, lowercase, a number and a special character",
                                    },
                                })}
                            />
                            <PasswordToggle shown={showPassword} onToggle={() => setShowPassword((v) => !v)} />
                        </Field>

                        {/* confirm password */}
                        <Field id="rePassword" label="Confirm Password" icon={LuLock} error={errors.rePassword}>
                            <input
                                id="rePassword"
                                type={showRePassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Confirm your password"
                                className={`${inputClass} pe-12`}
                                {...register("rePassword", {
                                    required: { value: true, message: "Password confirmation is required" },
                                    validate: (value) =>
                                        value === getValues("password") || "Passwords do not match",
                                })}
                            />
                            <PasswordToggle shown={showRePassword} onToggle={() => setShowRePassword((v) => !v)} />
                        </Field>

                        {/* gender */}
                        <div className="sm:col-span-2">
                            <p className="mb-2 text-sm font-medium text-gray-700">Gender</p>
                            <div className="flex gap-4">
                                {["male", "female"].map((g) => (
                                    <label
                                        key={g}
                                        htmlFor={g}
                                        className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl bg-gray-100 px-4 py-3.5 text-sm font-medium capitalize text-gray-700 transition has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-600 has-[:checked]:ring-2 has-[:checked]:ring-indigo-500"
                                    >
                                        <input
                                            id={g}
                                            type="radio"
                                            value={g}
                                            className="h-4 w-4 accent-indigo-500"
                                            {...register("gender", genderRules)}
                                        />
                                        {g}
                                    </label>
                                ))}
                            </div>
                            {errors.gender && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.gender.message}</p>
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
                        {isLoading ? <SyncLoader color="#ffffff" size={8} speedMultiplier={1} /> : "Sign up"}
                    </button>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-indigo-500 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;