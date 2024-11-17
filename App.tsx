import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';

type Task = {
  id: string;
  text: string;
  completed: boolean;
  animationValue: Animated.Value;
};

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const addTask = () => {
    if (task.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: task,
        completed: false,
        animationValue: new Animated.Value(0),
      };
      setTasks([...tasks, newTask]);
      setTask('');

      // Trigger fade-in animation
      Animated.timing(newTask.animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((item) => item.id === taskId);
    if (taskToDelete) {
      Animated.timing(taskToDelete.animationValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTasks(tasks.filter((item) => item.id !== taskId));
      });
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((item) =>
        item.id === taskId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const startEditingTask = (taskId: string, currentText: string) => {
    setEditingTaskId(taskId);
    setEditingText(currentText);
  };

  const updateTask = () => {
    if (editingTaskId && editingText.trim()) {
      setTasks(
        tasks.map((item) =>
          item.id === editingTaskId ? { ...item, text: editingText } : item
        )
      );
      setEditingTaskId(null);
      setEditingText('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <Animated.View
            style={[
              styles.taskContainer,
              {
                opacity: item.animationValue,
                transform: [
                  {
                    translateX: item.animationValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
              <Text style={item.completed ? styles.tick : styles.noTick}>
                {item.completed ? '✔' : ''}
              </Text>
            </TouchableOpacity>
            {editingTaskId === item.id ? (
              <TextInput
                style={[styles.taskText, styles.editInput]}
                value={editingText}
                onChangeText={(text) => setEditingText(text)}
                onBlur={updateTask}
                autoFocus
              />
            ) : (
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedTaskText,
                ]}
                onPress={() => toggleTaskCompletion(item.id)}
              >
                {item.text}
              </Text>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => startEditingTask(item.id, item.text)}
            >
              <Text style={styles.editSymbol}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteButton}>X</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#5C5CFF',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  tick: {
    fontSize: 18,
    color: 'light green',
    marginRight: 10,
  },
  noTick: {
    fontSize: 18,
    marginRight: 10,
  },
  deleteButton: {
    color: '#FF5C5C',
    fontWeight: 'bold',
    fontSize: 18,
  },
  editButton: {
    marginRight: 10,
  },
  editSymbol: {
    fontSize: 16,
    color: '#5C5CFF',
  },
  editInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#5C5CFF',
    flex: 1,
  },
});
