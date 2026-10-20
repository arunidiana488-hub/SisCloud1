import Layout from "../components/Layout";


function Academic(){

  const materias = [

    {
      nombre:"Sistemas de Información II",
      docente:"Docente asignado",
      proyectos:8
    },

    {
      nombre:"Redes Avanzadas",
      docente:"Docente asignado",
      proyectos:5
    },

    {
      nombre:"Ingeniería de Sistemas II",
      docente:"Docente asignado",
      proyectos:6
    },

    {
      nombre:"Big Data",
      docente:"Docente asignado",
      proyectos:4
    },

    {
      nombre:"Desarrollo de Aplicaciones Móviles",
      docente:"Docente asignado",
      proyectos:7
    }

  ];


  return (

    <Layout>


      <h1>
        📚 Gestión Académica
      </h1>


      <p>
        Administración de materias y organización académica.
      </p>



      <div className="dashboard-grid">


        {
          materias.map((materia,index)=>(


            <div 
              className="dashboard-card"
              key={index}
            >

              <h2>
                📘
              </h2>


              <h3>
                {materia.nombre}
              </h3>


              <p>
                👨‍🏫 {materia.docente}
              </p>


              <p>
                📁 Proyectos:
                {materia.proyectos}
              </p>


            </div>


          ))
        }


      </div>


    </Layout>

  );

}


export default Academic;