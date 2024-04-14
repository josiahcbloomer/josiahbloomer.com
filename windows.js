let windows = document.querySelectorAll(".window")

let windowZOrder = []

let dragging = false
let draggingWindow = null
let draggingStart = { x: 0, y: 0 }
let windowStart = { x: 0, y: 0 }
let mouseX, mouseY

windows.forEach(wind => {
	// assign a randomized ID
	wind.id = `window-${Math.random().toString(36).substring(2, 15)}`
	windowZOrder.push(wind.id)

	// handle dragging
	let windowHeader = wind.querySelector(".window-header")
	windowHeader.addEventListener("mousedown", e => {
		if (e.target.classList.contains("close-button")) return
		if (dragging) return

		dragging = true
		draggingWindow = wind.id
		windowStart = { x: wind.offsetLeft, y: wind.offsetTop }
		draggingStart = { x: mouseX, y: mouseY }
	})

	// handle z sorting
	wind.addEventListener("mousedown", e => {
        if (e.target.classList.contains("close-button")) return

		let index = windowZOrder.indexOf(wind.id)
		windowZOrder.splice(index, 1)
		windowZOrder.unshift(wind.id)
		resortWindows()
	})

	// handle close button
	let closeButton = wind.querySelector(".close-button")
	closeButton.addEventListener("click", e => {
        wind.style.transition = "none"
        wind.classList.remove("open")

        setTimeout(() => {
            wind.style.transition = "transform 0.4s"
            wind.classList.add("open")
        }, 500)

		wind.style.left =
			random(wind.offsetWidth / 2, window.innerWidth - wind.offsetWidth / 2) + "px"
		wind.style.top =
			random(wind.offsetHeight / 2, window.innerHeight - wind.offsetHeight / 2) + "px"

		// move to bottom
		windowZOrder.splice(windowZOrder.indexOf(wind.id), 1)
		windowZOrder.push(wind.id)

		resortWindows()
	})
})

window.addEventListener("load", e => {
	// initial z sort
	windowZOrder.sort((a, b) => {
		let aEl = document.getElementById(a)
		let bEl = document.getElementById(b)
		return (aEl.dataset.z || 99) - (bEl.dataset.z || 99)
	})
	resortWindows()

    windowZOrder.forEach((id, index) => {
        let window = document.getElementById(id)
        window.style.transition = "transform 0.4s"
        setTimeout(() => {
            window.classList.add("open")
        }, (windowZOrder.length - index) * 300)
    })
})

window.addEventListener("mousemove", e => {
	mouseX = e.clientX
	mouseY = e.clientY

	if (!dragging) return

	let windowToMove = document.getElementById(draggingWindow)

    let moveToX = windowStart.x + mouseX - draggingStart.x
    let moveToY = windowStart.y + mouseY - draggingStart.y

	windowToMove.style.left = constrain(moveToX, windowToMove.offsetWidth / 2, window.innerWidth - windowToMove.offsetWidth / 2) + "px"
	windowToMove.style.top = constrain(moveToY, windowToMove.offsetHeight / 2, window.innerHeight - windowToMove.offsetHeight / 2) + "px"
})
window.addEventListener("mouseup", e => {
	if (!dragging) return

	dragging = false
	draggingWindow = null
})

function resortWindows() {
	windowZOrder.forEach(id => {
		let window = document.getElementById(id)
		window.style.zIndex = windowZOrder.length - windowZOrder.indexOf(id) + 2
	})
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}
function constrain(value, min, max) {
    return Math.min(Math.max(value, min), max)
}