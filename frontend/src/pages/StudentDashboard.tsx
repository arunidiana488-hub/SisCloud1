import Layout from "../components/Layout";


function StudentDashboard(){

return (

<Layout>


<h1>
Dashboard Estudiante
</h1>


<div className="dashboard-grid">


<div className="dashboard-card">

<h2>
📁 12
</h2>

<p>
Proyectos activos
</p>

</div>



<div className="dashboard-card">

<h2>
☁ 48
</h2>

<p>
Archivos en la nube
</p>

</div>



<div className="dashboard-card">

<h2>
👥 5
</h2>

<p>
Equipos de trabajo
</p>

</div>



<div className="dashboard-card">

<h2>
📊 75%
</h2>

<p>
Avance promedio
</p>

</div>


</div>



<div className="content-box">

<h2>
📁 Proyectos recientes
</h2>


<div className="project">

<h3>
Sistema de Inventarios
</h3>

<p>
Materia: Sistemas de Información II
</p>

<p>
Estado: En desarrollo
</p>

</div>


<div className="project">

<h3>
Aplicación móvil educativa
</h3>

<p>
Materia: Desarrollo de Aplicaciones Móviles
</p>

<p>
Estado: Planificación
</p>

</div>


</div>



</Layout>

);

}


export default StudentDashboard;