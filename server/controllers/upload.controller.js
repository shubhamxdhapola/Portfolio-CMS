export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image provided"
            });
        }

        const filePath = req.file.path;
        const publicId = req.file.filename || '';

        return res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            profileImage: filePath,
            url: filePath,
            data: {
                url: filePath,
                publicId: publicId,
                storage: 'cloudinary'
            }
        });
    } catch (error) {
        console.log("Error in upload controller : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default uploadImage;
