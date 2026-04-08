import { useForm } from 'react-hook-form'
import axios from "axios";
import { useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

// import * as zod from 'zod' ==> zod
// import { zodResolver } from "@hookform/resolvers/zod" ==> zod

const Register = () => { //values

    // states ==> no RHF
    // const [usernameValue , setUsernameValue]=useState("menna")

    // function handleUserNameChange(e){
    //     setUsernameValue(e.target.value)
    // }

    // prevent refresh 
    // function handleSubmit(e) {
    //     e.preventDefault();
    // }

    // handling submit ==> 1 prevent default : no refresh , 
    // 2 collecting all values of feilds using register and returning them as a parameter for another function
    // 3 validation using register
    // 4 get errors using formState
    // get entier form values using getValues
    const { handleSubmit, register, formState: { errors, touchedFields }, getValues } = useForm({
        defaultValues: {
            name: "",
            username: "",
            email: "",
            dateOfBirth: "",
            gender: "",
            password: "",
            rePassword: ""
        },
        mode: "onChange",
        // resolver : zodResolver() ==>zod
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessResponse, setIsSuccessResponse] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate()

    function signUp(values) {
        setIsLoading(true);
        setErrorMessage(null);
        setIsSuccessResponse(false);

        axios.post("https://route-posts.routemisr.com/users/signup", values)
            .then(function (resp) {
                console.log('resp', resp.data)
                setIsSuccessResponse(true);
                setTimeout(() => {
                    setIsSuccessResponse(false);
                    navigate("/login")
                }, 1500);
            })
            .catch(function () {
                setErrorMessage("Error occurred ... try again later")
            })
            .finally(function () {
                setIsLoading(false)
            })
    }

    return (
        //*********************************** validation using react-hook-form only *******************************************

        <>
            <div className="max-w-4xl max-sm:max-w-lg mx-auto p-8 m-6 shadow-lg bg-white rounded-xl border">
                <div className="text-center m-12">
                    <h1 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Create Your Account</h1>
                </div>

                {/*useform connetion =>  handle submit  && get values of form feilds*/}
                <form onSubmit={handleSubmit(signUp)} >

                    {/* response  */}
                    {isSuccessResponse && <div className="block mb-5 bg-green-500 w-full mx-auto text-white text-center text-sm px-4 py-3 rounded-md ">
                        <p>Account Created Successfully</p>
                    </div>}

                    {errorMessage && <div className="block mb-5 bg-red-500 w-full mx-auto text-white text-center text-sm px-4 py-3 rounded-md ">
                        <p>{errorMessage}</p>
                    </div>}

                    <div className="grid sm:grid-cols-2 gap-8">

                        {/* name  */}
                        <div>
                            <label className="text-slate-900 text-sm font-medium mb-2 block" htmlFor="name">Name</label>
                            <input name="name" type="text" {...register("name", {
                                required: {
                                    value: true,
                                    message: "name is required"
                                },
                                minLength: {
                                    value: 3,
                                    message: "min length is 3"
                                },
                                maxLength: {
                                    value: 20,
                                    message: "max length is 20"
                                }
                            })}
                                className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                                placeholder="Enter name" />
                            {errors.name && touchedFields.name && (<p className="text-red-500 text-sm mb-2">{errors.name.message}</p>)}

                        </div>

                        {/* username  */}
                        <div>
                            <label className="text-slate-900 text-sm font-medium mb-2 block " htmlFor="username">Username</label>
                            <input name="username" type="text"  {...register("username", {
                                required: {
                                    value: true,
                                    message: "username is required"
                                },
                                minLength: {
                                    value: 3,
                                    message: "min length is 3"
                                },
                                maxLength: {
                                    value: 20,
                                    message: "max length is 20"
                                }
                            })}
                                className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                                placeholder="Enter username" />
                            {errors.username && touchedFields.username && (<p className="text-red-500 text-sm mb-2">{errors.username.message}</p>)}
                        </div>

                        {/* email  */}
                        <div>
                            <label className="text-slate-900 text-sm font-medium mb-2 block" htmlFor="email">Email </label>
                            <input name="email" type="email"  {...register("email", {
                                required: { value: true, message: "email is required" },
                                pattern: {
                                    // eslint-disable-next-line no-useless-escape
                                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message: "invalid email"
                                }
                            })}
                                className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                                placeholder="Enter email" />
                            {errors.email && touchedFields.email && (<p className="text-red-500 text-sm mb-2">{errors.email.message}</p>)}

                        </div>

                        {/* date of birth  */}
                        <div>
                            <label className="text-slate-900 text-sm font-medium mb-2 block" htmlFor="dateOfBirth">Date Of Birth</label>
                            <input name="dateOfBirth" type="date"  {...register("dateOfBirth", {
                                required: {
                                    value: true,
                                    message: "data of birth is required"
                                },
                                valueAsDate: true,
                                validate: (value) => {
                                    const currentYear = new Date().getFullYear();
                                    const userYear = value.getFullYear();
                                    if (currentYear - userYear >= 18) {
                                        return true;
                                    }
                                    return "you must be 18 or older";
                                }
                            })}
                                className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md 
                                focus:bg-transparent outline-blue-500 transition-all" />
                            {errors.dateOfBirth && touchedFields.dateOfBirth && (<p className="text-red-500 text-sm mb-2">{errors.dateOfBirth.message}</p>)}

                        </div>

                        {/* password  */}
                        <div>
                            <label className="text-slate-900 text-sm font-medium mb-2 block" htmlFor="password">Password</label>
                            <input name="password" type="password"  {...register("password", {
                                required: { value: true, message: "password is required" },
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
                                    message: "pass must start uppercase and includes numbers and special chars"
                                }
                            })}
                                className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                                placeholder="Enter password" />
                            {errors.password && touchedFields.password && (<p className="text-red-500 text-sm mb-2">{errors.password.message}</p>)}

                        </div>

                        {/* repassword  */}
                        <div>
                            <label className="text-slate-900 text-sm font-medium mb-2 block" htmlFor="repassword">Confirm Password</label>
                            <input name="rePassword" type="password" {...register("rePassword", {
                                required: {
                                    value: true,
                                    message: "password confirmation is required"
                                },
                                validate: (value) => {
                                    if (value === getValues("password")) {
                                        return true;
                                    }
                                    return "passwords do not match";
                                }
                            })}
                                className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                                placeholder="Confirm password" />
                            {errors.rePassword && touchedFields.rePassword && (<p className="text-red-500 text-sm mb-2">{errors.rePassword.message}</p>)}
                        </div>

                        {/* gender  */}
                        <div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <input name="gender" type="radio" {...register("gender", {
                                        required: { value: true, message: "gender is required" },
                                        pattern: {
                                            value: /^(male|female)$/
                                        }
                                    })}
                                        className="w-5 h-5" id="male" value="male" />
                                    <label className="text-slate-900 text-sm font-medium" htmlFor="male">Male</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input name="gender" type="radio" {...register("gender")}
                                        className="w-5 h-5" id="female" value="female" />
                                    <label className="text-slate-900 text-sm font-medium" htmlFor="female">Female</label>
                                </div>
                            </div>
                            {errors.gender && touchedFields.gender && (<p className="text-red-500 text-sm my-2 ">{errors.gender.message}</p>)}
                        </div>
                    </div>
                    {/* submit button  */}
                    <div className="mt-12">
                        <button type="submit" disabled={isLoading}
                            className="mx-auto block min-w-32 py-3 px-6 text-sm font-medium rounded-4xl text-white bg-indigo-500 hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                            {isLoading ? <SyncLoader color="#ffffff" size={8} speedMultiplier={1} /> : "Sign up"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Register
