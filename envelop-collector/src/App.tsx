import ControllerPanel from "./ControllerPanel/ControllerPanel";
import GetWay from "./GetWay/GetWay";

import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/" element = {<GetWay/>}/>
      <Route path="/home" element = {<ControllerPanel/>}/>
    </Routes>
    </>
  )
}