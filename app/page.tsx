"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { io } from "socket.io-client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [employeeId, setEmployeeId] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // 🔥 anti duplicate scan
  const lastRFID = useRef("")

  // =========================
  // SOCKET RFID REALTIME
  // =========================
  useEffect(() => {
    const socket = io("http://localhost:6100", {
      transports: ["websocket"]
    })

    socket.on("connect", () => {
      console.log("RFID Socket Connected")
    })

    socket.on("rfid_data", (data) => {
      if (!data?.employee_id) return

      // 🔥 prevent duplicate scan
      if (lastRFID.current === data.employee_id) return

      lastRFID.current = data.employee_id
      setEmployeeId(data.employee_id)

      // auto focus input
      inputRef.current?.focus()
    })

    socket.on("disconnect", () => {
      console.log("RFID Socket Disconnected")
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  // =========================
  // AUTO FOCUS (KIOSK MODE)
  // =========================
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // =========================
  // SUBMIT DATA
  // =========================
  const submit = async () => {
    if (!employeeId.trim()) {
      setMsg("Employee ID is required")
      return
    }

    setLoading(true)
    setMsg("")

    try {
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: employeeId.trim(),
          device_id: "1",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit")
      }

      // reset
      setEmployeeId("")
      lastRFID.current = ""

      // redirect
      router.push("/instruction")

    } catch (error: any) {
      setMsg(error.message || "Connection failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      {/* background */}
      <img
        src="/bg.png"
        className="absolute inset-0 h-full w-full object-cover"
        alt="bg"
      />

      {/* blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* card */}
      <Card className="relative w-[420px] rounded-2xl shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center p-4">
            <img
              src="/logo/pertamina.png"
              alt="logo"
              className="h-12 object-contain"
            />
          </div>

          <CardTitle className="text-xl font-semibold">
            Blood Pressure Measurement
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Tap RFID card or enter Employee ID
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* INPUT */}
          <Input
            ref={inputRef}
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit()
            }}
            className="h-14 text-center text-4xl font-bold tracking-widest"
          />

          {/* BUTTON */}
          <Button
            onClick={submit}
            disabled={loading}
            className="h-11 w-full bg-gradient-to-r from-red-600 to-blue-600 text-white font-semibold"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : "Submit"}
          </Button>

          {/* MESSAGE */}
          {msg && (
            <p className="text-center text-sm text-red-500">
              {msg}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}