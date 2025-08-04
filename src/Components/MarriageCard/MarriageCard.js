
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const MarriageCard = ({ match }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const imagesAvailable = match.images?.length > 0;
  const isSingleImage = match.images?.length === 1;
  const totalImages = match.images?.length || 0;

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.card}>
      {/* Image Section */}
      {imagesAvailable ? (
        isSingleImage ? (
          <Image source={{ uri: match.images[0] }} style={styles.fullImage} />
        ) : (
          <View style={styles.carouselContainer}>
            <FlatList
              data={match.images}
              horizontal
              keyExtractor={(image, index) => `${image}-${index}`}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.carouselImage} />
              )}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              pagingEnabled
              snapToInterval={width}
              decelerationRate="fast"
            />
            <View style={styles.imageCount}>
              <Text style={styles.imageCountText}>
                {currentIndex + 1}/{totalImages}
              </Text>
            </View>
          </View>
        )
      ) : (
        <Image
          source={{
            uri: "https://dummyimage.com/600x400/cccccc/000000&text=No+Image",
          }}
          style={styles.fullImage}
        />
      )}

      {/* Details */}
      <View style={styles.cardDetails}>
        <DetailRow icon="person-outline" label="Name" value={`${match.firstname} ${match.lastName}`} />
        <DetailRow icon="calendar-outline" label="Age" value={match.age} />
        <DetailRow icon="male-female" label="Gender" value={match.gender} />
        <DetailRow icon="checkmark-circle-outline" label="Status" value={match.maritalStatus} />
      </View>

      {/* Buttons */}
      <View style={styles.actionsRow}>
        {/* <TouchableOpacity
          style={styles.viewProfileButton}
          onPress={() => navigation.navigate("userprofile", { match })}
        >
          <Ionicons name="eye" size={18} color="#000" />
          <Text style={styles.buttonText}>View Profile</Text>
        </TouchableOpacity> */}

        {/* // implementing clcik feature of view profile  */}
      

       <TouchableOpacity
  style={styles.viewProfileButton}
  onPress={() => {
    console.log("Navigating with userId:", match.id); // ✅ Debug log
    navigation.navigate("userprofile", { userId: match.id });
  }}
>
  <Ionicons name="eye" size={18} color="#000" />
  <Text style={styles.buttonText}>View Profile</Text>
</TouchableOpacity>



        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="person-add" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailsRow}>
    <Ionicons name={icon} size={20} color="#555" />
    <Text style={styles.detailsLabel}>{label}:</Text>
    <Text style={styles.detailsValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginVertical: 16,
    marginHorizontal: 12,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  fullImage: {
    width: "100%",
    height: width * 0.6,
    resizeMode: "cover",
  },
  carouselContainer: {
    position: "relative",
  },
  carouselImage: {
    width,
    height: width * 0.6,
    resizeMode: "cover",
  },
  imageCount: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#000000aa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCountText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cardDetails: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "#fff",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailsLabel: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  detailsValue: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  viewProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    borderColor: "#000",
    borderWidth: 1.3,
  },
  addButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    borderWidth: 1.3,
    borderColor: "#000",
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});

export default MarriageCard;
