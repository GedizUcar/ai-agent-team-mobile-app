import React, { memo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useThemeColors } from '../../hooks/useThemeColors';
import { spacing } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth';
import { getApiErrorMessage } from '../../utils/error';
import type { ProfileStackScreenProps } from '../../navigation/types';

interface ProfileForm {
  firstName: string;
  lastName: string;
  phone: string;
}

type Props = ProfileStackScreenProps<'ProfileEdit'>;

function ProfileEditScreenComponent({ navigation }: Props) {
  const colors = useThemeColors();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
    },
  });

  const onSubmit = async (form: ProfileForm) => {
    setLoading(true);
    try {
      await authService.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || null,
      });
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      Alert.alert('Basarili', 'Profil bilgileriniz guncellendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (error: unknown) {
      Alert.alert('Hata', getApiErrorMessage(error, 'Profil guncellenirken bir hata olustu.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        testID="profile-edit-screen"
      >
        <View style={styles.form}>
          <Controller
            control={control}
            name="firstName"
            rules={{
              required: 'Ad alani zorunludur',
              maxLength: { value: 50, message: 'Ad en fazla 50 karakter olabilir' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Ad"
                placeholder="Adinizi girin"
                icon="person-outline"
                autoCapitalize="words"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.firstName?.message}
                testID="profile-edit-firstname"
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            rules={{
              required: 'Soyad alani zorunludur',
              maxLength: { value: 50, message: 'Soyad en fazla 50 karakter olabilir' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Soyad"
                placeholder="Soyadinizi girin"
                icon="person-outline"
                autoCapitalize="words"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName?.message}
                testID="profile-edit-lastname"
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{
              maxLength: { value: 20, message: 'Telefon en fazla 20 karakter olabilir' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Telefon"
                placeholder="Telefon numaraniz (opsiyonel)"
                icon="call-outline"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone?.message}
                testID="profile-edit-phone"
              />
            )}
          />

          <Button
            title="Kaydet"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            testID="profile-edit-save"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  form: {
    flex: 1,
  },
});

export const ProfileEditScreen = memo(ProfileEditScreenComponent);
