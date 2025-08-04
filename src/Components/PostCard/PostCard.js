import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import RNModal from "react-native-modal";

const screenWidth = Dimensions.get("window").width;
const MAX_CONTENT_LINES = 3;

// Memoized components for better performance
const PostHeader = React.memo(({ uploadedBy }) => (
  <View style={styles.header}>
    <Image
      source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
      style={styles.profileImage}
    />
    <Text style={styles.username}>{uploadedBy || "Unknown"}</Text>
  </View>
));

const PostActions = React.memo(({ 
  isLiked, 
  totalLikes, 
  totalComments, 
  onLike, 
  onComment 
}) => (
  <View style={styles.actions}>
    <TouchableOpacity onPress={onLike}>
      <AntDesign
        name={isLiked ? "heart" : "hearto"}
        size={24}
        color={isLiked ? "red" : "black"}
        style={styles.icon}
      />
    </TouchableOpacity>
    <Text style={styles.countText}>{totalLikes} Likes</Text>

    <TouchableOpacity onPress={onComment} style={styles.commentButton}>
      <Icon name="message-circle" size={24} color="black" />
    </TouchableOpacity>

    <Text style={styles.countText}>{totalComments} Comments</Text>
  </View>
));

const PostContent = React.memo(({ 
  content, 
  isExpanded, 
  onToggleExpand, 
  tags, 
  uploadedAt 
}) => (
  <>
    <View style={styles.captionContainer}>
      <Text
        numberOfLines={isExpanded ? undefined : MAX_CONTENT_LINES}
        style={styles.caption}
      >
        {content}
      </Text>
      {content.length > 100 && (
        <TouchableOpacity onPress={onToggleExpand}>
          <Text style={styles.viewMoreText}>
            {isExpanded ? "View Less" : "View More"}
          </Text>
        </TouchableOpacity>
      )}
    </View>

    {tags?.length > 0 && (
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>
    )}

    <Text style={styles.timestamp}>
      Posted on {new Date(uploadedAt).toLocaleDateString()}
    </Text>
  </>
));

const CommentItem = React.memo(({ 
  comment, 
  currentUserId, 
  isPostOwner, 
  onReply, 
  onDelete,
  visibleReplies,
  onToggleReplies,
  renderReplies 
}) => (
  <View style={styles.commentBlock}>
    <View style={styles.commentHeader}>
      <Image
        source={{ uri: "https://randomuser.me/api/portraits/men/10.jpg" }}
        style={styles.commentUserImage}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.commentUser}>{comment.commenterName}</Text>
        <Text style={styles.commentText}>{comment.text}</Text>
        <Text style={styles.commentTime}>
          {new Date(comment.commentedAt).toLocaleString()}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={() => onReply(comment.commentId, comment.commenterName)}>
            <Text style={styles.replyBtn}>Reply</Text>
          </TouchableOpacity>

          {(comment.commenterId === currentUserId || isPostOwner) && (
            <TouchableOpacity onPress={() => onDelete(comment.commentId)}>
              <Text style={{ color: "red", marginTop: 5 }}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>

        {comment.replies && comment.replies.length > 0 && (
          <>
            {visibleReplies[comment.commentId]
              ? renderReplies(comment.replies)
              : renderReplies([comment.replies[0]])}

            {comment.replies.length > 1 && (
              <TouchableOpacity
                onPress={() => onToggleReplies(comment.commentId)}
                style={{ marginTop: 5, marginLeft: 20 }}
              >
                <Text style={{ color: "#6200ee", fontSize: 13 }}>
                  {visibleReplies[comment.commentId]
                    ? "Hide Replies"
                    : `View ${comment.replies.length - 1} more repl${
                        comment.replies.length - 1 === 1 ? "y" : "ies"
                      }`}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  </View>
));

const PostCard = ({ activeCategory }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [expandedPosts, setExpandedPosts] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyToUser, setReplyToUser] = useState(null);

  // Memoized API base URL
  const API_BASE = useMemo(() => "http://192.168.1.116:8080/api/users", []);

  const toggleReplies = useCallback((commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }, []);

  const fetchCurrentUserId = useCallback(async () => {
    const id = await AsyncStorage.getItem("userId");
    console.log("👤 Current logged-in user ID:", id);
    setCurrentUserId(Number(id));
  }, []);

  useEffect(() => {
    fetchCurrentUserId();
  }, [fetchCurrentUserId]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const userId = await AsyncStorage.getItem("userId");

      const response = await fetch(
        `${API_BASE}/getUploaded-post/${activeCategory}?currentUserId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();

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
  }, [activeCategory, API_BASE]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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

  const flattenReplies = useCallback((replies) => {
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
  }, []);

  const isPostOwner = useCallback(() => {
    if (!selectedPost || !currentUserId) return false;
    return selectedPost.uploaderId === currentUserId;
  }, [selectedPost, currentUserId]);

  const renderReplies = useCallback((replies) => {
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

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setReplyingTo(reply.replyId);
                  setReplyToUser(reply.replierName);
                }}
              >
                <Text style={styles.replyBtn}>Reply</Text>
              </TouchableOpacity>

              {(reply.replierId === currentUserId || isPostOwner()) && (
                <TouchableOpacity
                  onPress={() => handleDeleteCommentOrReply(reply.replyId)}
                >
                  <Text style={{ color: "red", marginTop: 5 }}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    ));
  }, [currentUserId, isPostOwner, replyingTo, replyToUser]);

  const handleDeleteCommentOrReply = useCallback(async (id) => {
    const token = await AsyncStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE}/comment/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Deleted:", data);
        fetchComments(selectedPostId);
      } else {
        console.warn("❌ Delete failed:", data);
      }
    } catch (err) {
      console.error("🔥 Error deleting:", err);
    }
  }, [API_BASE, selectedPostId]);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) {
      console.log("🚫 Empty comment, skipping post.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    const endpoint = replyingTo
      ? `${API_BASE}/reply/${replyingTo}`
      : `${API_BASE}/comment/${selectedPostId}`;

    const bodyData = replyingTo
      ? {
          userId: Number(userId),
          text: newComment.trim(),
          repliedToUser: replyToUser,
        }
      : { text: newComment.trim(), parentCommentId: null };

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
  }, [newComment, replyingTo, replyToUser, selectedPostId, API_BASE]);

  const fetchComments = useCallback(async (postId) => {
    try {
      setLoadingComments(true);
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_BASE}/comments/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setComments(data.comments || []);
      setSelectedPost(data);
    } catch (error) {
      console.error("❌ Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  }, [API_BASE]);

  const openCommentsModal = useCallback((postId) => {
    setSelectedPostId(postId);
    setCommentModalVisible(true);
    fetchComments(postId);
  }, [fetchComments]);

  const handleLike = useCallback(async (postId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      const response = await fetch(`${API_BASE}/like/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: parseInt(userId) }),
      });

      if (!response.ok) throw new Error("Failed to toggle like");

      const data = await response.json();

      setPosts(prevPosts =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: data.liked,
                totalLikes: data.totalLikes,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Like error:", error);
    }
  }, [API_BASE]);

  const toggleExpand = useCallback((postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }, []);

  const handleReply = useCallback((commentId, commenterName) => {
    setReplyingTo(commentId);
    setReplyToUser(commenterName);
  }, []);

  const handleDeleteComment = useCallback((commentId) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteCommentOrReply(commentId),
        },
      ]
    );
  }, [handleDeleteCommentOrReply]);

  const renderItem = useCallback(({ item }) => {
    const isExpanded = expandedPosts[item.id];

    return (
      <View style={styles.card}>
        <PostHeader uploadedBy={item.uploadedBy} />

        <Image
          source={{ uri: item.imageUrl }}
          style={styles.media}
          resizeMode="cover"
        />

        <PostActions
          isLiked={item.isLiked}
          totalLikes={item.totalLikes}
          totalComments={item.totalComments}
          onLike={() => handleLike(item.id)}
          onComment={() => openCommentsModal(item.id)}
        />

        <PostContent
          content={item.content}
          isExpanded={isExpanded}
          onToggleExpand={() => toggleExpand(item.id)}
          tags={item.tags}
          uploadedAt={item.uploadedAt}
        />
      </View>
    );
  }, [expandedPosts, handleLike, openCommentsModal, toggleExpand]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const getItemLayout = useCallback((data, index) => ({
    length: 400, // Approximate height of each post
    offset: 400 * index,
    index,
  }), []);

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
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={3}
        getItemLayout={getItemLayout}
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
                  <CommentItem
                    key={index}
                    comment={comment}
                    currentUserId={currentUserId}
                    isPostOwner={isPostOwner()}
                    onReply={handleReply}
                    onDelete={handleDeleteComment}
                    visibleReplies={visibleReplies}
                    onToggleReplies={toggleReplies}
                    renderReplies={renderReplies}
                  />
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
            {replyingTo && (
              <View style={styles.replyInfo}>
                <Text style={styles.replyInfoText}>
                  Replying to <Text style={{ fontWeight: "bold" }}>{replyToUser}</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setReplyingTo(null);
                    setReplyToUser(null);
                  }}
                >
                  <Text style={styles.cancelReplyText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

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
  replyBtn: {
    fontSize: 13,
    color: "#000",
    fontWeight: "500",
    marginTop: 6,
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