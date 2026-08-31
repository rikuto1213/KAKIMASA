import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  isFavorited?: boolean;
  onFavoritePress?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onPress,
  isFavorited,
  onFavoritePress,
}) => {
  return (
    <View style={styles.card}>
      {restaurant.imageUrl && (
        <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {restaurant.description}
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.rating}>★ {restaurant.rating}</Text>
          <Text style={styles.reviews}>({restaurant.reviews} reviews)</Text>
        </View>
        <Text style={styles.address}>{restaurant.address}</Text>
        <Text style={styles.points}>+{restaurant.pointsPerVisit} points per visit</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB800',
  },
  reviews: {
    fontSize: 13,
    color: '#999',
    marginLeft: 4,
  },
  address: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  points: {
    fontSize: 12,
    fontWeight: '500',
    color: '#50C878',
  },
});
