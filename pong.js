let pongCanvas = document.getElementById("pong-canvas")
let ptx = pongCanvas.getContext("2d")

let lastClientMouse = { x: 0, y: 0 }
let canvasMouse = { x: 0, y: 0 }
let pongState = "game-over"

let timeMultiplier = 0;

let paddles = [],
	ball
let gameScore = 0

let windowOffsetTop, windowOffsetLeft

let pongWindowMoving = true;
let pongWindowSpeed = 1
let pongWindowVel = { x: pongWindowSpeed, y: pongWindowSpeed }
let pongWindow = document.querySelector(".pong-window")

let storedHighScore = localStorage.getItem("jcb-highScore")
let highScore = storedHighScore ? parseInt(storedHighScore) : 0

class PongPaddle {
	constructor(type) {
		this.width = 10

		this.x = type === "cpu" ? this.width : pongCanvas.width - this.width
		this.y = pongCanvas.height / 2
		this.height = 100
		this.type = type || "cpu"
		this.speed = 5
	}
	update() {
		if (this.type == "player") {
			this.y = canvasMouse.y
		} else {
			if (this.y < ball.y) this.y += this.speed * timeMultiplier
			if (this.y > ball.y) this.y -= this.speed * timeMultiplier
		}

		this.y = constrain(
			this.y,
			this.height / 2 + this.width,
			pongCanvas.height - this.height / 2 - this.width
		)
	}
	display() {
		if (pongState == "play") this.update()
		ptx.fillStyle = "#fff"
		ptx.beginPath()
		ptx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
		ptx.fill()
	}
}

class PongBall {
	constructor() {
		this.x = pongCanvas.width / 2
		this.y = pongCanvas.height / 2
		this.xVel = -4
		this.yVel = 4
		this.radius = 10

		this.canScore = true
	}
	update() {
		this.x += this.xVel * timeMultiplier
		this.y += this.yVel * timeMultiplier

		if (
			this.x < paddles[0].x + paddles[0].width / 2 + this.radius &&
			this.y < paddles[0].y + paddles[0].height / 2 + this.radius &&
			this.y > paddles[0].y - paddles[0].height / 2 - this.radius
		) {
			this.xVel = Math.abs(this.xVel)
			this.canScore = true
		}
		if (
			this.x > paddles[1].x - paddles[1].width / 2 - this.radius &&
			this.y < paddles[1].y + paddles[1].height / 2 + this.radius &&
			this.y > paddles[1].y - paddles[1].height / 2 - this.radius
		) {
			this.xVel = -Math.abs(this.xVel)

            let ballDiff = this.y - paddles[1].y;
            this.yVel += ballDiff * 0.1;

			if (this.canScore) {
				gameScore += 1
				this.canScore = false
				if (gameScore > highScore) {
					highScore = gameScore
					localStorage.setItem("jcb-highScore", highScore)
				}
			}
		}
		if (this.y < this.radius) this.yVel *= -1
		if (this.y > pongCanvas.height - this.radius) this.yVel *= -1

		if (this.x > pongCanvas.width) pongState = "game-over"
        if (this.x < 0) pongState = "win"

        this.yVel = constrain(this.yVel, -6, 6)
	}
	display() {
		if (pongState == "play") this.update()
		ptx.fillStyle = "#fff"
		ptx.beginPath()
		ptx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
		ptx.fill()
	}
}

function triggerGameOver() {
	pongState = "game-over"
}

ball = new PongBall()

paddles.push(new PongPaddle("cpu"))
paddles.push(new PongPaddle("player"))

let lastTime;

function draw(time) {
	// to adjust for different refresh rates
	timeMultiplier = (time - lastTime) / 16;
	lastTime = time

	ptx.fillStyle = "#000"
	ptx.fillRect(0, 0, pongCanvas.width, pongCanvas.height)

	ptx.fillStyle = "#fff3"
	ptx.font = "bold 100px brandon-grotesque"
	ptx.textAlign = "center"
	ptx.textBaseline = "middle"
	ptx.fillText(gameScore, pongCanvas.width / 2, pongCanvas.height / 2)

	ball.display()
	paddles.forEach(paddle => paddle.display())

	if (pongState == "game-over" || pongState == "win") {
		ptx.fillStyle = "#000a"
		ptx.fillRect(0, 0, pongCanvas.width, pongCanvas.height)

		ptx.fillStyle = "#fff"
		ptx.font = "bold 50px brandon-grotesque"
		ptx.textAlign = "center"
		ptx.textBaseline = "middle"
		ptx.fillText(pongState == "game-over" ? "Game Over!" : "You Win!", pongCanvas.width / 2, 100)
		ptx.font = "bold 30px brandon-grotesque"
		ptx.fillText(`score: ${gameScore}.  highest: ${highScore}.`, pongCanvas.width / 2, 135)
		ptx.font = "bold 30px brandon-grotesque"
		ptx.fillText("click to play again.", pongCanvas.width / 2, 250)
	} else if (!mouseIn) {
        ptx.fillStyle = "#fffa"
        ptx.font = "bold 30px brandon-grotesque"
	    ptx.fillText("keep your mouse in!", pongCanvas.width / 2, 250)
    }

    if (pongState == "play") {
        // move by vel
        pongWindow.style.left = (pongWindow.offsetLeft + pongWindowVel.x) + "px"
        pongWindow.style.top = (pongWindow.offsetTop + pongWindowVel.y) + "px"

        // check walls
        if (pongWindow.offsetLeft < pongWindow.offsetWidth / 2) {
            pongWindowVel.x = random(.8, 1.1) * pongWindowSpeed * timeMultiplier
        }
        if (pongWindow.offsetLeft > window.innerWidth - pongWindow.offsetWidth / 2) {
            pongWindowVel.x = -random(.8, 1.1) * pongWindowSpeed * timeMultiplier
        }
        if (pongWindow.offsetTop < pongWindow.offsetHeight / 2) {
            pongWindowVel.y = random(.8, 1.1) * pongWindowSpeed * timeMultiplier
        } 
        if (pongWindow.offsetTop > window.innerHeight - pongWindow.offsetHeight / 2) {
            pongWindowVel.y = -random(.8, 1.1) * pongWindowSpeed * timeMultiplier
        }

        let bounds = pongCanvas.getBoundingClientRect()
        windowOffsetTop = bounds.top
        windowOffsetLeft = bounds.left

        canvasMouse.x = lastClientMouse.x - windowOffsetLeft
	    canvasMouse.y = lastClientMouse.y - windowOffsetTop
    }

	window.requestAnimationFrame(draw)
}
window.requestAnimationFrame(draw)

function mouseMove(e) {
    let bounds = pongCanvas.getBoundingClientRect()
	windowOffsetTop = bounds.top
	windowOffsetLeft = bounds.left

    lastClientMouse.x = e.clientX
    lastClientMouse.y = e.clientY

	canvasMouse.x = e.clientX - windowOffsetLeft
	canvasMouse.y = e.clientY - windowOffsetTop

    mouseIn = true;
}

pongCanvas.addEventListener("mousemove", mouseMove)

pongCanvas.addEventListener("click", e => {
	pongState = "play"
	gameScore = 0
	ball = new PongBall()
})

pongCanvas.addEventListener("mouseleave", e => {
    mouseIn = false;
})
pongCanvas.addEventListener("mouseenter", e => {
    mouseIn = true;
})