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

interface WeightCardContentProps {
  pet: Pet;
  colors: ThemeColors;
  onClose: () => void;
  onSaveWeight: (newWeight: number) => void;
}

const WeightCardContent: React.FC<WeightCardContentProps> = ({
  pet,
  colors,
  onClose,
  onSaveWeight,
}) => {
  const [weightValue, setWeightValue] = useState(pet.weight.toString());

  const handleAdjust = (delta: number) => {
    const current = parseFloat(weightValue.replace(',', '.')) || pet.weight;
    const adjusted = Math.max(0.1, Number((current + delta).toFixed(2)));
    setWeightValue(adjusted.toString());
  };

  const handleSave = () => {
    const parsed = parseFloat(weightValue.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      onSaveWeight(parsed);
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
              { backgroundColor: colors.accentPurpleLight },
            ]}
          >
            <Ionicons name="scale" size={20} color={colors.accentPurple} />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Ağırlık Güncelle
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {pet.name} için yeni tartım değeri
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
            borderColor: colors.accentPurple,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          keyboardType="decimal-pad"
          value={weightValue}
          onChangeText={setWeightValue}
          autoFocus={true}
          selectTextOnFocus={true}
          placeholder="0.0"
          placeholderTextColor={colors.textMuted}
        />
        <Text style={[styles.unitText, { color: colors.textSecondary }]}>
          kg
        </Text>
      </View>

      {/* Quick Adjust Buttons */}
      <View style={styles.quickAdjustRow}>
        {[
          { label: '-0.5', val: -0.5 },
          { label: '-0.1', val: -0.1 },
          { label: '+0.1', val: 0.1 },
          { label: '+0.5', val: 0.5 },
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
              {item.label} kg
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

export interface WeightModalProps {
  visible: boolean;
  onClose: () => void;
  colors: ThemeColors;
  pet: Pet;
  onSaveWeight: (newWeight: number) => void;
}

export const WeightModal: React.FC<WeightModalProps> = ({
  visible,
  onClose,
  colors,
  pet,
  onSaveWeight,
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <WeightCardContent
              key={`${pet.id}-${pet.weight}`}
              pet={pet}
              colors={colors}
              onClose={onClose}
              onSaveWeight={onSaveWeight}
            />
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default WeightModal;

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
    minWidth: 80,
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
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  adjustBtnText: {
    fontSize: 12,
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

