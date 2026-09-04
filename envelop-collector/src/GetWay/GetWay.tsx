



// // who is the entering my site check the UserTabel Tab in the "SHEET_URL" , if exist then enter and save the seasion as "Current_Contoller"

// // input fields while login tab name : "UserTable" and in a table "UserInfo" it columns name are : Controller_Email , Password, isActive

// // best ui and ux desing and most responsive for all devices specily for small devices 

// // show a loader when login hit and checking the data to the server , 

// import { SHEET_URL } from "../lib/SheetUrl";

// // tab name : UserInfo, and in that tab a table colled : "UserInfo" and its columns are : Controller_Email , Password, isActive
// export default function GetWay() {
//     // best ui and ux desing and most responsive for all devices specily for small devices 
//     // show a loader when login hit and checking the data to the server , 

// }


import React, { useState } from "react";
import { SHEET_API_ENDPOINT } from "../lib/SheetUrl";
import { useNavigate } from "react-router-dom";


export default function GetWay() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const NaviGate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Fetching data from the specific tab "UserInfo"
      // Note: Modify the query string depending on your specific Sheet API provider (e.g., SheetDB, Stein, AppScript)
      const response = await fetch(`${SHEET_API_ENDPOINT}?sheet=UserTable`);
      
      if (!response.ok) {
        throw new Error("Failed to communicate with the server.");
      }

      const users = await response.json();

      // Find a matching record in the UserInfo table
      const foundUser = users.find(
        (user: any) =>
          user.Controller_Email === email && user.Password === password
      );

      if (foundUser) {
        // Verify if the account is active
        const isActive = String(foundUser.isActive).toLowerCase() === "true";

        if (isActive) {
          // Save session successfully
          sessionStorage.setItem("Current_Controller", JSON.stringify(foundUser));
          // alert("Access Granted. Welcome!");
          NaviGate('/dashboard')
          // window.location.href = '/dashboard'; // Redirect logic here
        } else {
          setError("This account has been deactivated.");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while verifying credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Controller Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Access the system dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-60"
              placeholder="controller@domain.com"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-60"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-500/30"
          >
            {isLoading ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Authenticating...
              </>
            ) : (
              "Secure Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}