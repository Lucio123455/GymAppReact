import styles from './HeaderRutina.module.css'
import carpetaImg from '../../../../assets/carpeta.png'
import buscarImg from '../../../../assets/buscar.png'
import { Link } from 'react-router-dom';

export function HeaderRutina() {
    return (
        <>
            <div className={styles.headerRutina}>
                <h2 >Rutinas</h2>
                <div className={styles.botones}>
                    <Link to="/crear-rutina">
                        <button className={styles.boton}>
                            <img src={carpetaImg} alt="Crear Rutina" />
                            Crear Rutina
                        </button>
                    </Link>
                    <button className={styles.boton}><img src={buscarImg} alt="" />Buscar</button>
                </div>
            </div>
        </>
    );
}