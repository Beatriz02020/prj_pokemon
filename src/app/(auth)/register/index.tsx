import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Image } from 'react-native';
import { Link, Redirect, router } from 'expo-router';

import Button from '@/src/components/button';
import { useAuth } from '@/src/contexts/auth';
import { styles } from './styles';

export default function Register() {
  const { isAuthenticated, register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (isAuthenticated) {
    return <Redirect href="/team" />;
  }

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      return;
    }

    const ok = await register(username, name, password);
    if (ok) {
      router.replace('/team');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.registerContainer}
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

        <Button title="Criar conta" onPress={handleRegister} style={styles.button} />

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
