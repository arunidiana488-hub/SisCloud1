import Layout from "../components/Layout";


function TeacherDashboard(){

return (

<Layout>


<h1>
Dashboard Docente
</h1>


<p>
Gestión académica y seguimiento de proyectos.
</p>



<div className="dashboard-grid">


<div className="dashboard-card">

<h2>
📚 5
</h2>

<p>
Materias asignadas
</p>

</div>



<div className="dashboard-card">

<h2>
📁 18
</h2>

<p>
Proyectos supervisados
</p>

</div>



<div className="dashboard-card">

<h2>
📝 7
</h2>

<p>
Observaciones pendientes
</p>

</div>



<div className="dashboard-card">

<h2>
📊 82%
</h2>

<p>
Avance promedio
</p>

</div>



</div>





<div className="content-box">


<h2>
📚 Materias
</h2>


<div className="project">

<h3>
Sistemas de Información II
</h3>

<p>
Proyectos activos: 8
</p>

</div>



<div className="project">

<h3>
Redes Avanzadas
</h3>

<p>
Proyectos activos: 4
</p>

</div>



<div className="project">

<h3>
Big Data
</h3>

<p>
Proyectos activos: 6
</p>

</div>


</div>





<div className="content-box">


<h2>
📁 Últimos proyectos revisados
</h2>


<div className="project">

<h3>
Sistema Web Académico
</h3>

<p>
Estado:
En desarrollo
</p>


<p>
Última observación:
Actualizar documentación
</p>


</div>


</div>



</Layout>

);

}


export default TeacherDashboard;