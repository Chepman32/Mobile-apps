import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

const StatsScreen = () => {
  const { stats, todayProgress, habits, categories } = useContext(AppContext);
  
  // Prepare data for the completion rate chart
  const completionData = {
    labels: stats.monthlyCompletions.map((_, index) => 
      new Date(new Date().setDate(new Date().getDate() - (29 - index))).getDate().toString()
    ),
    datasets: [
      {
        data: stats.monthlyCompletions.map(item => item.count),
        color: (opacity = 1) => `rgba(74, 111, 165, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Habits Completed']
  };

  // Prepare data for category distribution
  const categoryData = categories.map(category => ({
    name: category.name,
    count: habits.filter(h => h.category === category.id).length,
    color: category.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  })).filter(item => item.count > 0);

  // Calculate consistency (percentage of days with at least one habit completed in the last 30 days)
  const daysWithHabits = new Set(
    habits.flatMap(habit => 
      habit.completionHistory.map(ch => ch.date)
    )
  ).size;
  
  const consistency = Math.min(100, Math.round((daysWithHabits / 30) * 100));

  const screenWidth = Dimensions.get('window').width - 40;\n
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Habit Stats</Text>
        <Text style={styles.headerSubtitle}>Track your progress and consistency</Text>
      </View>

      {/* Today's Progress */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="today" size={20} color="#4a6fa5" />
          <Text style={styles.cardTitle}>Today's Progress</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{todayProgress.completionPercentage}%</Text>
          </View>
          <View style={styles.progressDetails}>
            <View style={styles.progressDetailItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4a6fa5" />
              <Text style={styles.progressDetailText}>
                {todayProgress.completedHabits.length} of {todayProgress.totalHabits} habits completed
              </Text>
            </View>
            <View style={styles.progressDetailItem}>
              <Ionicons name="flame" size={16} color="#FF6B6B" />
              <Text style={styles.progressDetailText}>
                {stats.currentStreak} day streak
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Consistency */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="trending-up" size={20} color="#4a6fa5" />
          <Text style={styles.cardTitle}>Consistency</Text>
        </View>
        <View style={styles.consistencyContainer}>
          <View style={styles.consistencyCircle}>
            <Text style={styles.consistencyText}>{consistency}%</Text>
            <Text style={styles.consistencyLabel}>of days with at least one habit completed</Text>
          </View>
          <View style={styles.consistencyDetails}>
            <View style={styles.consistencyDetailItem}>
              <Ionicons name="calendar" size={16} color="#4a6fa5" />
              <Text style={styles.consistencyDetailText}>
                {daysWithHabits} of last 30 days
              </Text>
            </View>
            <View style={styles.consistencyDetailItem}>
              <Ionicons name="trophy" size={16} color="#FFD700" />
              <Text style={styles.consistencyDetailText}>
                Best streak: {stats.longestStreak} days
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Monthly Completions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar" size={20} color="#4a6fa5" />
          <Text style={styles.cardTitle}>Monthly Completions</Text>
        </View>
        <LineChart
          data={completionData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withDots={false}
          withShadow={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={false}
        />
      </View>

      {/* Category Distribution */}
      {categoryData.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="pie-chart" size={20} color="#4a6fa5" />
            <Text style={styles.cardTitle}>Habits by Category</Text>
          </View>
          <PieChart
            data={categoryData}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        </View>
      )}

      {/* Habit Completion */}
      <View style={[styles.card, { marginBottom: 30 }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="checkmark-done" size={20} color="#4a6fa5" />
          <Text style={styles.cardTitle}>Habit Completion</Text>
        </View>
        <View style={styles.habitList}>
          {habits.map(habit => {
            const completionRate = Math.round(
              (habit.completionHistory.length / 30) * 100
            );
            return (
              <View key={habit.id} style={styles.habitItem}>
                <View style={styles.habitInfo}>
                  <View 
                    style={[
                      styles.habitIcon, 
                      { backgroundColor: `${habit.color}20` }
                    ]}
                  >
                    <Ionicons 
                      name={habit.icon as any} 
                      size={16} 
                      color={habit.color} 
                    />
                  </View>
                  <Text style={styles.habitName} numberOfLines={1}>
                    {habit.name}
                  </Text>
                </View>
                <View style={styles.habitStats}>
                  <Text style={styles.habitStatText}>
                    {completionRate}%
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { 
                          width: `${completionRate}%`,
                          backgroundColor: habit.color
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(74, 111, 165, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#4a6fa5',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: '#e0e6ed',
    borderLeftColor: '#4a6fa5',
    borderRightColor: '#4a6fa5',
    borderBottomColor: '#4a6fa5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a6fa5',
  },
  progressDetails: {
    flex: 1,
    marginLeft: 20,
  },
  progressDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressDetailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  consistencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consistencyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f4f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  consistencyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a6fa5',
    textAlign: 'center',
  },
  consistencyLabel: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  consistencyDetails: {
    flex: 1,
    marginLeft: 20,
  },
  consistencyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  consistencyDetailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  habitList: {
    marginTop: 8,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  habitStats: {
    width: 100,
    alignItems: 'flex-end',
  },
  habitStatText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 4,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default StatsScreen;
