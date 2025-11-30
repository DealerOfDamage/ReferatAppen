import React from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';

export type LargeButtonProps = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
};

const LargeButton: React.FC<LargeButtonProps> = ({ label, onPress, disabled, variant = 'secondary', loading }) => {
  const isPrimary = variant === 'primary';
  return (
    <Pressable disabled={disabled || loading} onPress={onPress} style={({ pressed }) => [
      styles.base,
      isPrimary ? styles.primary : styles.secondary,
      (disabled || loading) && styles.disabled,
      pressed && !disabled && !loading && styles.pressed,
    ]}>
      <View style={styles.content}>
        {loading && <ActivityIndicator color="#f8fafc" style={styles.spinner} />}
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  primary: {
    backgroundColor: '#0ea5e9',
  },
  secondary: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
  },
  spinner: {
    marginRight: 10,
  },
});

export default LargeButton;
