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
    return `
      <div class="chat-row ${active}">
        <a href="/chat/${chat.id}" class="chat-item-link">${escapeHtml(chat.name)}</a>
        <button class="chat-delete-btn" onclick="deleteChat(event, '${chat.id}')" title="Excluir chat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6M14 11v6"></path>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
          </svg>
        </button>
      </div>
    `
  }).join("")
}

async function deleteChat(event, chatId) {
  event.preventDefault()
  event.stopPropagation()

  if (!confirm("Excluir este chat? Todos os arquivos e mensagens serão removidos.")) return

  try {
    await API.deleteChat(chatId)

    const currentChatId = window.location.pathname.split("/").pop()
    if (currentChatId === chatId) {
      window.location.href = "/"
    } else {
      const activeChatId = window.location.pathname.startsWith("/chat/") ? currentChatId : null
      await loadSidebar(activeChatId)
    }
  } catch (e) {
    alert("Erro ao excluir o chat. Tente novamente.")
  }
}

function escapeHtml(text) {
  const d = document.createElement("div")
  d.appendChild(document.createTextNode(text))
  return d.innerHTML
}