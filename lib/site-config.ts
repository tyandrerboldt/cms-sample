

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";


export async function getSiteConfig() {
  try {
    const response = await fetch(new URL("/api/config", baseUrl))
    if (!response.ok) {
      throw new Error("Failed to fetch site config")
    }
    return response.json()
  } catch (error) {
    console.error("Erro ao buscar configurações do site:", error)
    return null
  }
}