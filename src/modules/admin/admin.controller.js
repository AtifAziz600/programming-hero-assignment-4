import * as adminService from "./admin.service";
export const getAllUsers = async (_req, res) => {
    const users = await adminService.getAllUsers();
    res.status(200).json({ success: true, data: users });
};
export const updateUserStatus = async (req, res) => {
    const { status } = req.body;
    const user = await adminService.updateUserStatus(req.params.id, status);
    res.status(200).json({ success: true, data: user });
};
export const getAllGearAdmin = async (_req, res) => {
    const gear = await adminService.getAllGearAdmin();
    res.status(200).json({ success: true, data: gear });
};
export const getAllRentalsAdmin = async (_req, res) => {
    const rentals = await adminService.getAllRentalsAdmin();
    res.status(200).json({ success: true, data: rentals });
};
