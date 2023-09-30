import { PrismaClient } from "@prisma/client";
const model = new PrismaClient();
const Comment = model.binh_luan;
const User = model.nguoi_dung;
const Image = model.hinh_anh;

const getReviewByImageId = async (req, res) => {
    try {
        const { imageId } = req.params;
        const data = await Comment.findMany({
            where: {
                hinh_id: Number.parseInt(imageId),
            },
            include: {
                hinh_anh: {
                    select: {
                        ten_hinh: true,
                        duong_dan: true,
                        mo_ta: true,
                    },
                },
                nguoi_dung: {
                    select: {
                        email: true,
                        ho_ten: true,
                        tuoi: true,
                        anh_dai_dien: true,
                    },
                },
            },
        });
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Bất ổn gòi BE ');
    }
};

const createReview = async (req, res) => {
    try {
        const { imageId, comment } = req.body;
        const { userId } = req.params;
        if (!imageId || !comment) {
            res.status(400).send('Dữ liệu nhập vào không hợp lệ!');
            return;
          }
        const user = await User.findFirst({
            where: {
                nguoi_dung_id: Number(userId),
            },
        });
        const image = await Image.findFirst({
            where: {
                hinh_id: Number(imageId),
            },
        });
        if (user && image) {
            const { content } = req.body;
            const data = {
                nguoi_dung_id: Number(userId),
                hinh_id: Number(imageId),
                ngay_binh_luan: new Date(),
                noi_dung: comment,
            };
            try {
                await Comment.create({
                    data: data,
                });
                res.status(201).send("Thêm comment thành công");
            } catch (error) {
                console.log(error);
                res.status(500).send('Bất ổn gòi BE ');
            }
        } else {
            res.status(400).send('Không tìm thấy  người dùng hoặc hình ảnh!');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Bất ổn gòi BE ');
    }
};

const updateReview = async (req, res) => {
    try {
        const { userId, reviewId } = req.query;
        const review = await Comment.findFirst({
            where: {
                binh_luan_id: Number(reviewId),
            },
        });

        if (!review) {
            return res.status(400).send('Không tìm thấy review!');
        }
        if (userId !== review.nguoi_dung_id.toString()) {
            return res.status(400).send('Bạn không có quyền chỉnh sửa review!');
        }
        const { content } = req.body;
        const data = {
            ngay_binh_luan: new Date(),
            noi_dung: content,
        };
        try {
            await Comment.update({
                data: data,
                where: {
                    binh_luan_id: Number(reviewId),
                },
            });
            res.send({
                message: 'Cập nhật review thành công!',
                data,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi trong quá trình cập nhật review');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi trong quá trình xử lý');
    }
};

const deleteReview = async (req, res) => {
    try {
        const { userId, reviewId } = req.query;
        const review = await Comment.findFirst({
            where: {
                binh_luan_id: Number(reviewId),
            },
        });

        if (!review) {
            return res.status(400).send('Không tìm thấy comment!');
        }

        if (userId !== review.nguoi_dung_id.toString()) {
            return res.status(400).send('Bạn không có quyền xóa comment!');
        }
        await Comment.delete({
            where: {
                binh_luan_id: Number(reviewId),
            },
        });
        res.send({
            message: 'Xóa comment thành công!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Bất ổn gòi BE ');
    }
};


export {
    getReviewByImageId,
    createReview,
    updateReview,
    deleteReview
};
