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

    try {
        // Kiểm tra xem người dùng tồn tại
        const existingUser = await User.findFirst({
            where: { nguoi_dung_id: Number(userId) },
        });

        if (!existingUser) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Kiểm tra tuổi hợp lệ
        if (age < 18 || age > 99) {
            return res.status(400).json({ message: "Tuổi không hợp lệ" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cập nhật thông tin người dùng
        await User.update({
            where: { nguoi_dung_id: Number(userId) },
            data: {
                email: email,
                mat_khau: hashedPassword,
                ho_ten: fullName,
                tuoi: age,
                anh_dai_dien: avatar,
            }
        });

        res.status(200).json({ message: "Cập nhật người dùng thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Bất ổn gòi BE' });
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