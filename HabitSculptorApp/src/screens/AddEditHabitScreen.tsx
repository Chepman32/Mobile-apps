import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppContext } from '../context/AppContext';
import { useTheme, themes } from '../context/ThemeContext';
import { RootStackParamList } from '../types';

const DAYS_OF_WEEK = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

const ICONS = [
  'barbell', 'basketball', 'book', 'brush', 'cafe', 'calendar', 'call', 'camera',
  'car', 'card', 'cart', 'chatbubbles', 'cloud', 'code', 'color-palette', 'construct',
  'fitness', 'flame', 'flash', 'flower', 'football', 'game-controller', 'gift', 'globe',
  'headset', 'heart', 'home', 'image', 'key', 'laptop', 'leaf', 'list', 'location',
  'lock-closed', 'mail', 'medal', 'medical', 'medkit', 'moon', 'musical-notes',
  'newspaper', 'notifications', 'nutrition', 'paw', 'pencil', 'people', 'person',
  'phone-portrait', 'pizza', 'planet', 'play', 'print', 'pulse', 'rainy', 'reader',
  'restaurant', 'ribbon', 'rocket', 'school', 'send', 'shirt', 'shuffle', 'star',
  'stopwatch', 'sunny', 'tennisball', 'thunderstorm', 'time', 'timer', 'train',
  'trash', 'trending-up', 'trophy', 'tv', 'umbrella', 'videocam', 'walk', 'water',
  'wine', 'wifi'
];

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FF9F1C', '#2EC4B6',
  '#E71D36', '#FF9F1C', '#2EC4B6', '#E71D36', '#011627', '#41B3A3', '#E8A87C',
  '#C38D9E', '#85DCB', '#E27D60', '#41B3A3', '#E8A87C', '#C38D9E', '#85DCB',
  '#E27D60'
];

const AddEditHabitScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'AddEditHabit'>>();
  const navigation = useNavigation();
  const { habitId } = route.params || {};
  const { 
    addHabit, 
    updateHabit, 
    getHabitById, 
    categories: allCategories 
  } = useContext(AppContext);
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [targetCount, setTargetCount] = useState(1);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const isEditMode = !!habitId;

  // Load habit data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const habit = getHabitById(habitId);
      if (habit) {
        setName(habit.name);
        setDescription(habit.description || '');
        setFrequency(habit.frequency);
        setDaysOfWeek(habit.daysOfWeek || []);
        setTargetCount(habit.targetCount);
        setCategory(habit.category);
        setColor(habit.color);
        setIcon(habit.icon);
      }
    } else if (allCategories.length > 0) {
      // Set default category if not in edit mode
      setCategory(allCategories[0].id);
    }
  }, [habitId, getHabitById, isEditMode, allCategories]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (frequency === 'weekly' && daysOfWeek.length === 0) {
      Alert.alert('Error', 'Please select at least one day of the week');
      return;
    }

    const habitData = {
      name: name.trim(),
      description: description.trim(),
      frequency,
      daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
      targetCount,
      category,
      color,
      icon,
    };

    try {
      setIsLoading(true);
      
      if (isEditMode) {
        await updateHabit(habitId, habitData);
      } else {
        await addHabit(habitData);
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving habit:', error);
      Alert.alert('Error', 'Failed to save habit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day].sort((a, b) => a - b));
    }
  };

  const renderIconPicker = () => (
    <Modal
      visible={showIconPicker}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowIconPicker(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text style={[styles.pickerTitle, { color: colors.text }]}>Select an Icon</Text>
          <ScrollView 
            contentContainerStyle={styles.iconsContainer}
            showsVerticalScrollIndicator={false}
          >
            {ICONS.map((iconName) => (
              <TouchableOpacity
                key={iconName}
                style={[
                  styles.iconButton,
                  { backgroundColor: colors.card },
                  icon === iconName && [styles.selectedIcon, { backgroundColor: colors.primary }]
                ]}
                onPress={() => {
                  setIcon(iconName);
                  setShowIconPicker(false);
                }}
              >
                <Ionicons 
                  name={iconName as any} 
                  size={28} 
                  color={icon === iconName ? colors.card : colors.primary} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={[styles.closePickerButton, { backgroundColor: colors.background }]}
            onPress={() => setShowIconPicker(false)}
          >
            <Text style={[styles.closePickerText, { color: colors.primary }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderColorPicker = () => (
    <Modal
      visible={showColorPicker}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowColorPicker(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text style={[styles.pickerTitle, { color: colors.text }]}>Select a Color</Text>
          <ScrollView 
            contentContainerStyle={styles.colorsContainer}
            showsVerticalScrollIndicator={false}
          >
            {COLORS.map((colorOption) => (
              <TouchableOpacity
                key={colorOption}
                style={[
                  styles.colorOption,
                  { backgroundColor: colorOption },
                  color === colorOption && [styles.selectedColor, { borderColor: colors.primary }]
                ]}
                onPress={() => {
                  setColor(colorOption);
                  setShowColorPicker(false);
                }}
              />
            ))}
          </ScrollView>
          <TouchableOpacity
            style={[styles.closePickerButton, { backgroundColor: colors.background }]}
            onPress={() => setShowColorPicker(false)}
          >
            <Text style={[styles.closePickerText, { color: colors.primary }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const styles = createStyles(colors);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Habit Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Drink water, Read a book"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add a short description"
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Frequency</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={frequency}
              onValueChange={(itemValue) => {
                setFrequency(itemValue);
                if (itemValue !== 'weekly') {
                  setDaysOfWeek([]);
                }
              }}
            >
              <Picker.Item label="Daily" value="daily" />
              <Picker.Item label="Weekly" value="weekly" />
              <Picker.Item label="Custom" value="custom" />
            </Picker>
          </View>
        </View>

        {frequency === 'weekly' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Days of the Week</Text>
            <View style={styles.daysContainer}>
              {DAYS_OF_WEEK.map((day) => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dayButton,
                    daysOfWeek.includes(day.value) && {
                      backgroundColor: color,
                      borderColor: color,
                    },
                  ]}
                  onPress={() => toggleDay(day.value)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      daysOfWeek.includes(day.value) && { color: '#fff' },
                    ]}
                  >
                    {day.label[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Target Count (per day)</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setTargetCount(Math.max(1, targetCount - 1))}
              disabled={targetCount <= 1}
            >
              <Ionicons name="remove" size={20} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.counterText}>{targetCount}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setTargetCount(targetCount + 1)}
            >
              <Ionicons name="add" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={setCategory}
              enabled={allCategories.length > 0}
            >
              {allCategories.map((cat) => (
                <Picker.Item 
                  key={cat.id} 
                  label={cat.name} 
                  value={cat.id} 
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Icon</Text>
          <TouchableOpacity 
            style={styles.iconPreview}
            onPress={() => setShowIconPicker(true)}
          >
            <View 
              style={[
                styles.iconPreviewBox,
                { backgroundColor: `${color}20` }
              ]}
            >
              <Ionicons name={icon as any} size={28} color={color} />
            </View>
            <Text style={styles.iconPreviewText}>Tap to change icon</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Color</Text>
          <TouchableOpacity 
            style={styles.colorPreview}
            onPress={() => setShowColorPicker(true)}
          >
            <View style={[styles.colorPreviewBox, { backgroundColor: color }]} />
            <Text style={styles.colorPreviewText}>Tap to change color</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, { backgroundColor: color }]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditMode ? 'Update Habit' : 'Create Habit'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderIconPicker()}
      {renderColorPicker()}
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: typeof themes.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  iconPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconPreviewBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconPreviewText: {
    fontSize: 15,
    color: colors.text,
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorPreviewBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 15,
  },
  colorPreviewText: {
    fontSize: 15,
    color: colors.subtext,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: colors.background,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    marginLeft: 10,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff', // Using white as the contrast color for primary
    fontSize: 16,
    fontWeight: '600',
  },

  // Picker Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: colors.text,
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  iconButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    margin: 8,
    backgroundColor: colors.background,
  },
  selectedIcon: {
    backgroundColor: colors.primary,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#4a6fa5',
    transform: [{ scale: 1.1 }],
  },
  closePickerButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  closePickerText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddEditHabitScreen;
