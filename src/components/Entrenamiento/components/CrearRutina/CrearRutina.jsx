import React, { useState } from 'react';
import styles from './CrearRutina.module.css';

function CrearRutina() {
    const [pasos, setPasos] = useState(0);
    const [diasSeleccionados, setDiasSeleccionados] = useState([]);

    const handleConfirmarRutinaYDias = () => {
        const checkboxes = document.querySelectorAll('input[name="dias"]:checked');
        const dias = Array.from(checkboxes).map((checkbox) => checkbox.value);

        setDiasSeleccionados(dias);
        setPasos(1);
    };

    return (
        <>
            {pasos === 0 && (
                <PasoRutinaYDiasSeleccionados handleConfirmarRutinaYDias={handleConfirmarRutinaYDias} />
            )}
            {pasos === 1 && <CargarDias dias={diasSeleccionados} />}
        </>
    );
}

function CargarDias({ dias }) {
    const [diaSeleccionado, setDiaSeleccionado] = useState(null); // Estado para el día seleccionado
    const [diasConfirmados, setDiasConfirmados] = useState([]); // Días confirmados

    const handleSeleccionarDia = (dia) => {
        setDiaSeleccionado(dia); // Actualiza el día seleccionado
    };

    const handleVolver = () => {
        setDiaSeleccionado(null); // Regresa a la lista de días
    };

    const handleConfirmar = (dia) => {
        setDiasConfirmados((prev) => [...prev, dia]);
        setDiaSeleccionado(null); 
        console.log('Días confirmados:', diasConfirmados);
    };

    return (
        <>
            {!diaSeleccionado ? (
                <div className={styles.contenedorFormulario}>
                    <h3>Días seleccionados</h3>
                    <ul className={styles.listaDias}>
                        {dias.map((dia) => (
                            <li key={dia}>
                                <button
                                    className={`${styles.botonDia} ${
                                        diasConfirmados.includes(dia) ? styles.botonDiaConfirmado : ''
                                    }`}
                                    onClick={() => handleSeleccionarDia(dia)}
                                >
                                    {dia}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <CargarEjercicio
                    dia={diaSeleccionado}
                    handleVolver={handleVolver}
                    handleConfirmar={handleConfirmar}
                />
            )}
        </>
    );
}

function CargarEjercicio({ dia, handleVolver, handleConfirmar }) {
    return (
        <div className={styles.contenedorFormulario}>
            <h3>Cargar Ejercicio para {dia}</h3>
            {/* Aquí puedes añadir un formulario para cargar ejercicios */}
            <button className={styles.boton} onClick={handleVolver}>
                Volver
            </button>
            <button className={styles.boton} onClick={() => handleConfirmar(dia)}>
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
            <label htmlFor="nombre-rutina">Nombre de la rutina</label>
            <input type="text" id="nombre-rutina" placeholder="Nombre de la rutina" required />
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
            <button className={styles.boton} onClick={handleConfirmarRutinaYDias}>
                Confirmar
            </button>
        </>
    );
}

export default CrearRutina;
