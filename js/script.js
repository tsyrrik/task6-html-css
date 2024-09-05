// Функция для получения данных через AJAX запрос
function fetchData() {
    return fetch('https://cors-anywhere.herokuapp.com/http://51.250.13.229/api/safetyEnterprise')
        .then(response => response.json())
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
            throw error;
        });
}

// Функция для создания таблицы с данными
function createTable(data) {
    const tableHeaders = [
        'Предприятие', 'Коэф. повторяемости', 'Коэф. устраняемости',
        'Кол-во нарушений', 'Кол-во предписаний', 'Приостановки работ',
        'Выполнено в срок', 'Не выполнено в срок', 'На контроле',
        'Просрочено', 'Выполнено'
    ];

    const tableRows = data.map(item => `
        <tr>
            <td>${item.PREDPR_NAIM}</td>
            <td>${item.REPEAT_ENT}</td>
            <td>${item.FACTOR_ELIMINATE || '—'}</td>
            <td>${item.KOL_NARUSH}</td>
            <td>${item.KOL_PREDPIS}</td>
            <td>${item.PRIOSTANOVKI}</td>
            <td>${item.ISP_V_SROK}</td>
            <td>${item.ISP_NE_V_SROK}</td>
            <td>${item.NE_ISTEK_SROK}</td>
            <td>${item.ISTEK_SROK}</td>
            <td>${item.VYP}</td>
        </tr>
    `).join('');

    const tableHTML = `
        <table>
            <thead>
                <tr>${tableHeaders.map(header => `<th>${header}</th>`).join('')}</tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
    `;

    document.getElementById('tableContainer').innerHTML = tableHTML;
}

// Функция для создания объектов данных для диаграммы
function createDataset(label, data, backgroundColor, borderColor) {
    return {
        label,
        data,
        backgroundColor,
        borderColor,
        borderWidth: 1
    };
}

// Функция для создания диаграммы на основе данных
function createChart(data) {
    const labels = data.map(item => item.PREDPR_NAIM);
    const datasets = [
        createDataset('Коэф. повторяемости', data.map(item => item.REPEAT_ENT), 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)'),
        createDataset('Коэф. устраняемости', data.map(item => item.FACTOR_ELIMINATE || 0), 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 1)'),
        createDataset('Кол-во нарушений', data.map(item => item.KOL_NARUSH), 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)'),
        createDataset('Кол-во предписаний', data.map(item => item.KOL_PREDPIS), 'rgba(255, 206, 86, 0.2)', 'rgba(255, 206, 86, 1)'),
        createDataset('Приостановки работ', data.map(item => item.PRIOSTANOVKI), 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)'),
        createDataset('Выполнено в срок', data.map(item => item.ISP_V_SROK), 'rgba(104, 255, 102, 0.2)', 'rgba(104, 255, 102, 1)'),
        createDataset('Не выполнено в срок', data.map(item => item.ISP_NE_V_SROK), 'rgba(255, 159, 64, 0.2)', 'rgba(255, 159, 64, 1)'),
        createDataset('На контроле', data.map(item => item.NE_ISTEK_SROK), 'rgba(153, 102, 102, 0.2)', 'rgba(153, 102, 102, 1)'),
        createDataset('Просрочено', data.map(item => item.ISTEK_SROK), 'rgba(201, 203, 207, 0.2)', 'rgba(201, 203, 207, 1)'),
        createDataset('Выполнено', data.map(item => item.VYP), 'rgba(102, 255, 255, 0.2)', 'rgba(102, 255, 255, 1)')
    ];

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

// Инициализация получения данных и отрисовки таблицы и диаграммы
fetchData().then(data => {
    createTable(data);
    createChart(data);
});
