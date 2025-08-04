

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Icon from 'react-native-vector-icons/Feather';
import RNPickerSelect from 'react-native-picker-select';

const Explore = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://192.168.1.116:8080/api/fed-categories/feedcategories');
      const json = await res.json();
      const formatted = json.categories.map((cat) => ({
        label: cat,
        value: cat,
      }));
      setCategories(formatted);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const compressedImages = await Promise.all(
        result.assets.map(async (image) => {
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            image.uri,
            [{ resize: { width: 800 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          return manipulatedImage;
        })
      );
      setSelectedImages(compressedImages);
    }
  };

  const handlePost = async () => {
    const formData = new FormData();
    selectedImages.forEach((image, index) => {
      formData.append('images', {
        uri: image.uri,
        name: `image_${index}.jpg`,
        type: 'image/jpeg',
      });
    });
    formData.append('caption', caption);
    formData.append('category', category);
    formData.append('tags', tags);

    try {
      const response = await fetch('http://192.168.1.116:8080/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      alert(data.success ? 'Post created successfully!' : 'Failed to create post');
    } catch (error) {
      console.error('Error posting:', error);
      alert('An error occurred while posting');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Create a New Post</Text>

        {/* Image Picker */}
        <View style={styles.imagePicker}>
          {selectedImages.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedImages.map((image, index) => (
                <Image key={index} source={{ uri: image.uri }} style={styles.selectedImage} />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.addImageText}>No images selected</Text>
          )}
          <TouchableOpacity style={styles.pickImageButton} onPress={handleImagePick}>
            <Icon name="image" size={20} color="#fff" />
            <Text style={styles.pickImageText}>Pick Images</Text>
          </TouchableOpacity>
        </View>

        {/* Caption Input */}
        <TextInput
          style={styles.input}
          placeholder="Write a caption..."
          placeholderTextColor="#888"
          value={caption}
          onChangeText={setCaption}
        />

        {/* Tags Input */}
        <TextInput
          style={styles.input}
          placeholder="Add tags (comma separated)"
          placeholderTextColor="#888"
          value={tags}
          onChangeText={setTags}
        />

        {/* Category Dropdown */}
        <Text style={styles.dropdownLabel}>Category</Text>
        {loadingCategories ? (
          <ActivityIndicator color="#000" />
        ) : (
          <RNPickerSelect
            onValueChange={(value) => setCategory(value)}
            items={categories}
            placeholder={{ label: 'Select Category', value: null }}
            style={{
              inputIOS: styles.dropdown,
              inputAndroid: styles.dropdown,
              placeholder: { color: '#aaa' },
            }}
            value={category}
          />
        )}

        {/* Post Button */}
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePicker: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    alignItems: 'center',
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  pickImageButton: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  pickImageText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  addImageText: {
    color: '#666',
  },
  input: {
    backgroundColor: '#f9f9f9',
    color: '#000',
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownLabel: {
    color: '#333',
    marginBottom: 6,
    fontSize: 14,
    marginTop: 6,
  },
  dropdown: {
    backgroundColor: '#f9f9f9',
    color: '#000',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 24,
  },
  postButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Explore;

{
/*
my ui structure is like as soon my user logges in users token , userId is stored into async storage and then after there is user redirected to home page in home page it has an topbar compoent inside it it has an rectange component , these rectangle component is basically an set of categroeis there are differnt categories all comming form backend like , Home , Marriage , Death , Annivarsary  etc so by default as soon the user loogs in thee category is selected to Home and based on these selected category the Postcards are displayed , liek my post cards data also comes form backend , i have api whci is like localhost:8080/api/users/getUploaded-post/Home it takes token auth token which is stored in async ok so based on that category slected the post cards data is shows . here is data which it return see [
    {
        "id": 5,
        "imageUrl": "https://shorturl.at/2qX4b",
        "content": "Sample post content",
        "tags": [
            "tag1",
            "tag2"
        ],
        "postUploaderId": 1,
        "uploadedBy": "Chetan Mallah",
        "categoryName": "Death",
        "uploadedAt": "2025-07-15T14:30:00",
        "totalLikes": 1,
        "comments": [
            {
                "commenterId": 2,
                "commentId": 4,
                "commenterName": "lucky 123",
                "text": "Good Pic 👌",
                "commentedAt": "2025-07-18T18:15:32.930476"
            },
            {
                "commenterId": 1,
                "commentId": 13,
                "commenterName": "Chetan Mallah",
                "text": "Test",
                "commentedAt": "2025-07-19T13:51:34.051288"
            }
        ],
        "totalComments": 2,
        "liked": false
    }
] kinda these thing so based on these my post card is hsown like username iamge like count coment count , and now on clcikign the comment it goes to new page and their it shows the all commetns it has and then user cna add the commetn and delet the comment okie. so now i thinkk off adding the comment posting and delting stuff with an websocket so in realt time it gets updated and the other users will know what id done or not kinda okie ? so is all my api response req is okie ? though ? just tell me or anything hsould i expect form my backend api and also any api i shoudl use kidna n all oke i have an delet api  localhost:8080/api/users/comment/6 which works only if the post owner calls it or if the comment owner calls it okie .
*/ }