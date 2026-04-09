"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Eye, Heart, Play } from "lucide-react"

export default function InstructionPage() {
  const router = useRouter()

  const steps = [
    {
      icon: <User className="h-6 w-6 text-white" />,
      title: "Insert Your Hand",
      description:
        "Place your arm gently into the cuff of the blood pressure device, palm facing up.",
    },
    {
      icon: <Eye className="h-6 w-6 text-white" />,
      title: "Stay Still",
      description:
        "Sit comfortably, keep your back straight, and do not move your arm or body during measurement.",
    },
    {
      icon: <Heart className="h-6 w-6 text-white" />,
      title: "Relax",
      description:
        "Take a deep breath, relax your muscles, and avoid talking to ensure accurate readings.",
    },
    {
      icon: <Play className="h-6 w-6 text-white" />,
      title: "Start Measurement",
      description:
        "Press the START button on the blood pressure device to begin the measurement.",
    },
  ]

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch("http://10.72.102.138:3005/bloodpress")
        if (!res.ok) throw new Error("Network response not ok")
        const json = await res.json()

        // Cek data sebagai objek, bukan array
        if (json?.data && Object.keys(json.data).length > 0) {
          clearInterval(intervalId)
          router.push("/resume")
        }
      } catch (err) {
        console.warn("Error fetching blood pressure (ignored):", err)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [router])

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white">
      <img
        src="/bg.png"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 backdrop-blur-sm" />

      <Card className="relative z-10 w-full max-w-4xl rounded-3xl p-6">
        <CardHeader className="mb-6 space-y-3 text-center">
          <div className="m-4 flex justify-center">
            <img
              src="/logo/pertamina.png"
              alt="Pertamina Logo"
              className="h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold">
            Blood Pressure Measurement Instructions
          </h1>
          <p className="mt-2 font-semibold text-red-600">
            Follow the steps below carefully and click the START button on the
            device to begin
          </p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {steps.map((step, idx) => (
            <Card key={idx} className="rounded-2xl p-4">
              <CardHeader className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-blue-500">
                  {step.icon}
                </div>
                <CardTitle className="text-lg font-semibold">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}