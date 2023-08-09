import { keyframes } from '@chakra-ui/react'

interface AnimationEntry {
    duration: string
    timing: string
    iteration: number | 'infinite'
}

interface Animation {
    bounce: Partial<AnimationEntry>
    spining: Partial<AnimationEntry>
}

export function getAnimation(params?: Partial<Animation>) {
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

    const spiningKeyframes = keyframes`
      0% {
        transform: rotateZ(0deg);
      }
      100% {
       transform: rotateZ(-360deg);
     }
  `

    return {
        bounceAnimation: `${bounceKeyframes} ${
            params?.bounce?.duration ?? '.2s'
        } ${params?.bounce?.iteration ?? '5'} ${
            params?.bounce?.timing ?? 'linear'
        }`,
        spiningAnimation: `${spiningKeyframes} ${
            params?.spining?.duration ?? '.4s'
        } ${params?.spining?.iteration ?? '1'} ${
            params?.spining?.timing ?? 'linear'
        }`,
    }
}
