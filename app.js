let db;
let SQL;

initSqlJs({
  locateFile: (file) =>
    `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`,
}).then((sql) => {
  SQL = sql;
  db = new SQL.Database();
  db.run(
    "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)"
  );
  displayNotes();
});

const noteForm = document.getElementById("noteForm");
const noteGrid = document.getElementById("noteGrid");

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("noteId").value;
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (id) {
    updateNote(id, title, content);
  } else {
    createNote(title, content);
  }

  noteForm.reset();
  document.getElementById("noteId").value = "";
});

function createNote(title, content) {
  db.run("INSERT INTO notes (title, content) VALUES (?, ?)", [title, content]);
  displayNotes();
}

function updateNote(id, title, content) {
  db.run("UPDATE notes SET title = ?, content = ? WHERE id = ?", [
    title,
    content,
    id,
  ]);
  displayNotes();
}

function deleteNote(id) {
  db.run("DELETE FROM notes WHERE id = ?", [id]);
  displayNotes();
}

function displayNotes() {
  const notes = db.exec("SELECT * FROM notes");
  noteGrid.innerHTML = "";

  if (notes.length > 0 && notes[0].values.length > 0) {
    notes[0].values.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.className = "note";
      noteElement.innerHTML = `
                <h3>${note[1]}</h3>
                <p>${note[2]}</p>
                <div class="note-actions">
                    <button onclick="editNote(${note[0]})">Edit</button>
                    <button class="delete" onclick="deleteNote(${note[0]})">Delete</button>
                </div>
            `;
      noteGrid.appendChild(noteElement);
    });
  }
}

function editNote(id) {
  const note = db.exec(`SELECT * FROM notes WHERE id = ${id}`)[0].values[0];
  document.getElementById("noteId").value = note[0];
  document.getElementById("title").value = note[1];
  document.getElementById("content").value = note[2];
}
