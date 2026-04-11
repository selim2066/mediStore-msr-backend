import multer from "multer";

// store file in memory (best for cloud upload later)
const storage = multer.memoryStorage();

export const upload = multer({ storage });