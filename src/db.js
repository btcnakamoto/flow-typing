import { openDB } from 'idb';

const DB_NAME = 'TypeLitDB';
const DB_VERSION = 2;  // 增加数据库版本号，以确保数据库升级
const BOOK_STORE = 'books';
const CHAPTER_STORE = 'chapters';

export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (!db.objectStoreNames.contains(BOOK_STORE)) {
        db.createObjectStore(BOOK_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(CHAPTER_STORE)) {
        db.createObjectStore(CHAPTER_STORE, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db;
};

export const saveBookToDB = async (book) => {
  const db = await initDB();
  const tx = db.transaction(BOOK_STORE, 'readwrite');
  await tx.store.put(book);
  await tx.done;
};

export const saveChaptersToDB = async (chapters) => {
  const db = await initDB();
  const tx = db.transaction(CHAPTER_STORE, 'readwrite');
  for (const chapter of chapters) {
    await tx.store.put(chapter);
  }
  await tx.done;
};

export const getBooksFromDB = async () => {
  const db = await initDB();
  const tx = db.transaction(BOOK_STORE, 'readonly');
  const books = await tx.store.getAll();
  await tx.done;
  return books;
};

export const getChaptersFromDB = async () => {
  const db = await initDB();
  const tx = db.transaction(CHAPTER_STORE, 'readonly');
  const chapters = await tx.store.getAll();
  await tx.done;
  return chapters;
};

export const clearDB = async () => {
  const db = await initDB();
  const bookTx = db.transaction(BOOK_STORE, 'readwrite');
  await bookTx.store.clear();
  await bookTx.done;

  const chapterTx = db.transaction(CHAPTER_STORE, 'readwrite');
  await chapterTx.store.clear();
  await chapterTx.done;
};

export const exportData = async () => {
  const books = await getBooksFromDB();
  const chapters = await getChaptersFromDB();
  const blob = new Blob([JSON.stringify({ books, chapters })], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = async (file) => {
  const reader = new FileReader();
  reader.onload = async (event) => {
    const data = JSON.parse(event.target.result);
    await clearDB();
    await saveBookToDB(data.books);
    await saveChaptersToDB(data.chapters);
  };
  reader.readAsText(file);
};