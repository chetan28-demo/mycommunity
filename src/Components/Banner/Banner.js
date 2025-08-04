import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions, Animated } from 'react-native';
import { Linking } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const currentIndexRef = useRef(0);

  // Fetch banners from API
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

  // Auto-scroll effect with proper cleanup
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      if (flatListRef.current) {
        currentIndexRef.current = (currentIndexRef.current + 1) % banners.length;
        flatListRef.current.scrollToIndex({ 
          index: currentIndexRef.current, 
          animated: true 
        });
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Handle Banner Press
  const handleBannerPress = useCallback((url) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
    }
  }, []);

  const renderBanner = useCallback(({ item, index }) => (
    <TouchableOpacity 
      style={styles.bannerContainer} 
      onPress={() => handleBannerPress(item.websiteUrl)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.bannerImage} 
        resizeMode="cover" 
      />
      <View style={styles.textOverlay}>
        <Text style={styles.headline}>{item.headline}</Text>
      </View>
      <View style={styles.carouselCounter}>
        <Text style={styles.counterText}>{index + 1}/{banners.length}</Text>
      </View>
    </TouchableOpacity>
  ), [banners.length, handleBannerPress]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const onScrollToIndexFailed = useCallback((info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  }, []);

  return (
    <View style={styles.container}>
      {banners.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={banners}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderBanner}
          onScrollToIndexFailed={onScrollToIndexFailed}
          removeClippedSubviews={true}
          maxToRenderPerBatch={3}
          windowSize={5}
        />
      ) : (
        <Text style={styles.noDataText}>No banners available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignItems: 'center',
  },
  bannerContainer: {
    width: screenWidth - 40,
    height: 240,
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: '92%',
    height: '92%',
    borderRadius: 10,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    borderRadius: 5,
  },
  headline: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carouselCounter: {
    position: 'absolute',
    top: 10,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
  },
  counterText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
});

export default Banner;