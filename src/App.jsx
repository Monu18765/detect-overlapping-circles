import { useEffect, useRef } from "react"

function App() {
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    let leftCircleCenter = null
    let rightCircleCenter = null
    let leftCircleRadius = 0
    let rightCircleRadius = 0
    let isDragging = false
    let isCollision = false
    let mouseButton =  null //0 for left button and 2 for right button

    useEffect(() => {
      canvasRef.current.width = window.innerWidth - 4
      canvasRef.current.height = window.innerHeight - 45
      contextRef.current = canvasRef.current.getContext("2d")
      console.log(contextRef)
      addEventListeners()
      const drawInterval = setInterval(draw, 10)

      return () => {
        removeEventListeners()
        clearInterval(drawInterval)
      }
    }, [])

    const drawCircle = (center, radius, fillColor) => {
      const ctx = contextRef.current;
      const [x, y] = center
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.closePath()
    }

    const drawLeftCircle = () => {
      const color = isCollision && mouseButton === 0 ? 'red' : 'green'
      drawCircle(leftCircleCenter, leftCircleRadius, color)
    }

    const drawRightCircle = () => {
      const color = isCollision && mouseButton === 2 ? 'red' : 'blue'
      drawCircle(rightCircleCenter, rightCircleRadius, color)
    }

    const draw = () => {
      // Clear the canvas before drawing
      const ctx = contextRef.current
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      checkCollision()
      if(mouseButton === 0){
        //Draw right circle
        if(rightCircleCenter){
          drawRightCircle()
        }
        //Draw left circle
        if(leftCircleCenter){
          drawLeftCircle()
        }
      }else if(mouseButton === 2){
        //Draw left circle
        if(leftCircleCenter){
          drawLeftCircle()
        }
        //Draw right circle
        if(rightCircleCenter){
          drawRightCircle()
        }
      }
    }

    const calculateRadius = (x1, y1, x2, y2) => {
      return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
    }

    const checkCollision = () => {
      if(leftCircleCenter && rightCircleCenter){
        const [x1, y1] = leftCircleCenter
        const [x2, y2] = rightCircleCenter
        const centerDistance = Math.sqrt((x2 - x1)**2 + (y1 - y2)**2)
        isCollision = centerDistance <= leftCircleRadius + rightCircleRadius
      }
    }

    const mouseDownEvent = (event) => {
      console.log(event)
      isDragging = true
      mouseButton = event.button

      if (mouseButton === 0) { 
        // left click for mouse
        console.log("left click");
        leftCircleCenter = [event.offsetX, event.offsetY]
        leftCircleRadius = 0
      } else if (mouseButton === 2){   
        // right click for mouse
        console.log("right click");
        rightCircleCenter = [event.offsetX, event.offsetY]
        rightCircleRadius = 0
      }
    }

    const mouseMoveEvent = (event) => {
      if(isDragging){
        const newX = event.offsetX
        const newY = event.offsetY
        if(mouseButton === 0){
          leftCircleRadius = calculateRadius(leftCircleCenter[0], leftCircleCenter[1], newX, newY)
        } else if(mouseButton === 2){
          rightCircleRadius = calculateRadius(rightCircleCenter[0], rightCircleCenter[1], newX, newY)
        }
      }
    }

    const mouseUpEvent = (event) => {
      isDragging = false
    }

    const contextmenuEvent = (event) => {
      event.preventDefault()
    }

    const addEventListeners = () => {
      canvasRef.current.addEventListener("mousedown", mouseDownEvent)
      canvasRef.current.addEventListener("mousemove", mouseMoveEvent)
      canvasRef.current.addEventListener("mouseup", mouseUpEvent)
      canvasRef.current.addEventListener('contextmenu', contextmenuEvent)
    }

    const removeEventListeners = () => {
      canvasRef.current.addEventListener("mousedown", mouseDownEvent)
      canvasRef.current.addEventListener("mousemove", mouseMoveEvent)
      canvasRef.current.addEventListener("mouseup", mouseUpEvent)
      canvasRef.current.addEventListener('contextmenu', contextmenuEvent)
    }

    return (
      <>
        <h1 style={{ textAlign: 'center' }}>Overlapping Circle Canvas</h1>
        <canvas style={{ border: '2px solid black'}} ref={canvasRef}>
         Canvas is not supported. Use Canvas supported browser.
        </canvas>
      </>
    )
  }
  
  export default App