let selectedFiles = []

document.addEventListener("DOMContentLoaded", () => {
  loadSidebar()

  const dropzone = document.getElementById("dropzone")
  const fileInput = document.getElementById("file-input")
  const createBtn = document.getElementById("create-btn")
  const errorMsg = document.getElementById("error-msg")

  dropzone.addEventListener("click", () => fileInput.click())

  dropzone.addEventListener("dragover", e => {
    e.preventDefault()
    dropzone.classList.add("dragover")
  })

  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"))

  dropzone.addEventListener("drop", e => {
    e.preventDefault()
    dropzone.classList.remove("dragover")
    addFiles(Array.from(e.dataTransfer.files))
  })

  fileInput.addEventListener("change", () => {
    addFiles(Array.from(fileInput.files))
    fileInput.value = ""
  })

  createBtn.addEventListener("click", handleCreate)
})

function addFiles(files) {
  files.forEach(f => {
    if (!selectedFiles.find(x => x.name === f.name)) {
      selectedFiles.push(f)
    }
  })
  renderFileList()
}

function removeFile(index) {
  selectedFiles.splice(index, 1)
  renderFileList()
}

function renderFileList() {
  const list = document.getElementById("file-list")
  if (selectedFiles.length === 0) {
    list.innerHTML = ""
    return
  }
  list.innerHTML = selectedFiles.map((f, i) => `
    <div class="file-item">
      <span class="file-name">${escapeHtml(f.name)}</span>
      <button class="file-remove" onclick="removeFile(${i})">remover</button>
    </div>
  `).join("")
}

async function handleCreate() {
  const name = document.getElementById("chat-name").value.trim()
  const errorMsg = document.getElementById("error-msg")
  const createBtn = document.getElementById("create-btn")
  const statusMsg = document.getElementById("status-msg")

  errorMsg.textContent = ""

  if (!name) {
    errorMsg.textContent = "Informe um nome para o chat."
    return
  }
  if (selectedFiles.length === 0) {
    errorMsg.textContent = "Adicione pelo menos um arquivo."
    return
  }

  createBtn.disabled = true
  createBtn.innerHTML = '<span class="spinner"></span> Criando...'

  const chat = await API.createChat(name)

  for (const file of selectedFiles) {
    statusMsg.textContent = `Processando: ${file.name}...`
    await API.ingestFile(chat.id, file)
  }

  statusMsg.textContent = ""
  window.location.href = `/chat/${chat.id}`
}

function escapeHtml(text) {
  const d = document.createElement("div")
  d.appendChild(document.createTextNode(text))
  return d.innerHTML
}
