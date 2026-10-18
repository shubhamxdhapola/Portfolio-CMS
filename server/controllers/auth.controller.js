import User from "../models/user.model.js";
import SiteSettings from "../models/site.settings.model.js";
import { generateToken } from "../utils/generateToken.js";
import { saveCookie, clearCookie } from "../utils/saveCookie.js";
import { logActivity } from "../utils/logger.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const cleanUsername = username.toLowerCase().trim();
    const user = await User.findOne({
      $or: [{ username: cleanUsername }, { email: cleanUsername }],
    }).select('+password +tokenVersion');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id, user.tokenVersion);
    saveCookie(token, req, res);

    await logActivity("ADMIN_LOGIN", "Authentication", "Admin logged in successfully", req);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        admin: {
          id: user._id,
          _id: user._id,
          username: user.username,
          email: user.email,
          name: user.name || "Shubham Dhapola",
          avatarUrl: user.avatarUrl || "",
          sidebarTitle: user.sidebarTitle || "shubhamxdev",
          role: user.role,
          lastLoginAt: user.lastLoginAt,
        },
        user: {
          id: user._id,
          _id: user._id,
          username: user.username,
          email: user.email,
          name: user.name || "Shubham Dhapola",
          avatarUrl: user.avatarUrl || "",
          sidebarTitle: user.sidebarTitle || "shubhamxdev",
          role: user.role,
          lastLoginAt: user.lastLoginAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    clearCookie(req, res);

    if (req.user || req.admin) {
      await logActivity("ADMIN_LOGOUT", "Authentication", "Admin logged out", req);
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Error in logout controller:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user || req.admin;
    const adminData = {
      id: user._id,
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name || "Shubham Dhapola",
      avatarUrl: user.avatarUrl || "",
      sidebarTitle: user.sidebarTitle || "shubhamxdev",
      role: user.role,
      lastLoginAt: user.lastLoginAt,
    };

    return res.status(200).json({
      success: true,
      data: {
        admin: adminData,
        user: adminData,
      },
    });
  } catch (error) {
    console.error("Error in getMe controller:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserInfo = getMe;

export const updateProfile = async (req, res) => {
  try {
    const { name, avatarUrl, sidebarTitle } = req.body;
    const userId = req.user?._id || req.admin?._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    if (name !== undefined) user.name = name.trim();
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl.trim();
    if (sidebarTitle !== undefined) user.sidebarTitle = sidebarTitle.trim();

    await user.save();

    if (sidebarTitle !== undefined) {
      await SiteSettings.findOneAndUpdate(
        {},
        { sidebarBrandTitle: sidebarTitle.trim() },
        { upsert: true }
      );
    }

    await logActivity("PROFILE_UPDATED", "Admin Profile", "Admin updated display profile & branding", req);

    const adminData = {
      id: user._id,
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name || "Shubham Dhapola",
      avatarUrl: user.avatarUrl || "",
      sidebarTitle: user.sidebarTitle || "shubhamxdev",
      role: user.role,
      lastLoginAt: user.lastLoginAt,
    };

    return res.status(200).json({
      success: true,
      message: "Admin profile updated successfully.",
      data: {
        admin: adminData,
        user: adminData,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const userId = req.user?._id || req.admin?._id;
    const user = await User.findById(userId).select('+password +tokenVersion');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password does not match." });
    }

    user.password = newPassword;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    await logActivity("PASSWORD_CHANGED", "Security", "Admin updated password", req);

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error in changePassword controller:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
