import { Link } from "react-router-dom";

import logoEmi from "../assets/logo-emi.png";
import logoSistemas from "../assets/logo-sistemas.png";


function Home(){

return (

<div className="home-page">


<div className="home-card">



<div className="home-logos">


<img 
src={logoEmi}
alt="EMI"
/>


<img 
src={logoSistemas}
alt="Sistemas"
/>


</div>




<h1>

☁ SISCloud

</h1>


<h2>

Plataforma de Nube Académica

</h2>


<p>

Gestión de proyectos, documentos y colaboración
académica para Ingeniería de Sistemas.

</p>



<Link to="/login">

<button className="home-button">

Ingresar al sistema

</button>


</Link>



<div className="home-footer">

Escuela Militar de Ingeniería  
<br/>
Ingeniería de Sistemas

</div>



</div>


</div>

);


}


export default Home;