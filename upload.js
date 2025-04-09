import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  const uploadDir = path.join(process.cwd()); // Save directly to the root directory

  // Ensure the upload directory exists (even though we're saving directly in the root)
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file[0];
    const fileName = path.basename(file.filepath); // Get the filename
    const domain = 'https://leluploader.vercel.app'; // Use your Vercel domain

    // The file URL will be directly in the root directory
    const fileUrl = `${domain}/${fileName}`;

    return res.status(200).json({ url: fileUrl });
  });
}
