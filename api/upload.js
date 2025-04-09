const multiparty = require('multiparty');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const form = new multiparty.Form();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(500).send('Error parsing files');
                return;
            }

            const uploadedFiles = files.files || [];
            if (uploadedFiles.length === 0) {
                res.status(400).send('No files uploaded');
                return;
            }

            try {
                const uploadPromises = uploadedFiles.map(file =>
                    cloudinary.uploader.upload(file.path, {
                        resource_type: 'auto', // Detects file type automatically
                    })
                );

                const results = await Promise.all(uploadPromises);
                const response = results.map(result => ({
                    name: result.original_filename,
                    url: result.secure_url,
                    size: result.bytes,
                }));

                res.status(200).json({
                    message: 'Files uploaded to Cloudinary successfully!',
                    files: response,
                });
            } catch (error) {
                res.status(500).send('Error uploading to Cloudinary: ' + error.message);
            }
        });
    } else {
        res.status(405).send('Method not allowed');
    }
};
