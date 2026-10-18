import { useState, useEffect } from 'react';

/**
 * Custom hook to track active image uploads in Admin CMS forms.
 * Returns true if one or more images are actively being uploaded to Cloudinary.
 */
export function useImageUploading() {
  const [activeUploads, setActiveUploads] = useState(0);

  useEffect(() => {
    const handleUploadState = (e) => {
      const isUploading = Boolean(e.detail?.isUploading);
      setActiveUploads((prev) => (isUploading ? prev + 1 : Math.max(0, prev - 1)));
    };

    window.addEventListener('admin_media_upload_state', handleUploadState);
    return () => {
      window.removeEventListener('admin_media_upload_state', handleUploadState);
    };
  }, []);

  return activeUploads > 0;
}

export default useImageUploading;
