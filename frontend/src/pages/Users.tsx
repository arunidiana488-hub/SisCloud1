import Layout from "../components/Layout";


function Users(){

  return (

    <Layout>


      <h1>
        👥 Gestión de Usuarios
      </h1>


      <div className="content-box">


        <div className="project">

          <h3>
            Juan Pérez
          </h3>

          <p>
            Rol: Estudiante
          </p>

          <p>
            Correo:
            juan@universidad.edu
          </p>

        </div>



        <div className="project">

          <h3>
            Carlos López
          </h3>

          <p>
            Rol: Docente
          </p>

          <p>
            Correo:
            carlos@universidad.edu
          </p>

        </div>



        <div className="project">

          <h3>
            Administrador SISCloud
          </h3>

          <p>
            Rol: Administrador
          </p>

        </div>


      </div>


    </Layout>

  );

}


export default Users;