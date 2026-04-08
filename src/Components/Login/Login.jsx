import { useForm } from 'react-hook-form'
import axios from "axios";
import { useContext, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../context/AuthContext';

const Login = () => { //values

    const { handleSubmit, register, formState: { errors, touchedFields }} = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "onChange",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessResponse, setIsSuccessResponse] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate()

    const { setAuthenticatedUserToken } = useContext(authContext)

    function signIn(values) {
        setIsLoading(true);
        setErrorMessage(null);
        setIsSuccessResponse(false);

        axios.post("https://route-posts.routemisr.com/users/signin", values)
            .then(function (resp) {
                setAuthenticatedUserToken(resp.data.data.token);
                localStorage.setItem("token", resp.data.data.token)
                setIsSuccessResponse(true);
                setTimeout(() => {
                    setIsSuccessResponse(false);
                    navigate("/home")
                }, 1500);
            })
            .catch(function () {
                setErrorMessage("Invalid Email or Password")
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
                    <h1 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Sign In Into Your Account</h1>
                </div>

                {/*useform connetion =>  handle submit  && get values of form feilds*/}
                <form onSubmit={handleSubmit(signIn)} >

                    {/* response  */}
                    {isSuccessResponse && <div className="block mb-5 bg-green-500 w-full mx-auto text-white text-center text-sm px-4 py-3 rounded-md ">
                        <p>Login Successful</p>
                    </div>}

                    {errorMessage && <div className="block mb-5 bg-red-500 w-full mx-auto text-white text-center text-sm px-4 py-3 rounded-md ">
                        <p>{errorMessage}</p>
                    </div>}

                    <div className="grid sm:grid-cols-2 gap-8">

                        {/* email  */}
                        <div>
                            <label className="text-slate-900 text-sm font-medium mb-2 block" htmlFor="email">Email </label>
                            <input name="email" type="email"  {...register("email", {
                                required: { value: true, message: "email is required" },
                            })}
                                className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                                placeholder="Enter email" />
                            {errors.email && touchedFields.email && (<p className="text-red-500 text-sm mb-2">{errors.email.message}</p>)}

                        </div>

                        {/* password  */}
                        <div>
                            <label className="text-slate-900 text-sm font-medium mb-2 block" htmlFor="password">Password</label>
                            <input name="password" type="password"  {...register("password", {
                                required: { value: true, message: "password is required" },
                            })}
                                className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                                placeholder="Enter password" />
                            {errors.password && touchedFields.password && (<p className="text-red-500 text-sm mb-2">{errors.password.message}</p>)}

                        </div>

                    </div>
                    {/* submit button  */}
                    <div className="mt-12">
                        <button type="submit" disabled={isLoading}
                            className="mx-auto block min-w-32 py-3 px-6 text-sm font-medium rounded-4xl text-white bg-indigo-500 hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                            {isLoading ? <SyncLoader color="#ffffff" size={8} speedMultiplier={1}/> : "Sign in"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login
