let saveButton = document.querySelector(`#save`);
let textInput = document.querySelector(`#text`);
let titleInput = document.querySelector(`#title`);
let categoryInput = document.querySelector(`#category`);
let dateInput = document.querySelector(`#date`);
let notesNode = document.querySelector(`#notes`);
let selectNode = document.querySelector(`#select`);
let searchNode = document.querySelector(`#search`);
let deletButtons;
let oldNotes = getNotesFromLocalStorage();
let notes = oldNotes ? oldNotes : [];

// Отрисовка заметок сохранённых в localstorage
render();

// Добавление новой заметки
saveButton.addEventListener(`click`, function () {
  let note = setNote();

  notes.push(note);
  render();
  saveNotesToLocalStorage(notes);
  selectNode.value = `all`;
});



// Поиск по категории
selectNode.addEventListener(`input`, searchByCategory);

// Поиск по содержанию
searchNode.addEventListener(`input`, searchByContent);

function renderNote(note) {
  notesNode.innerHTML = `
	<div class="col-md-3">
		<div class="card ${note.categoryClass}" data-id="${note.id}">
		<button type="button" class="btn-close" aria-label="Close"></button>
			<div class="card-body">
				<h5 class="card-title">${note.title}</h5>
				<h6 class="card-subtitle mb-2 text-muted">${note.category}</h6>
				<p class="card-text">${note.text}</p>
			</div>
			<div class="card-footer text-muted">
				${note.date}
			</div>
		</div>
	</div>
	` + notesNode.innerHTML;
  titleInput.value = ``;
  categoryInput.value = ``;
  textInput.value = ``;
  dateInput.value = ``;
}

function render() {
  notesNode.innerHTML = ``;
  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    renderNote(note);
  }
	deletButtons = document.querySelectorAll(`.btn-close`);
	deletButtons.forEach(button => 
		button.addEventListener(`click`, function() {
			let noteId = button.closest(`.card`).dataset.id;
			console.log(noteId);
			deleteNote(noteId)
		})
	)
}

function setNote() {
  let title = titleInput.value;
  let category = categoryInput.value;
  let text = textInput.value;
  let date = dateInput.value;
  let categoryClass = ``;
	let id = String(Math.random()).slice(2)
  if (category.toLowerCase().replace(`ё`, `е`) == `учеба`) {
    categoryClass = `study`;
  } else if (category.toLowerCase() == `важное`) {
    categoryClass = `important`;
  }

  let note = {
		id: id,
    title: title,
    category: category,
    text: text,
    date: date,
    categoryClass: categoryClass,
  };

  return note;
}

function saveNotesToLocalStorage() {
  let count = 0;
  for (let i = 0; i < notes.length; i++) {
    let note = JSON.stringify(notes[i]);
    localStorage.setItem(i, note);
    count++;
  }
  localStorage.setItem(`notesCount`, count);
}

function getNotesFromLocalStorage() {
  let array = [];
  let notesCount = Number(localStorage.getItem(`notesCount`));

  for (let i = 0; i < notesCount; i++) {
    let note = JSON.parse(localStorage.getItem(i));
    array.push(note);
  }
  return array;
}

function searchByCategory() {
  notesNode.innerHTML = ``;
  let option = selectNode.value;
  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    if (option == `all` || option == note.categoryClass) {
      renderNote(note);
    }
  }
}

function searchByContent() {
  notesNode.innerHTML = ``;
  let content = searchNode.value;

  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    if (note.text.toLowerCase().includes(content)) {
      renderNote(note);
    }
  }
}

function deleteNote(id) {
	for (let i = 0; i < notes.length; i++) {
		let note = notes[i];
		if (note.id == id) {
			notes.splice(i, 1)
		}
	}
	localStorage.clear()
	saveNotesToLocalStorage()
	render()
}