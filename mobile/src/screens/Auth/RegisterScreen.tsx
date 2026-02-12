import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { authService } from '../../services/auth';
import { getApiErrorMessage } from '../../utils/error';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
}

export const RegisterScreen = memo(function RegisterScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');

  const onSubmit = async (form: RegisterForm) => {
    setLoading(true);
    try {
      await authService.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
    } catch (error: unknown) {
      Alert.alert('Error', getApiErrorMessage(error, 'Registration failed. Please try again.'));
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
      >
        <View style={styles.header}>
          <Text style={[typography.h2, { color: colors.text }]}>Create Account</Text>
          <Text style={[typography.body1, { color: colors.textSecondary, marginTop: spacing.sm }]}>
            Join Stilora and start shopping.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Controller
                control={control}
                name="firstName"
                rules={{ required: 'Required', maxLength: { value: 50, message: 'Too long' } }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="First Name"
                    placeholder="John"
                    icon="person-outline"
                    autoComplete="given-name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.firstName?.message}
                    testID="register-first-name"
                  />
                )}
              />
            </View>
            <View style={styles.nameSpacer} />
            <View style={styles.nameField}>
              <Controller
                control={control}
                name="lastName"
                rules={{ required: 'Required', maxLength: { value: 50, message: 'Too long' } }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    autoComplete="family-name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.lastName?.message}
                    testID="register-last-name"
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email format',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="you@example.com"
                icon="mail-outline"
                keyboardType="email-address"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                testID="register-email"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
              validate: {
                uppercase: (v) => /[A-Z]/.test(v) || 'Must contain an uppercase letter',
                lowercase: (v) => /[a-z]/.test(v) || 'Must contain a lowercase letter',
                number: (v) => /[0-9]/.test(v) || 'Must contain a number',
                special: (v) => /[^A-Za-z0-9]/.test(v) || 'Must contain a special character',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Min. 8 characters"
                icon="lock-closed-outline"
                isPassword
                autoComplete="new-password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                testID="register-password"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Please confirm your password',
              validate: (v) => v === password || 'Passwords do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="Repeat your password"
                icon="lock-closed-outline"
                isPassword
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                testID="register-confirm-password"
              />
            )}
          />

          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            testID="register-submit"
          />
        </View>

        <View style={styles.footer}>
          <Text style={[typography.body2, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <Button
            title="Sign In"
            onPress={() => navigation.navigate('Login')}
            variant="ghost"
            testID="register-login-link"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  form: {
    marginBottom: spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
  },
  nameField: {
    flex: 1,
  },
  nameSpacer: {
    width: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
