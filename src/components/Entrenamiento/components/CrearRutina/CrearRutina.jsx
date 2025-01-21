import React, { useState } from 'react';
import styles from './CrearRutina.module.css';
import { Link } from 'react-router-dom';
import tick from '../../../../assets/marca-de-verificacion.png'
import cruz from '../../../../assets/cerrar.png'

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

    const handleVolver = () => {
        setDiaSeleccionado(null);
    }

    const handleConfirmar = (dia, ejercicios) => {
        setDiasConfirmados((prev) => {
            // Verificar si ya existe un día con el mismo nombre
            const diaExistenteIndex = prev.findIndex(d => d.dia === dia);
    
            if (diaExistenteIndex !== -1) {
                // Si el día ya existe, reemplazar el día con los nuevos ejercicios
                const nuevosDias = [...prev];
                nuevosDias[diaExistenteIndex] = { dia, ejercicios };
                return nuevosDias;
            } else {
                // Si el día no existe, agregarlo al final
                return [...prev, { dia, ejercicios }];
            }
        });
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
                                    onClick={() => handleSeleccionarDia(dia)
                                    }
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
                    handleVolver={handleVolver}
                />
            )}
        </>

    );
}

function CargarEjercicio({ dia, handleConfirmar, handleVolver }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [ejercicios, setEjercicios] = useState([]);
    const [nuevoEjercicio, setNuevoEjercicio] = useState("");
    const [series, setSeries] = useState(1); // Estado para las series del ejercicio

    const agregarEjercicio = () => {
        setMostrarFormulario(true);
    };

    const confirmarEjercicio = () => {
        if (nuevoEjercicio.trim() === "") return;
        setEjercicios((prevEjercicios) => [
            ...prevEjercicios,
            { nombre: nuevoEjercicio, series }, // Guarda nombre y series
        ]);
        setNuevoEjercicio("");
        setSeries(1); // Reinicia las series al valor inicial
        setMostrarFormulario(false);
    };

    const borrarEjercicio = (ejercicio) => {
        const nuevosEjercicios = ejercicios.filter(item => item.nombre !== ejercicio.nombre);
        setEjercicios(nuevosEjercicios);
    };

    const cerrarFormulario = () => {
        setMostrarFormulario(false)
    }


    return (
        <div className={styles.contenedorFormulario}>
            {ejercicios.length > 0 && (
                <ul className={styles.listaEjercicios}>
                    {ejercicios.map((ejercicio, index) => (
                        <li className={styles.ejercicioLi} key={index}>
                            <p>{ejercicio.series}</p>
                            <p>{ejercicio.nombre}</p>
                            <button onClick={() => borrarEjercicio(ejercicio)}><img src={cruz} alt="" /></button>
                        </li>
                    ))}
                </ul>
            )}

            <button
                className={styles.botonAgregarEjercicio}
                onClick={agregarEjercicio}
            >
                Agregar Ejercicio
            </button>

            {mostrarFormulario ? (
                <div className={styles.formEjercicio}>
                    <input
                        type="text"
                        id="nombre-ejercicio"
                        placeholder="Nombre del ejercicio"
                        value={nuevoEjercicio}
                        onChange={(e) => setNuevoEjercicio(e.target.value)}
                        required
                        className={styles.inputEjercicioNombre}
                    />
                    <select
                        id="series-ejercicio"
                        value={series}
                        onChange={(e) => setSeries(Number(e.target.value))}
                        className={styles.series}
                    >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                    <button
                        className={styles.confirmarEjercicio}
                        onClick={confirmarEjercicio}
                    >
                        <img src={tick} alt="Confirmar" />
                    </button>
                    <button
                        className={styles.volverDelForm}
                        onClick={cerrarFormulario}
                    >
                        <img src={cruz} alt="Confirmar" />
                    </button>
                </div>
            ) : (
                <>
                    <button
                        className={styles.botonConfirmarDia}
                        onClick={() => handleConfirmar(dia, ejercicios)}
                        disabled={ejercicios.length === 0}
                    >
                        Confirmar Día
                    </button>
                    
                    <button
                    className={styles.botonConfirmarDia}
                    onClick={() => handleVolver()}
                    >
                        Volver
                    </button>
                </>
            )}
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
