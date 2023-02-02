import { keyframes } from '@chakra-ui/react'

export function getAnimation() {
    const bounceKeyframes = keyframes`
    0%, 100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  `
    return {
        bounceAnimation: `${bounceKeyframes} 1s infinite`,
    }
}
