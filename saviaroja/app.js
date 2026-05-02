const PRICES = {
    wholesale: {
        glycerin: 20, // por kg
        blood: 0.15,  // por ml
        vitE: 0.20,   // por ml
        oil: 1.50     // por ml
    },
    retail: {
        glycerin: 35,
        blood: 0.34,
        vitE: 1.00,
        oil: 4.00
    }
};

const RECIPE_PER_10 = {
    glycerin: 1,    // kg
    blood: 20,      // ml
    vitE: 5,        // ml
    oil: 10         // ml
};

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).classList.add('active');
    
    // Highlight the correct nav button
    const navBtn = document.querySelector(`nav .tab-btn[onclick*="'${tabId}'"]`);
    if (navBtn) navBtn.classList.add('active');
}

function calculate() {
    const units = parseFloat(document.getElementById('units').value) || 0;
    const targetPrice = parseFloat(document.getElementById('price-target').value) || 0;
    const mode = document.getElementById('mode').value;
    
    const multiplier = units / 10;
    const p = PRICES[mode];

    const ingredients = [
        { name: 'Base de Glicerina', qty: (RECIPE_PER_10.glycerin * multiplier).toFixed(2) + ' kg', cost: p.glycerin, subtotal: RECIPE_PER_10.glycerin * multiplier * p.glycerin },
        { name: 'Sangre de Grado', qty: (RECIPE_PER_10.blood * multiplier).toFixed(0) + ' ml', cost: p.blood, subtotal: RECIPE_PER_10.blood * multiplier * p.blood },
        { name: 'Vitamina E', qty: (RECIPE_PER_10.vitE * multiplier).toFixed(0) + ' ml', cost: p.vitE, subtotal: RECIPE_PER_10.vitE * multiplier * p.vitE },
        { name: 'Aceite Esencial', qty: (RECIPE_PER_10.oil * multiplier).toFixed(0) + ' ml', cost: p.oil, subtotal: RECIPE_PER_10.oil * multiplier * p.oil }
    ];

    let totalInsumos = 0;
    const tableBody = document.getElementById('ingredients-table');
    tableBody.innerHTML = '';

    ingredients.forEach(item => {
        totalInsumos += item.subtotal;
        const row = `<tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>S/ ${item.cost.toFixed(2)}</td>
            <td>S/ ${item.subtotal.toFixed(2)}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    const unitCost = totalInsumos / units;
    const totalRevenue = units * targetPrice;
    const totalProfit = totalRevenue - totalInsumos;

    document.getElementById('total-cost').innerText = `S/ ${totalInsumos.toFixed(2)}`;
    document.getElementById('unit-cost').innerText = `S/ ${unitCost.toFixed(2)}`;
    document.getElementById('total-profit').innerText = `S/ ${totalProfit.toFixed(2)}`;
    
    if (unitCost >= targetPrice) {
        document.getElementById('unit-cost').style.color = 'red';
    } else {
        document.getElementById('unit-cost').style.color = 'inherit';
    }
}

function exportExcel() {
    const units = document.getElementById('units').value;
    const mode = document.getElementById('mode').value.toUpperCase();
    const totalProd = document.getElementById('total-cost').innerText;
    const unitProd = document.getElementById('unit-cost').innerText;
    
    // Estilos Inline para Excel
    const headerStyle = "background-color: #4A0E0E; color: #C2A478; font-weight: bold; border: 1px solid #C2A478;";
    const totalStyle = "background-color: #F8F1E7; font-weight: bold; border-top: 2px solid #4A0E0E;";
    const categoryStyle = "background-color: #fcfaf7; font-weight: bold; color: #4A0E0E;";

    let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Presupuesto Sabia Roja</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
        <body style="font-family: Arial, sans-serif;">
            <h1 style="color: #4A0E0E;">INFORME INTEGRAL - SABIA ROJA</h1>
            <p><b>Unidades:</b> ${units} | <b>Perfil:</b> ${mode}</p>
            
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <tr style="${headerStyle}">
                    <th colspan="4" style="padding: 10px;">1. PRESUPUESTO DE PRODUCCIÓN (INSUMOS)</th>
                </tr>
                <tr style="background: #eee; font-weight: bold;">
                    <td>Ingrediente</td><td>Cantidad</td><td>Costo Unit (S/)</td><td>Subtotal (S/)</td>
                </tr>
                ${Array.from(document.querySelectorAll("#ingredients-table tr")).map(row => {
                    const cells = Array.from(row.querySelectorAll("td")).map(c => `<td>${c.innerText}</td>`).join("");
                    return `<tr>${cells}</tr>`;
                }).join("")}
                <tr style="${totalStyle}">
                    <td colspan="3">COSTO TOTAL PRODUCCION</td><td>${totalProd}</td>
                </tr>
                <tr style="${totalStyle}">
                    <td colspan="3">COSTO UNITARIO</td><td>${unitProd}</td>
                </tr>
            </table>

            <br>

            <table border="1" style="border-collapse: collapse; width: 100%;">
                <tr style="${headerStyle}">
                    <th colspan="3" style="padding: 10px;">2. PRESUPUESTO DE COMUNICACIÓN Y MARKETING</th>
                </tr>
                <tr style="background: #eee; font-weight: bold;">
                    <td>Componente</td><td>Elemento</td><td>Presupuesto (S/)</td>
                </tr>
                ${Array.from(document.querySelectorAll(".marketing-table tbody tr")).map(row => {
                    const cells = Array.from(row.querySelectorAll("td"));
                    if (cells.length === 3) {
                        return `<tr style="${categoryStyle}"><td>${cells[0].innerText}</td><td>${cells[1].innerText}</td><td>${cells[2].innerText}</td></tr>`;
                    } else {
                        return `<tr><td></td><td>${cells[0].innerText}</td><td>${cells[1].innerText}</td></tr>`;
                    }
                }).join("")}
                <tr style="${headerStyle}">
                    <td colspan="2">TOTAL COMUNICACIÓN</td>
                    <td>${document.querySelector(".total-row td:last-child").innerText}</td>
                </tr>
            </table>

            <br>

            <table border="1" style="border-collapse: collapse; width: 100%;">
                <tr style="${headerStyle}">
                    <th colspan="3" style="padding: 10px;">3. ESTRATEGIA DE NEGOCIO</th>
                </tr>
                <tr>
                    <td style="padding: 15px; width: 33%; vertical-align: top;">
                        <h4 style="color: #4A0E0E; margin-bottom: 10px;">Idea de Negocio</h4>
                        <p style="font-size: 10pt;">${document.querySelector('#tab-strategy .card:nth-child(1) p').innerText}</p>
                    </td>
                    <td style="padding: 15px; width: 33%; vertical-align: top;">
                        <h4 style="color: #4A0E0E; margin-bottom: 10px;">Sustentación</h4>
                        <p style="font-size: 10pt;">${document.querySelector('#tab-strategy .card:nth-child(2) p').innerText}</p>
                    </td>
                    <td style="padding: 15px; width: 33%; vertical-align: top;">
                        <h4 style="color: #4A0E0E; margin-bottom: 10px;">Público Objetivo</h4>
                        <ul style="font-size: 10pt;">
                            ${Array.from(document.querySelectorAll('#tab-strategy ul li')).map(li => `<li>${li.innerText}</li>`).join("")}
                        </ul>
                    </td>
                </tr>
            </table>

            <br>

            <table border="1" style="border-collapse: collapse; width: 100%;">
                <tr style="${headerStyle}">
                    <th style="padding: 10px;">4. ANÁLISIS Y REGULACIÓN</th>
                </tr>
                <tr>
                    <td style="padding: 15px; background-color: #fdfaf5;">
                        <p><b>Nota sobre la SBS:</b> ${document.querySelector('.alert.note').innerText.replace('Regulación SBS:', '')}</p>
                        <p style="margin-top: 10px;"><b>Requerimiento DIGEMID:</b> ${document.querySelector('.alert.important').innerText.replace('Siguiente Paso (DIGEMID):', '')}</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Reporte_Integral_Sabia_Roja_${units}u.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportWord() {
    try {
        const content = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
            <head><meta charset="UTF-8"><title>Proyecto Sabia Roja</title>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; padding: 30pt; color: #333; }
                .header-title { color: #4A0E0E; text-align: center; font-size: 24pt; font-weight: bold; margin-bottom: 5pt; text-transform: uppercase; border-bottom: 3px solid #4A0E0E; padding-bottom: 10pt; }
                .header-subtitle { text-align: center; font-style: italic; color: #555; margin-bottom: 30pt; }
                h2 { color: #4A0E0E; margin-top: 25pt; border-bottom: 1px solid #C2A478; font-size: 18pt; padding-bottom: 5pt; }
                h3 { color: #8B0000; margin-top: 15pt; font-size: 14pt; }
                .layout-table { width: 100%; border-collapse: collapse; margin-bottom: 20pt; }
                .layout-table td { width: 50%; padding: 15pt; vertical-align: top; border: 1px solid #eee; background: #fafafa; }
                .quote-box { font-style: italic; color: #444; border-left: 4px solid #C2A478; padding-left: 10pt; }
                .data-table { width: 100%; border-collapse: collapse; margin-top: 10pt; margin-bottom: 20pt; }
                .data-table th { background-color: #4A0E0E; color: white; padding: 8pt; text-align: left; font-size: 10pt; border: 1px solid #4A0E0E; }
                .data-table td { border: 1px solid #ddd; padding: 8pt; vertical-align: top; font-size: 10pt; }
                .foda-table { width: 100%; border-collapse: collapse; margin-top: 10pt; }
                .foda-table td { border: 1px solid #333; padding: 12pt; vertical-align: top; width: 50%; }
                .f-title { background-color: #2e7d32; color: white; font-weight: bold; }
                .o-title { background-color: #1565c0; color: white; font-weight: bold; }
                .d-title { background-color: #ef6c00; color: white; font-weight: bold; }
                .a-title { background-color: #c62828; color: white; font-weight: bold; }
                .diagram-box { text-align: center; margin: 20pt 0; background: #F8F1E7; padding: 25pt; border: 2px solid #C2A478; border-radius: 10px; }
                .premium-tag { color: #C2A478; font-weight: bold; }
            </style>
            </head>
            <body>
                <div class="header-title">PROYECTO EMPRESARIAL: SABIA ROJA</div>
                <div class="header-subtitle">"Cosmética Curativa de Sangre de Grado" - Huánuco, Perú</div>
                
                <h2>1. GESTIÓN ESTRATÉGICA</h2>
                <table class="layout-table">
                    <tr>
                        <td>
                            <h3 style="margin-top:0;">1.1 La Visión</h3>
                            <div class="quote-box">${document.querySelector('#tab-project .quote:first-of-type').innerText}</div>
                        </td>
                        <td>
                            <h3 style="margin-top:0;">1.2 La Misión</h3>
                            <div class="quote-box">${document.querySelector('#tab-project .quote:last-of-type').innerText}</div>
                        </td>
                    </tr>
                </table>

                <h3>1.3 Valores Corporativos</h3>
                <ul style="color: #444;">
                    ${Array.from(document.querySelectorAll('.values-list li')).map(li => `<li>${li.innerHTML}</li>`).join("")}
                </ul>
                
                <h3>1.4 Objetivos Estratégicos (Nacional)</h3>
                <table class="data-table">
                    <tr><th>ÁREA DE GESTIÓN</th><th>OBJETIVO ESTRATÉGICO</th></tr>
                    ${Array.from(document.querySelectorAll('#table-objectives tbody tr')).map(row => `<tr><td>${row.cells[0].innerText}</td><td>${row.cells[1].innerText}</td></tr>`).join("")}
                </table>

                <h3>1.5 Objetivos de Exportación (Planes Futuros)</h3>
                <table class="data-table">
                    <tr><th>ÁREA COMERCIAL</th><th>META DE INTERNACIONALIZACIÓN</th></tr>
                    ${Array.from(document.querySelectorAll('#table-objectives-export tbody tr')).map(row => `<tr><td>${row.cells[0].innerText}</td><td>${row.cells[1].innerText}</td></tr>`).join("")}
                </table>

                <h3>1.6 Matriz FODA</h3>
                <table class="foda-table">
                    <tr><td class="f-title">FORTALEZAS (+)</td><td class="d-title">DEBILIDADES (-)</td></tr>
                    <tr><td>${document.querySelector('.f-box').innerText}</td><td>${document.querySelector('.d-box').innerText}</td></tr>
                    <tr><td class="o-title">OPORTUNIDADES (+)</td><td class="a-title">AMENAZAS (-)</td></tr>
                    <tr><td>${document.querySelector('.o-box').innerText}</td><td>${document.querySelector('.a-box').innerText}</td></tr>
                </table>

                <h2>2. ESTUDIO DE MERCADO</h2>
                <h3>2.1 Segmentación y Perfil del Cliente</h3>
                <table class="data-table">
                    <tr><th>SEGMENTO</th><th>PERFIL DETALLADO</th></tr>
                    ${Array.from(document.querySelectorAll('#table-segmentation tbody tr')).map(row => `<tr><td><b>${row.cells[0].innerText}</b></td><td>${row.cells[1].innerText}</td></tr>`).join("")}
                </table>

                <h3>2.2 Análisis de la Competencia</h3>
                <table class="data-table">
                    <tr style="background:#4A0E0E; color:white;"><td>CONCEPTO</td><td>Fusion</td><td>Biocosm.</td><td>Amy & Co</td><td>Sabia Roja</td></tr>
                    ${Array.from(document.querySelectorAll('#table-competitors tbody tr')).map(row => `<tr><td>${row.cells[0].innerText}</td><td>${row.cells[1].innerText}</td><td>${row.cells[2].innerText}</td><td>${row.cells[3].innerText}</td><td><b>${row.cells[4].innerText}</b></td></tr>`).join("")}
                </table>

                <h2>3. ESTRATEGIA DE MARKETING (4Ps)</h2>
                <h3>3.1 Estrategia de Producto y Empaque Premium</h3>
                <p>Nuestra propuesta se basa en la pureza del látex de Sangre de Grado. <br>
                <b>Empaque:</b> Envases de vidrio ámbar farmacéutico con dosificadores de lujo en oro mate y etiquetas resistentes con acabados en foil dorado.</p>

                <h3>3.2 Estructura de Precios Dual</h3>
                <p><b>Mercado Nacional (Huánuco):</b></p>
                <table class="data-table">
                    <tr><th>PRODUCTO</th><th>COSTO UNITARIO</th><th>P.V.P (SOLES)</th></tr>
                    ${Array.from(document.querySelectorAll('#table-pricing-national tbody tr')).map(row => `<tr><td>${row.cells[0].innerText}</td><td>${row.cells[1].innerText}</td><td><b>${row.cells[2].innerText}</b></td></tr>`).join("")}
                </table>

                <p style="margin-top: 15pt;"><b>Mercado de Exportación (Dólares):</b></p>
                <table class="data-table">
                    <tr><th>PRODUCTO</th><th>COSTO UNITARIO</th><th>P.V.P (DÓLARES)</th></tr>
                    ${Array.from(document.querySelectorAll('#table-pricing-export tbody tr')).map(row => `<tr><td>${row.cells[0].innerText}</td><td>${row.cells[1].innerText}</td><td><b>${row.cells[2].innerText}</b></td></tr>`).join("")}
                </table>

                <h3>3.3 Proyecciones de Ventas</h3>
                <table class="data-table">
                    <tr><th>PRODUCTO</th><th>MES 1-4</th><th>MES 5-8</th><th>MES 9-12</th><th>TOTAL ANUAL</th></tr>
                    ${Array.from(document.querySelectorAll('#table-projections tbody tr')).map(row => `<tr><td>${row.cells[0].innerText}</td><td>${row.cells[1].innerText}</td><td>${row.cells[2].innerText}</td><td>${row.cells[3].innerText}</td><td><b>${row.cells[4].innerText}</b></td></tr>`).join("")}
                </table>

                <h2>4. OPERACIONES Y LOGÍSTICA</h2>
                <h3>4.1 Selección de Proveedores</h3>
                <table class="data-table">
                    <tr><th>PROVEEDOR</th><th>ESPECIALIDAD</th><th>PUNTAJE CALIFICACIÓN</th></tr>
                    ${Array.from(document.querySelectorAll('#table-suppliers tbody tr')).map(row => `<tr><td>${row.cells[0].innerText}</td><td>${row.cells[1].innerText}</td><td>${row.cells[2].innerText}</td></tr>`).join("")}
                </table>

                <h3>4.2 Modelo de Distribución Exclusiva</h3>
                <div class="diagram-box">
                    <b style="color:#4A0E0E; font-size:14pt;">FLUJO DE VALOR:</b><br><br>
                    <span style="font-size:12pt;">🏭 PRODUCTOR → 🏪 PUNTO DE VENTA EXCLUSIVO → 👤 CONSUMIDOR FINAL</span>
                </div>
                <p><b>Justificación del Canal:</b> ${document.querySelector('#tab-project section:last-of-type p:last-of-type').innerText}</p>
                
                <p style="text-align:center; color:#888; font-size:8pt; margin-top:50pt;">Generado por Sabia Roja Dashboard - Gestión Estratégica 2026</p>
            </body>
            </html>
        `;

        const blob = new Blob([content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "PROYECTO_FINAL_SABIA_ROJA.doc";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error("Error en exportWord:", e);
        alert("Hubo un error al generar el archivo Word. Por favor, revisa la consola.");
    }
}

// Initial Run
window.onload = calculate;
