
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Agenda } from 'react-native-calendars';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'todoList.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const CalendarScreen = () => {
  const [items, setItems] = useState({});

  const loadItems = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM tasks ORDER BY dueDate ASC',
        [],
        (_, { rows }) => {
          const newItems = {};
          for (let i = 0; i < rows.length; i++) {
            const task = rows.item(i);
            const strTime = task.dueDate;
            if (!newItems[strTime]) {
              newItems[strTime] = [];
            }
            newItems[strTime].push({
              name: task.title,
              description: task.description,
              height: 50,
            });
          }
          setItems(newItems);
        },
        (tx, error) => console.error('Error fetching tasks for calendar', error)
      );
    });
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        loadItemsForMonth={(month) => { /* Load items for month if needed */ }}
        selected={new Date().toISOString().split('T')[0]}
        renderItem={renderItem}
        renderEmptyDate={() => {
          return (
            <View style={styles.emptyDate}>
              <Text>No tasks for this day.</Text>
            </View>
          );
        }}
        rowHasChanged={(r1, r2) => {
          return r1.name !== r2.name;
        }}
        theme={{
          agendaDayTextColor: '#007bff',
          agendaDayNumColor: '#007bff',
          agendaTodayColor: '#007bff',
          agendaKnobColor: '#007bff',
          selectedDayBackgroundColor: '#007bff',
          dotColor: '#007bff',
          todayTextColor: '#007bff',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
  },
});

export default CalendarScreen;
