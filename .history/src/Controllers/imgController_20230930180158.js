import { PrismaClient } from "@prisma/client";
import multer from 'multer';
import { decodeToken } from "../Config/jwtConfig.js";
import fs from 'fs';
const storage = multer.diskStorage({
    destination: (req, file, callback) =>
      callback(null, process.cwd() + "/public/img"),
    filename: (req, file, callback) => {
      let newName = Date.now() + "_" + file.originalname.replace(/\s+/g, "_"); // Xóa khoảng trắng thay bằng '_'
      callback(null, newName);
    },
  });

const model = new PrismaClient();
const Image = model.hinh_anh;
const User = model.nguoi_dung;


const getImg = async (req, res) => {
    const { userId, keywords } = req.query;

    if (!userId) {
        // Không có userId, nên lấy tất cả hình ảnh
        try {
            const images = await Image.findMany({
                where: {
                    ten_hinh: {
                        contains: keywords ? keywords : "",
                    },
                },
                include: {
                    nguoi_dung: true,
                },
            });

            if (images.length > 0) {
                res.status(200).send({ data: images, message: 'Lấy hình ảnh thành công' });
            } else {
                res.status(400).send('Không tìm thấy hình ảnh');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Bất ổn gòi BE');
        }
    } else {
        // Có userId, nên lấy hình ảnh theo người dùng
        try {
            const images = await Image.findMany({
                where: {
                    nguoi_dung_id: Number(userId),
                },
            });

            res.status(200).send({ data: images, message: 'Lấy hình ảnh theo người dùng thành công' });
        } catch (error) {
            console.log(error);
            res.status(500).send('Bất ổn gòi BE');
        }
    }
};
const getImgById = async (req, res) => {
    try {
        const { imageId } = req.params;

        const image = await Image.findFirst({
            where: {
                hinh_id: Number(imageId),
            },
        });

        if (image) {
            res.status(200).json({ image, message: 'Lấy hình ảnh thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy hình ảnh' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Bất ổn gòi BE' });
    }
};

const getImgByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await Image.findMany({
            where: {
                nguoi_dung_id: Number(userId),
            },
        });

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Bất ổn gòi BE' });
    }
};
// create image
const createImg = async (req, res) => {
    const { imageName, url, description, userId } = req.body;

    // Kiểm tra xem userId có tồn tại và là số dương hay không
    if (!userId || isNaN(userId) || userId <= 0) {
        return res.status(400).send('UserId không hợp lệ');
    }

    const user = await User.findFirst({
        where: { nguoi_dung_id: Number(userId) },
    });

    if (!user) {
        return res.status(400).send("Người dùng không tồn tại.");
    }

    const data = {
        ten_hinh: imageName,
        duong_dan: url,
        mo_ta: description,
        nguoi_dung_id: userId,
    };

    try {
        const newImage = await Image.create({
            data: data,
        });

        return res.status(201).json(newImage);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Bất ổn gòi BE');
    }
};

// update image
const updateImg = async (req, res) => {
    const { imageName, url, description } = req.body;
    const { userId, imageId } = req.query;

    // Kiểm tra xem userId và imageId có hợp lệ hay không
    if (!userId || isNaN(userId) || userId <= 0 || !imageId || isNaN(imageId) || imageId <= 0) {
        return res.status(400).send('UserId hoặc ImageId không hợp lệ');
    }

    const image = await Image.findFirst({
        where: {
            hinh_id: Number(imageId),
        },
    });

    if (!image) {
        return res.status(400).send('Không tìm thấy hình ảnh.');
    }

    // Kiểm tra quyền truy cập
    if (image.nguoi_dung_id !== Number(userId)) {
        return res.status(403).send('Bạn không có quyền chỉnh sửa hình ảnh của người khác.');
    }
    try {
        await Image.update({
            where: {
                hinh_id: Number(imageId),
            },
            data: {
                ten_hinh: imageName,
                duong_dan: url,
                mo_ta: description,
            }
        });
        res.status(200).json({ message: "Cập nhật hình ảnh thành công"});

    } catch (error) {
        console.error(error);
        res.status(500).send('Bất ổn gòi BE');
    }
};
const upload = multer({ storage: storage }).single('file');
// upload Image
const uploadImg = async (req, res) => {
    try {
        const { imageId } = req.query;
        const user = decodeToken(req.headers.token);
        const image = await Image.findFirst({
            where: { hinh_id: Number(imageId) },
        });

        if (user.data.nguoi_dung_id !== image.nguoi_dung_id) {
            return res.status(403).send("Access denied.");
        }

        const imageUrl = "/Public/img/";
        let file = req.file;

        fs.readFile(process.cwd() + imageUrl + file.filename, (err, data) => {
            if (err) {
                return res.status(500).send("Error uploading image");
            }

            const fileBase = `data:${file.mimetype};base64,${Buffer.from(data).toString("base64")}`;

            if (!file.filename) {
                return res.status(500).send("Error uploading image");
            };

            // Cập nhật đường dẫn của hình ảnh
             Image.update({
                where: {
                    hinh_id: Number(imageId),
                },
                data: {
                    duong_dan: `localhost:8080` + imageUrl + file.filename,
                  },
                  
            });

        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


const deleteImg = async (req, res) => {
    try {
        const { userId, imageId } = req.query;

        const user = descToken(req.headers.token);

        const image = await Image.findFirst({
            where: {
                hinh_id: Number(imageId),
            },
        });

        //kiểm tra có phải chính chủ xóa image không.
        if (user.data.nguoi_dung_id !== image.nguoi_dung_id) {
            return res.status(400).send("Access denied.");
        }

        if (!image) {
            res.status(400).send("There are no images in the repository.");
            return;
        }

        if (image.nguoi_dung_id !== Number(userId)) {
            res.status(400).send(
                "You are not authorized to alter the photo of another user."
            );
            return;
        }
        await Image.delete({
            where: {
                hinh_id: Number(imageId),
            },
        });

        // Delete the image
        // fs.unlink(process.cwd() + "/public/img/" + image.duong_dan, (err) => {});

        res.status(200).send("Image deleted successfully.");
    } catch (error) {
        console.log(error);
        res.status(500).send('Bất ổn gòi BE ');
    }
};

export { getImg, getImgById, getImgByUserId, createImg, updateImg, uploadImg, deleteImg, upload }