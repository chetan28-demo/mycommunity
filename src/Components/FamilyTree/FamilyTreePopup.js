import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '../UI';
import { COLORS, SPACING, SHADOWS } from '../../theme';

const { width } = Dimensions.get('window');

const TreeBox = ({ label }) => (
  <View style={styles.treeBox}>
    <Ionicons name="person" size={20} color={COLORS.primary[600]} />
    <Text variant="caption" color="primary" style={styles.treeBoxLabel}>
      {label}
    </Text>
  </View>
);

const FamilyTreePopup = ({ visible, onClose }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Card style={styles.popup}>
          <View style={styles.header}>
            <Text variant="h5" color="primary" style={styles.title}>
              Family Tree
            </Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={24} color={COLORS.neutral[600]} />
            </TouchableOpacity>
          </View>

          <View style={styles.treeContainer}>
            {/* Grand Parents Row */}
            <View style={styles.treeRow}>
              <TreeBox label="Grandfather" />
              <TreeBox label="Grandmother" />
            </View>

            {/* Parents Row */}
            <View style={styles.treeRow}>
              <TreeBox label="Father" />
              <TreeBox label="Mother" />
            </View>

            {/* User Row */}
            <View style={styles.treeRow}>
              <TreeBox label="You" />
            </View>
          </View>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  popup: {
    width: '100%',
    maxWidth: 400,
    padding: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
  },
  treeContainer: {
    alignItems: 'center',
  },
  treeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.lg,
  },
  treeBox: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: COLORS.primary[600],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
  },
  treeBoxLabel: {
    marginTop: SPACING.xs,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default FamilyTreePopup;