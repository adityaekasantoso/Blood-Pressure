"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [employeeId, setEmployeeId] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const router = useRouter()

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

      setEmployeeId("")
      router.push("/instruction")
    } catch (error: any) {
      setMsg(error.message || "Connection failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <img
        src="/bg.png"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 backdrop-blur-sm" />

      <Card className="relative w-[420px] rounded-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center p-4">
            <img
              src="/logo/pertamina.png"
              alt="Pertamina"
              className="h-12 object-contain"
            />
          </div>

          <CardTitle className="text-xl font-semibold">
            Blood Pressure Measurement
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Enter your Employee ID or tap your ID Card on the reader
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="h-12 text-center text-5xl font-semibold"
          />
          <Button
            onClick={submit}
            disabled={loading}
            className="h-11 w-full bg-gradient-to-r from-red-600 to-blue-600 text-base font-semibold text-white hover:from-red-700 hover:to-blue-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : "Submit"}
          </Button>

          {msg && <p className="text-center text-sm text-red-500">{msg}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
