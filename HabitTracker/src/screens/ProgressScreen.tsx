import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Dimensions, View } from 'react-native';
import { Title, Text, Card, useTheme } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { useHabit } from '../context/HabitContext';

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

export default function ProgressScreen() {
  const theme = useTheme();
  const { entries, habits } = useHabit();

  const weeklyData = useMemo(() => {
    const last30 = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().split('T')[0];
    });

    const activeHabitsCount = habits.filter(h=>h.isActive && h.frequency==='daily').length;

    const data = last30.map(date => {
      const completed = entries.filter(e=>e.date===date && e.completed).length;
      return activeHabitsCount>0? (completed/activeHabitsCount)*100 : 0;
    });

    return {
      labels: last30.map((d,i)=> i%5===0? new Date(d).toLocaleDateString('en',{month:'short',day:'numeric'}):''),
      datasets:[{ data }]
    };
  }, [entries, habits]);

  const avgCompletion = useMemo(()=>{
    if (weeklyData.datasets[0].data.length===0) return 0;
    const sum = weeklyData.datasets[0].data.reduce((a,b)=>a+b,0);
    return sum/weeklyData.datasets[0].data.length;
  }, [weeklyData]);

  return (
    <ScrollView style={[styles.container,{backgroundColor:theme.colors.background}]}> 
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Title>Last 30 Days Consistency</Title>
          <LineChart
            data={weeklyData}
            width={width-64}
            height={260}
            chartConfig={chartConfig}
            bezier
            style={{borderRadius:16}}
          />
          <Text style={styles.avgText}>Average Completion: {avgCompletion.toFixed(1)}%</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1 },
  card:{ margin:16 },
  avgText:{ marginTop:8, textAlign:'center' },
}); 