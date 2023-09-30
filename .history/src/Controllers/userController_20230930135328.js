import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import { createToken } from '../Config/jwtConfig.js';
const model = new PrismaClient();
const User = model.nguoi_dung;

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send('Dữ liệu nhập vào không hợp lệ!');
            return;
        }
        const checkUser = await User.findFirst({
            where: {
                email
            }
        });
        if (checkUser) {
            const checkPass = bcrypt.compareSync(password, checkUser.mat_khau);
            if (checkPass) {
                let token = createToken(checkUser);
                res.status(200).send(token,"Đăng nhập thành công");
            } 
            else {
                res.status(400).send("Mật khẩu không đúng");
            }
        }
        else {
            res.status(400).send("Email không tìm thấy");
        }
    }
    catch {
        res.status(500).send(error'Bất ổn gòi BE ');
    }
}
const signUp = async (req, res) => {
    try {
        const { email, password, fullName, age, avatar } = req.body;
        if (!email || !password || !fullName || !age || !avatar) {
            res.status(400).send('Dữ liệu nhập vào không hợp lệ!');
            return;
        }
        const checkEmail = await User.findMany({ where: { email } });

        if (checkEmail.length > 0) {
            res.status(400).send('Email đã tồn tại !');
            return;
        }


        const newUser = {
            email,
            ho_ten: fullName,
            tuoi: age,
            mat_khau: bcrypt.hashSync(password, 10),
        };

        await User.create({ data: newUser });
        res.status(201).send('Tạo mới tài khoản thành công !');
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Bất ổn gòi BE ');
    }
};
const signInFacebook = async (req, res) => {
    const { uID } = req.params;

    const checkUser = await User.findOne({
        where: {
            facebook_app_id: uID
        }
    })

    if (checkUser) {
        res.send("token");
    } else {
        const newUser = {
            email,
            ho_ten: fullName,
            mat_khau: "",
            facebook_app_id: uID
        }
        await User.create(newUser);
        res.send("token")
    }
}
const getUser = async (req, res) => {
    try {
        const data = await User.findMany();
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Bất ổn gòi BE ');
    }
};
const getUserById = async (req, res) => {
    try {
        const { userId } = req.user;
        const data = await User.findUnique({
            select: {
                email: true,
                ho_ten: true,
                tuoi: true,
                anh_dai_dien: true,
            },
            where: {
                nguoi_dung_id: userId,
            },
        });

        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Bất ổn gòi BE ');
    }
}
const updateProfile = async (req, res) => {
    try {
        const { fullName, age } = req.body;
        if (!fullName || !age) {
            res.status(400).send('Dữ liệu nhập vào không hợp lệ!');
            return;
        }

        if (!req.file) {
            res.status(400).send('File rỗng!');
            return;
        }

        const data = await User.update({
            select: {
                email: true,
                ho_ten: true,
                tuoi: true,
                anh_dai_dien: true,
            },
            where: {
                nguoi_dung_id: req.user.userId,
            },
            data: {
                ho_ten: fullName,
                tuoi: Number.parseInt(age),
                anh_dai_dien: req.file.path,
            },
        });
        res.send({
            message: 'Cập nhật thông tin thành công!',
            data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Bất ổn gòi BE ');
    }
};
const deleteUser = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findFirst({
        where: { nguoi_dung_id: Number(userId) },
    });

    if (!user) {
        return res.status(400).send('Không tìm thấy người dùng');
    }

    await User.delete({
        where: { nguoi_dung_id: Number(userId) },
    });

    res.status(200).send('Xóa người dùng thành công')
};
export { signUp, signIn, signInFacebook, getUserById, updateProfile, getUser, deleteUser }