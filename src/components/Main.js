import React, { useEffect, useRef, useState } from 'react'
// import { Landing } from './Landing'
// import { Works } from './Works.js'
import styled from 'styled-components'
import { IMAGES } from '../data.js'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  cursor: none;
  .top {
    position: absolute;
    width: 100%;
    padding: 1rem;
    ${(props) => props.theme.huh};
    & > :nth-child(2) {
      float: right;
    }
  }
`

const Cursor = styled.div`
  position: fixed;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  z-index: 300;
  ${(props) => props.theme.huh};
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

// put two classes in here, onclick transition between the two classes this will function as sort of a state change
const CursorImage = styled.img`
  &.state1 {
    height: 50vh;
    width: auto;
    position: fixed;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    z-index: 100;
    text-transform: uppercase;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0s 0.1s;
  }
  &.state2 {
    height: 50vh;
    width: auto;
    position: fixed;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
  }
  &.state3 {
    position: absolute;
    /* transition: all 0.5s ease; */
    transition: width 0.5s ease, height 0.5s ease, left 0.5s ease, top 0.5s ease,
      transform 0s;
  }
  &.state3 ~ .dummy {
    display: none;
  }
  &.dummy {
    opacity: 0;
  }
  &.active {
    height: 60vh;
    left: 50%;
    top: 45vh;
    transform: translate(-50%, -50%);
    position: fixed;
    z-index: 200;
    transition: all 0.5s ease;
  }
  &.inactive {
    opacity: 0.7;
  }
  &.state3.active ~ .dummy {
    display: block;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  height: 100vh;
  padding-right: 5vw;
  .inner {
    display: grid;
    /* consider picking a random number for inner */
    grid-template-columns: 5vw 1fr;
    grid-template-rows: repeat(9, auto);
    height: 100%;
    width: 100%;
  }
  .item {
    /* border: 1px solid green; */
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`

const Text = styled.div`
  position: absolute;
  top: 76vh;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.5s ease;
  &.active {
    opacity: 1;
    z-index: 300;
  }
  h1 {
    font: 400 max(1.25rem, 1.25vw) sans-serif;
  }
  p {
    font: 400 max(1rem, 1vw) sans-serif;
  }
`

export const Main = () => {
  const numImages = 9
  const theta = 100
  const [cursorText, setCursorText] = useState('move around')
  const [mousePosition, setMousePosition] = useState({ x: `50%`, y: `50%` })
  const [clicked, setClicked] = useState(false)
  const [imgNum, setImgNum] = useState(-1)
  const [moved, setMoved] = useState(false)
  const [wrap, setWrap] = useState(false)
  const [imgState, setImgState] = useState(1)
  const [activeImg, setActiveImg] = useState(-1)
  const [imgStyles, setImgStyles] = useState([...Array(numImages)])

  const imgOnClick = (i, title) => {
    console.log('hey from img', i)
    if (imgState < 3) {
      return
    }
    if (activeImg > -1 && activeImg !== i) {
      console.log('is this condition not being met??')
      return
    }

    const img = imgRefs.current[i].current
    if (!img) {
      console.log('sad')
      return
    }

    setActiveImg(i)
    setCursorText(`viewing ${title}`)
    img.style = {}
    setTimeout(() => {
      img.style.width = `${img.offsetWidth}px`
      console.log(`${img.offsetWidth}px`)
    }, 480)
  }

  const onHover = () => {
    setCursorText('click to view')
  }

  const imgRefs = useRef([])
  for (let i = 0; i < numImages; i++) {
    imgRefs.current[i] = React.createRef()
  }

  const dummyRefs = useRef([])
  for (let i = 0; i < numImages; i++) {
    dummyRefs.current[i] = React.createRef()
  }

  const imgIter = () => {
    const temp = []
    for (const [i, ref] of imgRefs.current.entries()) {
      if (!ref.current) {
        console.log('sad')
      }
      ref.current.style.width = `${dummyRefs.current[i].current.offsetWidth}px`
      ref.current.style.height = `${dummyRefs.current[i].current.offsetHeight}px`
      ref.current.style.top = `${
        dummyRefs.current[i].current.getBoundingClientRect().top
      }px`
      ref.current.style.left = `${
        dummyRefs.current[i].current.getBoundingClientRect().left
      }px`
      ref.current.style.transform = `translate(0, 0)`
      // ref.current.style.transition = ''
      temp.push({ ...ref.current.style })
    }
    setImgStyles(temp)
  }

  const isVisible = (i) => {
    if (!moved) {
      return false
    }
    if (i === imgNum) {
      return true
    }
    if (0 < imgNum - i && imgNum - i < 4) {
      return true
    }
    if (wrap && 0 < imgNum + numImages - i && imgNum + numImages - i < 4) {
      return true
    }
    return false
  }

  const distFromCursor = (ref) => {
    const rect = ref.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const xDiff = centerX - parseInt(mousePosition.x)
    const yDiff = centerY - parseInt(mousePosition.y)
    let dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
    return isNaN(dist) ? Infinity : dist
  }

  const scaleFunction = (dist) => {
    const maxDist = 400
    dist = Math.min(dist, maxDist)
    return 1 + 0.5 * (1 - dist / maxDist)
  }

  const zFunction = (dist) => {
    const maxDist = 400
    dist = Math.min(dist, maxDist)
    return 100 + Math.round(100 * (1 - dist / maxDist))
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (clicked) {
        console.log('what', activeImg, e.target.id, activeImg)
        if (activeImg > -1 && e.target.id !== `img${activeImg}`) {
          console.log('here', imgStyles)
          const idx = activeImg
          const img = imgRefs.current[activeImg].current
          setActiveImg(-1)
          if (!img) {
            return
          }
          const old = imgStyles[idx]
          img.style.height = old.height
          img.style.width = old.width
          img.style.left = old.left
          img.style.top = old.top
          // img.style.transition = 'all .5s ease'
          console.log(activeImg, { ...imgStyles[idx] })
        }
        return
      }
      setClicked(true)
      setImgState(2)
      for (let [i, ref] of imgRefs.current.entries()) {
        if (!ref.current) {
          continue
        }
        ref.current.style = {}
        ref.current.style.transition = `all .5s ${
          ((imgNum + numImages - i) % numImages) * 0.1
        }s`
        ref.current.style.width = `${ref.current.offsetWidth}px`
      }
      setTimeout(() => {
        imgIter()
      }, 2000)
      setTimeout(() => {
        for (let [i, ref] of imgRefs.current.entries()) {
          if (!ref.current) {
            continue
          }
          ref.current.style.transition = ''
        }
        setImgState(3)
      }, 4000)
    }
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [clicked, activeImg])

  useEffect(() => {
    const updateMousePosition = (event) => {
      const curPos = { x: event.clientX, y: event.clientY }
      // double check this is ok to setMousePosition at the beginning
      setMousePosition(curPos)
      switch (imgState) {
        case 1:
          console.log('1')
          if (!moved) {
            setMoved(true)
            return
          }
          if (imgNum < 0) {
            return
          }
          const prevImg = imgRefs.current[imgNum].current
          if (!prevImg) {
            return
          }
          const rect = prevImg.getBoundingClientRect()
          const prevPos = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          }
          const xDiff = Math.abs(curPos.x - prevPos.x)
          const yDiff = Math.abs(curPos.y - prevPos.y)

          if (!wrap && imgNum === numImages - 1) {
            setWrap(true)
          }
          if (xDiff > theta || yDiff > theta) {
            setImgNum((imgNum + 1) % numImages)
          }
          break
        case 2:
          console.log('hi')
          return
        case 3:
          console.log('hey')
          if (activeImg > -1) {
            return
          }
          for (const [i, ref] of imgRefs.current.entries()) {
            if (!ref.current) {
              console.log('does this happen?')
              continue
            }
            const dist = distFromCursor(ref.current)
            ref.current.style.transform = `scale(${scaleFunction(dist)})`
            ref.current.style.zIndex = `${zFunction(dist)}`
          }
          break
        default:
          return
      }
    }
    window.addEventListener('mousemove', updateMousePosition)

    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [imgNum, mousePosition, moved, wrap, clicked, imgState, activeImg])

  useEffect(() => {
    // console.log('imgNum changed', imgNum)
    if (imgNum < 0 || clicked) {
      return
    }
    const curImg = imgRefs.current[imgNum].current
    if (!curImg) {
      return
    }
    curImg.style.left = `${mousePosition.x}px`
    curImg.style.top = `${mousePosition.y}px`
  }, [imgNum])

  useEffect(() => {
    const curImg = imgRefs.current[0].current
    if (!curImg || clicked) {
      return
    }

    console.log('hey', mousePosition.x, mousePosition.y)
    if (moved) {
      const temp = (e) => {
        console.log('wat', e.clientX, e.clientY)
        curImg.style.left = `${e.clientX}px`
        curImg.style.top = `${e.clientY}px`
        window.removeEventListener('mousemove', temp)
      }
      window.addEventListener('mousemove', temp)
      setImgNum(0)
    }
  }, [moved])

  useEffect(() => {
    const timer = () => {
      if (!moved) {
        setTimeout(timer, 2000)
        return
      }
      setCursorText('click to enter')
    }
    setTimeout(timer, 2000)

    return () => clearTimeout(timer)
  }, [moved])

  const formatNumber = (n) => {
    if (n < 0) {
      return ''
    }
    return String(n).padStart(2, '0')
  }

  return (
    <Container>
      <div className='top'>
        <span>Alex Bao</span>
        <span>
          {imgState >= 2 ? formatNumber(activeImg) : formatNumber(imgNum)}
        </span>
      </div>
      <Cursor
        id='cursor'
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      >
        {cursorText === 'click to enter' && imgState > 1
          ? 'explore projects'
          : cursorText}
      </Cursor>
      <Grid>
        {IMAGES.map((col, i) => {
          return (
            <div className='inner'>
              {col.map((img, j) => {
                return (
                  <div
                    className='item'
                    style={{ gridArea: `${img.pos}/2/${img.pos + 1}/3` }}
                  >
                    <CursorImage
                      src={require(`../assets/images/${img.url}`)}
                      className='dummy'
                      ref={dummyRefs.current[img.idx]}
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </Grid>
      {IMAGES.map((col, i) => {
        return col.map((img, j) => {
          return (
            <>
              <CursorImage
                id={`img${img.idx}`}
                key={img.idx}
                src={require(`../assets/images/${img.url}`)}
                style={{
                  opacity: `${isVisible(img.idx) ? 1 : 0}`,
                  zIndex:
                    100 + ((img.idx - 1 + numImages - imgNum) % numImages),
                }}
                className={`state${imgState} ${
                  activeImg === img.idx
                    ? 'active'
                    : activeImg !== -1
                    ? 'inactive'
                    : ''
                }`}
                ref={imgRefs.current[img.idx]}
                onClick={() => imgOnClick(img.idx, img.title)}
                onMouseEnter={() => {
                  if (activeImg === img.idx) {
                    setCursorText(`viewing ${img.title}`)
                    return
                  }
                  setCursorText('click to view')
                }}
                onMouseLeave={() => {
                  if (activeImg > -1) {
                    setCursorText('close')
                    return
                  }
                  setCursorText('explore projects')
                }}
              />
              <Text
                id={`text${img.idx}`}
                className={`state${imgState} ${
                  activeImg === img.idx
                    ? 'active'
                    : activeImg !== -1
                    ? 'inactive'
                    : ''
                }`}
              >
                <h1>
                  <b>{img.title}</b> 2023
                </h1>
                <p>Alex Bao (b. 2002)</p>
                <p>{img.medium}</p>
                <p>{img.text}</p>
              </Text>
            </>
          )
        })
      })}
    </Container>
  )
}
