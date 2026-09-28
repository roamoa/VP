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
  Switch,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/theme';
import { Pet, PetType, Gender } from '../types/pet';

interface AddPetModalProps {
  visible: boolean;
  onClose: () => void;
  colors: ThemeColors;
  onAddPet: (newPet: Pet) => void;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({
  visible,
  onClose,
  colors,
  onAddPet,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<PetType>('cat');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('1');
  const [weight, setWeight] = useState('4.0');
  const [gender, setGender] = useState<Gender>('female');
  const [isNeutered, setIsNeutered] = useState(true);
  const [chipNumber, setChipNumber] = useState('');

  const petTypes: { key: PetType; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
    { key: 'cat', label: 'Kedi', icon: 'cat' },
    { key: 'dog', label: 'Köpek', icon: 'dog' },
    { key: 'bird', label: 'Kuş', icon: 'bird' },
    { key: 'rabbit', label: 'Tavşan', icon: 'rabbit' },
  ];

  const handleSave = () => {
    if (!name.trim()) return;

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: name.trim(),
      type,
      breed: breed.trim() || (type === 'cat' ? 'Tekir' : 'Melez'),
      age: parseInt(age, 10) || 1,
      gender,
      weight: parseFloat(weight) || 4.0,
      chipNumber: chipNumber.trim() ? chipNumber.trim() : undefined,
      avatarIcon: type === 'cat' ? 'cat' : type === 'dog' ? 'dog' : type === 'bird' ? 'bird' : 'rabbit',
      color:
        type === 'cat'
          ? '#8B5CF6'
          : type === 'dog'
          ? '#F59E0B'
          : type === 'bird'
          ? '#3B82F6'
          : '#EC4899',
      isNeutered,
      feeding: {
        dailyTargetGrams: type === 'cat' ? 150 : 400,
        currentGrams: 0,
        breakfast: false,
        lunch: false,
        dinner: false,
      },
      water: {
        dailyTargetMl: type === 'cat' ? 250 : 1200,
        currentMl: 0,
      },
      walk: {
        dailyTargetMin: type === 'cat' ? 20 : 60,
        currentMin: 0,
      },
      vaccines: [
        {
          id: `vac-${Date.now()}-1`,
          name: 'Genel Sağlık Kontrolü',
          dueDate: '1 Ay Sonra',
          completed: false,
        },
      ],
      activities: [
        {
          id: `act-${Date.now()}-1`,
          type: 'vet',
          title: 'Yeni Profil Oluşturuldu',
          time: 'Şimdi',
          detail: `${name.trim()} uygulamaya kaydedildi.`,
        },
      ],
      vetInfo: {
        clinicName: 'Veteriner Kliniği',
        doctorName: 'Veteriner Hekim',
        phone: '',
        address: '',
      },
    };

    onAddPet(newPet);
    setName('');
    setBreed('');
    setAge('1');
    setWeight('4.0');
    setChipNumber('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={[styles.modalCard, { backgroundColor: colors.cardBackground }]}
            >
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                  Yeni Evcil Hayvan Ekle 🐾
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {/* Pet Type Picker */}
                <Text style={[styles.label, { color: colors.textSecondary }]}>TÜR</Text>
                <View style={styles.typeRow}>
                  {petTypes.map((pt) => {
                    const isSelected = type === pt.key;
                    return (
                      <TouchableOpacity
                        key={pt.key}
                        style={[
                          styles.typeCard,
                          {
                            backgroundColor: isSelected
                              ? colors.primaryLight
                              : colors.inputBackground,
                            borderColor: isSelected ? colors.primary : colors.divider,
                          },
                        ]}
                        onPress={() => setType(pt.key)}
                        activeOpacity={0.7}
                      >
                        <MaterialCommunityIcons
                          name={pt.icon}
                          size={24}
                          color={isSelected ? colors.primary : colors.textMuted}
                        />
                        <Text
                          style={[
                            styles.typeCardText,
                            {
                              color: isSelected ? colors.primaryDark : colors.textPrimary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {pt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Name */}
                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>
                  İSİM *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.inputBackground, color: colors.textPrimary },
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Örn: Pamuk, Minnoş, Karabaş"
                  placeholderTextColor={colors.textMuted}
                />

                {/* Breed */}
                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>
                  IRK / CİNS
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.inputBackground, color: colors.textPrimary },
                  ]}
                  value={breed}
                  onChangeText={setBreed}
                  placeholder="Örn: British Shorthair, Terrier"
                  placeholderTextColor={colors.textMuted}
                />

                {/* Gender & Age Row */}
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>
                      CİNSİYET
                    </Text>
                    <View style={styles.genderRow}>
                      <TouchableOpacity
                        style={[
                          styles.genderBtn,
                          {
                            backgroundColor:
                              gender === 'female'
                                ? colors.accentPurpleLight
                                : colors.inputBackground,
                            borderColor:
                              gender === 'female' ? colors.accentPurple : colors.divider,
                          },
                        ]}
                        onPress={() => setGender('female')}
                      >
                        <Text
                          style={{
                            color:
                              gender === 'female' ? colors.accentPurple : colors.textSecondary,
                            fontWeight: '700',
                          }}
                        >
                          Dişi ♀
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.genderBtn,
                          {
                            backgroundColor:
                              gender === 'male'
                                ? colors.accentBlueLight
                                : colors.inputBackground,
                            borderColor:
                              gender === 'male' ? colors.accentBlue : colors.divider,
                          },
                        ]}
                        onPress={() => setGender('male')}
                      >
                        <Text
                          style={{
                            color:
                              gender === 'male' ? colors.accentBlue : colors.textSecondary,
                            fontWeight: '700',
                          }}
                        >
                          Erkek ♂
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.col}>
                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>
                      YAŞ
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.inputBackground,
                          color: colors.textPrimary,
                        },
                      ]}
                      keyboardType="numeric"
                      value={age}
                      onChangeText={setAge}
                      placeholder="1"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                {/* Weight & Microchip */}
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>
                      AĞIRLIK (KG)
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
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="4.0"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>

                  <View style={styles.col}>
                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>
                      ÇİP NO (OPSİYONEL)
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.inputBackground,
                          color: colors.textPrimary,
                        },
                      ]}
                      value={chipNumber}
                      onChangeText={setChipNumber}
                      placeholder="TR-..."
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                {/* Neuter status switch */}
                <View style={[styles.switchRow, { borderTopColor: colors.divider }]}>
                  <View>
                    <Text style={[styles.switchTitle, { color: colors.textPrimary }]}>
                      Kısırlaştırılmış mı?
                    </Text>
                    <Text style={[styles.switchSubtitle, { color: colors.textMuted }]}>
                      Beslenme hedefleri buna göre optimize edilir
                    </Text>
                  </View>
                  <Switch
                    value={isNeutered}
                    onValueChange={setIsNeutered}
                    trackColor={{ false: colors.inputBackground, true: colors.primaryLight }}
                    thumbColor={isNeutered ? colors.primary : colors.textMuted}
                  />
                </View>

                {/* Submit button */}
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    {
                      backgroundColor: name.trim() ? colors.primary : colors.textMuted,
                    },
                  ]}
                  disabled={!name.trim()}
                  onPress={handleSave}
                  activeOpacity={0.85}
                >
                  <Ionicons name="paw" size={20} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>Evcil Hayvanı Kaydet</Text>
                </TouchableOpacity>
              </ScrollView>
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
    maxHeight: '90%',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  typeCardText: {
    fontSize: 12,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 6,
  },
  genderBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  switchSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 16,
    marginTop: 20,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

