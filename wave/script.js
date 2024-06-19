let POINT_DISTANCE = 1000
let LEFT_PADDING = 200
let INCREASE_AM = 10
let MAX_WIDTH = 8000
let HANDLE_WIDTH = 180

let DOC_HEIGHT = 200

let x = 0

function genLines() {
    let beziers = []

    for (let i = 0; i < MAX_WIDTH; i += POINT_DISTANCE) {

        let num = Math.max(i - LEFT_PADDING, 0) / POINT_DISTANCE
        let height1 = num * INCREASE_AM * INCREASE_AM

        if (height1 < DOC_HEIGHT) {
            INCREASE_AM ++;
        } else height1 = DOC_HEIGHT

        beziers.push([
            i + HANDLE_WIDTH, DOC_HEIGHT,
            (i + POINT_DISTANCE / 2) - HANDLE_WIDTH, DOC_HEIGHT - height1,
            (i + POINT_DISTANCE / 2), DOC_HEIGHT - height1,
        ])
        beziers.push([
            i + (POINT_DISTANCE / 2) + HANDLE_WIDTH, DOC_HEIGHT - height1,
            (i + POINT_DISTANCE) - HANDLE_WIDTH, DOC_HEIGHT,
            (i + POINT_DISTANCE), DOC_HEIGHT,
        ])
    }

    return beziers
}

let points = genLines()

function setup() {
    createCanvas(1400, 500)
}

function exportSVG() {
    let svgContent = `<svg width="1400" height="500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1100">\n`;
    svgContent += `<path d="M 0 ${DOC_HEIGHT} `;

    for (let i = 0; i < points.length; i += 2) {
        let p1 = points[i];
        let p2 = points[i + 1];
        svgContent += `C ${p1[0]},${p1[1]} ${p1[2]},${p1[3]} ${p1[4]},${p1[5]} `;
        svgContent += `C ${p2[0]},${p2[1]} ${p2[2]},${p2[3]} ${p2[4]},${p2[5]} `;
    }

    svgContent += `" stroke="white" fill="none" stroke-width="4"/>\n`;
    svgContent += `</svg>`;

    saveSVG(svgContent, 'bezier-curve.svg');
}

function saveSVG(svgContent, filename) {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function draw() {
    background(0)

    stroke(255)
    strokeWeight(4)
    noFill()

    push()
    translate(-x, 0)

    beginShape()
    vertex(0, DOC_HEIGHT)
    for (let i = 0; i < points.length; i++) {
        bezierVertex(...points[i])
    }
    endShape()

    let lastPoint = [0, DOC_HEIGHT]
    strokeWeight(2)
    for (let i = 0; i < points.length; i++) {
        stroke(255, 0, 0)
        line(lastPoint[0], lastPoint[1], points[i][0], points[i][1])
        stroke(0, 255, 0)
        line(points[i][2], points[i][3], points[i][4], points[i][5])

        noStroke()
        fill(0, 0, 255)
        ellipse(points[i][0], points[i][1], 10, 10)
        fill(255, 0, 0)
        ellipse(points[i][2], points[i][3], 10, 10)

        lastPoint = [points[i][4], points[i][5]]
    }
    pop()

    // x = mouseX * 4;
}

let pointDistanceInput = document.querySelector('input[name="point-distance"]')
let leftPaddingInput = document.querySelector('input[name="left-padding"]')
let increaseAmInput = document.querySelector('input[name="increase-am"]')
let maxWidthInput = document.querySelector('input[name="max-width"]')
let handleWidthInput = document.querySelector('input[name="handle-width"]')

pointDistanceInput.addEventListener('input', update)
leftPaddingInput.addEventListener('input', update)
increaseAmInput.addEventListener('input', update)
maxWidthInput.addEventListener('input', update)
handleWidthInput.addEventListener('input', update)

update()

function update() {
    POINT_DISTANCE = parseInt(pointDistanceInput.value)
    LEFT_PADDING = parseInt(leftPaddingInput.value)
    INCREASE_AM = parseInt(increaseAmInput.value)
    MAX_WIDTH = parseInt(maxWidthInput.value)
    HANDLE_WIDTH = parseInt(handleWidthInput.value)

    console.log(POINT_DISTANCE, LEFT_PADDING, INCREASE_AM, MAX_WIDTH, HANDLE_WIDTH)

    points = genLines()
}
