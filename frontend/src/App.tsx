import { BrowserRouter, Routes, Route } from "react-router-dom";


// Páginas principales
import InstitutionalHome from "./pages/InstitutionalHome";
import Login from "./pages/Login";


// Dashboards por rol
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";


// Módulos
import Users from "./pages/Users";
import Academic from "./pages/Academic";



function App() {


  return (

    <BrowserRouter>


      <Routes>


        {/* Página principal */}

        <Route
        path="/"
        element={<InstitutionalHome />}
        />



        {/* Inicio de sesión */}

        <Route
          path="/login"
          element={<Login />}
        />



        {/* Dashboards según usuario */}


        <Route
          path="/student"
          element={<StudentDashboard />}
        />



        <Route
          path="/teacher"
          element={<TeacherDashboard />}
        />



        <Route
          path="/admin"
          element={<AdminDashboard />}
        />



        {/* Módulo 1:
            Gestión de Usuarios */}

        <Route
          path="/users"
          element={<Users />}
        />



        {/* Módulo 2:
            Gestión Académica */}

        <Route
          path="/academic"
          element={<Academic />}
        />


      </Routes>


    </BrowserRouter>

  );

}


export default App;