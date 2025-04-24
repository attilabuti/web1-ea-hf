const dataList = document.getElementById('data-list');

const labels = ['Január', 'Február', 'Március', 'Április', 'Május'];

const dataSetIncome = [
    [12, 47, 8, 36, 25],
    [5, 23, 41, 17, 30],
    [44, 19, 6, 32, 11],
    [27, 14, 49, 3, 38],
    [22, 10, 35, 46, 7]
];

const dataSetExpense = [
    [9, 28, 47, 15, 34],
    [3, 18, 26, 40, 12],
    [45, 7, 21, 38, 29],
    [16, 33, 2, 50, 24],
    [6, 43, 11, 31, 20]
];

function drawTable() {
    for (let i = 0; i < dataSetIncome.length; i++) {
        const tr = document.createElement('tr');

        let dataText = '';
        for (let y = 0; y < dataSetIncome[i].length; y++) {
            dataText += `<td>${dataSetIncome[i][y]} / ${dataSetExpense[i][y]}</td>`;
        }

        tr.innerHTML = `
            ${dataText}
            <td>
                <a href="#" onclick="visualise(${i})">Diagram</a>
            </td>
        `;

        dataList.appendChild(tr);
    }
}

var currentLineChart;

function visualise(id) {
    if (currentLineChart !== undefined) {
        currentLineChart.destroy();
        currentLineChart = undefined;
    }

    let dataIncome = dataSetIncome[id];
    let dataExpense = dataSetExpense[id];

    let ctx = document.getElementById('lineChart').getContext('2d');

    currentLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Kiadás',
                    data: dataExpense,
                    borderColor: 'blue',
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: 'Bevétel',
                    data: dataIncome,
                    borderColor: 'red',
                    borderWidth: 2,
                    fill: true,
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Hónapok',
                        font: {
                            padding: 4,
                            size: 20,
                            weight: 'bold',
                            family: 'Arial'
                        },
                        color: 'darkblue'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Összegek',
                        font: {
                            size: 20,
                            weight: 'bold',
                            family: 'Arial'
                        },
                        color: 'darkblue'
                    },
                    beginAtZero: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Összegek',
                    }
                }
            }
        }
    });
}

drawTable();
