const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const MOVED_EVENT = 'moved-book';
const DELETED_EVENT = 'deleted-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const books = [];

const isStorageCompatible = () => {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung web storage');
    return false;
  }
  return true;
};

document.addEventListener(RENDER_EVENT, () => {
  const unfinishedBook = document.getElementById('belumDibaca');
  unfinishedBook.innerHTML = '';

  const finishedBook = document.getElementById('sudahDibaca');
  finishedBook.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBookElement(bookItem);
    if (!bookItem.isComplete) {
      unfinishedBook.append(bookElement);
    } else {
      finishedBook.append(bookElement);
    }
  }
});

document.addEventListener(SAVED_EVENT, () => {
  const elementCustomAlert = document.createElement('div');
  elementCustomAlert.classList.add('alert');
  elementCustomAlert.innerText = 'Buku berhasil Disimpan!';

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

document.addEventListener(MOVED_EVENT, () => {
  const elementCustomAlert = document.createElement('div');
  elementCustomAlert.classList.add('alert');
  elementCustomAlert.innerText = 'Buku berhasil Dipindahkan!';

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

document.addEventListener(DELETED_EVENT, () => {
  const elementCustomAlert = document.createElement('div');
  elementCustomAlert.classList.add('alert');
  elementCustomAlert.innerText = 'Buku Dihapus!';
  elementCustomAlert.style.backgroundColor = 'red';

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

const loadDataFromStorage = () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const element of data) {
      books.push(element);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
  if (isStorageCompatible()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const moveData = () => {
  if (isStorageCompatible()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(MOVED_EVENT));
  }
};

const deleteData = () => {
  if (isStorageCompatible()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(DELETED_EVENT));
  }
};

const addBook = () => {
  const bookTitle = document.getElementById('title');
  const bookAuthor = document.getElementById('author');
  const bookYear = document.getElementById('year');
  const bookHasFinished = document.getElementById('isRead');
  let bookStatus;

  if (bookHasFinished.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  books.push({
    id: +new Date(),
    title: bookTitle.value,
    author: bookAuthor.value,
    year: Number(bookYear.value),
    isComplete: bookStatus,
  });

  bookTitle.value = null;
  bookAuthor.value = null;
  bookYear.value = null;
  bookHasFinished.checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const makeBookElement = (bookObject) => {
  const elementBookTitle = document.createElement('p');
  elementBookTitle.classList.add('element-title');
  elementBookTitle.innerHTML = `${bookObject.title} <span>(${bookObject.year})</span>`;

  const elementBookAuthor = document.createElement('p');
  elementBookAuthor.classList.add('element-writer');
  elementBookAuthor.innerText = bookObject.author;

  const descContainer = document.createElement('div');
  descContainer.classList.add('element-desc');
  descContainer.append(elementBookTitle, elementBookAuthor);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('element-action');

  const container = document.createElement('div');
  container.classList.add('element');
  container.append(descContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const returnBtn = document.createElement('button');
    returnBtn.classList.add('kembalikan-button');
    returnBtn.innerHTML = `<i class='bx bx-undo'></i>`;

    returnBtn.addEventListener('click', () => {
      returnBookFromFinished(bookObject.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('hapus-button');
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener('click', () => {
      deleteBook(bookObject.id);
    });

    actionContainer.append(returnBtn, deleteBtn);
    container.append(actionContainer);
  } else {
    const finishBtn = document.createElement('button');
    finishBtn.classList.add('selesai-button');
    finishBtn.innerHTML = `<i class='bx bx-check'></i>`;

    finishBtn.addEventListener('click', () => {
      addBookToFinished(bookObject.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('hapus-button');
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener('click', () => {
      deleteBook(bookObject.id);
    });

    actionContainer.append(finishBtn, deleteBtn);
    container.append(actionContainer);
  }

  return container;
};

const addBookToFinished = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const returnBookFromFinished = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const deleteBook = (bookId) => {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  deleteData();
};

const findBook = (bookId) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
};

const findBookIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
};

document.addEventListener('DOMContentLoaded', () => {
  if (isStorageCompatible()) {
    loadDataFromStorage();
  }

  const simpanForm = document.getElementById('formDataBuku');
  simpanForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById('formSearch');
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchBook();
  });

  const resetBtn = document.querySelector('.reset-button');
  resetBtn.addEventListener('click', () => {
    document.getElementById('search').value = '';
    searchBook();
  });
});

const searchBook = () => {
  const searchInput = document.getElementById('search').value.toLowerCase();
  const bookItems = document.getElementsByClassName('item');

  for (let i = 0; i < bookItems.length; i++) {
    const itemTitle = bookItems[i].querySelector('.item-title');
    if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
      bookItems[i].classList.remove('hidden');
    } else {
      bookItems[i].classList.add('hidden');
    }
  }
};
