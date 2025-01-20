import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Header } from './components/Header/Header';
import { FooterNav } from './components/FooterNav/FooterNav';
import { Entrenamiento } from './components/Entrenamiento/Entrenamiento';
import { Home } from "./components/Home/Home";
import { Perfil } from "./components/Perfil/Perfil";
import { Dia } from "./components/Entrenamiento/components/MisRutinas/Dia/Dia";
import CrearRutina from "./components/Entrenamiento/components/CrearRutina/CrearRutina";

function AppContent() {
  const location = useLocation();
  // Determinar el título en función de la ruta actual
  const getTitle = () => {
    const path = location.pathname;
  
    if (path === "/") return "Inicio";
  
    // Si la ruta es /entrenamiento/fulbody/lunes, obtendrá 'lunes' y lo convierte en 'Lunes'
    if (path.startsWith("/entrenamiento")) {
      const pathParts = path.split('/'); // Divide la ruta en partes
      const lastPart = pathParts[pathParts.length - 1]; // Obtiene la última parte (lunes, por ejemplo)
  
      // Elimina los guiones y convierte la primera letra en mayúsculas
      const formattedLastPart = lastPart.replace(/-/g, ' '); // Elimina todos los guiones
  
      return formattedLastPart.charAt(0).toUpperCase() + formattedLastPart.slice(1); // Convierte la primera letra en mayúsculas
    }
  
    if (path === "/perfil") return "Perfil";
  
    return "Página no encontrada";
  };
  
  return (
    <>
      <Header titulo={getTitle()} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entrenamiento" element={<Entrenamiento />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/entrenamiento/:nombreRutina/:dia" element={<Dia />} />
        <Route path="/entrenamiento/:crear-rutina" element={<CrearRutina />} />
      </Routes>
      <FooterNav />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


