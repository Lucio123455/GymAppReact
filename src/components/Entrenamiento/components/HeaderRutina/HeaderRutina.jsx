import styles from './HeaderRutina.module.css'
import carpetaImg from '../../../../assets/carpeta.png'
import buscarImg from '../../../../assets/buscar.png'

export function HeaderRutina() {
    return (
        <>
            <div className={styles.headerRutina}>
                <h2 >Rutinas</h2>
                <div className={styles.botones}>
                    <button className={styles.boton}><img  src={carpetaImg} alt="" />Crear Rutina</button>
                    <button className={styles.boton}><img src={buscarImg} alt="" />Buscar</button>
                </div>
            </div>
        </>
    );
}