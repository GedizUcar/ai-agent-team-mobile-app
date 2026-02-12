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

interface LoginForm {
  email: string;
  password: string;
}

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
}

export const LoginScreen = memo(function LoginScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (form: LoginForm) => {
    setLoading(true);
    try {
      await authService.login(form);
    } catch (error: unknown) {
      Alert.alert('Error', getApiErrorMessage(error, 'Login failed. Please try again.'));
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
          <Text style={[typography.h1, { color: colors.primary }]}>Stilora</Text>
          <Text style={[typography.body1, { color: colors.textSecondary, marginTop: spacing.sm }]}>
            Welcome back! Sign in to continue.
          </Text>
        </View>

        <View style={styles.form}>
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
                testID="login-email"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Password is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                icon="lock-closed-outline"
                isPassword
                autoComplete="password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                testID="login-password"
              />
            )}
          />

          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            testID="login-submit"
          />

          <Button
            title="Forgot Password?"
            onPress={() => navigation.navigate('ForgotPassword')}
            variant="ghost"
            style={{ marginTop: spacing.sm }}
            testID="login-forgot"
          />
        </View>

        <View style={styles.footer}>
          <Text style={[typography.body2, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate('Register')}
            variant="ghost"
            testID="login-register-link"
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  form: {
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
