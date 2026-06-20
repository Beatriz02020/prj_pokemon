import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Image, Platform } from 'react-native';
import { Link, Redirect, router } from 'expo-router';

import Button from '@/src/components/button';
import { useAuth } from '@/src/contexts/auth';
import { bootstrapInitialCaptures } from '@/src/utils/pokemonBootstrap';
import { styles } from './styles';

export default function Register() {
  const { isAuthenticated, isLoading, register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/team" />;
  }

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('As senhas nao coincidem.');
      return;
    }

    if (!username.trim() || !password || !name.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await register(username.trim(), name.trim(), password);

    if (!result.success) {
      setError('Nao foi possivel criar a conta.');
      setIsSubmitting(false);
      return;
    }

    if (result.userId) {
      try {
        await bootstrapInitialCaptures(result.userId);
      } catch (bootstrapError) {
        console.error('bootstrap error:', bootstrapError);
      }
    }

    setIsSubmitting(false);
    router.replace('/team');
  };

  const isWeb = Platform.OS === 'web';

  return (
    <ScrollView
      contentContainerStyle={[styles.registerContainer, isWeb && styles.registerContainerWeb]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Image
          source={require('../../../../assets/images/Pokemon_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Cadastro</Text>
        <Text style={styles.subtitle}>Crie sua conta para continuar</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="seu nome"
          placeholderTextColor="#9AA1AA"
          autoCapitalize="words"
          autoCorrect={false}
          style={styles.input}
        />

        <Text style={styles.label}>Usuario</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="seu usuario"
          placeholderTextColor="#9AA1AA"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="sua senha"
          placeholderTextColor="#9AA1AA"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="confirme a senha"
          placeholderTextColor="#9AA1AA"
          secureTextEntry
          style={styles.input}
        />

        {error.length > 0 ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          title={isSubmitting ? 'Cadastrando...' : 'Criar conta'}
          onPress={handleRegister}
          disabled={isSubmitting}
          style={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ja tem conta?</Text>
          <Link href="/login" style={styles.footerLink}>
            Entrar
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
