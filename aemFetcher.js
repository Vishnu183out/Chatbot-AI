import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Default AEM content export URL – you can move this to .env if needed
const AEM_EXPORT_URL = process.env.AEM_EXPORT_URL || 'http://localhost:4502/bin/export/sitecontent';

export async function fetchContent() {
  try {
    const response = await axios.get(AEM_EXPORT_URL, {
      auth: {
        username: process.env.AEM_USERNAME || 'admin',
        password: process.env.AEM_PASSWORD || 'admin'
      }
    });

    return response.data;
  } catch (err) {
    console.error('Error fetching content from AEM:', err.message);
    return [];
  }
}
