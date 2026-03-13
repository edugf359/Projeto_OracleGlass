const chatId = window.location.pathname.split("/").pop()

document.addEventListener("DOMContentLoaded", async () => {
  loadSidebar(chatId)
  await loadMessages()

  const input = document.getElementById("msg-input")
  const sendBtn = document.getElementById("send-btn")

  sendBtn.addEventListener("click", handleSend)

  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  })
})

async function loadMessages() {
  const messages = await API.getMessages(chatId)
  messages.forEach(m => appendMessage(m.role, m.content))
  scrollBottom()
}

async function handleSend() {
  const input = document.getElementById("msg-input")
  const sendBtn = document.getElementById("send-btn")
  const content = input.value.trim()
  if (!content) return

  input.value = ""
  input.disabled = true
  sendBtn.disabled = true

  appendMessage("user", content)
  showTyping()

  const data = await API.sendMessage(chatId, content)

  hideTyping()

  if (data.message) {
    appendMessage("assistant", data.message.content)
    if (data.sources && data.sources.length > 0) {
      appendSources(data.sources)
    }
  } else {
    appendMessage("assistant", "Ocorreu um erro ao processar sua pergunta.")
  }

  input.disabled = false
  sendBtn.disabled = false
  input.focus()
  scrollBottom()
}

function appendMessage(role, content) {
  const messages = document.getElementById("messages")
  const div = document.createElement("div")
  div.className = `message ${role}`
  div.innerHTML = `<div class="bubble">${escapeHtml(content)}</div>`
  messages.appendChild(div)
  scrollBottom()
}

function appendSources(sources) {
  const messages = document.getElementById("messages")
  const wrapper = document.createElement("div")
  wrapper.className = "sources-wrapper"
  wrapper.innerHTML = `
    <p class="sources-label">Trechos usados como referência</p>
    ${sources.map(s => `
      <div class="source-card">
        <p class="source-text">${escapeHtml(s.content.substring(0, 200))}${s.content.length > 200 ? "..." : ""}</p>
      </div>
    `).join("")}
  `
  messages.appendChild(wrapper)
  scrollBottom()
}

function showTyping() {
  const messages = document.getElementById("messages")
  const div = document.createElement("div")
  div.id = "typing"
  div.className = "message assistant"
  div.innerHTML = `<div class="bubble typing-bubble"><span></span><span></span><span></span></div>`
  messages.appendChild(div)
  scrollBottom()
}

function hideTyping() {
  const el = document.getElementById("typing")
  if (el) el.remove()
}

function scrollBottom() {
  const messages = document.getElementById("messages")
  messages.scrollTop = messages.scrollHeight
}

function escapeHtml(text) {
  const d = document.createElement("div")
  d.appendChild(document.createTextNode(text))
  return d.innerHTML
}
