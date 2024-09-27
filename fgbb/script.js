let chart
let data
let chartType = "line"

let dateRange = localStorage.getItem("dateRange")
if (dateRange) {
    const [startDate, endDate] = dateRange.split(" - ")
    document.getElementById("startDate").value = startDate
    document.getElementById("endDate").value = endDate
}

async function fetchData() {
	const response = await fetch("./mdata.json")
	data = await response.json()
	updateChart()
}

function updateChart() {
	const ctx = document.getElementById("messageChart").getContext("2d")
	const startDate = document.getElementById("startDate").value
	const endDate = document.getElementById("endDate").value

	// Filter data based on selected date range
	const filteredData = Object.keys(data)
		.filter(date => date >= startDate && date <= endDate)
		.reduce((obj, key) => {
			obj[key] = data[key]
			return obj
		}, {})

	const labels = Object.keys(filteredData)
	const values = Object.values(filteredData)

    // const trendLineValues = calculateTrendLine(values);
    const weeklyAverageValues = calculateWeeklyAverage(labels, values);

	if (chart) {
		chart.destroy()
	}

	chart = new Chart(ctx, {
		type: chartType,
		data: {
			labels: labels,
			datasets: [
				{
					label: "Messages Sent",
					data: values,
					backgroundColor: "rgba(75, 192, 192, 0.2)",
					borderColor: "rgba(75, 192, 192, 1)",
					borderWidth: 1,
				},
                // {
                //     label: 'Trend Line',
                //     data: trendLineValues,
                //     type: 'line', // Always render the trend line as a line chart
                //     fill: false,
                //     borderColor: 'rgba(255, 99, 132, 1)',
                //     borderWidth: 2,
                //     pointRadius: 0, // Remove points for the trend line
                //     borderDash: [5, 5], // Dotted trend line
                // },
                {
                    label: 'Weekly Average',
                    data: weeklyAverageValues,
                    type: 'line', // Weekly average is a line chart
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointRadius: 0, // No points for the weekly average line
                    borderDash: [10, 5], // Dashed line for weekly average
                }
			],
		},
		options: {
			scales: {
				x: {
					title: {
						display: true,
						text: "Date",
					},
				},
				y: {
					title: {
						display: true,
						text: "Number of Messages",
					},
					beginAtZero: true,
				},
			},
		},
	})
}

// function calculateTrendLine(values) {
//     const n = values.length;
//     const sumX = (n * (n + 1)) / 2; // Sum of 0 + 1 + 2 + ... + (n-1)
//     const sumY = values.reduce((acc, val) => acc + val, 0);
//     const sumXY = values.reduce((acc, val, index) => acc + index * val, 0);
//     const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6; // Sum of 0^2 + 1^2 + ... + (n-1)^2

//     // Calculate slope (m) and intercept (b) for y = mx + b
//     const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
//     const intercept = (sumY - slope * sumX) / n;

//     // Generate trend line values using y = mx + b
//     return values.map((_, index) => slope * index + intercept);
// }

function calculateWeeklyAverage(labels, values) {
    const weekAverages = [];
    const daysInWeek = 7;
    let sum = 0;
    let count = 0;

    for (let i = 0; i < values.length; i++) {
        sum += values[i];
        count++;

        // When we complete a week (or reach the last data point)
        if (count === daysInWeek || i === values.length - 1) {
            const avg = sum / count;
            for (let j = 0; j < count; j++) {
                weekAverages.push(avg); // Push the average for each day of the week
            }
            sum = 0;
            count = 0;
        }
    }

    return weekAverages;
}

function updateChartType() {
	chartType = document.getElementById("chartType").value
	updateChart()
}

function updateDateRange() {
	updateChart()
    localStorage.setItem("dateRange", `${document.getElementById("startDate").value} - ${document.getElementById("endDate").value}`)
}

// Initial data fetch and chart render
fetchData()
