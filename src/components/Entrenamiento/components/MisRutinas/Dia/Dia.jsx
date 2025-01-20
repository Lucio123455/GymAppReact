import React from "react";
import { useParams } from "react-router-dom";
import styles from "./Dia.module.css";

const rutinas = {
    fullbody: {
        Lunes: ["Sentadillas", "Push-ups", "Plancha"],
        Miércoles: ["Burpees", "Zancadas", "Abdominales"],
        Viernes: ["Saltos", "Press de hombros", "Bicicleta"],
    },
    principiante: {
        Lunes: ["Caminar", "Estiramientos básicos"],
        Miércoles: ["Caminata rápida", "Estiramientos avanzados"],
        Viernes: ["Yoga", "Respiración consciente"],
    },
    avanzado: {
        Lunes: ["Sprint", "Levantamiento de pesas"],
        Miércoles: ["Deadlift", "Dominadas"],
        Viernes: ["Snatch", "Clean and Jerk"],
    },
};

export function Dia() {
    const { nombreRutina, dia } = useParams();

    const rutinaKey = nombreRutina?.toLowerCase();
    const diaKey = dia?.charAt(0).toUpperCase() + dia.slice(1).toLowerCase();

    const ejercicios = rutinas[rutinaKey]?.[diaKey];

    if (!ejercicios) {
        return <h2>No se encontraron ejercicios para esta rutina y día.</h2>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{`Rutina: ${nombreRutina}`}</h1>
            <h2 className={styles.subtitle}>{`Día: ${dia}`}</h2>
            <ul className={styles.list}>
                {ejercicios.map((ejercicio, index) => (
                    <li key={index} className={styles.listItem}>
                        {ejercicio}
                    </li>
                ))}
            </ul>
        </div>
    );
}

