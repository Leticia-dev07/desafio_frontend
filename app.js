const API_URL = 'https://desafio-atividade-backend.onrender.com/api/entries';

// ELEMENTOS DO HTML
const form = document.getElementById('entry-form');
const entryId = document.getElementById('entry-id');
const nome = document.getElementById('nome');
const raca = document.getElementById('raca');
const datanascimento = document.getElementById('datanascimento');
const entriesList = document.getElementById('entries-list');
const message = document.getElementById('message');
const cancelEdit = document.getElementById('cancel-edit');
const formTitle = document.getElementById('form-title');
const reloadBtn = document.getElementById('reload-btn');

// MENSAGEM
function showMessage(text) {
  message.textContent = text;
}

// LIMPAR FORM
function clearForm() {
  form.reset();
  entryId.value = '';
  formTitle.textContent = 'Novo gatinho';
  cancelEdit.classList.add('hidden');
}

// FORMATAR DATA
function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

// LISTAR GATOS
async function loadEntries() {
  const response = await fetch(API_URL);
  const entries = await response.json();

  if (!entries.length) {
    entriesList.innerHTML = '<p>Nenhum gatinho encontrado.</p>';
    return;
  }

  entriesList.innerHTML = entries.map(entry => `
    <div class="border p-3 mb-2 rounded bg-white">
      <h3>${entry.nome}</h3>
      <p><strong>Raça:</strong> ${entry.raca}</p>
      <p><strong>Nascimento:</strong> ${formatDate(entry.datanascimento)}</p>

      <div class="d-flex gap-2 mt-2">
        <button class="btn btn-warning btn-sm" onclick="editEntry('${entry._id}')">
          Editar
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteEntry('${entry._id}')">
          Excluir
        </button>
      </div>
    </div>
  `).join('');
}

// SALVAR (POST / PUT)
async function saveEntry(data) {
  const id = entryId.value;
  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// EDITAR
window.editEntry = async function (id) {
  const response = await fetch(`${API_URL}/${id}`);
  const entry = await response.json();

  entryId.value = entry._id;
  nome.value = entry.nome;
  raca.value = entry.raca;
  datanascimento.value = entry.datanascimento.slice(0, 10);

  formTitle.textContent = 'Editar gatinho';
  cancelEdit.classList.remove('hidden');

  showMessage('Editando gatinho...');
};

// DELETE
window.deleteEntry = async function (id) {
  if (!confirm('Deseja excluir este gatinho?')) return;

  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

  showMessage('Gatinho excluído.');
  loadEntries();
};

// SUBMIT FORM
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    nome: nome.value,
    raca: raca.value,
    datanascimento: datanascimento.value
  };

  await saveEntry(data);

  showMessage(entryId.value ? 'Gatinho atualizado.' : 'Gatinho criado.');
  clearForm();
  loadEntries();
});

// CANCELAR EDIÇÃO
cancelEdit.addEventListener('click', () => {
  clearForm();
  showMessage('Edição cancelada.');
});

// RELOAD
reloadBtn.addEventListener('click', loadEntries);

// INIT
clearForm();
loadEntries();