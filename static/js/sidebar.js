async function loadSidebar(activeChatId = null) {
  const list = document.getElementById("sidebar-list")
  if (!list) return

  const chats = await API.getChats()

  if (chats.length === 0) {
    list.innerHTML = '<span class="sidebar-empty">Nenhum chat ainda</span>'
    return
  }

  list.innerHTML = chats.map(chat => {
    const active = chat.id === activeChatId ? "active" : ""
    return `<a href="/chat/${chat.id}" class="chat-item ${active}">${escapeHtml(chat.name)}</a>`
  }).join("")
}

function escapeHtml(text) {
  const d = document.createElement("div")
  d.appendChild(document.createTextNode(text))
  return d.innerHTML
}
