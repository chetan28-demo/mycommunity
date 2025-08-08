import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, Card, Button } from "../UI";
import { COLORS, SPACING, SHADOWS } from "../../theme";

const { width } = Dimensions.get("window");

const DetailRow = React.memo(({ icon, label, value, color = COLORS.neutral[600] }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIcon}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <Text variant="caption" color="secondary" style={styles.detailLabel}>
      {label}
    </Text>
    <Text variant="body2" color="primary" style={styles.detailValue}>
      {value}
    </Text>
  </View>
));

const ImageCarousel = React.memo(({ images, onIndexChange }) => {
  const renderImage = useCallback(({ item }) => (
    <Image source={{ uri: item }} style={styles.carouselImage} />
  ), []);

  const keyExtractor = useCallback((item, index) => `${item}-${index}`, []);

  const onScroll = useCallback((event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    onIndexChange(newIndex);
  }, [onIndexChange]);

  return (
    <FlatList
      data={images}
      horizontal
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      renderItem={renderImage}
      onScroll={onScroll}
      scrollEventThrottle={16}
      pagingEnabled
      snapToInterval={width}
      decelerationRate="fast"
      removeClippedSubviews={true}
      maxToRenderPerBatch={3}
      windowSize={5}
    />
  );
});

const MarriageCard = ({ match }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const imagesAvailable = useMemo(() => match.images?.length > 0, [match.images]);
  const isSingleImage = useMemo(() => match.images?.length === 1, [match.images]);
  const totalImages = useMemo(() => match.images?.length || 0, [match.images]);

  const handleViewProfile = useCallback(() => {
    console.log("Navigating with userId:", match.id);
    navigation.navigate("userprofile", { userId: match.id });
  }, [match.id, navigation]);

  const handleIndexChange = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  return (
    <Card style={styles.card} shadow="medium">
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {imagesAvailable ? (
          isSingleImage ? (
            <Image source={{ uri: match.images[0] }} style={styles.singleImage} />
          ) : (
            <View style={styles.carouselContainer}>
              <ImageCarousel 
                images={match.images} 
                onIndexChange={handleIndexChange}
              />
              <View style={styles.imageCounter}>
                <Text variant="caption" style={[styles.imageCounterText, { color: COLORS.white }]}>
                  {currentIndex + 1} / {totalImages}
                </Text>
              </View>
            </View>
          )
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="person" size={48} color={COLORS.neutral[400]} />
            <Text variant="caption" color="secondary">
              No photo available
            </Text>
          </View>
        )}
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <View style={styles.nameContainer}>
          <Text variant="h5" color="primary" style={styles.name}>
            {match.firstname} {match.lastName}
          </Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.success[500]} />
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <DetailRow 
            icon="calendar-outline" 
            label="Age" 
            value={`${match.age} years`}
            color={COLORS.primary[600]}
          />
          <DetailRow 
            icon="person-outline" 
            label="Gender" 
            value={match.gender}
            color={COLORS.secondary[600]}
          />
          <DetailRow 
            icon="heart-outline" 
            label="Status" 
            value={match.maritalStatus}
            color={COLORS.accent[600]}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Button
            variant="outline"
            onPress={handleViewProfile}
            style={styles.viewButton}
          >
            <Ionicons name="eye-outline" size={18} color={COLORS.primary[600]} />
            View Profile
          </Button>

          <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.8}>
            <Ionicons name="heart-outline" size={20} color={COLORS.error[500]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.messageButton} activeOpacity={0.8}>
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary[600]} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.md,
    overflow: 'hidden',
    padding: 0,
  },
  imageContainer: {
    position: 'relative',
    height: width * 0.6,
    backgroundColor: COLORS.neutral[100],
  },
  singleImage: {
    width: '100%',
    height: '100%',
  },
  carouselContainer: {
    position: 'relative',
    height: '100%',
  },
  carouselImage: {
    width,
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[100],
  },
  imageCounter: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  imageCounterText: {
    fontWeight: '600',
  },
  profileInfo: {
    padding: SPACING.lg,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  name: {
    flex: 1,
  },
  verifiedBadge: {
    marginLeft: SPACING.sm,
  },
  detailsContainer: {
    marginBottom: SPACING.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  detailIcon: {
    width: 24,
    alignItems: 'center',
  },
  detailLabel: {
    marginLeft: SPACING.sm,
    minWidth: 60,
  },
  detailValue: {
    marginLeft: SPACING.sm,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    backgroundColor: COLORS.error[50],
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.error[200],
  },
  messageButton: {
    backgroundColor: COLORS.primary[50],
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
});

export default MarriageCard;