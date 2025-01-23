import React, { useState, useEffect } from 'react';
import styles from './CrearRutina.module.css';
import { Link, Route, Routes, Outlet, useParams, useLocation, useNavigate } from 'react-router-dom';
import tick from '../../../../assets/marca-de-verificacion.png'
import cruz from '../../../../assets/cerrar.png'

function CrearRutina() {
    const [paso, setPaso] = useState(0);
    const [rutina, setRutina] = useState({
        nombre: "",
        dias: []
    });
    const [dias, setDias] = useState([]);

    const siguientePaso = () => setPaso((prev) => prev + 1);

    const cambiarNombreRutina = (nuevoNombre) => {
        setRutina((prevRutina) => ({
            ...prevRutina,
            nombre: nuevoNombre
        }));
    };

    const diasDeLaRutina = (diasElegidosNombre) => {
        setDias(diasElegidosNombre);
    };

    const agregarEjercicioADias = (diaSeleccionado, nuevoEjercicio) => {
        // Actualizamos el estado de 'dias'
        setDias((prevDias) => {
            return prevDias.map((dia) => {
                if (dia.nombre === diaSeleccionado) {
                    // Si el nombre del día coincide con el seleccionado, agregamos el nuevo ejercicio
                    return {
                        ...dia, // Copiar todas las propiedades del día actual
                        ejercicios: dia.ejercicios ? [...dia.ejercicios, nuevoEjercicio] : [nuevoEjercicio], // Si ya existen ejercicios, los agregamos, si no, creamos un array con el nuevo ejercicio
                    };
                }
                return dia; // Si no coincide, devolvemos el día tal cual
            });
        });
        console.log(dias);
    };
    
    

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
                dias={dias}
                onDiasElegidos={diasDeLaRutina}
            />
        );
    } else {
        return (
            <>
                <SegundoPaso
                    nombre={rutina.nombre}
                    dias={dias}
                    agregarEjercicioADias={agregarEjercicioADias}
                />
            </>
        )
    }
}

function SegundoPaso({ nombre, dias, agregarEjercicioADias }) {
    return (
        <>
            <h1 className={styles.tituloDias}>{nombre}</h1>
            <MostrarDias
                dias={dias}
                agregarEjercicioADias={agregarEjercicioADias}
            />
        </>
    );
}

function MostrarDias({ dias , agregarEjercicioADias}) {
    const navigate = useNavigate();

    const handleBack = () => {
        setMostrarDiaSeleccionado(null)
        navigate('/entrenamiento/crear-rutina');
    };

    useEffect(() => {
        window.onpopstate = handleBack;

        return () => {
            window.onpopstate = null; // Limpia el efecto
        };
    }, []);

    const [diaSeleccionado, setMostrarDiaSeleccionado] = useState(null)

    const handleMostrarDia = (dia) => {
        setMostrarDiaSeleccionado(dia)
    }


    return (
        <>
            {/* Si mostrarDia tiene un valor, muestra el <h1> con el día */}
            {diaSeleccionado &&
                <>
                    <CargarEjercicios
                        dia={diaSeleccionado}
                        dias={dias}
                        agregarEjercicioADias={agregarEjercicioADias}
                    />
                </>
            }

            {/* Si no hay día seleccionado, muestra la lista */}
            {!diaSeleccionado && (
                <>
                    <h2>Días seleccionados:</h2>
                    <ul className={styles.listaDias}>
                        {dias.length > 0 ? (
                            dias.map((dia, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => handleMostrarDia(dia.nombre)}
                                        className={styles.botonDia}
                                    >
                                        {dia.nombre}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p>No se han seleccionado días.</p>
                        )}
                    </ul>
                </>
            )}
        </>
    );
}

function BotonCargarEjercicios({ agregarEjercicio }) {
    return (
        <button className={styles.botonDia} onClick={agregarEjercicio}>
            Cargar Ejercicio
        </button>
    );
}

// Formulario para cargar el ejercicio
function FormCargarEjercicios({ finalizarEjercicio, dia, agregarEjercicioADias }) {
    const [ejercicio, setEjercicio] = useState("");

    const handleInputChange = (e) => {
        setEjercicio(e.target.value);
    };

    const confirmarEjercicio = () => {
        if (ejercicio.trim() === "") return; // Evitar agregar un ejercicio vacío
        agregarEjercicioADias(dia, ejercicio);
        setEjercicio(""); // Limpiar el campo de texto
        finalizarEjercicio()
    };

    return (
        <>
            <input
                type="text"
                id="nombre-ejercicio"
                className={styles.inputNombreRutina}
                placeholder="Nombre del ejercicio"
                value={ejercicio}
                onChange={handleInputChange}
            />
            <button className={styles.botonDia} onClick={confirmarEjercicio}>
                Confirmar
            </button>
        </>
    );
}

// Componente principal para cargar ejercicios
function CargarEjercicios({ dia, dias ,agregarEjercicioADias }) {
    const [mostrarForm, setMostrarForm] = useState(false); // Estado para mostrar el formulario

    const agregarEjercicio = () => {
        setMostrarForm(true);
    };

    const confirmarEjercicio = () => {
        setMostrarForm(false)
        
    }
    
    
    return (
        <>  
            <h1>{dia}</h1>
            {/* Si mostrarForm es true, mostramos el formulario, de lo contrario mostramos el botón */}
            {mostrarForm ? (
                <FormCargarEjercicios finalizarEjercicio={confirmarEjercicio} dia={dia} agregarEjercicioADias={agregarEjercicioADias} /> // Mostrar formulario
            ) : (
                <BotonCargarEjercicios agregarEjercicio={agregarEjercicio} /> // Mostrar botón
            )}
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
        // Si se selecciona el día, agregamos el objeto al array, de lo contrario lo eliminamos
        const nuevosDias = isChecked
            ? [...dias, { nombre: dia, activo: true }] // Agregar el día como objeto con 'activo'
            : dias.filter((d) => d.nombre !== dia); // Eliminar el día si se deselecciona

        // Llamar a onDiasElegidos para pasar el array actualizado
        onDiasElegidos(nuevosDias)
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
                            checked={dias.some((d) => d.nombre === dia && d.activo)} // Verificar si el día está seleccionado
                            onChange={(e) => handleCheckboxChange(dia, e.target.checked)} // Llamar a la función de cambio
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