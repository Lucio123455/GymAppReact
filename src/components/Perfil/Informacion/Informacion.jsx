import { Link } from "react-router-dom"

function Informacion() {
    return (
        <>
            <div className="contenedor-informacion">
                <Link to="/perfil/medidas">
                    <button className="boton-informacion">
                        <img />
                        Medidas
                    </button>
                </Link>

                <Link to={"/perfil/ejercicios"}>
                    <button className="boton-informacion">
                        <img />
                            Ejercicios
                    </button>
                </Link>
            </div>
        </>
    )
}

export default Informacion