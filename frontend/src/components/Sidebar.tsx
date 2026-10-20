import { Link } from "react-router-dom";


function Sidebar(){

  return (

    <aside className="sidebar">


      <div className="logo">

        ☁ SISCloud

      </div>



      <nav>


        <Link to="/">
          🏠 Inicio
        </Link>


        <Link to="/projects">
          📁 Proyectos
        </Link>


        <Link to="/academic">
          📚 Gestión Académica
        </Link>


        <Link to="/files">
          ☁ Nube Académica
        </Link>


        <Link to="/teams">
          👥 Equipos de Trabajo
        </Link>


        <Link to="/tracking">
          📊 Seguimiento
        </Link>


        <Link to="/audit">
          🔐 Auditoría
        </Link>


        <Link to="/repository">
          🗂 Repositorio
        </Link>


      </nav>


    </aside>

  );

}


export default Sidebar;