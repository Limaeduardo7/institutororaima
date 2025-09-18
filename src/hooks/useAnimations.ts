import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
const anime = require('animejs')

export const useGSAPAnimation = (
  animation: 'fadeIn' | 'slideUp' | 'slideLeft' | 'scale' | 'rotate',
  duration: number = 1,
  delay: number = 0
) => {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current

    switch (animation) {
      case 'fadeIn':
        gsap.fromTo(element, 
          { opacity: 0 },
          { opacity: 1, duration, delay, ease: 'power2.out' }
        )
        break
      
      case 'slideUp':
        gsap.fromTo(element,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration, delay, ease: 'power2.out' }
        )
        break
      
      case 'slideLeft':
        gsap.fromTo(element,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration, delay, ease: 'power2.out' }
        )
        break
      
      case 'scale':
        gsap.fromTo(element,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration, delay, ease: 'back.out(1.7)' }
        )
        break
      
      case 'rotate':
        gsap.fromTo(element,
          { rotation: -10, opacity: 0 },
          { rotation: 0, opacity: 1, duration, delay, ease: 'power2.out' }
        )
        break
    }
  }, [animation, duration, delay])

  return elementRef
}

export const useAnimeAnimation = (
  animation: 'bounce' | 'elastic' | 'pulse' | 'swing',
  trigger: boolean = true
) => {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!elementRef.current || !trigger) return

    const element = elementRef.current

    switch (animation) {
      case 'bounce':
        anime({
          targets: element,
          translateY: [-20, 0],
          scale: [0.9, 1],
          opacity: [0, 1],
          duration: 800,
          easing: 'easeOutBounce'
        })
        break
      
      case 'elastic':
        anime({
          targets: element,
          scale: [0, 1],
          opacity: [0, 1],
          duration: 1000,
          easing: 'easeOutElastic(1, .8)'
        })
        break
      
      case 'pulse':
        anime({
          targets: element,
          scale: [1, 1.05, 1],
          duration: 1500,
          loop: true,
          easing: 'easeInOutSine'
        })
        break
      
      case 'swing':
        anime({
          targets: element,
          rotate: [-5, 5, -3, 3, 0],
          duration: 1000,
          easing: 'easeInOutSine'
        })
        break
    }
  }, [animation, trigger])

  return elementRef
}

export const useScrollAnimation = (threshold: number = 0.1) => {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(entry.target,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
            )
          }
        })
      },
      { threshold }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold])

  return elementRef
}

export const useHoverAnimation = () => {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return elementRef
}

export const useCounterAnimation = (
  endValue: number,
  duration: number = 2000,
  trigger: boolean = true
) => {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!elementRef.current || !trigger) return

    const element = elementRef.current
    
    anime({
      targets: { value: 0 },
      value: endValue,
      duration,
      easing: 'easeOutExpo',
      update: function(anim: { animatables: Array<{ target: { value: number } }> }) {
        const value = Math.round(anim.animatables[0].target.value)
        element.textContent = value.toLocaleString('pt-BR')
      }
    })
  }, [endValue, duration, trigger])

  return elementRef
}