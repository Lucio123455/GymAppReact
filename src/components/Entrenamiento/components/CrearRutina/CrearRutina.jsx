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

    useEffect(() => {
        console.log('Updated rutina:', rutina);
    }, [rutina]);

    const handleConfirmarRutina = () => {
        setRutina((prevRutina) => ({
            ...prevRutina,
            dias: dias
        }));
        alert("rutina creada con exito");
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
                dias={dias}
                onDiasElegidos={diasDeLaRutina}
            />
        );
    } else {
        return (
            <>
                <SegundoPaso
                    dias={dias}
                    agregarEjercicioADias={agregarEjercicioADias}
                    handleConfirmarRutina={handleConfirmarRutina}
                />
            </>
        )
    }
}

function SegundoPaso({ dias, agregarEjercicioADias, handleConfirmarRutina }) {
    const navigate = useNavigate();

    const handleBack = () => {
        setDiaSeleccionado(null)
        navigate('/entrenamiento/crear-rutina');
    };

    useEffect(() => {
        window.onpopstate = handleBack;

        return () => {
            window.onpopstate = null; // Limpia el efecto
        };
    }, []);

    const [diaSeleccionado, setDiaSeleccionado] = useState(null)

    const handleMostrarDia = (dia) => {
        setDiaSeleccionado(dia)
    }

    const [diasConfirmados, setDiasConfirmados] = useState([]);

    const sacarDeDiasConfirmados = (dia) => {
        if (diasConfirmados.includes(dia)) {
            setDiasConfirmados(diasConfirmados.filter(d => d !== dia));
        }
    };

    const handleConfirmarDia = (dia) => {
        if (!diasConfirmados.includes(dia)) {
            setDiasConfirmados([...diasConfirmados, dia]);
        }
        setDiaSeleccionado(null)
    }

    return (
        <>
            {/* Si mostrarDia tiene un valor, muestra el <h1> con el día */}
            {diaSeleccionado ? (
                <>
                    <CargarEjercicios
                        dia={diaSeleccionado}
                        dias={dias}
                        agregarEjercicioADias={agregarEjercicioADias}
                        handleConfirmarDia={handleConfirmarDia}
                        sacarDeDiasConfirmados={sacarDeDiasConfirmados}
                    />
                </>
            ) : (
                <>
                    <ListaDias
                        dias={dias}
                        handleMostrarDia={handleMostrarDia}
                        diasConfirmados={diasConfirmados} />
                    {diasConfirmados.length === dias.length && (
                        <BotonConfirmarRutina handleConfirmarRutina={handleConfirmarRutina} />
                    )}
                </>
            )}
        </>
    );
}

function BotonConfirmarRutina({ handleConfirmarRutina }) {
    return (
        <>
            <Link to={"/entrenamiento"}>
                <button
                    className={styles.botonDia}
                    onClick={() => handleConfirmarRutina()}
                >
                    Confirmar Rutina
                </button>

            </Link>
        </>
    );
}

function ListaDias({ dias, handleMostrarDia, diasConfirmados }) {
    const esDiaConfirmado = (dia, diasConfirmados) => {
        return diasConfirmados.includes(dia);
    };

    return (
        <>
            <h2>Días seleccionados:</h2>
            <ul className={styles.listaDias}>
                {dias.length > 0 ? (
                    dias.map((dia, index) => (
                        <Dia
                            key={`${dia.nombre}-${index}`}
                            dia={dia}
                            index={index}
                            handleMostrarDia={handleMostrarDia}
                            esDiaConfirmado={esDiaConfirmado(dia.nombre, diasConfirmados)}
                        />
                    ))
                ) : (
                    <p>No se han seleccionado días.</p>
                )}
            </ul>
        </>
    );
}

function Dia({ dia, index, handleMostrarDia, esDiaConfirmado }) {
    return (
        <li key={`${dia.nombre}-${index}`}>
            <button
                onClick={() => handleMostrarDia(dia.nombre)}
                className={styles.botonDia}
                style={{ backgroundColor: esDiaConfirmado ? 'green' : 'blue' }}
            >
                {dia.nombre}
            </button>
        </li>
    );
}


// Componente principal para cargar ejercicios
function CargarEjercicios({ dia, dias, agregarEjercicioADias, handleConfirmarDia, sacarDeDiasConfirmados }) {
    const [mostrarForm, setMostrarForm] = useState(false); // Estado para mostrar el formulario

    const agregarEjercicio = () => {
        setMostrarForm(true);
        sacarDeDiasConfirmados(dia)
    };

    const confirmarEjercicio = () => {
        setMostrarForm(false)
    }

    return (
        <>
            <h1>{dia}</h1>

            <ListaDeEjercicios diaSeleccionado={dia} dias={dias} />
            {/* Si mostrarForm es true, mostramos el formulario, de lo contrario mostramos el botón */}
            {mostrarForm ? (
                <FormCargarEjercicios finalizarEjercicio={confirmarEjercicio} dia={dia} agregarEjercicioADias={agregarEjercicioADias} /> // Mostrar formulario
            ) : (
                <>
                    <BotonAgregarEjercicios agregarEjercicio={agregarEjercicio} /> // Mostrar botón
                    <BotonConfirmarDia handleConfirmarDia={handleConfirmarDia} dia={dia} />
                </>
            )}
        </>
    );
}

function BotonConfirmarDia({ handleConfirmarDia, dia }) {
    return (
        <>
            <button
                className={styles.botonDia}
                onClick={() => handleConfirmarDia(dia)}
            >
                Confirmar Dia
            </button>
        </>
    );
}

function BotonAgregarEjercicios({ agregarEjercicio, }) {
    return (
        <button className={styles.botonDia} onClick={agregarEjercicio}>
            Agregar Ejercicio
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

function ListaDeEjercicios({ dias, diaSeleccionado }) {
    const diaEncontrado = dias.find((dia) => dia.nombre === diaSeleccionado);

    return (
        <>
            {diaEncontrado && Array.isArray(diaEncontrado.ejercicios) ? (
                <ul className={styles.listaDias}>
                    {diaEncontrado.ejercicios.map((ejercicio, index) => (
                        <Ejercicio ejercicio={ejercicio} index={index} />
                    ))}
                </ul>
            ) : (
                <p>Aun no has cargado ejercicios en: {diaSeleccionado}, carga el primero dando click en agregar ejercicio</p>
            )}
        </>
    );
}

function Ejercicio({ ejercicio, index }) {
    return <li key={`${ejercicio}-${index}`} className={styles.botonDia}>{ejercicio}</li>
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
        let nuevosDias;
    
        if (isChecked) {
            nuevosDias = [...dias, { nombre: dia, activo: true }];
        } else {
            nuevosDias = dias.filter((d) => d.nombre !== dia);
        }
    
        nuevosDias.sort((a, b) => {
            return todosLosDias.indexOf(a.nombre) - todosLosDias.indexOf(b.nombre);
        });

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