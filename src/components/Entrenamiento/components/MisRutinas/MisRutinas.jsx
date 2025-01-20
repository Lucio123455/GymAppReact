import { useState } from 'react';
import styles from './MisRutinas.module.css';
import flechitaImg from '../../../../assets/flechita.png';
import { Link } from 'react-router-dom';

export function MisRutinas() {
    const rutinas = [
        {
            nombre: 'FullBody',
            dias: ['Lunes', 'Miércoles', 'Viernes']
        },
        {
            nombre: 'Principiante',
            dias: ['Lunes', 'Miércoles', 'Viernes']
        },
        {
            nombre: 'Avanzado',
            dias: ['Lunes', 'Miércoles', 'Viernes']
        }
    ];

    return (
        <div className={styles.contenedorPrincipal}>
            <h2>Mis Rutinas</h2>
            {mostrarRutinas(rutinas)}
        </div>
    );
}

function mostrarRutinas(rutinas) {
    return rutinas.map((rutina, index) => (
        <Rutina key={index} rutina={rutina} />
    ));
}

function Rutina({ rutina }) {
    const [mostrarDias, setMostrarDias] = useState(false);

    const toggleMostrarDias = () => {
        setMostrarDias(prevState => !prevState);
    };

    return (
        <div className={styles.contenedorRutinas}>
            <div className={styles.rutinas}>
                <h3>{rutina.nombre}</h3>
                <button onClick={toggleMostrarDias}>
                    <img src={flechitaImg} alt="Mostrar días" />
                </button>
            </div>
            {mostrarDias && (
                <ul className={styles.dias}>
                    {rutina.dias.map((dia, index) => (
                        <li className={styles.dia} key={index}>
                            <h3 className={styles.diaTitle}>{dia}</h3>
                            <Link to={`/entrenamiento/${rutina.nombre.toLowerCase()}/${dia.toLowerCase()}`} className={styles.boton}>
                                Comenzar
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

