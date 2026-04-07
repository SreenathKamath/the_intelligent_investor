const books = [
  {
    id: "rich-dad",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    description: "A mindset-oriented starting point for understanding assets, liabilities, and cash flow thinking.",
    concepts: [
      "Assets should put money into your pocket over time.",
      "Financial literacy matters more than just a higher income.",
      "Owning productive systems creates long-term freedom.",
    ],
    lessons: [
      "Track where your income goes before chasing bigger returns.",
      "Distinguish consumption from investment clearly.",
      "Use salary as a tool to acquire assets, not status expenses.",
    ],
    takeaways: [
      "Start with a savings discipline and invest consistently.",
      "Build income-generating assets early in life.",
      "Treat financial education as a permanent habit.",
    ],
  },
  {
    id: "intelligent-investor",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    description: "The classic playbook for disciplined investing, margin of safety, and emotional control.",
    concepts: [
      "Market prices and business value are not always the same.",
      "Margin of safety reduces the cost of being wrong.",
      "Temperament matters as much as analytical skill.",
    ],
    lessons: [
      "Do not confuse market noise with intrinsic business reality.",
      "Demand a buffer before taking investment risk.",
      "Avoid emotional reactions to volatility.",
    ],
    takeaways: [
      "Define your investing framework before entering markets.",
      "Use diversification and patience as strategic tools.",
      "Let discipline outperform excitement.",
    ],
  },
  {
    id: "psychology-money",
    title: "Psychology of Money",
    author: "Morgan Housel",
    description: "A modern guide to how behavior, patience, and luck influence wealth creation.",
    concepts: [
      "Good financial outcomes often come from behavior more than spreadsheets.",
      "Compounding needs long time horizons and restraint.",
      "Personal finance is personal because goals differ by individual.",
    ],
    lessons: [
      "Sustainable habits are stronger than aggressive short bursts.",
      "Avoid copying strategies that do not match your life stage.",
      "Preserving flexibility is a financial advantage.",
    ],
    takeaways: [
      "Choose plans you can actually stick with.",
      "Make room for uncertainty and luck in every projection.",
      "Patience is part of the return engine.",
    ],
  },
];

function renderBooks(activeId = books[1].id) {
  const booksGrid = document.getElementById("books-grid");
  const bookDetail = document.getElementById("book-detail");
  if (!booksGrid || !bookDetail) return;

  booksGrid.innerHTML = books
    .map(
      (book) => `
        <article class="book-card ${book.id === activeId ? "active" : ""}" data-book-id="${book.id}">
          <div class="book-card-top">
            <div class="book-cover">${book.title.charAt(0)}</div>
            <div>
              <h3>${book.title}</h3>
              <p>${book.author}</p>
            </div>
          </div>
          <p>${book.description}</p>
        </article>
      `
    )
    .join("");

  const activeBook = books.find((book) => book.id === activeId) ?? books[0];
  bookDetail.innerHTML = `
    <p class="eyebrow">Book Detail</p>
    <h3>${activeBook.title}</h3>
    <p>${activeBook.author}</p>
    <p>${activeBook.description}</p>
    <strong>Key Concepts</strong>
    <ul>${activeBook.concepts.map((item) => `<li>${item}</li>`).join("")}</ul>
    <strong>Important Lessons</strong>
    <ul>${activeBook.lessons.map((item) => `<li>${item}</li>`).join("")}</ul>
    <strong>Practical Takeaways</strong>
    <ul>${activeBook.takeaways.map((item) => `<li>${item}</li>`).join("")}</ul>
  `;

  document.querySelectorAll("[data-book-id]").forEach((element) => {
    element.addEventListener("click", () => renderBooks(element.dataset.bookId));
  });
}

renderBooks();
