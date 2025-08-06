import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNModal from "react-native-modal";
import { Text, Card, Button } from "../UI";
import { COLORS, SPACING, SHADOWS } from "../../theme";

const screenWidth = Dimensions.get("window").width;
const MAX_CONTENT_LINES = 3;

// Memoized components for better performance
const PostHeader = React.memo(({ uploadedBy, uploadedAt }) => (
  <View style={styles.header}>
    <Image
      source={{ uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" }}
      style={styles.profileImage}
    />
    <View style={styles.headerText}>
      <Text variant="h6" color="primary">{uploadedBy || "Unknown"}</Text>
      <Text variant="caption" color="secondary">
        {new Date(uploadedAt).toLocaleDateString()}
      </Text>
    </View>
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
    <TouchableOpacity onPress={onLike} style={styles.actionButton}>
      <Ionicons
        name={isLiked ? "heart" : "heart-outline"}
        size={24}
        color={isLiked ? COLORS.error[500] : COLORS.neutral[600]}
      />
      <Text variant="caption" color="secondary" style={styles.actionText}>
        {totalLikes}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={onComment} style={styles.actionButton}>
      <Ionicons name="chatbubble-outline" size={24} color={COLORS.neutral[600]} />
      <Text variant="caption" color="secondary" style={styles.actionText}>
        {totalComments}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionButton}>
      <Ionicons name="share-outline" size={24} color={COLORS.neutral[600]} />
    </TouchableOpacity>
  </View>
));

const PostContent = React.memo(({ 
  content, 
  isExpanded, 
  onToggleExpand, 
  tags 
}) => (
  <View style={styles.contentContainer}>
    <Text
      variant="body1"
      numberOfLines={isExpanded ? undefined : MAX_CONTENT_LINES}
      style={styles.content}
    >
      {content}
    </Text>
    
    {content.length > 150 && (
      <TouchableOpacity onPress={onToggleExpand}>
        <Text variant="caption" color={COLORS.primary[600]} style={styles.viewMoreText}>
          {isExpanded ? "Show less" : "Show more"}
        </Text>
      </TouchableOpacity>
    )}

    {tags?.length > 0 && (
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text variant="caption" color={COLORS.primary[600]}>
              #{tag}
            </Text>
          </View>
        ))}
      </View>
    )}
  </View>
));

const CommentItem = React.memo(({ 
  comment, 
  currentUserId, 
  isPostOwner, 
  onLongPress,
  visibleReplies,
  onToggleReplies,
  renderReplies 
}) => (
  <Pressable 
    style={styles.commentItem}
    onLongPress={() => onLongPress(comment)}
    delayLongPress={500}
  >
    <Image
      source={{ uri: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150" }}
      style={styles.commentAvatar}
    />
    <View style={styles.commentContent}>
      <Text variant="label" color="primary">{comment.commenterName}</Text>
      <Text variant="body2" color="primary" style={styles.commentText}>
        {comment.text}
      </Text>
      <Text variant="caption" color="secondary" style={styles.commentTime}>
        {new Date(comment.commentedAt).toLocaleString()}
      </Text>

      {comment.replies && comment.replies.length > 0 && (
        <>
          {visibleReplies[comment.commentId]
            ? renderReplies(comment.replies)
            : renderReplies([comment.replies[0]])}

          {comment.replies.length > 1 && (
            <TouchableOpacity
              onPress={() => onToggleReplies(comment.commentId)}
              style={styles.viewRepliesButton}
            >
              <Text variant="caption" color={COLORS.primary[600]}>
                {visibleReplies[comment.commentId]
                  ? "Hide replies"
                  : `View ${comment.replies.length - 1} more repl${
                      comment.replies.length - 1 === 1 ? "y" : "ies"
                    }`}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  </Pressable>
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
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentActionModal, setCommentActionModal] = useState(false);

  const API_BASE = useMemo(() => "http://192.168.1.116:8080/api/users", []);

  const fetchCurrentUserId = useCallback(async () => {
    const id = await AsyncStorage.getItem("userId");
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
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  }, [API_BASE]);

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

  const openCommentsModal = useCallback((postId) => {
    setSelectedPostId(postId);
    setCommentModalVisible(true);
    fetchComments(postId);
  }, [fetchComments]);

  const handleCommentLongPress = useCallback((comment) => {
    const canDelete = comment.commenterId === currentUserId || 
                     (selectedPost && selectedPost.uploaderId === currentUserId);
    
    if (canDelete) {
      setSelectedComment(comment);
      setCommentActionModal(true);
    }
  }, [currentUserId, selectedPost]);

  const handleDeleteComment = useCallback(async () => {
    if (!selectedComment) return;

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE}/comment/${selectedComment.commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchComments(selectedPostId);
        setCommentActionModal(false);
        setSelectedComment(null);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }, [selectedComment, API_BASE, selectedPostId, fetchComments]);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE}/comment/${selectedPostId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newComment.trim() }),
      });

      if (response.ok) {
        setNewComment("");
        fetchComments(selectedPostId);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }, [newComment, selectedPostId, API_BASE, fetchComments]);

  const toggleExpand = useCallback((postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }, []);

  const toggleReplies = useCallback((commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }, []);

  const renderReplies = useCallback((replies) => {
    return replies.map((reply, index) => (
      <View key={reply.replyId || index} style={styles.replyItem}>
        <Image
          source={{ uri: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150" }}
          style={styles.replyAvatar}
        />
        <View style={styles.replyContent}>
          <Text variant="caption" color="primary" style={styles.replyUser}>
            {reply.replierName}
          </Text>
          <Text variant="body2" color="primary">
            <Text variant="body2" color={COLORS.primary[600]}>
              @{reply.repliedToName}
            </Text>{" "}
            {reply.text}
          </Text>
          <Text variant="caption" color="secondary">
            {new Date(reply.repliedAt).toLocaleString()}
          </Text>
        </View>
      </View>
    ));
  }, []);

  const renderItem = useCallback(({ item }) => {
    const isExpanded = expandedPosts[item.id];

    return (
      <Card style={styles.postCard} shadow="medium">
        <PostHeader uploadedBy={item.uploadedBy} uploadedAt={item.uploadedAt} />

        <Image
          source={{ uri: item.imageUrl }}
          style={styles.postImage}
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
        />
      </Card>
    );
  }, [expandedPosts, handleLike, openCommentsModal, toggleExpand]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text variant="body2" color="secondary" style={styles.loadingText}>
          Loading posts...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error[500]} />
        <Text variant="h6" color="primary" style={styles.errorTitle}>
          Something went wrong
        </Text>
        <Text variant="body2" color="secondary" style={styles.errorMessage}>
          {error}
        </Text>
        <Button onPress={() => setError(null)} style={styles.retryButton}>
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
      />

      {/* Comments Modal */}
      <RNModal
        isVisible={commentModalVisible}
        onBackdropPress={() => setCommentModalVisible(false)}
        onSwipeComplete={() => setCommentModalVisible(false)}
        swipeDirection="down"
        style={styles.modalWrapper}
        propagateSwipe
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.dragIndicator} />
            <Text variant="h5" color="primary" style={styles.modalTitle}>
              Comments
            </Text>
          </View>

          {loadingComments ? (
            <View style={styles.modalLoading}>
              <ActivityIndicator size="large" color={COLORS.primary[600]} />
            </View>
          ) : (
            <ScrollView style={styles.commentsScroll}>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <CommentItem
                    key={index}
                    comment={comment}
                    currentUserId={currentUserId}
                    isPostOwner={selectedPost?.uploaderId === currentUserId}
                    onLongPress={handleCommentLongPress}
                    visibleReplies={visibleReplies}
                    onToggleReplies={toggleReplies}
                    renderReplies={renderReplies}
                  />
                ))
              ) : (
                <View style={styles.noComments}>
                  <Ionicons name="chatbubble-outline" size={48} color={COLORS.neutral[300]} />
                  <Text variant="body2" color="secondary">
                    No comments yet. Be the first to comment!
                  </Text>
                </View>
              )}
            </ScrollView>
          )}

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={100}
          >
            <View style={styles.commentInputContainer}>
              <TextInput
                placeholder="Add a comment..."
                placeholderTextColor={COLORS.neutral[400]}
                value={newComment}
                onChangeText={setNewComment}
                style={styles.commentInput}
                multiline
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={styles.sendButton}
                disabled={!newComment.trim()}
              >
                <Ionicons 
                  name="send" 
                  size={20} 
                  color={newComment.trim() ? COLORS.primary[600] : COLORS.neutral[400]} 
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </RNModal>

      {/* Comment Action Modal */}
      <RNModal
        isVisible={commentActionModal}
        onBackdropPress={() => setCommentActionModal(false)}
        style={styles.actionModalWrapper}
      >
        <View style={styles.actionModalContainer}>
          <Text variant="h6" color="primary" style={styles.actionModalTitle}>
            Comment Options
          </Text>
          
          <TouchableOpacity
            style={styles.actionModalButton}
            onPress={handleDeleteComment}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.error[600]} />
            <Text variant="body1" color={COLORS.error[600]} style={styles.actionModalText}>
              Delete Comment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionModalButton, styles.cancelButton]}
            onPress={() => setCommentActionModal(false)}
          >
            <Text variant="body1" color="secondary">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </RNModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  postCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: SPACING.sm,
  },
  headerText: {
    flex: 1,
  },
  postImage: {
    width: "100%",
    height: screenWidth * 0.75,
    backgroundColor: COLORS.neutral[100],
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.lg,
  },
  actionText: {
    marginLeft: SPACING.xs,
  },
  contentContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
  },
  content: {
    marginBottom: SPACING.xs,
  },
  viewMoreText: {
    marginTop: SPACING.xs,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: SPACING.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  errorTitle: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorMessage: {
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  retryButton: {
    marginTop: SPACING.md,
  },
  listContainer: {
    paddingVertical: SPACING.md,
    paddingBottom: 100,
  },

  // Modal Styles
  modalWrapper: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
    maxHeight: Dimensions.get("window").height * 0.9,
    ...SHADOWS.xl,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.neutral[300],
    borderRadius: 2,
    marginBottom: SPACING.sm,
  },
  modalTitle: {
    textAlign: "center",
  },
  modalLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  commentsScroll: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  commentItem: {
    flexDirection: "row",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: SPACING.sm,
  },
  commentContent: {
    flex: 1,
  },
  commentText: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  commentTime: {
    marginTop: SPACING.xs,
  },
  replyItem: {
    flexDirection: "row",
    marginTop: SPACING.sm,
    marginLeft: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: SPACING.sm,
  },
  replyContent: {
    flex: 1,
  },
  replyUser: {
    marginBottom: SPACING.xs,
  },
  viewRepliesButton: {
    marginTop: SPACING.sm,
    marginLeft: SPACING.lg,
  },
  noComments: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING['3xl'],
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    backgroundColor: COLORS.white,
  },
  commentInput: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    maxHeight: 100,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  sendButton: {
    padding: SPACING.sm,
    borderRadius: 20,
  },

  // Action Modal Styles
  actionModalWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  actionModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    width: "80%",
    ...SHADOWS.lg,
  },
  actionModalTitle: {
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  actionModalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  actionModalText: {
    marginLeft: SPACING.sm,
  },
  cancelButton: {
    backgroundColor: COLORS.neutral[50],
  },
});

export default PostCard;