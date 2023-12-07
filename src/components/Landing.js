import React from 'react'
import styled from 'styled-components'

const CursorImage = styled.img`
  position: fixed;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  z-index: 100;
  text-transform: uppercase;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

export const Landing = () => {
  return <div>Landing</div>
}
