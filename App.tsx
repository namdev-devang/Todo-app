import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
  }, [tasks]);

  const loadTasks = async () => {
    const saved = await AsyncStorage.getItem('TASKS');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  };

  const handleAddOrUpdate = () => {
    if (!task.trim()) return;

    if (editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex] = task;
      setTasks(updated);
      setEditIndex(null);
    } else {
      setTasks([...tasks, task]);
    }

    setTask('');
  };

  const handleDelete = index => {
    Alert.alert('Confirm', 'Delete this task?', [
      {text: 'Cancel'},
      {
        text: 'Delete',
        onPress: () => {
          const updated = tasks.filter((_, i) => i !== index);
          setTasks(updated);
        },
      },
    ]);
  };

  const handleEdit = index => {
    setTask(tasks[index]);
    setEditIndex(index);
  };

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-8">
      <Text className="text-3xl font-bold text-center mb-6 text-gray-800">
        📝 ToDo App
      </Text>

      <View className="flex-row items-center bg-white rounded-xl shadow-md p-3 mb-6">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2 text-base bg-gray-50"
          placeholder="Enter your task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity
          onPress={handleAddOrUpdate}
          className="bg-blue-600 px-4 py-2 rounded-lg">
          <Text className="text-white font-semibold text-base">
            {editIndex !== null ? 'Update' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
        renderItem={({item, index}) => (
          <View className="flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-3">
            <Text className="text-base text-gray-800 flex-1">{item}</Text>
            <View className="flex-row space-x-3 ml-4">
              <TouchableOpacity onPress={() => handleEdit(index)}>
                <Icon name="edit" size={22} color="#f59e0b" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(index)}>
                <Icon name="delete" size={22} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default App;
