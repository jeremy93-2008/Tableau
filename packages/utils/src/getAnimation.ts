import { keyframes } from '@chakra-ui/react'

export function getAnimation() {
    const bounceKeyframes = keyframes`
    0% {
      transform: rotateZ(0);
    }
    25% {
      transform: rotateZ(5deg);
    }
    75% {
      transform: rotateZ(-5deg);
    }
    100% {
       transform: rotateZ(0);
    }
  `
    return {
        bounceAnimation: `${bounceKeyframes} .2s 5 linear`,
    }
}
