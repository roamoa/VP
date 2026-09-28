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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/theme';

interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  colors: ThemeColors;
  onSaveAction: (
    type: 'feeding' | 'water' | 'walk' | 'vaccine' | 'weight',
    data: any
  ) => void;
  currentWeight?: number;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  visible,
  onClose,
  colors,
  onSaveAction,
  currentWeight = 4.0,
}) => {
  const [activeTab, setActiveTab] = useState<'feeding' | 'water' | 'walk' | 'vaccine' | 'weight'>('feeding');

  // Input states
  const [foodGrams, setFoodGrams] = useState('50');
  const [foodNote, setFoodNote] = useState('Kuru Mama');

  const [waterMl, setWaterMl] = useState('100');

  const [walkMins, setWalkMins] = useState('20');
  const [walkNote, setWalkNote] = useState('Park yürüyüşü');

  const [vaccineName, setVaccineName] = useState('');
  const [vaccineDate, setVaccineDate] = useState('');

  const [newWeight, setNewWeight] = useState(currentWeight.toString());

  const handleSave = () => {
    if (activeTab === 'feeding') {
      const grams = parseInt(foodGrams, 10) || 50;
      onSaveAction('feeding', { grams, note: foodNote });
    } else if (activeTab === 'water') {
      const ml = parseInt(waterMl, 10) || 100;
      onSaveAction('water', { ml });
    } else if (activeTab === 'walk') {
      const mins = parseInt(walkMins, 10) || 20;
      onSaveAction('walk', { mins, note: walkNote });
    } else if (activeTab === 'vaccine') {
      if (!vaccineName.trim()) return;
      onSaveAction('vaccine', {
        name: vaccineName,
        dueDate: vaccineDate || 'Gelecek Ay',
      });
      setVaccineName('');
      setVaccineDate('');
    } else if (activeTab === 'weight') {
      const weightNum = parseFloat(newWeight) || currentWeight;
      onSaveAction('weight', { weight: weightNum });
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={[
                styles.modalCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                  Hızlı Kayıt Ekle
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Action Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsRow}
              >
                {[
                  { key: 'feeding', label: 'Mama', icon: 'nutrition', color: colors.accentYellow },
                  { key: 'water', label: 'Su', icon: 'water', color: colors.accentBlue },
                  { key: 'walk', label: 'Aktivite', icon: 'walk', color: colors.primary },
                  { key: 'vaccine', label: 'Aşı / İlaç', icon: 'medical', color: colors.accentRed },
                  { key: 'weight', label: 'Kilo', icon: 'scale', color: colors.accentPurple },
                ].map((tab) => {
                  const isSelected = activeTab === tab.key;
                  return (
                    <TouchableOpacity
                      key={tab.key}
                      style={[
                        styles.tabItem,
                        {
                          backgroundColor: isSelected ? tab.color : colors.inputBackground,
                        },
                      ]}
                      onPress={() => setActiveTab(tab.key as any)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={tab.icon as any}
                        size={16}
                        color={isSelected ? '#FFFFFF' : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.tabText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.textPrimary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Tab Form Contents */}
              <View style={styles.formBody}>
                {activeTab === 'feeding' && (
                  <View>
                    <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                      MAMA MİKTARI (GRAM)
                    </Text>
                    <View style={styles.quickPillsRow}>
                      {['30', '50', '80', '120'].map((g) => (
                        <TouchableOpacity
                          key={g}
                          style={[
                            styles.presetPill,
                            {
                              backgroundColor:
                                foodGrams === g ? colors.accentYellow : colors.inputBackground,
                            },
                          ]}
                          onPress={() => setFoodGrams(g)}
                        >
                          <Text
                            style={[
                              styles.presetText,
                              {
                                color: foodGrams === g ? '#FFFFFF' : colors.textPrimary,
                              },
                            ]}
                          >
                            {g}g
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.inputBackground,
                          color: colors.textPrimary,
                        },
                      ]}
                      keyboardType="numeric"
                      value={foodGrams}
                      onChangeText={setFoodGrams}
                      placeholder="Örn: 50"
                      placeholderTextColor={colors.textMuted}
                    />

                    <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 12 }]}>
                      NOT / MAMA TÜRÜ
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.inputBackground,
                          color: colors.textPrimary,
                        },
                      ]}
                      value={foodNote}
                      onChangeText={setFoodNote}
                      placeholder="Somonlu kuru mama, yaş mama vb."
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                )}

                {activeTab === 'water' && (
                  <View>
                    <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                      SU MİKTARI (ML)
                    </Text>
                    <View style={styles.quickPillsRow}>
                      {['50', '100', '200', '350'].map((ml) => (
                        <TouchableOpacity
                          key={ml}
                          style={[
                            styles.presetPill,
                            {
                              backgroundColor:
                                waterMl === ml ? colors.accentBlue : colors.inputBackground,
                            },
                          ]}
                          onPress={() => setWaterMl(ml)}
                        >
                          <Text
                            style={[
                              styles.presetText,
                              {
                                color: waterMl === ml ? '#FFFFFF' : colors.textPrimary,
                              },
                            ]}
                          >
                            {ml}ml
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.inputBackground,
                          color: colors.textPrimary,
                        },
                      ]}
                      keyboardType="numeric"
                      value={waterMl}
                      onChangeText={setWaterMl}
                      placeholder="100"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                )}

                {activeTab === 'walk' && (
                  <View>
                    <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                      AKTİVİTE / YÜRÜYÜŞ SÜRESİ (DAKİKA)
                    </Text>
                    <View style={styles.quickPillsRow}>
                      {['15', '30', '45', '60'].map((m) => (
                        <TouchableOpacity
                          key={m}
                          style={[
                            styles.presetPill,
                            {
                              backgroundColor:
                                walkMins === m ? colors.primary : colors.inputBackground,
                            },
                          ]}
                          onPress={() => setWalkMins(m)}
                        >
                          <Text
                            style={[
                              styles.presetText,
                              {
                                color: walkMins === m ? '#FFFFFF' : colors.textPrimary,
                              },
                            ]}
                          >
                            {m} dk
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.inputBackground,
                          color: colors.textPrimary,
                        },
                      ]}
                      keyboardType="numeric"
                      value={walkMins}
                      onChangeText={setWalkMins}
                      placeholder="20"
                      placeholderTextColor={colors.textMuted}
                    />

                    <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 12 }]}>
                      AKTİVİTE AÇIKLAMASI
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.inputBackground,
                          color: colors.textPrimary,
                        },
                      ]}
                      value={walkNote}
                      onChangeText={setWalkNote}
                      placeholder="Sahil yürüyüşü, top oyunu vb."
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                )}

                {activeTab === 'vaccine' && (
                  <View>
                    <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                      AŞI VEYA İLAÇ ADI
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.inputBackground,
                          color: colors.textPrimary,
                        },
                      ]}
                      value={vaccineName}
                      onChangeText={setVaccineName}
                      placeholder="Örn: Karma Aşı, Kuduz, Antibiyotik"
                      placeholderTextColor={colors.textMuted}
                    />

                    <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 12 }]}>
                      UYGULAMA / TEKRAR TARİHİ
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.inputBackground,
                          color: colors.textPrimary,
                        },
                      ]}
                      value={vaccineDate}
                      onChangeText={setVaccineDate}
                      placeholder="Örn: 20 Ekim 2026"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                )}

                {activeTab === 'weight' && (
                  <View>
                    <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                      GÜNCEL KİLO (KG)
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.inputBackground,
                          color: colors.textPrimary,
                        },
                      ]}
                      keyboardType="decimal-pad"
                      value={newWeight}
                      onChangeText={setNewWeight}
                      placeholder="Örn: 4.5"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                onPress={handleSave}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Kaydet</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 12,
  },
  formBody: {
    marginVertical: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  quickPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  presetPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 16,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
