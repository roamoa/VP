import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pet, AppSettings } from '../types/pet';
import { ThemeColors } from '../constants/theme';

interface PetProfileFormProps {
  selectedPet: Pet;
  pets: Pet[];
  onUpdatePet: (updatedPet: Pet) => void;
  onDeletePet: (petId: string) => void;
  weightUnit: string;
  colors: ThemeColors;
}

const PetProfileForm: React.FC<PetProfileFormProps> = ({
  selectedPet,
  pets,
  onUpdatePet,
  onDeletePet,
  weightUnit,
  colors,
}) => {
  const [petName, setPetName] = useState(selectedPet.name);
  const [petBreed, setPetBreed] = useState(selectedPet.breed);
  const [petAge, setPetAge] = useState(selectedPet.age.toString());
  const [petWeight, setPetWeight] = useState(selectedPet.weight.toString());
  const [chipNo, setChipNo] = useState(selectedPet.chipNumber || '');
  const [isNeutered, setIsNeutered] = useState(selectedPet.isNeutered);

  const [clinicName, setClinicName] = useState(selectedPet.vetInfo?.clinicName || '');
  const [vetDoctor, setVetDoctor] = useState(selectedPet.vetInfo?.doctorName || '');
  const [vetPhone, setVetPhone] = useState(selectedPet.vetInfo?.phone || '');
  const [vetAddress, setVetAddress] = useState(selectedPet.vetInfo?.address || '');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSavePetDetails = () => {
    setIsSaving(true);
    const updated: Pet = {
      ...selectedPet,
      name: petName.trim() || selectedPet.name,
      breed: petBreed.trim() || selectedPet.breed,
      age: parseInt(petAge, 10) || selectedPet.age,
      weight: parseFloat(petWeight) || selectedPet.weight,
      chipNumber: chipNo.trim() || undefined,
      isNeutered,
      vetInfo: {
        clinicName: clinicName.trim(),
        doctorName: vetDoctor.trim(),
        phone: vetPhone.trim(),
        address: vetAddress.trim(),
      },
    };

    onUpdatePet(updated);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 300);
  };

  const handleCallVet = () => {
    if (vetPhone) {
      Linking.openURL(`tel:${vetPhone.replace(/\s+/g, '')}`);
    } else {
      Alert.alert('Bilgi', 'Kayıtlı bir telefon numarası bulunamadı.');
    }
  };

  const confirmDeletePet = () => {
    if (pets.length <= 1) {
      Alert.alert('Uyarı', 'Uygulamada en az 1 evcil hayvan kaydı bulunmalıdır.');
      return;
    }
    Alert.alert(
      'Evcil Hayvanı Sil',
      `"${selectedPet.name}" kaydını silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => onDeletePet(selectedPet.id),
        },
      ]
    );
  };

  return (
    <>
      {/* 1. SEÇİLİ EVCİL HAYVAN PROFİLİ & BİLGİLERİ */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
        ]}
      >
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="paw" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {selectedPet.name} - Profil Bilgileri
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Temel sağlık ve kimlik parametreleri
            </Text>
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.formRow}>
          <View style={styles.col}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>İSİM</Text>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: colors.inputBackground, color: colors.textPrimary },
              ]}
              value={petName}
              onChangeText={setPetName}
            />
          </View>

          <View style={styles.col}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>IRK</Text>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: colors.inputBackground, color: colors.textPrimary },
              ]}
              value={petBreed}
              onChangeText={setPetBreed}
            />
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={styles.col}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>YAŞ</Text>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: colors.inputBackground, color: colors.textPrimary },
              ]}
              keyboardType="numeric"
              value={petAge}
              onChangeText={setPetAge}
            />
          </View>

          <View style={styles.col}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              AĞIRLIK ({weightUnit})
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: colors.inputBackground, color: colors.textPrimary },
              ]}
              keyboardType="decimal-pad"
              value={petWeight}
              onChangeText={setPetWeight}
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            MİKROÇİP NUMARASI
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: colors.inputBackground, color: colors.textPrimary },
            ]}
            value={chipNo}
            onChangeText={setChipNo}
            placeholder="TR-..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Neuter status toggle */}
        <View style={[styles.toggleRow, { borderTopColor: colors.divider }]}>
          <View>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
              Kısırlaştırılmış
            </Text>
            <Text style={[styles.toggleSubtitle, { color: colors.textMuted }]}>
              Diyet kalorisi optimizasyonu için
            </Text>
          </View>
          <Switch
            value={isNeutered}
            onValueChange={setIsNeutered}
            trackColor={{ false: colors.inputBackground, true: colors.primaryLight }}
            thumbColor={isNeutered ? colors.primary : colors.textMuted}
          />
        </View>
      </View>

      {/* 2. VETERİNER VE ACİL İLETİŞİM */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
        ]}
      >
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: colors.accentRedLight }]}>
            <Ionicons name="medical" size={18} color={colors.accentRed} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Veteriner & Acil İletişim
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Acil durumlarda hızlı erişim için
            </Text>
          </View>
          {vetPhone ? (
            <TouchableOpacity
              style={[styles.callBtn, { backgroundColor: colors.primary }]}
              onPress={handleCallVet}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>KLİNİK ADI</Text>
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: colors.inputBackground, color: colors.textPrimary },
            ]}
            value={clinicName}
            onChangeText={setClinicName}
            placeholder="Örn: Dost Pati Veteriner Kliniği"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.formRow}>
          <View style={styles.col}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              HEKİM ADI
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: colors.inputBackground, color: colors.textPrimary },
              ]}
              value={vetDoctor}
              onChangeText={setVetDoctor}
              placeholder="Dr. ..."
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.col}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>TELEFON</Text>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: colors.inputBackground, color: colors.textPrimary },
              ]}
              keyboardType="phone-pad"
              value={vetPhone}
              onChangeText={setVetPhone}
              placeholder="+90 ..."
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>KLİNİK ADRESİ</Text>
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: colors.inputBackground, color: colors.textPrimary },
            ]}
            value={vetAddress}
            onChangeText={setVetAddress}
            placeholder="Adres bilgisi"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Save button for profile & vet info */}
        <TouchableOpacity
          style={[
            styles.saveProfileBtn,
            { backgroundColor: saveSuccess ? colors.primaryDark : colors.primary },
          ]}
          onPress={handleSavePetDetails}
          activeOpacity={0.8}
        >
          <Ionicons
            name={saveSuccess ? 'checkmark-circle' : 'save-outline'}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.saveProfileBtnText}>
            {saveSuccess ? 'Başarıyla Kaydedildi! ✓' : isSaving ? 'Kaydediliyor...' : 'Profil Bilgilerini Güncelle'}
          </Text>
        </TouchableOpacity>

        {/* Delete pet button */}
        {pets.length > 1 && (
          <TouchableOpacity
            style={[styles.deletePetBtn, { borderColor: colors.accentRed }]}
            onPress={confirmDeletePet}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color={colors.accentRed} />
            <Text style={[styles.deletePetText, { color: colors.accentRed }]}>
              {selectedPet.name} Kaydını Sil
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

interface SettingsScreenProps {
  pets: Pet[];
  selectedPet: Pet;
  onUpdatePet: (updatedPet: Pet) => void;
  onDeletePet: (petId: string) => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetData: () => void;
  colors: ThemeColors;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  pets,
  selectedPet,
  onUpdatePet,
  onDeletePet,
  settings,
  onUpdateSettings,
  onResetData,
  colors,
}) => {
  const confirmResetData = () => {
    Alert.alert(
      'Verileri Sıfırla',
      'Tüm evcil hayvan kayıtları ve ayarlar ilk varsayılan durumuna döndürülecek. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sıfırla', style: 'destructive', onPress: onResetData },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>Ayarlar</Text>
        <Text style={[styles.screenSubtitle, { color: colors.textSecondary }]}>
          Uygulama tercihleri ve evcil hayvan profil yönetimi
        </Text>
      </View>

      {/* Selected Pet Form (keyed so it resets cleanly without effect on pet change) */}
      <PetProfileForm
        key={selectedPet.id}
        selectedPet={selectedPet}
        pets={pets}
        onUpdatePet={onUpdatePet}
        onDeletePet={onDeletePet}
        weightUnit={settings.weightUnit}
        colors={colors}
      />

      {/* 3. BİLDİRİMLER & HATIRLATICILAR */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
        ]}
      >
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: colors.accentYellowLight }]}>
            <Ionicons name="notifications" size={18} color={colors.accentYellow} />
          </View>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Bildirim & Hatırlatıcılar
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Günlük bakım uyarıları
            </Text>
          </View>
        </View>

        {/* Genel Bildirimler */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
              Uygulama Bildirimleri
            </Text>
            <Text style={[styles.toggleSubtitle, { color: colors.textMuted }]}>
              Tüm uyarıları etkinleştir
            </Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(val) =>
              onUpdateSettings({ ...settings, notificationsEnabled: val })
            }
            trackColor={{ false: colors.inputBackground, true: colors.primaryLight }}
            thumbColor={settings.notificationsEnabled ? colors.primary : colors.textMuted}
          />
        </View>

        {/* Beslenme Bildirimi */}
        <View style={[styles.toggleRow, { borderTopColor: colors.divider }]}>
          <View>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
              Beslenme Saatleri
            </Text>
            <Text style={[styles.toggleSubtitle, { color: colors.textMuted }]}>
              Sabah, öğle ve akşam mama hatırlatıcısı
            </Text>
          </View>
          <Switch
            disabled={!settings.notificationsEnabled}
            value={settings.feedingReminders}
            onValueChange={(val) =>
              onUpdateSettings({ ...settings, feedingReminders: val })
            }
            trackColor={{ false: colors.inputBackground, true: colors.primaryLight }}
            thumbColor={settings.feedingReminders ? colors.primary : colors.textMuted}
          />
        </View>

        {/* Su Bildirimi */}
        <View style={[styles.toggleRow, { borderTopColor: colors.divider }]}>
          <View>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
              Su Tazeleme
            </Text>
            <Text style={[styles.toggleSubtitle, { color: colors.textMuted }]}>
              Her 3 saatte bir su kontrolü
            </Text>
          </View>
          <Switch
            disabled={!settings.notificationsEnabled}
            value={settings.waterReminders}
            onValueChange={(val) =>
              onUpdateSettings({ ...settings, waterReminders: val })
            }
            trackColor={{ false: colors.inputBackground, true: colors.primaryLight }}
            thumbColor={settings.waterReminders ? colors.primary : colors.textMuted}
          />
        </View>

        {/* Aşı Uyarısı */}
        <View style={[styles.toggleRow, { borderTopColor: colors.divider }]}>
          <View>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
              Aşı & Veteriner Uyarıları
            </Text>
            <Text style={[styles.toggleSubtitle, { color: colors.textMuted }]}>
              Yaklaşan aşıdan 3 gün önce haber ver
            </Text>
          </View>
          <Switch
            disabled={!settings.notificationsEnabled}
            value={settings.vaccineAlerts}
            onValueChange={(val) =>
              onUpdateSettings({ ...settings, vaccineAlerts: val })
            }
            trackColor={{ false: colors.inputBackground, true: colors.primaryLight }}
            thumbColor={settings.vaccineAlerts ? colors.primary : colors.textMuted}
          />
        </View>
      </View>

      {/* 4. GÖRÜNÜM & TERCİHLER */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
        ]}
      >
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: colors.accentPurpleLight }]}>
            <Ionicons name="color-palette" size={18} color={colors.accentPurple} />
          </View>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Görünüm ve Birimler
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Tema ve ölçü standartları
            </Text>
          </View>
        </View>

        {/* Koyu Mod Seçimi */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
              Karanlık Mod (Dark Theme)
            </Text>
            <Text style={[styles.toggleSubtitle, { color: colors.textMuted }]}>
              Gözü yormayan koyu renk teması
            </Text>
          </View>
          <Switch
            value={settings.theme === 'dark'}
            onValueChange={(isDark) =>
              onUpdateSettings({
                ...settings,
                theme: isDark ? 'dark' : 'light',
              })
            }
            trackColor={{ false: colors.inputBackground, true: colors.accentPurpleLight }}
            thumbColor={settings.theme === 'dark' ? colors.accentPurple : colors.textMuted}
          />
        </View>

        {/* Ağırlık Birimi */}
        <View style={[styles.toggleRow, { borderTopColor: colors.divider }]}>
          <View>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
              Ağırlık Birimi
            </Text>
            <Text style={[styles.toggleSubtitle, { color: colors.textMuted }]}>
              Kilo ölçümü formatı
            </Text>
          </View>
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitBtn,
                settings.weightUnit === 'kg' && { backgroundColor: colors.primary },
              ]}
              onPress={() => onUpdateSettings({ ...settings, weightUnit: 'kg' })}
            >
              <Text
                style={[
                  styles.unitBtnText,
                  {
                    color:
                      settings.weightUnit === 'kg' ? '#FFFFFF' : colors.textSecondary,
                  },
                ]}
              >
                kg
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitBtn,
                settings.weightUnit === 'lbs' && { backgroundColor: colors.primary },
              ]}
              onPress={() => onUpdateSettings({ ...settings, weightUnit: 'lbs' })}
            >
              <Text
                style={[
                  styles.unitBtnText,
                  {
                    color:
                      settings.weightUnit === 'lbs' ? '#FFFFFF' : colors.textSecondary,
                  },
                ]}
              >
                lbs
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 5. VERİ VE HAKKINDA */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
        ]}
      >
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: colors.accentBlueLight }]}>
            <Ionicons name="information-circle" size={18} color={colors.accentBlue} />
          </View>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Uygulama & Veri
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Sürüm bilgisi ve yerel depolama
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Sürüm</Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>v1.0.0 (Expo React Native)</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Platform Uyumu</Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>iOS & Android (Universal)</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Depolama</Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>Çevrimdışı (AsyncStorage)</Text>
        </View>

        {/* Reset Data Button */}
        <TouchableOpacity
          style={[styles.resetBtn, { backgroundColor: colors.accentRedLight }]}
          onPress={confirmResetData}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={18} color={colors.accentRed} />
          <Text style={[styles.resetBtnText, { color: colors.accentRed }]}>
            Varsayılan Verilere Sıfırla
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  col: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  textInput: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  saveProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    marginTop: 16,
  },
  saveProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  deletePetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    marginTop: 10,
  },
  deletePetText: {
    fontSize: 13,
    fontWeight: '700',
  },
  unitSelector: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
  },
  unitBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  unitBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 14,
    marginTop: 16,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
