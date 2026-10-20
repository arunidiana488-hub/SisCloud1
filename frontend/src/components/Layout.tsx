import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}


function Layout({children}: LayoutProps){

  return (

    <div className="layout">

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <main className="page-content">
          {children}
        </main>

      </div>

    </div>

  );

}


export default Layout;