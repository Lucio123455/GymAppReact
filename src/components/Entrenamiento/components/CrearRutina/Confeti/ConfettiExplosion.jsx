import React, { useState } from 'react';
import './ConfettiExplosion.css';

const ConfettiExplosion = () => {
    const [confetti, setConfetti] = useState([]);

    const launchConfetti = (event) => {
        const x = event.clientX;
        const y = event.clientY;
        const newConfetti = [];

        for (let i = 0; i < 30; i++) { // Genera 30 confetis por explosión
            newConfetti.push({
                id: Date.now() + i,
                x,
                y,
                size: Math.random() * 10 + 5, // Tamaño entre 5px y 15px
                color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Color aleatorio
                angle: Math.random() * 360, // Ángulo de salida aleatorio
                speed: Math.random() * 5 + 2, // Velocidad aleatoria
            });
        }

        setConfetti((prev) => [...prev, ...newConfetti]);

        setTimeout(() => {
            setConfetti([]);
        }, 2000); // Los elimina después de 2 segundos
    };

    return (
        <div className="confetti-container" onClick={launchConfetti}>
            {confetti.map((piece) => (
                <div
                    key={piece.id}
                    className="confetti-piece"
                    style={{
                        left: `${piece.x}px`,
                        top: `${piece.y}px`,
                        width: `${piece.size}px`,
                        height: `${piece.size}px`,
                        backgroundColor: piece.color,
                        transform: `rotate(${piece.angle}deg)`,
                        animationDuration: `${piece.speed}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default ConfettiExplosion;
