const API = {
  async getChats() {
    const r = await fetch("/api/chats")
    return r.json()
  },

  async createChat(name) {
    const r = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
    return r.json()
  },

  async deleteChat(id) {
    await fetch(`/api/chats/${id}`, { method: "DELETE" })
  },

  async getMessages(chatId) {
    const r = await fetch(`/api/messages/${chatId}`)
    return r.json()
  },

  async sendMessage(chatId, content) {
    const r = await fetch(`/api/messages/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    })
    return r.json()
  },

  async ingestFile(chatId, file, onProgress) {
    const form = new FormData()
    form.append("file", file)
    form.append("chat_id", chatId)
    if (onProgress) onProgress(file.name)
    const r = await fetch("/api/ingest", { method: "POST", body: form })
    return r.json()
  }
}
