import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Modal, TouchableOpacity, Dimensions } from "react-native";
import { fetchBase64Image } from "../services/apiCalls";
// import { MaterialIcons } from "@expo/vector-icons";

const DocumentImages = ({ imageIds }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      const loaded = await Promise.all(
        imageIds.map(async (id) => {
          const base64 = await fetchBase64Image(id);
          if (!base64) return null;

          const isJpg = base64.startsWith("/9j/");
          const isPng = base64.startsWith("iVBOR");

          const mime = isJpg
            ? "image/jpeg"
            : isPng
            ? "image/png"
            : "image/*";

          return `data:${mime};base64,${base64}`;
        })
      );
      setImages(loaded.filter(Boolean)); // remove nulls
    };

    loadImages();
  }, [imageIds]);

  const openImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <>
      {images.map((uri, idx) => (
        <TouchableOpacity key={idx} onPress={() => openImage(uri)}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
          </View>
        </TouchableOpacity>
      ))}

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeImage}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeImage}>
            {/* <MaterialIcons name="close" size={30} color="white" /> */}
          </TouchableOpacity>
          <Image 
            source={{ uri: selectedImage }} 
            style={styles.fullImage} 
            resizeMode="contain"
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    margin: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});

export default DocumentImages;