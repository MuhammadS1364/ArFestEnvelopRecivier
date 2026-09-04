import ControllerPanel from "./ControllerPanel/ControllerPanel";
import HandOverComponent from "./ControllerPanel/HandOverComponetn";
import ReceiverComponent from "./ControllerPanel/ReceVerComponent";
import GetWay from "./GetWay/GetWay";

import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./GetWay/ProtectedRoute";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<GetWay />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<ControllerPanel />} />
          <Route path="/handover" element={<HandOverComponent />} />
          <Route path="/recevier" element={<ReceiverComponent />} />
          <Route />
        </Route>
      </Routes>
    </>
  );
}