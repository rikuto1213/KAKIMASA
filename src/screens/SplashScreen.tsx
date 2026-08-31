import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { useAuthStore } from '@store/useAuthStore';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export const SplashScreen: React.FC = () => {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner color="#208AEF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Your splash screen content here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#208AEF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
