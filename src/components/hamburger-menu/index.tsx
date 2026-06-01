import { useState } from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/src/contexts/auth';
import { styles } from './styles';

const MENU_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Time', href: '/team' },
  { label: 'Perfil', href: '/profile' },
  { label: 'Login', href: '/login' },
  { label: 'Cadastro', href: '/register' },
] as const;

const HIDDEN_MENU_ROUTES = new Set(['/login', '/register']);

type MenuItem = (typeof MENU_ITEMS)[number];

type MenuHref = MenuItem['href'];

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { isAuthenticated, signOut } = useAuth();
  const pathname = usePathname();

  if (HIDDEN_MENU_ROUTES.has(pathname)) {
    return null;
  }

  const navItems: MenuItem[] = isAuthenticated
    ? MENU_ITEMS.filter((item) => item.href !== '/login' && item.href !== '/register')
    : [...MENU_ITEMS];
  const visibleItems = navItems.filter((item) => item.href !== pathname);

  const handleNavigate = (href: MenuHref) => {
    setIsOpen(false);
    router.push(href);
  };

  const handleSignOut = () => {
    setIsOpen(false);
    signOut();
    router.replace('/login');
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setIsOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Abrir menu"
      >
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </Pressable>

      <Modal
        transparent
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <Pressable
            style={[styles.menu, { top: insets.top + 56 }]}
            onPress={(event) => event.stopPropagation()}
          >
            {visibleItems.map((item) => (
              <Pressable
                key={item.href}
                onPress={() => handleNavigate(item.href)}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed ? styles.menuItemPressed : null,
                ]}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </Pressable>
            ))}
            {isAuthenticated ? (
              <Pressable
                onPress={handleSignOut}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed ? styles.menuItemPressed : null,
                ]}
              >
                <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                  Sair
                </Text>
              </Pressable>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
