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

    const agregarEjercicioADias = (diaSeleccionado, nombre, series) => {
        // Update the state of 'dias'
        setDias((prevDias) => {
            return prevDias.map((dia) => {
                if (dia.nombre === diaSeleccionado) {
                    // If the day's name matches the selected one, add the new exercise
                    return {
                        ...dia, // Copy all properties of the current day
                        ejercicios: dia.ejercicios
                            ? [...dia.ejercicios, { nombre, series }] // Add the new exercise as an object
                            : [{ nombre, series }], // Initialize with the first exercise as an object
                    };
                }
                return dia; // If it doesn't match, return the day as is
            });
        });
        console.log(dias);
    };

    useEffect(() => {
        console.log("Updated dias:", dias);
    }, [dias]);


    const actualizarSerieDelEjercicio = (nuevasSeries, nombreEjercicio, diaEncontrado) => {
        setDias((prevDias) => {
            return prevDias.map((dia) => {
                if (dia.nombre === diaEncontrado) {
                    console.log(dia.nombre)
                    return {
                        ...dia,
                        ejercicios: dia.ejercicios.map((ejercicio) => {
                            if (ejercicio.nombre === nombreEjercicio) {
                                // Update the `series` for the matching exercise
                                return {
                                    ...ejercicio,
                                    series: nuevasSeries,
                                };
                            }
                            return ejercicio; // Return unchanged exercises
                        }),
                    };
                }
                return dia; // Return unchanged days
            });
        });
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
                    actualizarSerieDelEjercicio={actualizarSerieDelEjercicio}

                />
            </>
        )
    }
}

function SegundoPaso({ dias, agregarEjercicioADias, handleConfirmarRutina, actualizarSerieDelEjercicio }) {
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
                        actualizarSerieDelEjercicio={actualizarSerieDelEjercicio}
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
function CargarEjercicios({ dia, dias, agregarEjercicioADias, handleConfirmarDia, sacarDeDiasConfirmados, actualizarSerieDelEjercicio }) {

    const confirmarEjercicio = () => {
        setMostrarForm(false)
    }

    return (
        <>
            <h1>{dia}</h1>
            <FormCargarEjercicios finalizarEjercicio={confirmarEjercicio} dia={dia} agregarEjercicioADias={agregarEjercicioADias} sacarDeDiasConfirmados={sacarDeDiasConfirmados} />
            <ListaDeEjercicios diaSeleccionado={dia} dias={dias} actualizarSerieDelEjercicio={actualizarSerieDelEjercicio} />
            <BotonConfirmarDia handleConfirmarDia={handleConfirmarDia} dia={dia} />
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

// Formulario para cargar el ejercicio
function FormCargarEjercicios({ finalizarEjercicio, dia, agregarEjercicioADias, sacarDeDiasConfirmados }) {
    const [ejercicio, setEjercicio] = useState("");
    const [series, setSeries] = useState(null);

    const handleInputChangeNombre = (e) => {
        setEjercicio(e.target.value);
    };

    const handleInputChangeSeries = (e) => {
        setSeries(e.target.value);
    }

    const confirmarEjercicio = () => {
        if (ejercicio.trim() === "") return; // Evitar agregar un ejercicio vacío
        agregarEjercicioADias(dia, ejercicio, series);
        setEjercicio(""); // Limpiar el campo de texto
        setSeries("")
        finalizarEjercicio()
        sacarDeDiasConfirmados(dia)
    };

    return (
        <>
            <div className={styles.formCargarRutina}>
                <input
                    type="text"
                    id="nombre-ejercicio"
                    className={styles.formInput}
                    placeholder="Nombre del ejercicio"
                    value={ejercicio}
                    onChange={handleInputChangeNombre}
                />
                {/*<input
                    type="number"
                    id="series-ejercicio"
                    className={styles.inputSeries}
                    placeholder=""
                    value={series}
                    onChange={handleInputChangeSeries}
                />*/}
                <button className={styles.formBoton} onClick={confirmarEjercicio}>
                    <i class="fas fa-plus-circle fa-lg"></i>
                </button>
            </div>

        </>
    );
}

function ListaDeEjercicios({ dias, diaSeleccionado, actualizarSerieDelEjercicio }) {
    const diaEncontrado = dias.find((dia) => dia.nombre === diaSeleccionado);

    return (
        <>
            <div className={styles.contenedorEjercicios}>
                {diaEncontrado && Array.isArray(diaEncontrado.ejercicios) ? (
                    <ul className={styles.listaEjercicios}>
                        {diaEncontrado.ejercicios.map((ejercicio, index) => (
                            <Ejercicio ejercicio={ejercicio} index={index} dia={diaEncontrado} actualizarSerieDelEjercicio={actualizarSerieDelEjercicio} />
                        ))}
                    </ul>
                ) : (
                    <p>Aun no has cargado ejercicios en: {diaSeleccionado}, carga el primero dando click en agregar ejercicio</p>
                )}
            </div>
        </>
    );
}

function Ejercicio({ ejercicio, index, dia, actualizarSerieDelEjercicio }) {
    const [series, setSeries] = useState(ejercicio.series);

    const handleInputChangeSeries = (e) => {
        setSeries(e.target.value);
    }

    const handleIncrementar = () => {
        setSeries((prevSeries) => Math.min(prevSeries + 1, 100)); // Limita a 100 como máximo
    }

    const handleDecrementar = () => {
        setSeries((prevSeries) => Math.max(prevSeries - 1, 0)); // Limita a 0 como mínimo
    }

    const handleConfirmarSeries = () => {
        actualizarSerieDelEjercicio(series, ejercicio.nombre, dia.nombre);
        console.log(series);
        console.log(dia);
        console.log(ejercicio.nombre);
        console.log("serie modificada");
    }

    return (
        <>
            <div className={styles.ejercicio}>
                <li key={`${ejercicio.nombre}-${index}`} className={styles.ejercicioNombre}>{ejercicio.nombre}</li>
                
                <div className={styles.inputContainer}>
                    
                        <input
                            type="number"
                            id="series-ejercicio"
                            placeholder={ejercicio.series}
                            value={series}
                            onChange={handleInputChangeSeries}
                            step="1"
                            min="0"
                            max="100"
                        />
                        <div>
                            <button type="button" onClick={handleIncrementar} className={styles.flecha}>+</button>
                            <button type="button" onClick={handleDecrementar} className={styles.flecha}>-</button>
                        </div>
                        
                </div>
                <button className={styles.completeBtn} onClick={handleConfirmarSeries}><i className='fas fa-check-circle'></i></button>
                <button className={styles.trashBtn}><i className='fas fa-trash'></i></button>
            </div>
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