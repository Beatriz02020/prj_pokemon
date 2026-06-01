import { useState } from 'react';
import { View, Text, TextInput, Image, ScrollView } from 'react-native';
import { Link, Redirect, router } from 'expo-router';

import Button from '@/src/components/button';
import { useAuth } from '@/src/contexts/auth';
import { styles } from './styles';

export default function Login() {
  const { isAuthenticated, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Redirect href="/dashboard" />;
  }

  const handleLogin = () => {
    const ok = signIn(email, password);
    if (!ok) {
      setError('Preencha email e senha para continuar.');
      return;
    }

    setError('');
    router.replace('/dashboard');
  };

  return (
    <View style={styles.container}>
       <ScrollView
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
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Acesse o app para ver o dashboard</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          placeholderTextColor="#9AA1AA"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
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

        {error.length > 0 ? <Text style={styles.error}>{error}</Text> : null}

        <Button title="Entrar" onPress={handleLogin} style={styles.button} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Nao tem conta?</Text>
          <Link href="/register" style={styles.footerLink}>
            Cadastre-se
          </Link>
        </View>
      </View>
      </ScrollView> 
    </View>
  );
}
