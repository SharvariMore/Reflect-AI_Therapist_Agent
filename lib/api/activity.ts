interface ActivityEntry {
  type: string
  name: string
  description?: string
  duration?: number
}

export async function logActivity(
  data: ActivityEntry
): Promise<{ success: boolean; data: any }> {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Not Authenticated!")

  const response = await fetch("/api/activity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to Log Activity!")
  }

  return response.json()
}
