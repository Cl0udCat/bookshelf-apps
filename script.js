const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APP';
const INCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookShelfList";
const BOOK_ITEMID = "itemId";

document.addEventListener('DOMContentLoaded', function() {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      inputBook();
    });
      if (isStorageExist()) {
          loadDataFromStorage();
        }
});

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu belum mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (isStorageExist()) {
      loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
    let data = JSON.parse(serializedData);
    books.splice(0, books.length, ...data);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function inputBook() {
    const textJudul = document.getElementById('inputBookTitle').value;
    const textPenulis = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textJudul, textPenulis, bookYear, isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
  return + new Date();
}

function generateBookObject(id, judul, penulis, year, isCompleted) {
  return {
    id,
    judul,
    penulis,
    year,
    isCompleted,
  }
}
document.addEventListener(RENDER_EVENT, function (){
  console.log(books);
});

function makeBook(book_shelf) {
  const textJudul = document.createElement("h2");
  textJudul.innerText = book_shelf.judul;
  
  const textPenulis = document.createElement("p");
  textPenulis.innerText = book_shelf.penulis;

  const bookYear = document.createElement("p");
  bookYear.innerText = book_shelf.year;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.setAttribute("id", `book-${book_shelf.id}`);
  container.append(textJudul, textPenulis, bookYear);
  
  if (book_shelf.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('green');
    undoButton.setAttribute("id", "button-undo");
    undoButton.innerText = "Belum Selesai Dibaca";

    undoButton.addEventListener("click", function () {
      undoBookToCompleted(book_shelf.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.setAttribute("id", "trash-button");
    trashButton.innerText = "Hapus Buku";

    trashButton.addEventListener("click", function () {
      removeBookToCompleted(book_shelf.id);
    });
    container.append(undoButton, trashButton);

  } else {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.setAttribute("id", "button-undo");
    undoButton.innerText = "Sudah Selesai";

    undoButton.addEventListener("click", function () {
      addBookToCompleted(book_shelf.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.setAttribute("id", "trash-button");
    trashButton.innerText = "Hapus Buku";

    trashButton.addEventListener("click", function () {
      removeBookToCompleted(book_shelf.id);
    });
    container.append(undoButton, trashButton);
  }

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
    const incompletedBOOKList = document.getElementById("incompleteBookshelfList");
    incompletedBOOKList.innerHTML = '';
    const completedBOOKList = document.getElementById("completeBookshelfList");
    completedBOOKList.innerHTML = '';
    
    for (const book_shelf of books) {
    const bookElement = makeBook(book_shelf);
    if (!book_shelf.isCompleted) incompletedBOOKList.append(bookElement);
    else completedBOOKList.append(bookElement);
  }
});


function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
  
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(books);
}
  
function removeBookToCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
  
function undoBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
  
function findBook(bookId) {
    for (const makeBook of books) {
        if (makeBook.id === bookId) {
            return makeBook;
      }
    }
    return null;
}
  
function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
      }
    }
    return -1;
}

const checkbox = document.getElementById("inputBookIsComplete");
let check = false;

checkbox.addEventListener("change", function () {
  if (checkbox.checked) {
    check = true;

    document.querySelector("span").innerText = "Selesai dibaca";
  } else {
    check = false;

    document.querySelector("span").innerText = "Belum selesai dibaca";
  }
});

