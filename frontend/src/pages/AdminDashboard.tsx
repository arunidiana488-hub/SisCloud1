import Layout from "../components/Layout";


function AdminDashboard(){

  return (

    <Layout>


      <h1>
        🛡️ Dashboard Administrador
      </h1>


      <p>
        Administración general de la plataforma SISCloud.
      </p>



      <div className="dashboard-grid">


        <div className="dashboard-card">

          <h2>
            👥
          </h2>

          <p>
            Gestión de Usuarios
          </p>

          <small>
            Crear, editar y administrar usuarios.
          </small>

        </div>



        <div className="dashboard-card">

          <h2>
            🔐
          </h2>

          <p>
            Roles y Permisos
          </p>

          <small>
            Control de accesos del sistema.
          </small>

        </div>



        <div className="dashboard-card">

          <h2>
            📊
          </h2>

          <p>
            Auditoría
          </p>

          <small>
            Historial de actividades.
          </small>

        </div>



        <div className="dashboard-card">

          <h2>
            ⚙️
          </h2>

          <p>
            Configuración
          </p>

          <small>
            Administración del sistema.
          </small>

        </div>


      </div>




      <div className="content-box">


        <h2>
          Estado del sistema
        </h2>


        <div className="project">

          <p>
            👨‍🎓 Usuarios estudiantes:
            250
          </p>

          <p>
            👨‍🏫 Usuarios docentes:
            15
          </p>

          <p>
            📁 Proyectos registrados:
            80
          </p>


        </div>


      </div>


    </Layout>

  );

}


export default AdminDashboard;