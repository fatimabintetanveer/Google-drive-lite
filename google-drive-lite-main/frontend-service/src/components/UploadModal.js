import React from 'react';
import styles from '@/styles/DashboardPage.module.css';

const UploadModal = ({ image, uploadImage, closeModal }) => {
  const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append('image', image);
  
        uploadImage(formData);
      // Close the modal after uploading
      closeModal();
    } catch (error) {
      console.error('Error uploading image:', error);
      // Optionally, you can display an error message to the user
      console.error(error.stack);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Upload Image</h2>
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className={styles.previewImage}
          />
        )}
        <p>Are you sure you want to upload this image?</p>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default UploadModal;
