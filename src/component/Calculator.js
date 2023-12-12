// Calculator.js

import React, { useState } from 'react';

const Calculator = () => {
    const [result, setResult] = useState('');
    const [inflation, setInflation] = useState(8.4);

    const handleCalculate = () => {
        const cost = parseFloat(document.getElementById("cost").value);
        const monthlyPrice = parseFloat(document.getElementById("monthlyPrice").value);
        const months = parseInt(document.getElementById("months").value);
        const inflation = parseFloat(document.getElementById("inflation").value) / 100;

        if (isNaN(cost) || isNaN(monthlyPrice) || isNaN(months) || isNaN(inflation)) {
            setResult("Por favor, ingrese números válidos en todos los campos.");
        } else if (months < 1 || months > 24) {
            setResult("La cantidad de cuotas debe estar entre 1 y 24.");
        } else {
            const decision = calcularPagoConInflacion(cost, monthlyPrice, inflation, months);
            setResult(decision);
        }
    };

    const handleClear = () => {
        document.getElementById("cost").value = "";
        document.getElementById("monthlyPrice").value = "";
        document.getElementById("months").value = "";
        document.getElementById("inflation").value = "8.4";
        setResult('');
    };


    const calcularPagoConInflacion = (pagoContado, pagoCuotas, tasaInflacion, numeroCuotas) => {
        if (numeroCuotas === 1) {
            pagoCuotas /= 1 + tasaInflacion;
        } else {
            let valorActualCuota = pagoCuotas;
            for (let mes = 1; mes <= numeroCuotas; mes++) {
                valorActualCuota /= 1 + tasaInflacion;
            }
            pagoCuotas = valorActualCuota;
        }

        if (pagoCuotas < pagoContado) {
            return "Le conviene comprar en cuotas.";
        } else {
            return "Le conviene comprar de contado.";
        }
    };

    return (
        <div className="calculator-section" id="cuotas">
            <h1>Cuotas o Contado?</h1>
            <h5>Calcula si te conviene pagar en cuotas o de Contado</h5>
            <form id="calculator">
                <div>
                    <label htmlFor="cost">Monto en un solo pago:</label>
                    <input type="number" id="cost" required />
                    <div className="invalid-feedback"></div>
                </div>
                <div>
                    <label htmlFor="monthlyPrice">Precio en cuotas:</label>
                    <input type="number" id="monthlyPrice" required />
                    <div className="invalid-feedback"></div>
                </div>
                <div>
                    <label htmlFor="months">Cantidad de cuotas:</label>
                    <input type="number" id="months" required />
                    <div className="invalid-feedback">La cantidad de cuotas debe ser un número entre 1 y 24.</div>
                </div>
                <div>
                    <label htmlFor="inflation">
                        <p>Inflación Estimada Indec Octubre 2023 (8.4%):</p>
                    </label>
                    <div className="inflation-input">
                        <input type="number" id="inflation" value={inflation} required />   
                    </div>
                </div>
                <div>
                    <button type="button" onClick={handleCalculate}>Calcular</button>
                    <button type="button" onClick={handleClear}>Limpiar</button>
                </div>
                <div id="result">{result}</div>
            </form>
        </div>
    );
};

export default Calculator;
