import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import { createToken } from '../Config/jwtConfig.js';
const model = new PrismaClient();
const User = model.nguoi_dung;
const encodePassword = (password, number = 10) => {
    return bcrypt.hashSync(password, number);
};
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
                const token = createToken({
                    userId: checkUser.nguoi_dung_id,
                    email: checkUser.email,
                });
                res.status(200).json({ message: "Đăng nhập thành công", token });
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
        res.status(500).send('Bất ổn gòi BE ');
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
    const { userId } = req.params;
    try {
        const user = await User.findFirst({
            where: { nguoi_dung_id: Number(userId) },
        });
        if (user) {
            res.status(200).json({ user, message: "Lấy dữ liệu thành công" });
        } else {
            res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Bất ổn gòi BE ');
    }
}
const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { email, password, fullName, age, avatar } = req.body;
    const data = {
        email: email,
        mat_khau: encodePassword(password),
        ho_ten: fullName,
        tuoi: age,
        anh_dai_dien: avatar,
    };
    if (userId) {
        if (
            email !== "" &&
            password !== "" &&
            fullName !== "" &&
            age > 1 &&
            avatar !== ""
        ) {
            try {
                await User.update({
                    where: { nguoi_dung_id: Number(userId) },
                    data: data,
                });
                res.status(200).json({message: "Update người dùng thành công" });
            } catch (error) {
                res.status(500).send('Bất ổn gòi BE ');
            }
        } else {
            res.status(400).json(data, { message: "Provide complete information" });
        }
    } else {
        res.status(400).json(data, { message: "Provide complete information" });
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
export { signUp, signIn, signInFacebook, getUserById, updateUser, getUser, deleteUser }