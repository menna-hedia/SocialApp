import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";

export default function ChangePassword({ onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        {
          password: data.password,
          newPassword: data.newPassword,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
    },
    onSuccess: (res) => {
      console.log("change-password response:", res.data);

      // خزّن التوكن الجديد بس لو موجود (مكانه ممكن يكون res.data.token أو res.data.data.token)
      const newToken = res.data?.token || res.data?.data?.token;

      if (newToken) {
        localStorage.setItem("token", newToken);

        toast.success("Password changed successfully", {
          position: "top-right",
          autoClose: 1000,
        });

        onClose();
      } else {
        // الـ API مرجعش توكن جديد: التوكن القديم غالبًا اتلغى، فنطلّع المستخدم يسجّل دخول تاني
        toast.success("Password changed. Please login again.", {
          position: "top-right",
          autoClose: 1500,
        });

        localStorage.removeItem("token");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error changing password", {
        position: "top-right",
        autoClose: 1000,
      });
    },
  });

  function onSubmit(data) {
    mutate(data);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-lg"
        >
          ×
        </button>

        <h3 className="text-lg font-bold mb-4">Change Password</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Current Password */}
          <div>
            <label htmlFor="password" className="text-sm font-medium mb-2 block">
              Current Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Current password is required",
              })}
              className="bg-slate-100 w-full px-4 py-3 rounded-md outline-indigo-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="mt-3">
            <label htmlFor="newPassword" className="text-sm font-medium mb-2 block">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
                  message:
                    "Must be 8+ chars with uppercase, lowercase, number & special char",
                },
              })}
              className="bg-slate-100 w-full px-4 py-3 rounded-md outline-indigo-500"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mb-2">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mt-3">
            <label htmlFor="confirmPassword" className="text-sm font-medium mb-2 block">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: "Confirm your password",
                deps: ["newPassword"],
                validate: (value) =>
                  value === getValues("newPassword") || "Passwords do not match",
              })}
              className="bg-slate-100 w-full px-4 py-3 rounded-md outline-indigo-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-5 mx-auto flex min-w-32 justify-center py-3 px-6 text-sm font-medium rounded-4xl text-white bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60"
          >
            {isPending ? <SyncLoader color="#fff" size={5} /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}