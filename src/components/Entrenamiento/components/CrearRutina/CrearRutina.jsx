import React, { useState } from 'react';
import styles from './CrearRutina.module.css';
import { Link } from 'react-router-dom';

function CrearRutina() {
    const [pasos, setPasos] = useState(0);
    const [diasSeleccionados, setDiasSeleccionados] = useState([]);

    const handleConfirmarRutinaYDias = () => {

        const nombreRutina = document.querySelector('#nombre-rutina').value;


        const rutina = {
            nombre: nombreRutina
        }

        localStorage.setItem('rutina', JSON.stringify(rutina));
        const checkboxes = document.querySelectorAll('input[name="dias"]:checked');
        const dias = Array.from(checkboxes).map((checkbox) => checkbox.value);

        setDiasSeleccionados(dias);
        if (nombreRutina != '' && dias.length > 0) {
            setPasos(1)
        } else {
            alert("asd")
        }

    };

    const handleConfirmarRutina = (diasConfirmados) => {
        const rutinaGuardada = JSON.parse(localStorage.getItem('rutina')) || {};


        const rutina = {
            ...rutinaGuardada,
            dias: diasConfirmados,
            fechaCreacion: new Date().toISOString() // Ejemplo de fecha de creación
        };

        // Guardar el objeto rutina en localStorage
        localStorage.setItem('rutina', JSON.stringify(rutina));

        console.log('Rutina guardada:', rutina);
    };


    return (
        <>
            {pasos === 0 && (
                <PasoRutinaYDiasSeleccionados handleConfirmarRutinaYDias={handleConfirmarRutinaYDias} />
            )}
            {pasos === 1 && <CargarDias dias={diasSeleccionados} handleConfirmarRutina={handleConfirmarRutina} />}
        </>
    );
}

function CargarDias({ dias, handleConfirmarRutina }) {
    const [diaSeleccionado, setDiaSeleccionado] = useState(null); // Estado para el día seleccionado
    const [diasConfirmados, setDiasConfirmados] = useState([]); // Días confirmados

    const handleSeleccionarDia = (dia) => {
        setDiaSeleccionado(dia); // Actualiza el día seleccionado
    };

    const handleConfirmar = (dia, ejercicios) => {
        setDiasConfirmados((prev) => [...prev, { dia, ejercicios }]);
        setDiaSeleccionado(null);
    };

    const esDiaConfirmado = (dia) => {
        return diasConfirmados.some((d) => d.dia === dia); // Comprueba si el día está confirmado
    };

    const rutina = JSON.parse(localStorage.getItem('rutina')); // Parsear el objeto
    const nombreRutina = rutina ? rutina.nombre : null; // Obtener el nombre si existe, de lo contrario, null
    console.log(diasConfirmados)

    return (
        <>
            {!diaSeleccionado ? (
                <div className={styles.contenedorFormulario}>
                    <h2 className={styles.tituloDias}>{nombreRutina}</h2>
                    <ul className={styles.listaDias}>
                        {dias.map((dia) => (
                            <li key={dia}>
                                <button
                                    className={` ${esDiaConfirmado(dia) ? styles.botonDiaConfirmado : styles.botonDia}`}
                                    onClick={
                                        esDiaConfirmado(dia)
                                            ? undefined
                                            : () => handleSeleccionarDia(dia)
                                    }
                                    disabled={esDiaConfirmado(dia)} // Evita interacción si está confirmado
                                >
                                    {dia}
                                </button>
                            </li>
                        ))}

                        {/* Verifica si todos los días están confirmados */}
                        {diasConfirmados.length === dias.length && (
                            <Link to="/entrenamiento">
                                <button className={styles.botonConfirmarDias} onClick={() => handleConfirmarRutina(diasConfirmados)}>
                                    Finalizar Rutina
                                </button>
                            </Link>
                        )}
                    </ul>
                </div>
            ) : (
                <CargarEjercicio
                    dia={diaSeleccionado}
                    handleConfirmar={handleConfirmar}
                />
            )}
        </>

    );
}

function CargarEjercicio({ dia, handleConfirmar }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [ejercicios, setEjercicios] = useState([]);
    const [nuevoEjercicio, setNuevoEjercicio] = useState('');

    const agregarEjercicio = () => {
        setMostrarFormulario(true);
    };

    const confirmarEjercicio = () => {
        if (nuevoEjercicio.trim() === '') return;
        setEjercicios((prevEjercicios) => [...prevEjercicios, nuevoEjercicio]);
        setNuevoEjercicio('');
        setMostrarFormulario(false);
        console.log(ejercicios);
    };


    return (
        <div className={styles.contenedorFormulario}>
            <button className={styles.botonDia} onClick={agregarEjercicio}>
                Agregar Ejercicio
            </button>

            {mostrarFormulario && (
                <div>
                    <label htmlFor="nombre-ejercicio">Nombre del ejercicio</label>
                    <input
                        type="text"
                        id="nombre-ejercicio"
                        placeholder="Nombre del ejercicio"
                        value={nuevoEjercicio}
                        onChange={(e) => setNuevoEjercicio(e.target.value)} // Controla el input
                        required
                    />
                    
                    <button className={styles.botonDia} onClick={confirmarEjercicio}>Confirmar</button>
                </div>
            )}

            {ejercicios.length > 0 && (
                <ul>
                    {ejercicios.map((ejercicio, index) => (
                        <li className={styles.botonDia} key={index}>{ejercicio}</li>
                    ))}
                </ul>
            )}


            <button
                className={styles.boton}
                onClick={() => handleConfirmar(dia, ejercicios)}
                disabled={ejercicios.length === 0}  // Desactiva el botón si no hay ejercicios
            >
                Confirmar
            </button>
        </div>
    );
}



function PasoRutinaYDiasSeleccionados({ handleConfirmarRutinaYDias }) {
    return (
        <>
            <div className={styles.contenedorFormulario}>
                <NombreRutina />
                <DiasRutina />
                <ConfirmarDiasRutina handleConfirmarRutinaYDias={handleConfirmarRutinaYDias} />
            </div>
        </>
    );
}

function NombreRutina() {
    return (
        <>
            <label htmlFor="nombre-rutina" className={styles.nombreRutina}>Nombre de la rutina</label>
            <input type="text" id="nombre-rutina" className={styles.inputNombreRutina} placeholder="Nombre de la rutina" required />
        </>
    );
}

function DiasRutina() {
    return (
        <>
            <label htmlFor="dias-semanales">Días semanales</label>
            <div id="dias-semanales" className={styles.diasSemanales}>
                <label className={styles.dia}>
                    <input type="checkbox" name="dias" value="Lunes" /> Lunes
                </label>
                <label className={styles.dia}>
                    <input type="checkbox" name="dias" value="Martes" /> Martes
                </label>
                <label className={styles.dia}>
                    <input type="checkbox" name="dias" value="Miércoles" /> Miércoles
                </label>
                <label className={styles.dia}>
                    <input type="checkbox" name="dias" value="Jueves" /> Jueves
                </label>
                <label className={styles.dia}>
                    <input type="checkbox" name="dias" value="Viernes" /> Viernes
                </label>
                <label className={styles.dia}>
                    <input type="checkbox" name="dias" value="Sábado" /> Sábado
                </label>
                <label className={styles.dia}>
                    <input type="checkbox" name="dias" value="Domingo" /> Domingo
                </label>
            </div>
        </>
    );
}

function ConfirmarDiasRutina({ handleConfirmarRutinaYDias }) {
    return (
        <>
            <button className={styles.botonConfirmar} onClick={handleConfirmarRutinaYDias}>
                Confirmar
            </button>
        </>
    );
}

export default CrearRutina;
