// Utility functions for handling image storage with compression

/**
 * Compresses an image to reduce its size
 * @param {string} dataUrl - The image as a data URL
 * @param {number} maxWidth - Maximum width (default: 1920)
 * @param {number} maxHeight - Maximum height (default: 1080)
 * @param {number} quality - JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<string>} Compressed image as data URL
 */
export async function compressImage(dataUrl, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to JPEG to reduce size
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Stores an image in localStorage with compression, falling back to sessionStorage if too large
 * @param {string} key - Storage key
 * @param {string} dataUrl - Image as data URL
 * @returns {Promise<boolean>} Success status
 */
export async function storeImage(key, dataUrl) {
  try {
    // Compress the image first
    const compressed = await compressImage(dataUrl);
    
    // Try localStorage first
    try {
      localStorage.setItem(key, compressed);
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        // If still too large, try sessionStorage (temporary, but won't persist)
        try {
          sessionStorage.setItem(key, compressed);
          console.warn(`Image too large for localStorage, stored in sessionStorage instead`);
          return true;
        } catch (e2) {
          console.error('Image too large to store even in sessionStorage');
          return false;
        }
      }
      throw e;
    }
  } catch (error) {
    console.error('Error compressing/storing image:', error);
    return false;
  }
}

/**
 * Retrieves an image from storage
 * @param {string} key - Storage key
 * @returns {string|null} Image data URL or null
 */
export function getStoredImage(key) {
  // Try localStorage first
  const fromLocal = localStorage.getItem(key);
  if (fromLocal) return fromLocal;
  
  // Fall back to sessionStorage
  const fromSession = sessionStorage.getItem(key);
  if (fromSession) return fromSession;
  
  return null;
}

/**
 * Removes an image from storage
 * @param {string} key - Storage key
 */
export function removeStoredImage(key) {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

