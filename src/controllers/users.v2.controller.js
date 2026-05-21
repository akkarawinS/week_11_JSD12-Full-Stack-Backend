import { User } from '../modules/users/user.model.js'
import { hashPassword, comparePassword } from '../middlewares/hashPassword.js'
import jwt from 'jsonwebtoken'

const userResponse = (doc) => {
    const user = doc.toObject();
    delete user.password;
    return user;
};

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
}

export const getDynamicUsers = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, data: userResponse(user) });
    } catch (err) {
        next(err);
    }
}

export const addUsers = async (req, res, next) => {
    const { username, email, password, role } = req.body || {};

    //Eror handling
    if (!username || !email || !password) {
        const err = new Error('Missing required fields: username, email, and password are required.');
        err.name = 'ValidationError';
        err.status = 400;
        return res.status(400).json({ success: false, error: err });
    }
    try {
        const doc = await User.create({ username, email, password, role });

        return res.status(201).json({ success: true, data: userResponse(doc) });
    } catch (err) {
        next(err);
    }
}

export const updateUsers = async (req, res) => {
    const { username, email, password } = req.body || {};

    //ดัก error ในเคสว่าถ้า 
    if (!username && !email && !password) {
        const err = new Error('At least one field (username, email, password, or role) must be provided for update.');
        err.name = 'ValidationError';
        err.status = 400;
        return res.status(400).json({ success: false, error: err });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, password },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: userResponse(updatedUser) });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
}

export const deleteUsers = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
}

export const pgGetUser = async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select(PG_SELECT);

        if (error) throw error;

        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}

export const register = async (req, res, next) => {
    const { username, email, password } = req.body || {};

    const dupeUsers = await User.findOne({ email });
    if (dupeUsers) {
        return res.status(400).json({ success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    try {
        const doc = await User.create({
            username,
            email,
            password: password
        });
        res.status(201).json({ success: true, message: 'สมัคสมาชิกสำเร็จ!' });
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const userInDB = await User.findOne({ email }).select('+password');

        if (!userInDB) {
            return res.status(400).json({ success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }
        const isMatch = await comparePassword(password, userInDB.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        const token = jwt.sign({ userId: userInDB._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        }); 

        const isProd = process.env.NODE_ENV === 'production'

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: isProd, // Only send over HTTPS in production
            sameSite: isProd ? "none" : "lax",
            path: "/",
            maxAge: 60 * 60 * 1000, // 1HR its age of cookie
        })


        res.status(200).json({
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ!',
            user: {
                _id: userInDB._id,
                username: userInDB.username,
                email: userInDB.email,
                role: userInDB.role,
            },
        });
    } catch (err) {
        next(err);
    }
}

export const checkUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found !",
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                role: user.role,
            },
        });

    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProd, // Only send over HTTPS in production
        sameSite: isProd ? "none" : "lax",
        path: "/",
    });

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};