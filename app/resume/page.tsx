"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Heart, Clock } from "lucide-react"

type TensiData = {
  device: number
  dia: number
  dt: string
  nik: number
  pulse: number
  sys: number
}

export default function ResumePage() {
  const [data, setData] = useState<TensiData | null>(null)
  const [countdown, setCountdown] = useState(10)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BP_API_URL}/bloodpress_db`)
        const json = await res.json()
        setData(json.data || null)
      } catch (err) {
        console.warn("Error fetching blood pressure data:", err)
        setData(null)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/")
    }
  }, [countdown, router])

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white">
      <img
        src="/bg.png"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 backdrop-blur-sm" />

      <Card className="relative z-10 w-full max-w-4xl rounded-3xl p-6">
        <CardHeader className="mb-6 text-center">
          <div className="mb-2 flex justify-center">
            <img
              src="/logo/pertamina.png"
              alt="Pertamina Logo"
              className="h-12 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-black">{data?.nik || "-"}</h2>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-around py-4">
            {/* Systolic */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-blue-600">
                <ArrowUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-black">
                {data?.sys || "-"}
              </span>
              <span className="text-sm text-black">Systolic</span>
            </div>

            {/* Diastolic */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-blue-600">
                <ArrowDown className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-black">
                {data?.dia || "-"}
              </span>
              <span className="text-sm text-black">Diastolic</span>
            </div>

            {/* Pulse */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-blue-600">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-black">
                {data?.pulse || "-"}
              </span>
              <span className="text-sm text-black">Pulse</span>
            </div>

            {/* Time */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-blue-600">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-black">
                {data?.dt?.split(" ")[1] || "-"}
              </span>
              <span className="text-sm text-black">Time</span>
            </div>
          </div>

          <p className="mt-2 text-center text-sm text-black">
            This page will automatically close in {countdown} seconds
          </p>
        </CardContent>
      </Card>
    </div>
  )
}