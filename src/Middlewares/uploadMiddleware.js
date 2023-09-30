import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, callback) =>
    callback(null, process.cwd() + "/Public/img"),
  filename: (req, file, callback) => {
    let newName = Date.now() + "_" + file.originalname.replace(/\s+/g, "_"); // Xóa khoảng trắng thay bằng '_'
    callback(null, newName);
  },
});
const upload = multer({ storage });
const uploadSingle = upload.single('image');

export default uploadSingle;