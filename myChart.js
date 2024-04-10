function renderPopupStatsChart(stats) {
    // Chart-Canvas auswählen und alten Chart entfernen, falls vorhanden
    let canvas = document.getElementById('popupChart');
    if (canvas.chart) {
        canvas.chart.destroy();
    }

    // Kontext des Canvas holen und neuen Chart erstellen
    let ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stats.map(stat => stat.stat.name),
            datasets: [{
                label: 'Base Stats',
                data: stats.map(stat => stat.base_stat),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            legend: {
                display: false // Verstecke die Legende
            },
            title: {
                display: true,
                text: 'Base Stats' // Setze den Titel des Diagramms
            }
        }
    });
}