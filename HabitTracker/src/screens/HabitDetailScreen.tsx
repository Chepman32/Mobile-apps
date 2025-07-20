import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View, Dimensions, Alert } from 'react-native';
import { Title, Text, Card, Button, Chip, ProgressBar, useTheme, IconButton } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHabit } from '../context/HabitContext';
import { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '4', strokeWidth: '2', stroke: '#6366f1' },
};

type DetailRoute = RouteProp<RootStackParamList, 'HabitDetail'>;

export default function HabitDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<DetailRoute>();
  const { habitId } = route.params;

  const {
    habits,
    entries,
    deleteHabit,
    getHabitStats,
  } = useHabit();

  const habit = habits.find(h => h.id === habitId);
  const stats = getHabitStats(habitId);

  const recentEntries = useMemo(() => {
    return entries
      .filter(e => e.habitId === habitId)
      .sort((a,b)=>b.date.localeCompare(a.date))
      .slice(0,14);
  }, [entries, habitId]);

  const streakData = useMemo(() => {
    if (!stats) return null;
    const labels = ['Longest','Current'];
    const data = [stats.longestStreak, stats.currentStreak];
    return { labels, datasets:[{ data }]};
  }, [stats]);

  const deleteConfirm = () => {
    Alert.alert('Delete Habit','Are you sure you want to delete this habit?',[
      {text:'Cancel',style:'cancel'},
      {text:'Delete',style:'destructive',onPress:async()=>{await deleteHabit(habitId); navigation.goBack();}},
    ]);
  };

  if (!habit || !stats) {
    return (
      <View style={[styles.center,{backgroundColor:theme.colors.background}]}> 
        <Text>Habit not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container,{backgroundColor:theme.colors.background}]}> 
      <Card style={styles.card} mode="elevated">
        <Card.Title
          title={habit.name}
          subtitle={habit.description}
          left={(props)=>(<Icon {...props} name={habit.icon||'check-circle'} color={habit.color||theme.colors.primary} size={40}/>)}
          right={()=>(
            <IconButton icon="pencil" onPress={()=>navigation.navigate('EditHabit' as never,{ habitId } as never)} />
          )}
        />
        <Card.Content>
          <Text>Frequency: {habit.frequency} • Target {habit.targetCount}</Text>
          <Text>Difficulty: {habit.difficulty}</Text>
          <ProgressBar progress={stats.completionRate/100} style={{marginVertical:8}} color={theme.colors.primary}/>
          <Text>{stats.completionRate.toFixed(1)}% completion rate</Text>
        </Card.Content>
      </Card>

      {streakData && (
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Title>Streaks</Title>
            <BarChart
              data={streakData}
              width={width-64}
              height={220}
              chartConfig={chartConfig}
              fromZero
              style={{borderRadius:16}}
            />
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Title>Recent Activity</Title>
          {recentEntries.map(e=> (
            <View key={e.id} style={styles.entryRow}>
              <Icon name={e.completed? 'check-circle':'circle-outline'} size={20} color={e.completed? '#10b981': theme.colors.outline}/>
              <Text style={styles.entryText}>{e.date} • {e.completed? 'Completed':'Missed'} ({e.count})</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Button mode="contained" style={styles.deleteBtn} onPress={deleteConfirm} icon="delete">
        Delete Habit
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1 },
  card:{ margin:16 },
  entryRow:{ flexDirection:'row', alignItems:'center', marginVertical:4 },
  entryText:{ marginLeft:8 },
  deleteBtn:{ margin:16, backgroundColor:'#ef4444' },
  center:{ flex:1, justifyContent:'center', alignItems:'center' },
}); 