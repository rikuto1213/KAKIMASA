import { RestaurantCard } from '@components/RestaurantCard';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { apiService } from '@services/api';
import { useAuthStore } from '@store/useAuthStore';
import { useRestaurantStore } from '@store/useRestaurantStore';
import { getUserLocation } from '@utils/location';
import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export const HomeScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { restaurants, setRestaurants, isLoading, setLoading } = useRestaurantStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const location = await getUserLocation();
      const response = await apiService.getRestaurants(
        location?.latitude,
        location?.longitude,
        50
      );
      setRestaurants(response.data || []);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRestaurants();
    setRefreshing(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back, {user?.name}!</Text>
          <Text style={styles.points}>You have {user?.points || 0} points</Text>
        </View>

        {/* Restaurants List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
          {restaurants.length === 0 ? (
            <Text style={styles.emptyText}>No restaurants found nearby</Text>
          ) : (
            restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onPress={() => {
                  // Navigate to restaurant details
                }}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#208AEF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  points: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 32,
  },
});
