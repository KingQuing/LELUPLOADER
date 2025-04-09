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
  const uploadDir = path.join(process.cwd(), 'public/uploads');

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file[0];
    const fileName = path.basename(file.filepath);
    const domain = 'https://leluploader.com'; // <-- Change this to your domain
    const fileUrl = `${domain}/uploads/${fileName}`;

    return res.status(200).json({ url: fileUrl });
  });
}
