let books = [];

function escapeHtml(value) {
  return `${value || ""}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderBooks(activeId) {
  const booksGrid = document.getElementById("books-grid");
  const bookDetail = document.getElementById("book-detail");
  if (!booksGrid || !bookDetail) return;

  const activeBook = books.find((book) => book.id === activeId) || books[0];
  booksGrid.innerHTML = books
    .map(
      (book) => `
        <article class="book-card ${book.id === activeBook.id ? "active" : ""}" data-book-id="${book.id}">
          <div class="book-card-top">
            <div class="book-cover">${book.coverUrl ? `<img src="${book.coverUrl}" alt="${escapeHtml(book.title)} cover" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:16px;" />` : escapeHtml(book.title.charAt(0))}</div>
            <div>
              <h3>${escapeHtml(book.title)}</h3>
              <p>${escapeHtml(book.author)}</p>
            </div>
          </div>
          <p>${escapeHtml(book.description)}</p>
        </article>
      `
    )
    .join("");

  bookDetail.innerHTML = `
    <p class="eyebrow">Book Detail</p>
    <h3>${escapeHtml(activeBook.title)}</h3>
    <p>${escapeHtml(activeBook.author)}</p>
    <p>${escapeHtml(activeBook.description)}</p>
    <strong>Key Subjects</strong>
    <ul>${(activeBook.subjects || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>Subject metadata is limited for this title right now.</li>"}</ul>
    ${activeBook.sourceUrl ? `<a class="trend flat" href="${activeBook.sourceUrl}" target="_blank" rel="noreferrer">Open Book Source</a>` : ""}
  `;

  document.querySelectorAll("[data-book-id]").forEach((element) => {
    element.addEventListener("click", () => renderBooks(element.dataset.bookId));
  });
}

async function loadBooks() {
  const booksGrid = document.getElementById("books-grid");
  const bookDetail = document.getElementById("book-detail");
  if (!booksGrid || !bookDetail) return;

  booksGrid.innerHTML = `<article class="book-card"><p>Loading live book metadata...</p></article>`;
  bookDetail.innerHTML = `<p class="eyebrow">Book Detail</p><p>Loading...</p>`;

  try {
    const response = await fetch("/api/books");
    const payload = await response.json();
    books = payload.books || [];
    if (!books.length) {
      throw new Error(payload.warning || "No books available");
    }
    renderBooks(books[0].id);
  } catch (error) {
    books = [
      {
        id: "books-unavailable",
        title: "Books Unavailable",
        author: "Open Library",
        description: "Live book metadata could not be loaded right now.",
        subjects: ["Try refreshing or check the source later."],
        coverUrl: "",
        sourceUrl: "https://openlibrary.org/",
      },
    ];
    renderBooks(books[0].id);
  }
}

loadBooks();
