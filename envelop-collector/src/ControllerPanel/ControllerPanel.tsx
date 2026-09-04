

// // side nave bar with option : HandOver, Collect , OverAll Status

// // left side aside nav bar and the right side the main content area , and aslo for the dynamic page or component
// import { SHEET_URL } from "../lib/SheetUrl";

// // tab name : Non-Stage, and in that tab a table colled : "NonStageProgrammes" and its columns are : CODE	PROGRAM	CATEGORY	JUDGE	HandOver	Receiver	IsSummitted	IsRecivied	IsUploaded

// export default function ControllerPanel (){
//     // get the "Current_Contoller" user name from the seasion and disyplay
//     // by default content page  style : three box , Numbers_HandOvered, Number_NotDelivered, Number_of Recivings , 

//     // just below table will shown all the data in the tab "Non-Stage" and columns are :
//     //"CODE, PROGRAM,CATEGORY, JUDGE, HandOver, Receiver, IsSummitted, IsRecivied,IsUploaded "

//     // we can filte the tabel "NonStageProgrammes" in tab  "Non-Stage"
// }



import React, { useState, useEffect } from "react";
import { SHEET_URL } from "../lib/SheetUrl";

// Type definition for the Non-Stage Programme data
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
  // Navigation State
  const [activeTab, setActiveTab] = useState("OverAll Status");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Session & Data State
  const [controller, setController] = useState<any>(null);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Retrieve Session & Fetch Data
  useEffect(() => {
    // 1. Get current controller from session
    const sessionData = sessionStorage.getItem("Current_Controller");
    if (sessionData) {
      setController(JSON.parse(sessionData));
    } else {
      // Handle missing session (e.g., redirect to login)
      // window.location.href = '/login';
    }

    // 2. Fetch data from Sheet URL
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Adjust the query parameter based on your specific Sheet API
        const response = await fetch(`${SHEET_URL}?sheet=Non-Stage`);
        
        if (!response.ok) throw new Error("Failed to fetch data.");
        
        const data = await response.json();
        setProgrammes(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredProgrammes = programmes.filter((prog) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      String(prog.CODE).toLowerCase().includes(searchLower) ||
      String(prog.PROGRAM).toLowerCase().includes(searchLower) ||
      String(prog.CATEGORY).toLowerCase().includes(searchLower) ||
      String(prog.JUDGE).toLowerCase().includes(searchLower)
    );
  });

  // Calculate Statistics safely
  const calculateStats = () => {
    let handedOver = 0;
    let received = 0;

    programmes.forEach((p) => {
      const isSub = String(p.IsSummitted).toLowerCase() === "true";
      const isRec = String(p.IsRecivied).toLowerCase() === "true";
      
      if (isSub) handedOver++;
      if (isRec) received++;
    });

    const notDelivered = programmes.length - handedOver;

    return {
      Numbers_HandOvered: handedOver,
      Number_NotDelivered: notDelivered,
      Number_of_Recivings: received,
    };
  };

  const stats = calculateStats();

  // Navigation Items
  const navItems = ["OverAll Status", "HandOver", "Collect"];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">CONTROL PANEL</h1>
        </div>
        
        <div className="p-4">
          <div className="mb-6 px-4 py-3 bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Logged in as</p>
            <p className="text-sm font-medium truncate text-white">
              {controller?.Controller_Email || "Guest User"}
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveTab(item);
                  setIsSidebarOpen(false); // Close mobile menu on click
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  activeTab === item 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-800 truncate">
            {activeTab}
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        {/* Dynamic Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* Page Title (Desktop) */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{activeTab}</h2>
          </div>

          {activeTab === "OverAll Status" ? (
            <div className="space-y-6">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center sm:items-start">
                  <p className="text-sm font-medium text-gray-500">HandOvered</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.Numbers_HandOvered}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center sm:items-start">
                  <p className="text-sm font-medium text-gray-500">Not Delivered</p>
                  <p className="text-3xl font-bold text-red-500 mt-2">{stats.Number_NotDelivered}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center sm:items-start">
                  <p className="text-sm font-medium text-gray-500">Received</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.Number_of_Recivings}</p>
                </div>
              </div>

              {/* Data Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="relative max-w-md">
                    <input
                      type="text"
                      placeholder="Search by Code, Program, Category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-shadow"
                    />
                    <svg 
                      className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : error ? (
                    <div className="py-8 text-center text-red-500 text-sm">{error}</div>
                  ) : filteredProgrammes.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-sm">No records found matching your search.</div>
                  ) : (
                    <table className="w-full whitespace-nowrap text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-xs border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4">CODE</th>
                          <th className="px-6 py-4">PROGRAM</th>
                          <th className="px-6 py-4">CATEGORY</th>
                          <th className="px-6 py-4">JUDGE</th>
                          <th className="px-6 py-4">HandOver</th>
                          <th className="px-6 py-4">Receiver</th>
                          <th className="px-6 py-4 text-center">IsSubmitted</th>
                          <th className="px-6 py-4 text-center">IsReceived</th>
                          <th className="px-6 py-4 text-center">IsUploaded</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProgrammes.map((prog, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-6 py-3 font-medium text-gray-900">{prog.CODE}</td>
                            <td className="px-6 py-3 text-gray-700">{prog.PROGRAM}</td>
                            <td className="px-6 py-3 text-gray-700">{prog.CATEGORY}</td>
                            <td className="px-6 py-3 text-gray-700">{prog.JUDGE}</td>
                            <td className="px-6 py-3 text-gray-700">{prog.HandOver}</td>
                            <td className="px-6 py-3 text-gray-700">{prog.Receiver}</td>
                            
                            {/* Boolean/Status Indicators */}
                            <td className="px-6 py-3 text-center">
                              <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${String(prog.IsSummitted).toLowerCase() === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {String(prog.IsSummitted)}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${String(prog.IsRecivied).toLowerCase() === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {String(prog.IsRecivied)}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${String(prog.IsUploaded).toLowerCase() === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {String(prog.IsUploaded)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          ) : (
            
            // Placeholder for other tabs
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl shadow-sm border border-gray-100 h-96">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Module Under Construction</h3>
              <p className="text-gray-500 max-w-sm">The {activeTab} view is currently being integrated. Please check back later.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}