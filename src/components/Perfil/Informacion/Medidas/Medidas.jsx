import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './Medidas.css'

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Medidas() {
    /*MEDIDAS HARDCODEADAS*/
    const medidasHistoricas = [
        { fecha: new Date('2023-10-01'), peso: 70.5, altura: 1.75 },
        { fecha: new Date('2023-10-15'), peso: 71.0, altura: 1.75 },
        { fecha: new Date('2023-11-01'), peso: 70.8, altura: 1.76 },
        { fecha: new Date('2023-11-15'), peso: 70.2, altura: 1.76 },
        { fecha: new Date('2023-12-01'), peso: 69.9, altura: 1.76 }
    ];

    return (
        <>
            <GraficoMedidasHistoricas medidasHistoricas={medidasHistoricas} />
            <BotonCargarNuevaMedida />
        </>
    );
}

function BotonCargarNuevaMedida() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    return (
        <>
            <button className='boton-cargar-nueva-medida' onClick={() => setMostrarFormulario(true)}>
                Cargar Nueva Medida
            </button>
            {mostrarFormulario && <FormularioNuevaMedida onClose={() => setMostrarFormulario(false)} />} 
        </>
    );
}

function FormularioNuevaMedida({ onClose }) {
    const [altura, setAltura] = useState('');
    const [peso, setPeso] = useState('');
    const [fecha, setFecha] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (altura <= 0 || peso <= 0 || !fecha) {
            alert("Ingrese valores válidos.");
            return;
        }
        console.log('Datos enviados:', { altura: altura / 100, peso: parseFloat(peso), fecha });
        onClose();
    };

    const handleCancel = () => {
        onClose()
    }

    return (
        <div>
            <h1>Formulario de Datos</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="altura">Altura (en cm):</label>
                    <input
                        type="number"
                        id="altura"
                        value={altura}
                        onChange={(e) => setAltura(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="peso">Peso (en kg):</label>
                    <input
                        type="number"
                        id="peso"
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="fecha">Fecha:</label>
                    <input
                        type="date"
                        id="fecha"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Enviar</button>
                <button onClick={handleCancel}>Cancelar</button>
            </form>
        </div>
    );
}

function GraficoMedidasHistoricas({ medidasHistoricas }) {
    const labels = medidasHistoricas.map((medida) => medida.fecha.toISOString().split('T')[0]);
    const datosPeso = medidasHistoricas.map((medida) => medida.peso);
    const datosAltura = medidasHistoricas.map((medida) => medida.altura);

    const data = {
        labels,
        datasets: [
            {
                label: 'Peso (kg)',
                data: datosPeso,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                yAxisID: 'y',
            },
            {
                label: 'Altura (m)',
                data: datosAltura,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                yAxisID: 'y1',
            },
        ],
    };

    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Peso (kg)',
                },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Altura (m)',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };
    return <Line data={data} options={options} />;
}

export default Medidas;