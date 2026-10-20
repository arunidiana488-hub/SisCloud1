import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logoEmi from "../assets/logo-emi.png";
import logoSistemas from "../assets/logo-sistemas.png";


function Login(){

  const navigate = useNavigate();


  const [rol,setRol] = useState("");

  const [captcha,setCaptcha] = useState("");

  const [mensaje,setMensaje] = useState("");


  const codigoCaptcha = "A7K9P";



  const ingresar = () => {


    if(captcha !== codigoCaptcha){

      setMensaje("Código CAPTCHA incorrecto");

      return;

    }


    if(rol === ""){

      setMensaje("Seleccione un usuario");

      return;

    }



    if(rol === "estudiante"){

      navigate("/student");

    }



    if(rol === "docente"){

      navigate("/teacher");

    }



    if(rol === "administrador"){

      navigate("/admin");

    }


  };



  return (

    <div className="login-page">


      <div className="login-container">



        {/* LADO INSTITUCIONAL */}


        <div className="login-brand">


          <div className="logos-container">


            <div className="logo-box">

              <img
                src={logoEmi}
                alt="Logo EMI"
                className="login-logo"
              />

            </div>



            <div className="logo-divider"></div>



            <div className="logo-box">

              <img
                src={logoSistemas}
                alt="Logo Sistemas"
                className="login-logo"
              />

            </div>


          </div>





          <h1>
            ☁ SISCloud
          </h1>



          <h2>
            Plataforma de Nube Académica
          </h2>



          <p>

            Gestión de proyectos,
            documentos y colaboración académica
            para Ingeniería de Sistemas.

          </p>





          <div className="institution-box">


            <h3>
              Escuela Militar de Ingeniería
            </h3>


            <p>
              Ingeniería de Sistemas
            </p>


          </div>



        </div>







        {/* FORMULARIO */}



        <div className="login-card">


          <h2>
            Inicio de Sesión
          </h2>



          <p className="subtitle">

            Ingrese sus credenciales

          </p>





          <input

            className="login-input"

            type="email"

            placeholder="Correo institucional"

          />





          <input

            className="login-input"

            type="password"

            placeholder="Contraseña"

          />






          <select

            className="login-input"

            value={rol}

            onChange={(e)=>setRol(e.target.value)}

          >

            <option value="">
              Seleccione usuario
            </option>


            <option value="estudiante">

              👨‍🎓 Estudiante

            </option>



            <option value="docente">

              👨‍🏫 Docente

            </option>



            <option value="administrador">

              🛡 Administrador

            </option>


          </select>






          <div className="captcha-container">


            <span>
              Código CAPTCHA
            </span>



            <div className="captcha-code">

              {codigoCaptcha}

            </div>


          </div>






          <input

            className="login-input"

            placeholder="Ingrese CAPTCHA"

            value={captcha}

            onChange={(e)=>setCaptcha(e.target.value)}

          />






          <button

            className="login-button"

            onClick={ingresar}

          >

            Ingresar

          </button>






          {
            mensaje &&

            <p className="error-message">

              {mensaje}

            </p>
          }





        </div>



      </div>



    </div>

  );

}


export default Login;