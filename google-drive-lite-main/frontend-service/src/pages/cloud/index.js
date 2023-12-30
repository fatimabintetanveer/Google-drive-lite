import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '@/contexts/AuthContext';
import { Router, useRouter } from 'next/router';
import styles from '@/styles/DashboardPage.module.css';
import UploadModal from '@/components/UploadModal';
import { FaCamera } from 'react-icons/fa';


const index = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [userId, setUserId] = useState();
  const [userImages, setUserImages] = useState([]);
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [checkedImages, setCheckedImages] = useState([]);
  const [hasCheckedImages, setHasCheckedImages] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/cloud/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) setUserId(user.username);
  }, [user])

  const uploadImage = async (formData) => {
    try {
      // Append userId to formData
      formData.append('userId', userId);

      const response = await fetch('http://localhost:5000/api/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Image uploaded successfully.....');
        // After uploading, fetch the updated list of images
        fetchUserImages();
        setImage(null);
      } else {
        console.error('Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Re-throw the error so that the UploadModal can handle it
    }
  };

  const handleDelete = (imageIds) => {
    // if (window.confirm("Are you sure you want to delete the selected images?")) {
      deleteImages(imageIds);
    // }
  };

  const deleteImages = async (imageIdArr) => {
    try {
      for (const imageId of imageIdArr) {
        const response = await fetch('http://localhost:5000/api/deleteImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userId, imageIds: [imageId] }), // Wrap each image ID in an array
        });
  
        if (response.ok) {
          console.log(`Image ${imageId} deleted successfully.....`);
        } else {
          console.error(`Failed to delete image ${imageId}.`);
        }
      }
  
      // After deleting all images, update state and fetch user images
      setCheckedImages([]);
      fetchUserImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  

  const fetchUserImages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/viewGallery/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserImages(data.images);
      } else {
        console.error('Failed to fetch user images.');
      }
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };

  const handleCheck = (imageId) => {
    setCheckedImages((prevCheckedImages) => {
      const newCheckedImages = prevCheckedImages.includes(imageId)
        ? prevCheckedImages.filter((id) => id !== imageId)
        : [...prevCheckedImages, imageId];
  
      setHasCheckedImages(newCheckedImages.length > 0);
  
      return newCheckedImages;
    });
  };

  // Fetch user images when the component mounts
  useEffect(() => {
    if (userId) {
      fetchUserImages();
    }
  }, [userId]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setShowModal(true);
  };

  const closeModal = () => {
    // Reset the image and hide the modal
    setImage(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        // Call the uploadImage function with the formData
        await uploadImage(formData);

        // Reset the image and hide the modal
        setImage(null);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // Optionally, you can display an error message to the user
    }
  };

  useEffect(() => {
    var box = document.getElementById("box");
    var file = document.getElementById("file");

    const handleClick = () => file.click();

    box.addEventListener('click', handleClick);

    return () => {
      box.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className={styles.background}>
      <div className={styles.container}>
      <button onClick={() => handleDelete(checkedImages)} disabled={!hasCheckedImages}>Delete Selected</button>
        <div>
          <form className={styles.gallery} onSubmit={handleSubmit}>
            {userImages.map((image) => (
              <div key={image._id} className={styles.card}>
                <img src={`data:image/jpeg;base64,${image.data}`} alt={`User Image ${image._id}`} />
                <input
                  type="checkbox"
                  className={styles.checkButton}
                  onChange={() => handleCheck(image._id)}
                />
              </div>
            ))}
            <div className={styles.addCard} id="box">
              <FaCamera className={styles.icon} />
              <input
                id="file"
                type="file"
                className={styles.file}
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <UploadModal
          image={image}
          uploadImage={uploadImage}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default index;