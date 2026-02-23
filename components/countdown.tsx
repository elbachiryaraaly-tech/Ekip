"use client"

import { useEffect, useState } from "react"

interface CountdownProps {
  targetDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const timeUnits = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
      {timeUnits.map((unit, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center min-w-[80px] md:min-w-[100px]"
        >
          <div className="relative px-6 py-4 md:px-8 md:py-6 rounded-2xl bg-primary-foreground/10 border-2 border-primary-foreground/30 backdrop-blur-md elegant-shadow-lg">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-primary-foreground tabular-nums drop-shadow-lg">
              {String(unit.value).padStart(2, "0")}
            </div>
          </div>
          <p className="mt-3 text-sm md:text-base font-serif text-primary-foreground/90 uppercase tracking-wider drop-shadow-md">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  )
}
