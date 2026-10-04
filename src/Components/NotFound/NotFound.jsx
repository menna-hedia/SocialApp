import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuHouse, LuArrowLeft } from "react-icons/lu";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center rounded-xl bg-white px-6 py-16 shadow-md">
      <div className="text-center">
        <p className="text-8xl font-extrabold tracking-tight text-indigo-500 sm:text-9xl">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-800 sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base text-gray-500 sm:text-lg">
          Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 rounded-4xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400"
          >
            <LuHouse className="text-lg" />
            Go back home
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-4xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            <LuArrowLeft className="text-lg" />
            Previous page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;