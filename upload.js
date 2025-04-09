import { createBlob } from '@vercel/blob';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Disable Vercel's default body parser to handle files manually
  },
};

// Initialize Vercel Blob client using environment variables for token and endpoint
const blobClient = createBlob({
  token: process.env.VERCEL_BLOB_TOKEN,  // Set your Vercel Blob token as an environment variable
  endpoint: process.env.VERCEL_BLOB_ENDPOINT,  // Set your Vercel Blob endpoint as an environment variable
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  form.keepExtensions = true; // Retain the file extensions (e.g., .png, .jpg)

  // Parse the form and handle the uploaded file
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const file = files.file[0];  // Get the uploaded file
    const filePath = file.filepath;

    try {
      // Upload the file to Vercel Blob Storage
      const blob = await blobClient.upload(filePath, file.originalFilename);

      // Get the raw URL for the uploaded file
      const fileUrl = blob.url;

      // Respond with the file URL
      return res.status(200).json({ url: fileUrl });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to upload the file.' });
    }
  });
}
