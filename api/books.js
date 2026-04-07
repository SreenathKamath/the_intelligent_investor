const { sendJson } = require("./_lib/data");
const { fetchBookCollection } = require("./_lib/dynamic");

module.exports = async function handler(req, res) {
  try {
    const books = await fetchBookCollection();
    sendJson(res, 200, { books });
  } catch (error) {
    sendJson(res, 200, {
      books: [],
      warning: "Book metadata could not be loaded right now.",
    });
  }
};
