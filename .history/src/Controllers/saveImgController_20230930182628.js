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

    // Kiểm tra các tham số truy vấn
    if ((!imageId && imageId !== 0) || isNaN(imageId) || imageId < 0 || (!userId && userId !== 0) || isNaN(userId) || userId < 0) {
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

    // Trường hợp không tìm thấy hình ảnh hoặc người dùng
    if (!image && !user) {
        return res.status(404).json({ error: 'No image or user found' });
    }

    // Trường hợp tìm thấy hình ảnh và người dùng
    if (image && user) {
        try {
            const data = await SaveImage.findMany({
                where: {
                    hinh_id: Number(imageId),
                    nguoi_dung_id: Number(userId),
                },
            });
            return res.status(200).json(data, { message: 'Lưu ảnh thành công' });
        } catch (error) {
            console.log(error);
            return res.status(500).send("Bất ổn gòi BE");
        }
    }

    // Trường hợp tìm thấy hình ảnh hoặc người dùng
    if (image) {
        try {
            const data = await SaveImage.findMany({
                where: {
                    hinh_id: Number(imageId),
                },
            });
            return res.status(200).json(data, { message: 'Lưu ảnh thành công' });
        } catch (error) {
            console.log(error);
            return res.status(500).send("Bất ổn gòi BE");
        }
    }

    if (user) {
        try {
            const data = await SaveImage.findMany({
                where: {
                    nguoi_dung_id: Number(userId),
                },
            });
            return res.status(200).json(data, { message: 'Lưu ảnh thành công' });
        } catch (error) {
            console.log(error);
            return res.status(500).send("Bất ổn gòi BE");
        }
    }
};


export { handleImage, getSaveImage }