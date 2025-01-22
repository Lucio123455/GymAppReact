import React, { useState} from 'react';
import styles from './CrearRutina.module.css';
import { Link, Route, Routes, Outlet, useParams, useLocation  } from 'react-router-dom';
import tick from '../../../../assets/marca-de-verificacion.png'
import cruz from '../../../../assets/cerrar.png'

function CrearRutina() {
    const [paso, setPaso] = useState(0);
    const [rutina, setRutina] = useState({
        nombre: "",
        dias: []
    });

    const siguientePaso = () => setPaso((prev) => prev + 1);

    const cambiarNombreRutina = (nuevoNombre) => {
        setRutina((prevRutina) => ({
            ...prevRutina,
            nombre: nuevoNombre
        }));
    };

    const diasDeLaRutina = (diasElegidos) => {
        setRutina((prevRutina) => ({
            ...prevRutina,
            dias: diasElegidos
        }))
    }

    const handleClickTerminarPrimerPaso = () => {
        siguientePaso();
        console.log("Nombre de la rutina:", rutina.nombre);
    };

    if (paso === 0) {
        return (
            <PrimerPaso
                nombre={rutina.nombre}
                onNombreChange={cambiarNombreRutina}
                onNext={handleClickTerminarPrimerPaso}
                dias={rutina.dias}
                onDiasElegidos={diasDeLaRutina}
            />
        );
    } else {
        return (
            <>
                <SegundoPaso
                    nombre={rutina.nombre}
                    dias={rutina.dias}
                />

                
               
                
            </>
        )
    }
}

function SegundoPaso({ nombre, dias }) {
    return (
        <>
            <h1 className={styles.tituloDias}>{nombre}</h1>
            <MostrarDias
                dias={dias}
            />
        </>
    );
}

export function DiaConstructor({ dias }) {
    
}

function MostrarDias({ dias }) {
    return (
        <>
            <h2>Días seleccionados:</h2>
            <ul className={styles.listaDias}>
                {dias.length > 0 ? (
                    dias.map((dia, index) => (
                        <li key={index}>
                            <Link 
                                to={`/crear-rutina/${dia.toLowerCase()}`}
                                state={dia}
                            >
                                {dia}
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>No se han seleccionado días.</p>
                )}
            </ul>
        </>
    );
}


function PrimerPaso({ nombre, onNombreChange, onNext, dias, onDiasElegidos }) {
    return (
        <>
            <NombreRutina
                nombre={nombre}
                onNombreChange={onNombreChange}
            />
            <DiasPosibles
                dias={dias}
                onDiasElegidos={onDiasElegidos}
            />
            <BotonTerminarPrimerPaso
                onNext={onNext}
            />
        </>
    );
}

function NombreRutina({ nombre, onNombreChange }) {
    return (
        <>
            <label htmlFor="nombre-rutina" className={styles.nombreRutina}>Nombre de la rutina</label>
            <input
                type="text" id="nombre-rutina"
                className={styles.inputNombreRutina}
                placeholder="Nombre de la rutina"
                required
                value={nombre}
                onChange={(e) => onNombreChange(e.target.value)}
            />
        </>
    );
}

function DiasPosibles({ dias, onDiasElegidos }) {
    const todosLosDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const handleCheckboxChange = (dia, isChecked) => {
        const nuevosDias = isChecked
            ? [...dias, dia]
            : dias.filter((d) => d !== dia);

        onDiasElegidos(nuevosDias);
    };

    return (
        <>
            <label htmlFor="dias-semanales">Días semanales</label>
            <div id="dias-semanales" className={styles.diasSemanales}>
                {todosLosDias.map((dia) => (
                    <label key={dia} className={styles.dia}>
                        <input
                            type="checkbox"
                            name="dias"
                            value={dia}
                            checked={dias.includes(dia)} // Verificar si el día está seleccionado
                            onChange={(e) => handleCheckboxChange(dia, e.target.checked)}
                        />
                        {dia}
                    </label>
                ))}
            </div>
        </>
    );
}


function BotonTerminarPrimerPaso({ onNext }) {
    return <button className={styles.botonConfirmar} onClick={onNext}>Confirmar</button>
}

export default CrearRutina