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
import SeguimientoModule from "./modules/seguimiento/index";



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



        {/* Módulo 3:
            Seguimiento - Gestión de Proyectos Académicos */}

        <Route
          path="/seguimiento/*"
          element={<SeguimientoModule />}
        />


      </Routes>


    </BrowserRouter>

  );

}


export default App;