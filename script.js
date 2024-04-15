let canvas = document.getElementById("progress-chart")
let ctx = canvas.getContext("2d")

function drawProgressChart(progress) {
    let width = canvas.width
    let height = canvas.height

    ctx.clearRect(0, 0, width, height)

    let progressInRadians = (1 - progress) * Math.PI * 2

    ctx.strokeStyle = "#000"
    ctx.lineWidth = 5

    // outer circle
    ctx.fillStyle = "#badc58"
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, 240 / 2, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fill()

    // inner arc
    ctx.fillStyle = "#6ab04c"
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, 240 / 2, -Math.PI / 2, progressInRadians -Math.PI / 2, true)
    ctx.lineTo(width / 2, height / 2)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
}

let percentElement = document.querySelector(".percent-funded")
let moneyElement = document.querySelector(".fundraising-money")
async function fetchAmount() {
    let { raised, goal, refetch } = await fetch("https://api.josiahbloomer.com/amount_raised").then(res => res.json())
    drawProgressChart(raised / goal)

    percentElement.textContent = `${(raised / goal * 100).toFixed(0)}%`

    moneyElement.textContent = `${formatMoney(raised)} of ${formatMoney(goal)}`

    if (refetch) setTimeout(fetchAmount, 5000)
}

window.addEventListener("load", fetchAmount)

function formatMoney(amount) {
    return String(amount.toLocaleString("en-US", { style: "currency", currency: "USD" })).slice(0, -3)
}