import { apiService } from '@services/api';
import { useAuthStore } from '@store/useAuthStore';
import { formatCurrency } from '@utils/formatting';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface QRToken {
  token: string;
  expiresAt: string;
}

export default function PointsCardScreen() {
  const { user } = useAuthStore();
  const [qrToken, setQrToken] = useState<QRToken | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAwardForm, setShowAwardForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [awarding, setAwarding] = useState(false);

  // Fetch current QR token on mount and refresh every 30 seconds
  useEffect(() => {
    fetchCurrentToken();
    const interval = setInterval(fetchCurrentToken, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentToken = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCurrentToken();
      setQrToken(response.data);
    } catch (error) {
      console.error('Failed to fetch QR token:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    try {
      setRefreshing(true);
      await fetchCurrentToken();
    } finally {
      setRefreshing(false);
    }
  };

  const handleAwardPoints = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('エラー', '正しい金額を入力してください');
      return;
    }

    if (!qrToken) {
      Alert.alert('エラー', 'QRコードを取得してください');
      return;
    }

    try {
      setAwarding(true);
      const response = await apiService.awardPoints(qrToken.token, parseFloat(amount));
      
      Alert.alert(
        'ポイント付与完了',
        `${response.data.pointsAwarded}pt 獲得しました！\n合計: ${response.data.totalPoints}pt`,
        [{ text: 'OK', onPress: () => {
          setAmount('');
          setShowAwardForm(false);
          // Refresh user data
          useAuthStore.getState().initialize();
        }}]
      );
    } catch (error: any) {
      Alert.alert('エラー', error.response?.data?.error || 'ポイント付与に失敗しました');
    } finally {
      setAwarding(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Points Card Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ポイントカード</Text>
      </View>

      {/* Points Balance Card */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>現在のポイント</Text>
          <Text style={styles.cardPoints}>{user?.points || 0} pt</Text>
          <Text style={styles.cardSubtext}>
            残高: {formatCurrency((user?.points || 0) * 10)} 相当
          </Text>
        </View>
      </View>

      {/* QR Code Section */}
      <View style={styles.qrSection}>
        <Text style={styles.sectionTitle}>ポイントカード（QRコード）</Text>
        <Text style={styles.sectionDescription}>
          このQRコードを店員さんに見せてください
        </Text>

        {loading ? (
          <View style={styles.qrContainer}>
            <ActivityIndicator size="large" color="#208AEF" />
          </View>
        ) : qrToken ? (
          <View style={styles.qrContainer}>
            <View style={styles.qrTokenBox}>
              <Text style={styles.qrTokenLabel}>ポイントカードコード</Text>
              <Text style={styles.qrTokenValue} selectable>
                {qrToken.token.substring(0, 20)}...
              </Text>
              <Text style={styles.qrTokenHint}>
                店員さんに見せるか、スクリーンショットをお見せください
              </Text>
            </View>
            <Text style={styles.expirationText}>
              更新予定: {new Date(qrToken.expiresAt).toLocaleTimeString('ja-JP')}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.refreshButton, refreshing && styles.refreshButtonDisabled]}
          onPress={handleRefreshToken}
          disabled={refreshing}
        >
          <Text style={styles.refreshButtonText}>
            {refreshing ? 'リロード中...' : 'QRコードをリロード'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Test Points Award Form */}
      <View style={styles.testSection}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowAwardForm(!showAwardForm)}
        >
          <Text style={styles.toggleButtonText}>
            {showAwardForm ? 'フォームを閉じる' : 'ポイント付与テスト（開発用）'}
          </Text>
        </TouchableOpacity>

        {showAwardForm && (
          <View style={styles.awardForm}>
            <Text style={styles.formLabel}>会計金額を入力 (¥)</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>¥</Text>
              <TouchableOpacity
                style={styles.amountPreset}
                onPress={() => setAmount('3000')}
              >
                <Text style={styles.presetText}>3,000</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.amountPreset}
                onPress={() => setAmount('5000')}
              >
                <Text style={styles.presetText}>5,000</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.amountPreset}
                onPress={() => setAmount('10000')}
              >
                <Text style={styles.presetText}>10,000</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.selectedAmount}>入力額: ¥{amount || '0'}</Text>
            <Text style={styles.pointsPreview}>
              獲得ポイント: {amount ? Math.floor(parseFloat(amount) / 100) : 0} pt
            </Text>

            <TouchableOpacity
              style={[styles.awardButton, awarding && styles.awardButtonDisabled]}
              onPress={handleAwardPoints}
              disabled={awarding || !amount}
            >
              <Text style={styles.awardButtonText}>
                {awarding ? 'ポイント付与中...' : 'ポイントを付与する'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ポイント計算方法</Text>
          <Text style={styles.infoText}>• 会計額の1%がポイントになります</Text>
          <Text style={styles.infoText}>• ¥3,000 → 30pt</Text>
          <Text style={styles.infoText}>• ¥5,000 → 50pt</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>QRコードについて</Text>
          <Text style={styles.infoText}>• 5分ごとに自動更新されます</Text>
          <Text style={styles.infoText}>• 有効期限が切れる前にリロードしてください</Text>
          <Text style={styles.infoText}>• セキュリティのため、このQRコードは他の人に見せないでください</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#208AEF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  cardPoints: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  qrSection: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  qrTokenBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#208AEF',
    padding: 16,
    marginBottom: 12,
  },
  qrTokenLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  qrTokenValue: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#208AEF',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 6,
  },
  qrTokenHint: {
    fontSize: 11,
    color: '#999',
  },
  expirationText: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
  },
  refreshButton: {
    backgroundColor: '#208AEF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonDisabled: {
    opacity: 0.5,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  testSection: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  toggleButton: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#FF9800',
    fontSize: 14,
    fontWeight: '600',
  },
  awardForm: {
    marginTop: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    alignSelf: 'center',
  },
  amountPreset: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  presetText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF9800',
  },
  selectedAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  pointsPreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  awardButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  awardButtonDisabled: {
    opacity: 0.5,
  },
  awardButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    marginHorizontal: 16,
    marginBottom: 40,
    gap: 12,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});
