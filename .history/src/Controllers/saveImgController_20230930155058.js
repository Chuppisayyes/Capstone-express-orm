import { PrismaClient } from "@prisma/client";

const model = new PrismaClient();
const Image = model.hinh_anh;
const User = model.nguoi_dung;
const SaveImage = model.luu_anh;

const handleImage = async (req, res) => {
    const { imageId, userId } = req.query;

    const image = await Image.findFirst({
        where: {
            hinh_id: Number(imageId),
        },
    });

    if (!image) {
        errorCode(res, "No image found");
        return;
    }

    const user = await User.findFirst({
        where: {
            nguoi_dung_id: Number(userId),
        },
    });

    if (!user) {
        errorCode(res, "No user found");
        return;
    }

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
        return res.status(200).send('lưu ảnh thành công')
    } else {
        await SaveImage.delete({
            where: {
                nguoi_dung_id_hinh_id: {
                    nguoi_dung_id: Number(userId),
                    hinh_id: Number(imageId),
                },
            },
        });
        res.status(200).send('xóa ảnh lưu thành công')
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
            res.status(200).send(data,'Luư ảnh thành công')
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
            res.status(200).send('Luư ảnh thành công')
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
            res.status(200).send('Luư ảnh thành công')

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