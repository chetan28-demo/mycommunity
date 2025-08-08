import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import RNModal from 'react-native-modal';
import { addComment } from '../../utils/addComment';
import { deleteComment } from '../../utils/deleteComment';
import { Text, Card } from '../UI';
import { COLORS, SPACING, SHADOWS } from '../../theme';

const CommentActionModal = ({ visible, onClose, onDelete, comment }) => (
  <RNModal
    isVisible={visible}
    onBackdropPress={onClose}
    style={styles.actionModalWrapper}
    animationIn="fadeIn"
    animationOut="fadeOut"
  >
    <View style={styles.actionModalContainer}>
      <View style={styles.actionModalHeader}>
        <Image
          source={{ 
            uri: comment?.commenterImageUrl || 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150' 
          }}
          style={styles.actionModalAvatar}
        />
        <View style={styles.actionModalUserInfo}>
          <Text variant="h6" color="primary">{comment?.commenterName}</Text>
          <Text variant="caption" color="secondary" numberOfLines={2}>
            {comment?.text}
          </Text>
        </View>
      </View>

      <View style={styles.actionModalButtons}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <MaterialIcons name="delete-outline" size={20} color={COLORS.error[600]} />
          <Text variant="body1" style={[styles.deleteButtonText, { color: COLORS.error[600] }]}>
            Delete Comment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
        >
          <Text variant="body1" color="secondary">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </RNModal>
);

const CommentItem = React.memo(({ 
  comment, 
  currentUserId, 
  isPostOwner, 
  onLongPress 
}) => {
  const isCurrentUser = comment.commenterId === currentUserId;
  const canDelete = isCurrentUser || isPostOwner;
  const profileImage = comment.commenterImageUrl || 
    'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150';

  const formatTime = (timestamp) => {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHr < 24) return `${diffHr}h`;
    return `${diffDay}d`;
  };

  return (
    <Pressable
      style={styles.commentItem}
      onLongPress={() => canDelete && onLongPress(comment)}
      delayLongPress={500}
    >
      <Image source={{ uri: profileImage }} style={styles.commentAvatar} />
      
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text variant="label" color="primary">
            {isCurrentUser ? 'You' : comment.commenterName || 'Anonymous'}
          </Text>
          <Text variant="caption" color="secondary">
            {formatTime(comment.commentedAt)}
          </Text>
        </View>
        
        <Text variant="body2" color="primary" style={styles.commentText}>
          {comment.text || '(No text)'}
        </Text>

        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.likeButton}>
            <Ionicons name="heart-outline" size={16} color={COLORS.neutral[500]} />
            <Text variant="caption" color="secondary" style={styles.likeCount}>
              0
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Text variant="caption" style={[styles.replyText, { color: COLORS.primary[600] }]}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
});

const CommentsPage = ({ route }) => {
  const navigation = useNavigation();
  const { comments: initialComments = [], postId } = route.params;
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedId = await AsyncStorage.getItem('userId');
      setUserId(parseInt(storedId));
    };
    fetchUserId();
    setComments(
      initialComments.map((c, i) => ({
        ...c,
        _key: c.commentId?.toString() || `init-${i}`,
      }))
    );
  }, [initialComments]);

  const handleSubmitComment = useCallback(async () => {
    if (!commentText.trim()) return;
    
    try {
      const newComment = await addComment(postId, userId, commentText);
      const generatedKey = `temp-${Date.now()}`;
      setComments((prev) => [
        ...prev,
        {
          ...newComment,
          commenterName: 'You',
          commenterId: userId,
          commenterImageUrl: null,
          commentedAt: new Date().toISOString(),
          text: commentText,
          _key: generatedKey,
        },
      ]);
      setCommentText('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add comment');
    }
  }, [commentText, postId, userId]);

  const handleCommentLongPress = useCallback((comment) => {
    setSelectedComment(comment);
    setActionModalVisible(true);
  }, []);

  const handleDeleteComment = useCallback(async () => {
    if (!selectedComment) return;

    try {
      await deleteComment(selectedComment.commentId);
      setComments((prev) => prev.filter((c) => c.commentId !== selectedComment.commentId));
      setActionModalVisible(false);
      setSelectedComment(null);
    } catch (error) {
      console.error('Error deleting comment:', error.message);
      Alert.alert('Error', 'Failed to delete comment');
    }
  }, [selectedComment]);

  const renderComment = useCallback(({ item }) => (
    <CommentItem
      comment={item}
      currentUserId={userId}
      isPostOwner={false} // You can determine this based on your logic
      onLongPress={handleCommentLongPress}
    />
  ), [userId, handleCommentLongPress]);

  const keyExtractor = useCallback((item) => item._key, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text variant="h5" color="primary" style={styles.headerTitle}>
          Comments
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Comments List */}
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.commentsList}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      {/* Comment Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.emojiButton}>
              <Ionicons name="happy-outline" size={24} color={COLORS.neutral[500]} />
            </TouchableOpacity>
            
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add a comment..."
              placeholderTextColor={COLORS.neutral[400]}
              style={styles.textInput}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity
              onPress={handleSubmitComment}
              style={[
                styles.sendButton,
                commentText.trim() && styles.sendButtonActive
              ]}
              disabled={!commentText.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={commentText.trim() ? COLORS.primary[600] : COLORS.neutral[400]} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Comment Action Modal */}
      <CommentActionModal
        visible={actionModalVisible}
        onClose={() => setActionModalVisible(false)}
        onDelete={handleDeleteComment}
        comment={selectedComment}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  backButton: {
    padding: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  commentsList: {
    paddingVertical: SPACING.sm,
    paddingBottom: 100,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  commentText: {
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  likeCount: {
    marginLeft: SPACING.xs,
  },
  replyText: {
    // Color handled inline
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    ...SHADOWS.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.neutral[50],
    borderRadius: 24,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minHeight: 48,
  },
  emojiButton: {
    padding: SPACING.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    maxHeight: 100,
  },
  sendButton: {
    padding: SPACING.sm,
    borderRadius: 20,
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary[50],
  },

  // Action Modal Styles
  actionModalWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.lg,
    width: '85%',
    ...SHADOWS.xl,
  },
  actionModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  actionModalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  actionModalUserInfo: {
    flex: 1,
  },
  actionModalButtons: {
    gap: SPACING.sm,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.error[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.error[200],
  },
  deleteButtonText: {
    marginLeft: SPACING.sm,
  },
  cancelButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    alignItems: 'center',
  },

  // Tab Bar Icon Styles
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  focusedIconContainer: {
    backgroundColor: COLORS.primary[50],
    borderRadius: 16,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary[600],
  },
});

export default CommentsPage;