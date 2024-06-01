// src/cropImage.js
export default function getCroppedImg(imageSrc, crop) {
    const canvas = document.createElement('canvas');
    const scaleX = imageSrc.width / crop.width;
    const scaleY = imageSrc.height / crop.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
  
    ctx.drawImage(
      imageSrc,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = 'cropped.jpg';
        const croppedImageUrl = window.URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, 'image/jpeg');
    });
  }
  