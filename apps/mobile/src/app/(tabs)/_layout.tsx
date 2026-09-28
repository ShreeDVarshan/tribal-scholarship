import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Home, BookOpen, FileText, CreditCard, User, Bot } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="scholarships"
          options={{
            title: 'Scholarships',
            tabBarIcon: ({ color, size }) => <BookOpen size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="applications"
          options={{
            title: 'Applications',
            tabBarIcon: ({ color, size }) => <FileText size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="payments"
          options={{
            title: 'Payments',
            tabBarIcon: ({ color, size }) => <CreditCard size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={20} color={color} />,
          }}
        />
      </Tabs>

      {/* Floating JAGO AI Assistant Trigger */}
      <TouchableOpacity
        style={styles.floatingJagoBtn}
        onPress={() => router.push('/jago')}
        activeOpacity={0.85}
      >
        <Bot size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  floatingJagoBtn: {
    position: 'absolute',
    bottom: 74,
    right: 18,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 99,
  },
});
