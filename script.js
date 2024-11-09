const notes = [];
let darkModeEnabled = false;

const addNoteBtn = document.getElementById("add-note-btn");
const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");
const noteTag = document.getElementById("note-tag");
const notesContainer = document.getElementById("notes-container");
const savedNotesModal = document.getElementById("saved-notes-modal");
const savedNotesContainer = document.getElementById("saved-notes-container");
const closeBtn = document.querySelector(".close-btn");
const saveNotesBtn = document.getElementById("save-notes-btn");
const addOtherNotesBtn = document.getElementById("add-other-notes-btn");
const darkModeToggle = document.getElementById("dark-mode-toggle");

let editNoteId = null; // Variable to track the note being edited

// Function to add or edit a note
function saveOrUpdateNote() {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
  const tags = noteTag.value.split(",").map(tag => tag.trim()).filter(tag => tag);

  if (title && content) {
    if (editNoteId) {
      // Update existing note
      const noteIndex = notes.findIndex(note => note.id === editNoteId);
      notes[noteIndex] = {
        ...notes[noteIndex],
        title: title,
        content: content,
        tags: tags,
        date: new Date().toLocaleString(),
      };
      editNoteId = null; // Reset after edit
    } else {
      // Add new note
      const note = {
        id: Date.now(),
        title: title,
        content: content,
        tags: tags,
        date: new Date().toLocaleString(),
      };
      notes.push(note);
    }
    displayNotes();
    clearInputs();
  } else {
    alert("Please enter a title and content for the note.");
  }
}

// Function to display notes
function displayNotes() {
  notesContainer.innerHTML = "";
  notes.forEach(note => {
    const noteCard = document.createElement("div");
    noteCard.className = "note";
    noteCard.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <div class="note-tags">${note.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
      <div class="note-date">${note.date}</div>
      <button class="edit-btn" onclick="editNote(${note.id})">Edit</button>
      <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
    `;
    notesContainer.appendChild(noteCard);
  });
}

// Function to delete a note
function deleteNote(id) {
  const index = notes.findIndex(note => note.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    displayNotes();
  }
}

// Function to show saved notes in a modal
function showSavedNotes() {
  savedNotesContainer.innerHTML = "";
  notes.forEach(note => {
    const noteCard = document.createElement("div");
    noteCard.className = "note";
    noteCard.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <div class="note-tags">${note.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
      <div class="note-date">${note.date}</div>
      <button class="edit-btn" onclick="editNote(${note.id})">Edit</button>
    `;
    savedNotesContainer.appendChild(noteCard);
  });
  savedNotesModal.style.display = "block";
}

// Function to edit a note
function editNote(id) {
  const noteToEdit = notes.find(note => note.id === id);
  noteTitle.value = noteToEdit.title;
  noteContent.value = noteToEdit.content;
  noteTag.value = noteToEdit.tags.join(", ");
  editNoteId = id; // Set the ID of the note being edited
}

// Function to clear input fields
function clearInputs() {
  noteTitle.value = "";
  noteContent.value = "";
  noteTag.value = "";
}

// Function to toggle dark mode
function toggleDarkMode() {
  darkModeEnabled = !darkModeEnabled;
  document.body.classList.toggle("dark-mode", darkModeEnabled);
}

// Event listeners
addNoteBtn.addEventListener("click", saveOrUpdateNote); // Modify here
saveNotesBtn.addEventListener("click", showSavedNotes);
closeBtn.addEventListener("click", () => {
  savedNotesModal.style.display = "none";
});
addOtherNotesBtn.addEventListener("click", () => {
  clearInputs();
  displayNotes(); // Display all notes again
});
darkModeToggle.addEventListener("click", toggleDarkMode);
let archivedNotes = [];

// Function to archive a note
function archiveNote(noteId) {
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex > -1) {
        const [archivedNote] = notes.splice(noteIndex, 1);
        archivedNotes.push(archivedNote);
        displayNotes();
        displayArchivedNotes();
    }
}

// Display archived notes
function displayArchivedNotes() {
    const archivedNotesContainer = document.getElementById("archived-notes-container");
    archivedNotesContainer.innerHTML = ""; // Clear existing content
    archivedNotes.forEach(note => {
        const noteElement = createNoteElement(note);
        archivedNotesContainer.appendChild(noteElement);
    });
}

// Add event listener to archive buttons
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("archive-btn")) {
        const noteId = parseInt(event.target.getAttribute("data-id"));
        archiveNote(noteId);
    }
});
document.getElementById("export-btn").addEventListener("click", exportNotes);
document.getElementById("import-input").addEventListener("change", importNotes);
// Function to apply the selected theme
function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('theme', theme); // Save selected theme in local storage
}

// Load the saved theme on page load
window.onload = function() {
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);
};

// Add event listeners to theme buttons
document.getElementById("light-theme-btn").addEventListener("click", () => applyTheme('light-theme'));
document.getElementById("dark-theme-btn").addEventListener("click", () => applyTheme('dark-theme'));
