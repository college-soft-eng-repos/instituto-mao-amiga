import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ConfirmationDialogProps = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  confirmVariant?: 'primary' | 'danger';
  cancelLabel?: string;
  onCancel?: () => void;
};

export default function ConfirmationDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  confirmVariant = 'danger',
  cancelLabel,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={(event) => event.stopPropagation()}
    >
      <TouchableOpacity
        style={styles.card}
        activeOpacity={1}
        onPress={(event) => event.stopPropagation()}
        accessibilityRole="alert"
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          {onCancel && cancelLabel && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.confirmButton, confirmVariant === 'primary' && styles.primaryButton]}
            onPress={onConfirm}
          >
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
    elevation: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    padding: 22,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 12,
  },
  title: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    minHeight: 42,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  cancelText: {
    color: '#334155',
    fontWeight: '600',
  },
  confirmButton: {
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DC3545',
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
});
