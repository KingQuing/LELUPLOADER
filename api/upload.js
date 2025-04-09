const multiparty = require('multiparty');

module.exports = (req, res) => {
    if (req.method === 'POST') {
        const form = new multiparty.Form();

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(500).send('Error parsing files');
                return;
            }

            // Files are in `files.files` (based on the input name "files")
            const uploadedFiles = files.files || [];
            if (uploadedFiles.length === 0) {
                res.status(400).send('No files uploaded');
                return;
            }

            // For Vercel, you can't write to the filesystem permanently.
            // We'll just log the file info for now as an example.
            const response = uploadedFiles.map(file => ({
                name: file.originalFilename,
                size: file.size,
            }));

            res.status(200).json({
                message: 'Files received successfully!',
                files: response,
            });
        });
    } else {
        res.status(405).send('Method not allowed');
    }
};
