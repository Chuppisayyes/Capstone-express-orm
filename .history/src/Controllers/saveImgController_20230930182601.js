import { PrismaClient } from "@prisma/client";

const model = new PrismaClient();
const Image = model.hinh_anh;
const User = model.nguoi_dung;
const SaveImage = model.luu_anh;

const handleImage = async (req, res) => {
    const { imageId, userId } = req.query;

    // Kiểm tra các tham số truy vấn
    if (!imageId || isNaN(imageId) || imageId <= 0 || !userId || isNaN(userId) || userId <= 0) {
        return res.status(400).json({ error: 'Invalid imageId or userId' });
    }

    // Tìm kiếm hình ảnh và người dùng
    const image = await Image.findFirst({
        where: {
            hinh_id: Number(imageId),
        },
    });

    const user = await User.findFirst({
        where: {
            nguoi_dung_id: Number(userId),
        },
    });

    // Kiểm tra sự tồn tại của hình ảnh và người dùng
    if (!image) {
        return res.status(400).json({ error: 'No image found' });
    }

    if (!user) {
        return res.status(400).json({ error: 'No user found' });
    }

    // Tìm kiếm và xử lý hình ảnh đã lưu
    const authImage = await SaveImage.findFirst({
        where: {
            hinh_id: Number(imageId),
            nguoi_dung_id: Number(userId),
        },
    });

    const data = {
        nguoi_dung_id: Number(userId),
        hinh_id: Number(imageId),
        ngay_luu: new Date(),
    };

    if (!authImage) {
        await SaveImage.create({
            data: data,
        });
        return res.status(200).json({ message: 'Lưu ảnh thành công' });
    } else {
        await SaveImage.delete({
            where: {
                nguoi_dung_id_hinh_id: {
                    nguoi_dung_id: Number(userId),
                    hinh_id: Number(imageId),
                },
            },
        });
        return res.status(200).json({ message: 'Xóa ảnh lưu thành công' });
    }
};


const getSaveImage = async (req, res) => {
    const { imageId, userId } = req.query;

    const image = await Image.findFirst({
        where: {
            hinh_id: Number(imageId ? imageId : -1),
        },
    });

    const user = await User.findFirst({
        where: {
            nguoi_dung_id: Number(userId ? userId : -1),
        },
    });
    // by user and image
    if (image && user) {
        try {
            const data = await SaveImage.findMany({
                where: {
                    hinh_id: Number(imageId),
                    nguoi_dung_id: Number(userId),
                },
            });
            res.status(200).json(data, { message: 'Lưu ảnh thành công' });
        } catch (error) {
            console.log(error);
            res.status(500).send("Bất ổn gòi BE");
        }
        return;
    }
    //image

    if (image) {
        try {
            const data = await SaveImage.findMany({
                where: {
                    hinh_id: Number(imageId),
                },
            });
            res.status(200).json(data, { message: 'Lưu ảnh thành công' });

        } catch (error) {
            console.log(error);
            res.status(500).send("Bất ổn gòi BE");
        }
        return;
    }
    // by user
    if (user) {
        try {
            const data = await SaveImage.findMany({
                where: {
                    nguoi_dung_id: Number(userId),
                },
            });
            res.status(200).json(data, { message: 'Lưu ảnh thành công' });


        } catch (error) {
            console.log(error);
            res.status(500).send("Bất ổn gòi BE");
        }
        return;
    }

    if (!user && !image) {
        res.status(400).send('Người dùng và hình ảnh không tồn tại')
    }
    res.status(500).send("Bất ổn gòi BE");
};

export { handleImage, getSaveImage }