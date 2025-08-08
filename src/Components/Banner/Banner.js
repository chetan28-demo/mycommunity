import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  View, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Dimensions, 
  Animated 
} from 'react-native';
import { Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../UI';
import { COLORS, SPACING, SHADOWS } from '../../theme';

const { width: screenWidth } = Dimensions.get('window');

const BannerItem = React.memo(({ item, index, totalItems, onPress }) => (
  <TouchableOpacity 
    style={styles.bannerContainer} 
    onPress={() => onPress(item.websiteUrl)}
    activeOpacity={0.95}
  >
    <Image 
      source={{ uri: item.imageUrl }} 
      style={styles.bannerImage} 
      resizeMode="cover" 
    />
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.7)']}
      style={styles.gradient}
    >
      <View style={styles.textOverlay}>
        <Text variant="h6" style={[styles.headline, { color: COLORS.white }]}>
          {item.headline}
        </Text>
      </View>
      <View style={styles.carouselCounter}>
        <Text variant="caption" style={[styles.counterText, { color: COLORS.white }]}>
          {index + 1} / {totalItems}
        </Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
));

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const fetchBanners = useCallback(async () => {
    try {
      const response = await fetch('http://192.168.1.116:3000/banner');
      const data = await response.json();
      if (Array.isArray(data)) {
        setBanners(data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Auto-scroll effect
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (currentIndex + 1) % banners.length;
        setCurrentIndex(nextIndex);
        flatListRef.current.scrollToIndex({ 
          index: nextIndex, 
          animated: true 
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, currentIndex]);

  const handleBannerPress = useCallback((url) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
    }
  }, []);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: false,
      listener: (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        setCurrentIndex(index);
      }
    }
  );

  const renderBanner = useCallback(({ item, index }) => (
    <BannerItem
      item={item}
      index={index}
      totalItems={banners.length}
      onPress={handleBannerPress}
    />
  ), [banners.length, handleBannerPress]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const onScrollToIndexFailed = useCallback((info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  }, []);

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderBanner}
        onScrollToIndexFailed={onScrollToIndexFailed}
        onScroll={onScroll}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
      
      {/* Pagination Dots */}
      {banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  opacity: scrollX.interpolate({
                    inputRange: [
                      (index - 1) * screenWidth,
                      index * screenWidth,
                      (index + 1) * screenWidth,
                    ],
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                  }),
                  transform: [{
                    scale: scrollX.interpolate({
                      inputRange: [
                        (index - 1) * screenWidth,
                        index * screenWidth,
                        (index + 1) * screenWidth,
                      ],
                      outputRange: [0.8, 1.2, 0.8],
                      extrapolate: 'clamp',
                    }),
                  }],
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.lg,
  },
  bannerContainer: {
    width: screenWidth - (SPACING.md * 2),
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: SPACING.md,
    ...SHADOWS.md,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  textOverlay: {
    padding: SPACING.md,
  },
  headline: {
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  carouselCounter: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  counterText: {
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary[600],
    marginHorizontal: 4,
  },
});

export default Banner;