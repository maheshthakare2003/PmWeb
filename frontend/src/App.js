import AppLayout from "./components/AppLayout";
import { Routes, Route, BrowserRouter} from "react-router-dom";
import Task from "./components/Task";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/Login";
import AppLayout2 from "./components/AppLayout2.js";
function App() {
  console.log("render app..");
  return (
    
    <AppLayout>
      <Toaster position="top-right" gutter={8} />
   
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/:projectId" element={<Task />} />
        <Route path="/Dash" element={<AppLayout2 />} />
       
      </Routes>
      
    </AppLayout>
  );
}

export default App;
