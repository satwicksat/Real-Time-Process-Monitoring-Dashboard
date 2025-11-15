const cpuCtx = document.getElementById("cpuChart").getContext("2d");
let cpuValues = [];

const cpuChart = new Chart(cpuCtx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "CPU Usage",
            data: cpuValues,
            borderColor: "skyblue",
            backgroundColor: "rgba(135,206,235,0.3)",
            tension: 0.3
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    }
});

async function loadStats() {
    const response = await fetch("/api/stats");
    const data = await response.json();

    // Update chart
    cpuChart.data.labels.push(new Date().toLocaleTimeString());
    cpuChart.data.datasets[0].data.push(data.cpu);

    if (cpuChart.data.labels.length > 20) {
        cpuChart.data.labels.shift();
        cpuChart.data.datasets[0].data.shift();
    }

    cpuChart.update();

    // Update memory
    document.getElementById("total").innerText = data.total_mem;
    document.getElementById("used").innerText = data.used_mem;
    document.getElementById("free").innerText = data.free_mem;
}

async function loadProcesses() {
    const response = await fetch("/api/processes");
    const processes = await response.json();
    
    const tableBody = document.querySelector("#processTable tbody");
    tableBody.innerHTML = "";

    processes.forEach(proc => {
        const row = `
            <tr>
                <td>${proc.pid}</td>
                <td>${proc.name}</td>
                <td>${proc.cpu_percent}</td>
                <td>${proc.memory_percent.toFixed(2)}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

setInterval(loadStats, 2000);
setInterval(loadProcesses, 3000);
