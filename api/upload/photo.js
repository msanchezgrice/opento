// API endpoint to upload photos to Cloudinary
// POST /api/upload/photo

import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Allow up to 10MB images
    }
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, imageData } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Validate Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary config missing');
      return res.status(500).json({ error: 'Upload service not configured' });
    }

    console.log('Uploading photo for user:', userId);

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageData, {
      folder: 'opento/avatars',
      public_id: `user_${userId}`,
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    console.log('✓ Photo uploaded to Cloudinary:', uploadResult.secure_url);

    // Update user's avatar_url in database
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: uploadResult.secure_url })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user avatar:', updateError);
      // Photo is uploaded but DB update failed - still return success with URL
    }

    return res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      message: 'Photo uploaded successfully'
    });

  } catch (error) {
    console.error('Photo upload error:', error);
    return res.status(500).json({
      error: 'Failed to upload photo',
      message: error.message
    });
  }
}
