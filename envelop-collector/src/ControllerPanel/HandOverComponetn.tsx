import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SHEET_API_ENDPOINT } from "../lib/SheetUrl";

interface Programme {
  CODE: string;
  PROGRAM: string;
  CATEGORY: string;
  JUDGE: string;
  IsSummitted: string | boolean;
}

export default function HandOverComponent() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [controllerEmail, setControllerEmail] = useState("");
  
  const [selJudge, setSelJudge] = useState(""); // Judge Filter

  useEffect(() => {
    const session = sessionStorage.getItem("Current_Controller");
    if (session) setControllerEmail(JSON.parse(session).Controller_Email);

    const fetchData = async () => {
      try {
        const res = await fetch(`${SHEET_API_ENDPOINT}?sheet=Non-Stage`);
        const data = await res.json();
        const pending = data.filter((p: Programme) => String(p.IsSummitted).toLowerCase() !== "true");
        setProgrammes(pending);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHandOver = async (code: string) => {
    setActionLoading(code);
    try {
      await fetch(`${SHEET_API_ENDPOINT}/CODE/${code}?sheet=Non-Stage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IsSummitted: "TRUE", HandOver: controllerEmail }),
      });
      setProgrammes((prev) => prev.filter((p) => p.CODE !== code));
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setActionLoading(null);
    }
  };

  const uniqueJudges = Array.from(new Set(programmes.map((p) => p.JUDGE).filter(Boolean)));
  const filteredData = selJudge ? programmes.filter(p => p.JUDGE === selJudge) : programmes;

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 gap-4">
        <Link to="/dashboard" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition">
          &larr; Back to Home
        </Link>
        <select 
          value={selJudge} 
          onChange={(e) => setSelJudge(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter by Judge: All</option>
          {uniqueJudges.map(j => <option key={j} value={j}>{j}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
           <div className="p-8 text-center text-gray-500">Loading pending handovers...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">CODE</th>
                  <th className="px-6 py-4">PROGRAM</th>
                  <th className="px-6 py-4">JUDGE</th>
                  <th className="px-6 py-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No items found.</td></tr>
                ) : (
                  filteredData.map((prog) => (
                    <tr key={prog.CODE} className="hover:bg-blue-50/50">
                      <td className="px-6 py-4 font-bold text-gray-900">{prog.CODE}</td>
                      <td className="px-6 py-4">{prog.PROGRAM}</td>
                      <td className="px-6 py-4">{prog.JUDGE}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleHandOver(prog.CODE)}
                          disabled={actionLoading === prog.CODE}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                          {actionLoading === prog.CODE ? "Updating..." : "HandOver"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}