import { forIn, groupBy } from "lodash";
import { useState } from "react";
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

function Ejercicios() {
    const ejercicios = [
        {
            nombre: "Press de banca",
            series: [
                { serieNum: 0, peso: 80, repeticiones: 10, fecha: "2025-02-01" },
                { serieNum: 1, peso: 85, repeticiones: 8, fecha: "2025-02-01" },
                { serieNum: 2, peso: 90, repeticiones: 6, fecha: "2025-02-01" },
                { serieNum: 0, peso: 92, repeticiones: 5, fecha: "2025-02-02" },
                { serieNum: 0, peso: 95, repeticiones: 4, fecha: "2025-02-03" },
                { serieNum: 1, peso: 100, repeticiones: 3, fecha: "2025-02-03" },
                { serieNum: 0, peso: 102, repeticiones: 2, fecha: "2025-02-04" },
                { serieNum: 1, peso: 105, repeticiones: 1, fecha: "2025-02-04" }
            ]
        },
        {
            nombre: "Sentadilla",
            series: [
                { serieNum: 0, peso: 80, repeticiones: 10, fecha: "2025-02-01" },
                { serieNum: 1, peso: 85, repeticiones: 8, fecha: "2025-02-01" },
                { serieNum: 2, peso: 90, repeticiones: 6, fecha: "2025-02-01" },
                { serieNum: 0, peso: 92, repeticiones: 5, fecha: "2025-02-02" },
                { serieNum: 0, peso: 95, repeticiones: 4, fecha: "2025-02-03" },
                { serieNum: 1, peso: 100, repeticiones: 3, fecha: "2025-02-03" },
                { serieNum: 0, peso: 102, repeticiones: 2, fecha: "2025-02-04" },
                { serieNum: 1, peso: 105, repeticiones: 1, fecha: "2025-02-04" }
            ]
        },
        {
            nombre: "Dominadas",
            series: [
                { serieNum: 0, peso: 80, repeticiones: 10, fecha: "2025-02-01" },
                { serieNum: 1, peso: 85, repeticiones: 8, fecha: "2025-02-01" },
                { serieNum: 2, peso: 90, repeticiones: 6, fecha: "2025-02-01" },
                { serieNum: 0, peso: 92, repeticiones: 5, fecha: "2025-02-02" },
                { serieNum: 0, peso: 95, repeticiones: 4, fecha: "2025-02-03" },
                { serieNum: 1, peso: 100, repeticiones: 3, fecha: "2025-02-03" },
                { serieNum: 0, peso: 102, repeticiones: 2, fecha: "2025-02-04" },
                { serieNum: 1, peso: 105, repeticiones: 1, fecha: "2025-02-04" }
            ]
        }
    ];

    return (
        <>
            <ul>
                {ejercicios.map((ejercicio) => (
                    <Ejercicio key={ejercicio.nombre} ejercicio={ejercicio} />
                ))}
            </ul>
        </>
    );
}

function Ejercicio({ ejercicio }) {
    const seriesAgrupadas = groupBy(ejercicio.series, 'serieNum');
    const [graficoSeleccionado, setGraficoSeleccionado] = useState(seriesAgrupadas['0']);
  
    const handleMostrarGrafico = (serieGrupo) => {
      setGraficoSeleccionado(serieGrupo);
    };
  
    return (
      <>
        <div className="contenedor-ejercicio">
          <h2>{ejercicio.nombre}</h2>
          <p>Mostrar en serie: </p>
          {Object.keys(seriesAgrupadas).map((serieGrupo, indice) => (
            <button 
                key={indice} 
                onClick={() => handleMostrarGrafico(seriesAgrupadas[serieGrupo])}
            >
              Serie {indice + 1}
            </button>
          ))}
  
          {<GraficoEjercicio data={graficoSeleccionado} />}
        </div>
      </>
    );
  }

function GraficoEjercicio({ data }) {
    // Crear las etiquetas y los datos de la gráfica
    const labels = data.map((medida) => medida.fecha);
    const datosPeso = data.map((medida) => medida.peso);
    const datosRepeticiones = data.map((medida) => medida.repeticiones);
  
    const chartData = {
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
          label: 'Repeticiones',
          data: datosRepeticiones,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          yAxisID: 'y1',
        },
      ],
    };
  
    const chartOptions = {
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
            text: 'Repeticiones',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };
  
    return <Line data={chartData} options={chartOptions} />;
  }


export default Ejercicios