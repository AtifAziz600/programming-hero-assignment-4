import * as authService from "./auth.service";
export const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ success: true, data: user });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        res.status(401).json({ success: false, message: err.message });
    }
};
export const getMe = async (req, res) => {
    const user = req.user;
    const { password, ...safeUser } = user;
    res.status(200).json({ success: true, data: safeUser });
};
