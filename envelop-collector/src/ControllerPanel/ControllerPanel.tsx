

// // // side nave bar with option : HandOver, Collect , OverAll Status

// // // left side aside nav bar and the right side the main content area , and aslo for the dynamic page or component
// // import { SHEET_URL } from "../lib/SheetUrl";

// // // tab name : Non-Stage, and in that tab a table colled : "NonStageProgrammes" and its columns are : CODE	PROGRAM	CATEGORY	JUDGE	HandOver	Receiver	IsSummitted	IsRecivied	IsUploaded

// // export default function ControllerPanel (){
// //     // get the "Current_Contoller" user name from the seasion and disyplay
// //     // by default content page  style : three box , Numbers_HandOvered, Number_NotDelivered, Number_of Recivings , 

// //     // just below table will shown all the data in the tab "Non-Stage" and columns are :
// //     //"CODE, PROGRAM,CATEGORY, JUDGE, HandOver, Receiver, IsSummitted, IsRecivied,IsUploaded "

// //     // we can filte the tabel "NonStageProgrammes" in tab  "Non-Stage"
// // }


// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { SHEET_API_ENDPOINT } from "../lib/SheetUrl";

// interface Programme {
//   CODE: string;
//   PROGRAM: string;
//   CATEGORY: string;
//   JUDGE: string;
//   HandOver: string;
//   Receiver: string;
//   IsSummitted: string | boolean;
//   IsRecivied: string | boolean;
//   IsUploaded: string | boolean;
// }

// export default function ControllerPanel() {
//   const location = useLocation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // Session & Data State
//   const [controller, setController] = useState<any>(null);
//   const [programmes, setProgrammes] = useState<Programme[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   // Filter States
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selCategory, setSelCategory] = useState("");
//   const [selHandover, setSelHandover] = useState("");
//   const [selReceiver, setSelReceiver] = useState("");
//   const [selStatus, setSelStatus] = useState("");

//   useEffect(() => {
//     const sessionData = sessionStorage.getItem("Current_Controller");
//     if (sessionData) setController(JSON.parse(sessionData));

//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`${SHEET_API_ENDPOINT}?sheet=Non-Stage`);
//         if (!response.ok) throw new Error("Failed to fetch data.");
        
//         const data = await response.json();
//         setProgrammes(data);
//       } catch (err: any) {
//         setError(err.message || "An error occurred while fetching data.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Extract Unique Values for Dropdowns
//   const uniqueCategories = Array.from(new Set(programmes.map(p => p.CATEGORY).filter(Boolean)));
//   const uniqueHandovers = Array.from(new Set(programmes.map(p => p.HandOver).filter(Boolean)));
//   const uniqueReceivers = Array.from(new Set(programmes.map(p => p.Receiver).filter(Boolean)));

//   // Filter Logic
//   const filteredProgrammes = programmes.filter((prog) => {
//     // 1. Text Search
//     const searchLower = searchQuery.toLowerCase();
//     const matchesSearch = 
//       String(prog.CODE).toLowerCase().includes(searchLower) ||
//       String(prog.PROGRAM).toLowerCase().includes(searchLower) ||
//       String(prog.CATEGORY).toLowerCase().includes(searchLower) ||
//       String(prog.JUDGE).toLowerCase().includes(searchLower);

//     // 2. Dropdown Filters
//     const matchesCategory = selCategory ? prog.CATEGORY === selCategory : true;
//     const matchesHandover = selHandover ? prog.HandOver === selHandover : true;
//     const matchesReceiver = selReceiver ? prog.Receiver === selReceiver : true;

//     // 3. Status Filter
//     let matchesStatus = true;
//     if (selStatus === "Submitted") matchesStatus = String(prog.IsSummitted).toLowerCase() === "true";
//     else if (selStatus === "Received") matchesStatus = String(prog.IsRecivied).toLowerCase() === "true";
//     else if (selStatus === "Uploaded") matchesStatus = String(prog.IsUploaded).toLowerCase() === "true";

//     return matchesSearch && matchesCategory && matchesHandover && matchesReceiver && matchesStatus;
//   });

//   // Calculate Statistics
//   const stats = programmes.reduce(
//     (acc, p) => {
//       if (String(p.IsSummitted).toLowerCase() === "true") acc.handedOver++;
//       if (String(p.IsRecivied).toLowerCase() === "true") acc.received++;
//       return acc;
//     },
//     { handedOver: 0, received: 0 }
//   );
//   const notDelivered = programmes.length - stats.handedOver;

//   // Navigation Setup
//   const navItems = [
//     { name: "OverAll Status", path: "/dashboard" },
//     { name: "HandOver", path: "/handover" },
//     { name: "Collect / Receive", path: "/recevier" },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
//       {/* Mobile Sidebar Overlay */}
//       {isSidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 md:hidden transition-opacity"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar Navigation */}
//       <aside 
//         className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex items-center justify-center h-16 border-b border-slate-700">
//           <h1 className="text-xl font-bold tracking-wider text-blue-400">CONTROL PANEL</h1>
//         </div>
        
//         <div className="p-4">
//           <div className="mb-6 px-4 py-3 bg-slate-800 rounded-lg">
//             <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Logged in as</p>
//             <p className="text-sm font-medium truncate text-white">
//               {controller?.Controller_Email || "Guest User"}
//             </p>
//           </div>

//           <nav className="space-y-2">
//             {navItems.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   onClick={() => setIsSidebarOpen(false)}
//                   className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
//                     isActive 
//                       ? "bg-blue-600 text-white" 
//                       : "text-slate-300 hover:bg-slate-800 hover:text-white"
//                   }`}
//                 >
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 flex flex-col overflow-hidden w-full">
        
//         {/* Mobile Header */}
//         <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
//           <h1 className="text-lg font-bold text-gray-800 truncate">
//             {navItems.find((n) => n.path === location.pathname)?.name || "Dashboard"}
//           </h1>
//           <button 
//             onClick={() => setIsSidebarOpen(true)}
//             className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//         </header>

//         {/* Dynamic Content Body */}
//         <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
//           <div className="hidden md:flex justify-between items-center mb-8">
//             <h2 className="text-2xl font-bold text-gray-800">
//               {navItems.find((n) => n.path === location.pathname)?.name || "Dashboard"}
//             </h2>
//           </div>

//           {location.pathname === "/dashboard" ? (
//             <div className="space-y-6">
              
//               {/* Summary Cards */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                   <p className="text-sm font-medium text-gray-500">HandOvered</p>
//                   <p className="text-3xl font-bold text-blue-600 mt-2">{stats.handedOver}</p>
//                 </div>
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                   <p className="text-sm font-medium text-gray-500">Not Delivered</p>
//                   <p className="text-3xl font-bold text-red-500 mt-2">{notDelivered}</p>
//                 </div>
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                   <p className="text-sm font-medium text-gray-500">Received</p>
//                   <p className="text-3xl font-bold text-green-600 mt-2">{stats.received}</p>
//                 </div>
//               </div>

//               {/* Data Table Section */}
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
//                 {/* Filters Area */}
//                 <div className="p-4 border-b border-gray-100 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                   {/* Search */}
//                   <div className="relative lg:col-span-1">
//                     <input
//                       type="text"
//                       placeholder="Search..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
//                     />
//                     <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                     </svg>
//                   </div>

//                   {/* Category Filter */}
//                   <select
//                     value={selCategory}
//                     onChange={(e) => setSelCategory(e.target.value)}
//                     className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
//                   >
//                     <option value="">All Categories</option>
//                     {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//                   </select>

//                   {/* HandOver Filter */}
//                   <select
//                     value={selHandover}
//                     onChange={(e) => setSelHandover(e.target.value)}
//                     className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
//                   >
//                     <option value="">All HandOvers</option>
//                     {uniqueHandovers.map(ho => <option key={ho} value={ho}>{ho}</option>)}
//                   </select>

//                   {/* Receiver Filter */}
//                   <select
//                     value={selReceiver}
//                     onChange={(e) => setSelReceiver(e.target.value)}
//                     className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
//                   >
//                     <option value="">All Receivers</option>
//                     {uniqueReceivers.map(rec => <option key={rec} value={rec}>{rec}</option>)}
//                   </select>

//                   {/* Status Filter */}
//                   <select
//                     value={selStatus}
//                     onChange={(e) => setSelStatus(e.target.value)}
//                     className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
//                   >
//                     <option value="">All Statuses</option>
//                     <option value="Submitted">Is Submitted</option>
//                     <option value="Received">Is Received</option>
//                     <option value="Uploaded">Is Uploaded</option>
//                   </select>
//                 </div>

//                 {/* Table */}
//                 <div className="overflow-x-auto">
//                   {isLoading ? (
//                     <div className="flex justify-center items-center py-12">
//                       <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                     </div>
//                   ) : error ? (
//                     <div className="py-8 text-center text-red-500 text-sm">{error}</div>
//                   ) : filteredProgrammes.length === 0 ? (
//                     <div className="py-8 text-center text-gray-500 text-sm">No records match your filters.</div>
//                   ) : (
//                     <table className="w-full whitespace-nowrap text-sm text-left">
//                       <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-xs border-b border-gray-200">
//                         <tr>
//                           <th className="px-6 py-4">CODE</th>
//                           <th className="px-6 py-4">PROGRAM</th>
//                           <th className="px-6 py-4">CATEGORY</th>
//                           <th className="px-6 py-4">JUDGE</th>
//                           <th className="px-6 py-4">HandOver</th>
//                           <th className="px-6 py-4">Receiver</th>
//                           <th className="px-6 py-4 text-center">IsSubmitted</th>
//                           <th className="px-6 py-4 text-center">IsReceived</th>
//                           <th className="px-6 py-4 text-center">IsUploaded</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-100">
//                         {filteredProgrammes.map((prog, idx) => (
//                           <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
//                             <td className="px-6 py-3 font-medium text-gray-900">{prog.CODE}</td>
//                             <td className="px-6 py-3 text-gray-700">{prog.PROGRAM}</td>
//                             <td className="px-6 py-3 text-gray-700">{prog.CATEGORY}</td>
//                             <td className="px-6 py-3 text-gray-700">{prog.JUDGE}</td>
//                             <td className="px-6 py-3 text-gray-700">{prog.HandOver || "-"}</td>
//                             <td className="px-6 py-3 text-gray-700">{prog.Receiver || "-"}</td>
                            
//                             <td className="px-6 py-3 text-center">
//                               <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${String(prog.IsSummitted).toLowerCase() === 'true' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
//                                 {String(prog.IsSummitted)}
//                               </span>
//                             </td>
//                             <td className="px-6 py-3 text-center">
//                               <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${String(prog.IsRecivied).toLowerCase() === 'true' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
//                                 {String(prog.IsRecivied)}
//                               </span>
//                             </td>
//                             <td className="px-6 py-3 text-center">
//                               <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${String(prog.IsUploaded).toLowerCase() === 'true' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
//                                 {String(prog.IsUploaded)}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl shadow-sm border border-gray-100 h-96">
//               <h3 className="text-xl font-bold text-gray-700 mb-2">View not found or routed separately</h3>
//               <p className="text-gray-500">The router handles this path externally or it is under construction.</p>
//             </div>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// }



import  { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { SHEET_API_ENDPOINT } from "../lib/SheetUrl";

interface Programme {
  CODE: string;
  PROGRAM: string;
  CATEGORY: string;
  JUDGE: string;
  HandOver: string;
  Receiver: string;
  IsSummitted: string | boolean;
  IsRecivied: string | boolean;
  IsUploaded: string | boolean;
}

export default function ControllerPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [controller, setController] = useState<any>(null);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selCategory, setSelCategory] = useState("");
  const [selHandover, setSelHandover] = useState("");
  const [selReceiver, setSelReceiver] = useState("");
  const [selStatus, setSelStatus] = useState("");
  const [selJudge, setSelJudge] = useState(""); // NEW: Judge Filter

  useEffect(() => {
    const sessionData = sessionStorage.getItem("Current_Controller");
    if (sessionData) {
      setController(JSON.parse(sessionData));
    } else {
      navigate("/");
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${SHEET_API_ENDPOINT}?sheet=Non-Stage`);
        const data = await response.json();
        setProgrammes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("Current_Controller");
    navigate("/");
  };

  const uniqueCategories = Array.from(new Set(programmes.map(p => p.CATEGORY).filter(Boolean)));
  const uniqueHandovers = Array.from(new Set(programmes.map(p => p.HandOver).filter(Boolean)));
  const uniqueReceivers = Array.from(new Set(programmes.map(p => p.Receiver).filter(Boolean)));
  const uniqueJudges = Array.from(new Set(programmes.map(p => p.JUDGE).filter(Boolean))); // NEW

  const filteredProgrammes = programmes.filter((prog) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      String(prog.CODE).toLowerCase().includes(searchLower) ||
      String(prog.PROGRAM).toLowerCase().includes(searchLower);

    const matchesCategory = selCategory ? prog.CATEGORY === selCategory : true;
    const matchesHandover = selHandover ? prog.HandOver === selHandover : true;
    const matchesReceiver = selReceiver ? prog.Receiver === selReceiver : true;
    const matchesJudge = selJudge ? prog.JUDGE === selJudge : true; // NEW

    let matchesStatus = true;
    if (selStatus === "Submitted") matchesStatus = String(prog.IsSummitted).toLowerCase() === "true";
    else if (selStatus === "Received") matchesStatus = String(prog.IsRecivied).toLowerCase() === "true";
    else if (selStatus === "Uploaded") matchesStatus = String(prog.IsUploaded).toLowerCase() === "true";

    return matchesSearch && matchesCategory && matchesHandover && matchesReceiver && matchesJudge && matchesStatus;
  });

  const stats = programmes.reduce(
    (acc, p) => {
      if (String(p.IsSummitted).toLowerCase() === "true") acc.handedOver++;
      if (String(p.IsRecivied).toLowerCase() === "true") acc.received++;
      return acc;
    },
    { handedOver: 0, received: 0 }
  );

  const navItems = [
    { name: "OverAll Status", path: "/dashboard" },
    { name: "HandOver", path: "/handover" },
    { name: "Collect / Receive", path: "/recevier" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-center h-16 border-b border-slate-700">
          <h1 className="text-xl font-bold text-blue-400">CONTROL PANEL</h1>
        </div>
        
        <div className="p-4 flex-1">
          <div className="mb-6 px-4 py-3 bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Logged in as</p>
            <p className="text-sm font-medium truncate text-white">{controller?.Controller_Email || "Guest User"}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  location.pathname === item.path ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-800 truncate">
            {navItems.find((n) => n.path === location.pathname)?.name || "Dashboard"}
          </h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-100 rounded-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {location.pathname === "/dashboard" ? (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">HandOvered</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.handedOver}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Not Delivered</p>
                  <p className="text-3xl font-bold text-red-500 mt-2">{programmes.length - stats.handedOver}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Received</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.received}</p>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 text-sm" />
                  
                  <select value={selCategory} onChange={(e) => setSelCategory(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white">
                    <option value="">All Categories</option>
                    {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  
                  <select value={selJudge} onChange={(e) => setSelJudge(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white">
                    <option value="">All Judges</option>
                    {uniqueJudges.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>

                  <select value={selHandover} onChange={(e) => setSelHandover(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white">
                    <option value="">All HandOvers</option>
                    {uniqueHandovers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>

                  <select value={selReceiver} onChange={(e) => setSelReceiver(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white">
                    <option value="">All Receivers</option>
                    {uniqueReceivers.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>

                  <select value={selStatus} onChange={(e) => setSelStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white">
                    <option value="">All Statuses</option>
                    <option value="Submitted">Is Submitted</option>
                    <option value="Received">Is Received</option>
                    <option value="Uploaded">Is Uploaded</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  {isLoading ? (
                     <div className="text-center py-10 text-gray-500">Loading data...</div>
                  ) : (
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4">CODE</th>
                          <th className="px-6 py-4">PROGRAM</th>
                          <th className="px-6 py-4">JUDGE</th>
                          <th className="px-6 py-4">HandOver</th>
                          <th className="px-6 py-4">Receiver</th>
                          <th className="px-6 py-4 text-center">IsSubmitted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProgrammes.map((prog, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/50">
                            <td className="px-6 py-3 font-medium">{prog.CODE}</td>
                            <td className="px-6 py-3">{prog.PROGRAM}</td>
                            <td className="px-6 py-3">{prog.JUDGE}</td>
                            <td className="px-6 py-3">{prog.HandOver || "-"}</td>
                            <td className="px-6 py-3">{prog.Receiver || "-"}</td>
                            <td className="px-6 py-3 text-center">{String(prog.IsSummitted)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Render Sub-components like HandOver and Receiver inside the Outlet */
            <Outlet />
          )}

        </div>
      </main>
    </div>
  );
}