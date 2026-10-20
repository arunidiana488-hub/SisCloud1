import { Link } from "react-router-dom";

import logoEmi from "../assets/logo-emi.png";


function InstitutionalHome(){

return (

<div className="emi-home">


<header className="emi-header">


<div className="emi-logo">

<img 
src={logoEmi}
alt="EMI"
/>

</div>



<nav>

<a>
ACADÉMICA ▼
</a>

<a>
INVESTIGACIÓN ▼
</a>

<a>
INTERACCIÓN SOCIAL ▼
</a>

<a>
SERVICIOS ▼
</a>

<a>
NOSOTROS ▼
</a>


</nav>




<Link 
to="/login"
className="siscloud-button"
>

☁ SISCloud

</Link>


</header>





<section className="emi-banner">


<img
src="/banner-emi.png"
className="banner-image"
/>



<div className="banner-content">


<h1>
SISCloud
</h1>


<p>
Plataforma de Nube Académica
y Gestión de Proyectos
</p>


<Link to="/login">

<button>
Ingresar a SISCloud
</button>

</Link>


</div>



</section>



</div>


);

}


export default InstitutionalHome;