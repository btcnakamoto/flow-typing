import { openDB } from 'idb';

const DB_NAME = 'TypeLitDB';
const DB_VERSION = 1;
const STORE_NAME = 'chapters';

export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db;
};

export const saveChaptersToDB = async (chapters) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const chapter of chapters) {
    await tx.store.put(chapter);
  }
  await tx.done;
};

export const getChaptersFromDB = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const chapters = await tx.store.getAll();
  await tx.done;
  return chapters;
};

export const clearDB = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  await tx.done;
};

export const exportData = async () => {
  const chapters = await getChaptersFromDB();
  const blob = new Blob([JSON.stringify(chapters)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chapters.json';
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = async (file) => {
  const reader = new FileReader();
  reader.onload = async (event) => {
    const chapters = JSON.parse(event.target.result);
    await clearDB();
    await saveChaptersToDB(chapters);
  };
  reader.readAsText(file);
};