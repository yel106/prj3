import React from "react";
import "./hohome.css";
import { backgroundColor } from "@chakra-ui/react";

export function BoardHome() {
  return (
    <>
      <div className="a">
        <form className="b" backgroundColor="red">
          <img
            className="h-14 mb-4 mx-auto"
            src="https://cdn.pixabay.com/photo/2015/09/04/22/52/turntable-922903_640.jpg"
            alt=""
          />
          <div className="space-y-4">
            <h1 className="text-center text-2xl font-semibold text-gray-600">
              Register
            </h1>
            <div>
              <label
                htmlFor="username"
                className="block mb-1 text-gray-600 font-semibold"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-gray-600 font-semibold"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-gray-600 font-semibold"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
              />
            </div>
            <button className="mt-4 w-full bg-yellow-500 font-semibold py-2 rounded-md tracking-wide">
              Register
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
