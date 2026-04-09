export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:6100/api/devices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return Response.json(data, { status: res.status });
  } catch (error: any) {
    return Response.json(
      { message: "Proxy failed", error: error.message },
      { status: 500 }
    );
  }
}