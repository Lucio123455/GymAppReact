import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./Dia.module.css";
import { map } from "lodash";

const rutinas = [
    {
        nombre: "fullbody",
        dias: [
            {
                dia: "Lunes",
                ejercicios: [
                    {
                        nombre: "Sentadillas",
                        series: [
                            { peso: 60, repeticiones: 12 },
                            { peso: 65, repeticiones: 10 }
                        ]
                    },
                    {
                        nombre: "Push-ups",
                        series: [
                            { peso: 0, repeticiones: 15 },
                            { peso: 0, repeticiones: 12 }
                        ]
                    },
                    {
                        nombre: "Plancha",
                        series: [
                            { peso: 0, repeticiones: 30 },
                            { peso: 0, repeticiones: 40 }
                        ]
                    }
                ]
            },
            {
                dia: "Miércoles",
                ejercicios: [
                    {
                        nombre: "Burpees",
                        series: [
                            { peso: 0, repeticiones: 10 },
                            { peso: 0, repeticiones: 12 }
                        ]
                    },
                    {
                        nombre: "Zancadas",
                        series: [
                            { peso: 20, repeticiones: 10 },
                            { peso: 25, repeticiones: 8 }
                        ]
                    },
                    {
                        nombre: "Abdominales",
                        series: [
                            { peso: 0, repeticiones: 20 },
                            { peso: 0, repeticiones: 25 }
                        ]
                    }
                ]
            }
        ]
    },
];

const obtenerEjercicios = (nombre, dia) => {
    const rutina = rutinas.find(r => r.nombre === nombre)
    const ejercicios = rutina.dias.find(d => d.dia === dia).ejercicios
    return ejercicios
}

export function Dia() {
    const { nombreRutina, dia } = useParams();
    const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const rutinaKey = nombreRutina?.toLowerCase();
    const diaKey = dia?.charAt(0).toUpperCase() + dia.slice(1).toLowerCase();

    const ejercicios = obtenerEjercicios(rutinaKey, diaKey);

    // Evitar que el usuario navegue hacia atrás
    useEffect(() => {
        const handlePopState = (event) => {
            // Si el usuario hace clic en el botón de retroceso, redirigirlo a la página de ejercicios
            setEjercicioSeleccionado(null); // Restablecer el estado
            navigate(".", { replace: true }); // Reemplazar el historial para no permitir retroceder
        };

        // Escuchar el evento de retroceso
        window.history.pushState(null, "", window.location.href); // Mantener la página actual
        window.addEventListener("popstate", handlePopState);

        return () => {
            // Limpiar el evento cuando el componente se desmonta
            window.removeEventListener("popstate", handlePopState);
        };
    }, [navigate]);

    const onEjercicioSeleccionado = (ejercicio) => {
        setEjercicioSeleccionado(ejercicio);
        navigate(".", { state: { ejercicioSeleccionado: ejercicio } });
    };

    return (
        <div className="container">
            {ejercicioSeleccionado ? (
                <>
                    <h3>{ejercicioSeleccionado.nombre}</h3>
                    <ul>
                        {ejercicioSeleccionado.series.map((serie, index) => (
                            <li key={index}>
                                Peso: {serie.peso} Repes: {serie.repeticiones}
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <ul>
                    {ejercicios.map((ejercicio, index) => (
                        <li key={index}>
                            {ejercicio.nombre}
                            <button onClick={() => onEjercicioSeleccionado(ejercicio)}>
                                Ver Series
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

