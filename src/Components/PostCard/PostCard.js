
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from "react-native";
import RNModal from "react-native-modal";

const screenWidth = Dimensions.get("window").width;
const MAX_CONTENT_LINES = 3;

const PostCard = ({ activeCategory }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [expandedPosts, setExpandedPosts] = useState({});

  const [visibleReplies, setVisibleReplies] = useState({});
  const toggleReplies = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      console.log("👤 Current logged-in user ID:", id);
      setCurrentUserId(Number(id));
    };
    fetchCurrentUserId();
  }, []);

  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null); // ✅ Add this

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  //replyy comment
  const [replyingTo, setReplyingTo] = useState(null); // comment ID
  const [replyToUser, setReplyToUser] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const userId = await AsyncStorage.getItem("userId");

        const response = await fetch(
          `http://192.168.1.116:8080/api/users/getUploaded-post/${activeCategory}?currentUserId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        // Set isLiked from backend response
        const updated = data.map((post) => ({
          ...post,
          isLiked: post.liked || false,
        }));

        setPosts(updated);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (commentModalVisible) {
          setCommentModalVisible(false);
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [commentModalVisible]);

  const flattenReplies = (replies) => {
    const flat = [];

    const recurse = (arr) => {
      for (const reply of arr) {
        flat.push(reply);
        if (reply.replies && reply.replies.length > 0) {
          recurse(reply.replies);
        }
      }
    };

    recurse(replies);
    return flat;
  };

  const isPostOwner = () => {
    if (!selectedPost || !currentUserId) return false;

    console.log("🔍 Post owner check");
    console.log("📮 uploaderId:", selectedPost.uploaderId);
    console.log("👤 currentUserId:", currentUserId);

    return selectedPost.uploaderId === currentUserId;
  };

  const renderReplies = (replies) => {
    return replies.map((reply, index) => (
      <View
        key={reply.replyId || index}
        style={{ marginTop: 10, marginLeft: 20 }}
      >
        <View style={styles.commentHeader}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            style={styles.commentUserImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.commentUser}>{reply.replierName}</Text>

            <Text style={styles.commentText}>
              <Text style={{ fontWeight: "bold", color: "#333" }}>
                @{reply.repliedToName}
              </Text>{" "}
              {reply.text}
            </Text>

            <Text style={styles.commentTime}>
              {new Date(reply.repliedAt).toLocaleString()}
            </Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <TouchableOpacity
                onPress={() => {
                  setReplyingTo(reply.replyId);
                  setReplyToUser(reply.replierName);
                }}
              >
                <Text style={styles.replyBtn}>Reply</Text>
              </TouchableOpacity>

              {(reply.replierId === currentUserId ||
                isPostOwner(selectedPostId)) && (
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Delete Reply",
                      "Are you sure you want to delete this reply?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () =>
                            handleDeleteCommentOrReply(reply.replyId),
                        },
                      ]
                    )
                  }
                >
                  <Text style={{ color: "red", marginTop: 5 }}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    ));
  };

  // delt commetn
  const handleDeleteCommentOrReply = async (id) => {
    const token = await AsyncStorage.getItem("token");

    try {
      const res = await fetch(
        `http://192.168.1.116:8080/api/users/comment/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Deleted:", data);
        fetchComments(selectedPostId); // Refresh
      } else {
        console.warn("❌ Delete failed:", data);
      }
    } catch (err) {
      console.error("🔥 Error deleting:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      console.log("🚫 Empty comment, skipping post.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    const endpoint = replyingTo
      ? `http://192.168.1.116:8080/api/users/reply/${replyingTo}`
      : `http://192.168.1.116:8080/api/users/comment/${selectedPostId}`;

    const bodyData = replyingTo
      ? {
          userId: Number(userId),
          text: newComment.trim(),
          repliedToUser: replyToUser, // ✅ Add this field
        }
      : { text: newComment.trim(), parentCommentId: null };

    console.log("📤 Posting to:", endpoint);
    console.log("📦 Payload:", bodyData);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Posted successfully:", data);
        setNewComment("");
        setReplyingTo(null);
        setReplyToUser(null);
        fetchComments(selectedPostId);
      } else {
        console.warn("❌ Post failed:", data);
      }
    } catch (err) {
      console.error("🔥 Network error while posting comment:", err);
    }
  };

  // render reply
  const fetchComments = async (postId) => {
    try {
      setLoadingComments(true);
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `http://192.168.1.116:8080/api/users/comments/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("📥 Comments fetched for post:", postId);
      console.log("🧾 Response shape:", JSON.stringify(data, null, 2));

      setComments(data.comments || []);
      setSelectedPost(data); // ✅ Now you’re storing the full post info including uploaderId
    } catch (error) {
      console.error("❌ Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const openCommentsModal = (postId) => {
    setSelectedPostId(postId);
    setCommentModalVisible(true);
    fetchComments(postId);
  };

  const handleLike = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      const response = await fetch(
        `http://192.168.1.116:8080/api/users/like/${postId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: parseInt(userId) }),
        }
      );

      if (!response.ok) throw new Error("Failed to toggle like");

      const data = await response.json(); // { postId, totalLikes, liked }

      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: data.liked,
              totalLikes: data.totalLikes,
            }
          : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedPosts[item.id];

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{item.uploadedBy || "Unknown"}</Text>
        </View>

        {/* Post Image */}
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.media}
          resizeMode="cover"
        />

        {/* Like & Comment Actions */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleLike(item.id)}>
            <AntDesign
              name={item.isLiked ? "heart" : "hearto"}
              size={24}
              color={item.isLiked ? "red" : "black"}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.countText}>{item.totalLikes} Likes</Text>

          <TouchableOpacity
            onPress={() => openCommentsModal(item.id)}
            style={styles.commentButton}
          >
            <Icon name="message-circle" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.countText}>{item.totalComments} Comments</Text>
        </View>

        {/* Caption */}
        <View style={styles.captionContainer}>
          <Text
            numberOfLines={isExpanded ? undefined : MAX_CONTENT_LINES}
            style={styles.caption}
          >
            {item.content}
          </Text>
          {item.content.length > 100 && (
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={styles.viewMoreText}>
                {isExpanded ? "View Less" : "View More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tags */}
        {item.tags?.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                #{tag}
              </Text>
            ))}
          </View>
        )}

        {/* Time */}
        <Text style={styles.timestamp}>
          Posted on {new Date(item.uploadedAt).toLocaleDateString()}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => setError(null)}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <RNModal
        isVisible={commentModalVisible}
        onBackdropPress={() => setCommentModalVisible(false)}
        onSwipeComplete={() => setCommentModalVisible(false)}
        swipeDirection="down"
        style={styles.modalContainerWrapper}
        propagateSwipe
      >
        <View style={styles.modalContainer}>
          <View style={styles.dragIndicator} />
          <Text style={styles.modalTitle}>Comments</Text>

          {loadingComments ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <View key={index} style={styles.commentBlock}>
                    <View style={styles.commentHeader}>
                      <Image
                        source={{
                          uri: "https://randomuser.me/api/portraits/men/10.jpg",
                        }}
                        style={styles.commentUserImage}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.commentUser}>
                          {comment.commenterName}
                        </Text>
                        <Text style={styles.commentText}>{comment.text}</Text>
                        <Text style={styles.commentTime}>
                          {new Date(comment.commentedAt).toLocaleString()}
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              console.log(
                                "↪️ Replying to comment ID:",
                                comment.id,
                                "by",
                                comment.commenterName
                              );
                              setReplyingTo(comment.commentId);
                              setReplyToUser(comment.commenterName);
                            }}
                          >
                            <Text style={styles.replyBtn}>Reply</Text>
                          </TouchableOpacity>

                          {/* ✅ Show delete button if current user is post owner */}
                          {(() => {
                            const post = posts.find(
                              (p) => p.id === selectedPostId
                            );
                            const isCommentOwner =
                              comment.commenterId === currentUserId;
                            const isUploader = isPostOwner(selectedPostId);

                            if (isCommentOwner || isUploader) {
                              return (
                                <TouchableOpacity
                                  onPress={() =>
                                    Alert.alert(
                                      "Delete Comment",
                                      "Are you sure you want to delete this comment?",
                                      [
                                        { text: "Cancel", style: "cancel" },
                                        {
                                          text: "Delete",
                                          style: "destructive",
                                          onPress: () =>
                                            handleDeleteCommentOrReply(
                                              comment.commentId
                                            ),
                                        },
                                      ]
                                    )
                                  }
                                >
                                  <Text style={{ color: "red" }}>Delete</Text>
                                </TouchableOpacity>
                              );
                            }
                            return null;
                          })()}
                        </View>

                        {/* Replies */}
                        {/* Replies */}

                        {comment.replies && comment.replies.length > 0 && (
                          <>
                            {visibleReplies[comment.commentId]
                              ? renderReplies(flattenReplies(comment.replies))
                              : renderReplies([
                                  flattenReplies(comment.replies)[0],
                                ])}

                            {comment.replies.length > 1 && (
                              <TouchableOpacity
                                onPress={() => toggleReplies(comment.commentId)}
                                style={{ marginTop: 5, marginLeft: 20 }}
                              >
                                <Text
                                  style={{ color: "#6200ee", fontSize: 13 }}
                                >
                                  {visibleReplies[comment.commentId]
                                    ? "Hide Replies"
                                    : `View ${
                                        comment.replies.length - 1
                                      } more repl${
                                        comment.replies.length - 1 === 1
                                          ? "y"
                                          : "ies"
                                      }`}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={{ padding: 10, color: "#999" }}>
                  No comments yet.
                </Text>
              )}
            </ScrollView>
          )}

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={100}
          >
            <>
              {/* ✅ SHOWING "Replying to JohnDoe" LINE */}
              {replyingTo && (
                <View
                  style={{
                    padding: 10,
                    backgroundColor: "#eee",
                    borderRadius: 8,
                    margin: 10,
                  }}
                >
                  <Text style={{ color: "#333" }}>
                    Replying to{" "}
                    <Text style={{ fontWeight: "bold" }}>{replyToUser}</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setReplyingTo(null);
                      setReplyToUser(null);
                    }}
                  >
                    <Text style={{ color: "red", marginTop: 5 }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ✅ COMMENT / REPLY INPUT */}
              <View style={styles.commentInputWrapper}>
                <TextInput
                  placeholder={
                    replyingTo ? "Write your reply..." : "Add a comment..."
                  }
                  placeholderTextColor="#777"
                  value={newComment}
                  onChangeText={setNewComment}
                  style={styles.commentInput}
                />
                <TouchableOpacity
                  onPress={handleAddComment}
                  style={styles.postButton}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
              </View>
            </>
          </KeyboardAvoidingView>
        </View>
      </RNModal>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fafafa",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  media: {
    width: "100%",
    height: screenWidth * 0.75,
    backgroundColor: "#f0f0f0",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  commentButton: {
    marginLeft: 15,
    marginRight: 5,
  },
  countText: {
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  captionContainer: {
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  caption: {
    fontSize: 14,
    color: "#444",
  },
  viewMoreText: {
    color: "#6200ee",
    marginTop: 4,
    fontSize: 13,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  tag: {
    color: "#6200ee",
    marginRight: 8,
    fontSize: 13,
  },
  timestamp: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 12,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  retryText: {
    color: "blue",
  },
  listContainer: {
    paddingVertical: 10,
    paddingBottom: 30,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    height: "60%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111",
    textAlign: "center",
  },
  commentBlock: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  commentText: {
    fontSize: 14,
    color: "#222",
    marginTop: 2,
    lineHeight: 20,
  },
  commentTime: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  repliesContainer: {
    marginLeft: 20,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
  },
  replyBlock: {
    marginTop: 6,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
  },
  replyUser: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
  },
  replyText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
  replyTime: {
    fontSize: 11,
    color: "#aaa",
    marginTop: 3,
  },
  closeModalButton: {
    alignSelf: "center",
    marginTop: 15,
  },

  modalContainerWrapper: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 40,
    maxHeight: Dimensions.get("window").height * 0.93,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  commentUserImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ddd",
  },
  replyUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ddd",
  },
  replyBtn: {
    fontSize: 13,
    color: "#000",
    fontWeight: "500",
    marginTop: 6,
  },
  replyBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },

  commentInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  commentInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111",
  },

  postButton: {
    marginLeft: 10,
  },

  postButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },

  replyInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },

  replyInfoText: {
    fontSize: 13,
    color: "#333",
  },

  cancelReplyText: {
    color: "#000",
    fontSize: 13,
  },
});

export default PostCard;
