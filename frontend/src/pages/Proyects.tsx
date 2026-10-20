import Layout from "../components/Layout";


function Projects(){


  const proyectos = [

    {
      nombre:"Sistema de Inventarios",
      materia:"Sistemas de Información II",
      docente:"Ing. Carlos López",
      integrantes:4,
      estado:"En desarrollo",
      avance:"75%"
    },


    {
      nombre:"Infraestructura de Red Empresarial",
      materia:"Redes Avanzadas",
      docente:"Ing. María Pérez",
      integrantes:3,
      estado:"Planificación",
      avance:"25%"
    },


    {
      nombre:"Sistema Inteligente con Big Data",
      materia:"Big Data",
      docente:"Ing. Roberto García",
      integrantes:5,
      estado:"En desarrollo",
      avance:"60%"
    },


    {
      nombre:"Aplicación Móvil Educativa",
      materia:"Desarrollo de Aplicaciones Móviles",
      docente:"Ing. Ana Torres",
      integrantes:4,
      estado:"Finalizado",
      avance:"100%"
    }


  ];



  return (

    <Layout>


      <div className="dashboard-header">


        <h1>
          📁 Gestión de Proyectos Académicos
        </h1>


        <p>
          Administración y seguimiento de proyectos desarrollados por estudiantes.
        </p>


      </div>




      <button className="primary-button">

        + Nuevo Proyecto

      </button>




      <div className="content-box">


        <h2>
          Proyectos registrados
        </h2>



        {
          proyectos.map((proyecto,index)=>(


            <div 
              className="project"
              key={index}
            >


              <h3>
                📂 {proyecto.nombre}
              </h3>


              <p>
                📚 Materia:
                {proyecto.materia}
              </p>


              <p>
                👨‍🏫 Docente:
                {proyecto.docente}
              </p>


              <p>
                👥 Integrantes:
                {proyecto.integrantes}
              </p>


              <p>
                Estado:
                {proyecto.estado}
              </p>


              <p>
                Avance:
                {proyecto.avance}
              </p>



            </div>


          ))
        }


      </div>


    </Layout>

  );

}


export default Projects;