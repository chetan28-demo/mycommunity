import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { Text, Card, Input, Button } from '../../Components/UI';
import { COLORS, SPACING, SHADOWS, SAFE_AREA } from '../../theme';

const ImagePreview = React.memo(({ images, onRemove }) => (
  <ScrollView 
    horizontal 
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.imagePreviewContainer}
  >
    {images.map((image, index) => (
      <View key={index} style={styles.imagePreviewItem}>
        <Image source={{ uri: image.uri }} style={styles.previewImage} />
        <TouchableOpacity
          style={styles.removeImageButton}
          onPress={() => onRemove(index)}
        >
          <Ionicons name="close" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    ))}
  </ScrollView>
));

const Explore = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchCategories = useCallback(async () => {
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
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleImagePick = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const compressedImages = await Promise.all(
        result.assets.map(async (image) => {
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            image.uri,
            [{ resize: { width: 1080 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );
          return manipulatedImage;
        })
      );
      setSelectedImages(prev => [...prev, ...compressedImages].slice(0, 5));
    }
  }, []);

  const removeImage = useCallback((index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handlePost = useCallback(async () => {
    if (!caption.trim() || !category || selectedImages.length === 0) {
      Alert.alert('Error', 'Please fill all required fields and select at least one image');
      return;
    }

    setPosting(true);

    try {
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

      const response = await fetch('http://192.168.1.116:8080/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert('Success', 'Post created successfully!');
        // Reset form
        setSelectedImages([]);
        setCaption('');
        setCategory('');
        setTags('');
      } else {
        Alert.alert('Error', 'Failed to create post');
      }
    } catch (error) {
      console.error('Error posting:', error);
      Alert.alert('Error', 'An error occurred while posting');
    } finally {
      setPosting(false);
    }
  }, [selectedImages, caption, category, tags]);

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="add-circle" size={32} color={COLORS.primary[600]} />
          <Text variant="h2" color="primary" style={styles.title}>
            Create Post
          </Text>
          <Text variant="body1" color="secondary" style={styles.subtitle}>
            Share your moments with the community
          </Text>
        </View>

        {/* Image Selection Card */}
        <Card style={styles.imageCard}>
          <View style={styles.imageCardHeader}>
            <MaterialIcons name="photo-library" size={24} color={COLORS.primary[600]} />
            <Text variant="h6" color="primary" style={styles.cardTitle}>
              Photos ({selectedImages.length}/5)
            </Text>
          </View>

          {selectedImages.length > 0 ? (
            <ImagePreview images={selectedImages} onRemove={removeImage} />
          ) : (
            <View style={styles.emptyImageContainer}>
              <Ionicons name="image-outline" size={48} color={COLORS.neutral[400]} />
              <Text variant="body2" color="secondary" style={styles.emptyImageText}>
                No images selected
              </Text>
            </View>
          )}

          <Button
            variant="outline"
            onPress={handleImagePick}
            style={styles.pickImageButton}
          >
            <Ionicons name="camera" size={20} color={COLORS.primary[600]} />
            Select Images
          </Button>
        </Card>

        {/* Content Card */}
        <Card style={styles.contentCard}>
          <Input
            label="Caption"
            placeholder="What's on your mind?"
            value={caption}
            onChangeText={setCaption}
            multiline
            style={styles.captionInput}
            leftIcon="create-outline"
          />

          <Input
            label="Tags"
            placeholder="Add tags (comma separated)"
            value={tags}
            onChangeText={setTags}
            leftIcon="pricetag-outline"
          />

          <View style={styles.categoryContainer}>
            <Text variant="label" color="primary" style={styles.categoryLabel}>
              Category *
            </Text>
            {loadingCategories ? (
              <ActivityIndicator color={COLORS.primary[600]} />
            ) : (
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={setCategory}
                  items={categories}
                  placeholder={{ label: 'Select Category', value: null }}
                  style={{
                    inputIOS: styles.picker,
                    inputAndroid: styles.picker,
                    placeholder: { color: COLORS.neutral[400] },
                  }}
                  value={category}
                  Icon={() => (
                    <Ionicons name="chevron-down" size={20} color={COLORS.neutral[500]} />
                  )}
                />
              </View>
            )}
          </View>
        </Card>

        {/* Post Button */}
        <Button
          onPress={handlePost}
          loading={posting}
          disabled={!caption.trim() || !category || selectedImages.length === 0}
          size="large"
          style={styles.postButton}
        >
          <MaterialIcons name="publish" size={20} color={COLORS.white} />
          Publish Post
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    paddingTop: SAFE_AREA.top,
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  title: {
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
  imageCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  imageCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    marginLeft: SPACING.sm,
  },
  emptyImageContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  emptyImageText: {
    marginTop: SPACING.sm,
  },
  imagePreviewContainer: {
    paddingVertical: SPACING.md,
  },
  imagePreviewItem: {
    position: 'relative',
    marginRight: SPACING.sm,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.error[500],
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  captionInput: {
    minHeight: 100,
  },
  categoryContainer: {
    marginBottom: SPACING.md,
  },
  categoryLabel: {
    marginBottom: SPACING.sm,
  },
  pickerContainer: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  picker: {
    fontSize: 16,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Explore;