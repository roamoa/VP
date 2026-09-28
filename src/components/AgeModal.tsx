import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/theme';
import { Pet } from '../types/pet';

interface AgeCardContentProps {
  pet: Pet;
  colors: ThemeColors;
  onClose: () => void;
  onSaveAge: (newAge: number) => void;
}

const AgeCardContent: React.FC<AgeCardContentProps> = ({
  pet,
  colors,
  onClose,
  onSaveAge,
}) => {
  const [ageValue, setAgeValue] = useState(pet.age.toString());

  const handleAdjust = (delta: number) => {
    const current = parseInt(ageValue, 10) || pet.age;
    const adjusted = Math.max(0, current + delta);
    setAgeValue(adjusted.toString());
  };

  const handleSave = () => {
    const parsed = parseInt(ageValue, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onSaveAge(parsed);
    }
    onClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[
        styles.modalCard,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.accentYellowLight },
            ]}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.accentYellow} />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Yaş Güncelle
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {pet.name} için güncel yaş
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={styles.closeBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Input Box */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.accentYellow,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          keyboardType="numeric"
          value={ageValue}
          onChangeText={setAgeValue}
          autoFocus={true}
          selectTextOnFocus={true}
          placeholder="1"
          placeholderTextColor={colors.textMuted}
        />
        <Text style={[styles.unitText, { color: colors.textSecondary }]}>
          Yaşında
        </Text>
      </View>

      {/* Quick Adjust Buttons */}
      <View style={styles.quickAdjustRow}>
        {[
          { label: '-1 Yıl', val: -1 },
          { label: '+1 Yıl', val: 1 },
          { label: '+2 Yıl', val: 2 },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.adjustBtn,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.cardBorder,
              },
            ]}
            onPress={() => handleAdjust(item.val)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.adjustBtnText,
                { color: colors.textPrimary },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.cancelBtn,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.cardBorder,
            },
          ]}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>
            Vazgeç
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export interface AgeModalProps {
  visible: boolean;
  onClose: () => void;
  colors: ThemeColors;
  pet: Pet;
  onSaveAge: (newAge: number) => void;
}

export const AgeModal: React.FC<AgeModalProps> = ({
  visible,
  onClose,
  colors,
  pet,
  onSaveAge,
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <AgeCardContent
              key={`${pet.id}-${pet.age}`}
              pet={pet}
              colors={colors}
              onClose={onClose}
              onSaveAge={onSaveAge}
            />
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AgeModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  input: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    minWidth: 60,
    padding: 0,
  },
  unitText: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 6,
  },
  quickAdjustRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 22,
  },
  adjustBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  adjustBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: 14,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

