import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { apiService } from '@services/api';
import { useAuthStore } from '@store/useAuthStore';
import { useRestaurantStore } from '@store/useRestaurantStore';
import { formatDate } from '@utils/formatting';
import { useEffect, useState } from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ReservationsScreen() {
  const { user } = useAuthStore();
  const { userReservations, setUserReservations, isLoading, setLoading } = useRestaurantStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const response = await apiService.getReservations();
      setUserReservations(response.data || []);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReservations();
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
        {userReservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reservations yet</Text>
            <Text style={styles.emptySubtext}>Book a restaurant to get started</Text>
          </View>
        ) : (
          <View style={styles.section}>
            {userReservations.map((reservation) => (
              <View key={reservation.id} style={styles.reservationCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.reservationStatus}>{reservation.status}</Text>
                  <Text style={styles.reservationDate}>
                    {formatDate(reservation.date)}
                  </Text>
                </View>
                <Text style={styles.reservationTime}>{reservation.time}</Text>
                <Text style={styles.reservationGuests}>
                  {reservation.numberOfPeople} {reservation.numberOfPeople === 1 ? 'Guest' : 'Guests'}
                </Text>
                {reservation.specialRequests && (
                  <Text style={styles.reservationNotes}>{reservation.specialRequests}</Text>
                )}
                {reservation.pointsEarned && (
                  <View style={styles.pointsEarned}>
                    <Text style={styles.pointsEarnedText}>
                      +{reservation.pointsEarned} points earned
                    </Text>
                  </View>
                )}
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  reservationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reservationStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#50C878',
    textTransform: 'capitalize',
  },
  reservationDate: {
    fontSize: 12,
    color: '#999',
  },
  reservationTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reservationGuests: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reservationNotes: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  pointsEarned: {
    backgroundColor: '#f0f8ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  pointsEarnedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#50C878',
  },
  actionButton: {
    backgroundColor: '#208AEF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
});
