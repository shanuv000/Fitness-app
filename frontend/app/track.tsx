import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { createWorkout, getExercises, searchExercises, importExercise } from '../services/api';
import GlassCard from '../components/GlassCard';



interface Exercise {
    _id?: string;
    id?: string;
    name: string;
    category?: string;
    bodyPart?: string;
    muscleGroup?: string;
    target?: string;
    imageUrl?: string;
    source?: string;
}

interface WorkoutExercise {
    name: string;
    sets: string;
    reps: string;
    weight: string;
}

export default function TrackWorkout() {
    const router = useRouter();
    const [workoutName, setWorkoutName] = useState('');
    const [exercises, setExercises] = useState<WorkoutExercise[]>([{ name: '', sets: '', reps: '', weight: '' }]);
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        loadExercises();
        const interval = setInterval(() => {
            setTimer(t => t + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                performSearch();
            } else {
                loadExercises();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const loadExercises = async () => {
        const data = await getExercises();
        setAvailableExercises(data);
    };

    const performSearch = async () => {
        setIsSearching(true);
        const results = await searchExercises(searchQuery);
        setAvailableExercises(results);
        setIsSearching(false);
    };

    const addExercise = () => {
        setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
    };

    const updateExercise = (index: number, field: keyof WorkoutExercise, value: string) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    const openExerciseSelector = (index: number) => {
        setCurrentExerciseIndex(index);
        setModalVisible(true);
    };

    const selectExercise = async (exercise: Exercise) => {
        if (currentExerciseIndex !== null) {
            let exerciseName = exercise.name;

            if (exercise.source === 'external') {
                const imported = await importExercise(exercise);
                if (imported) {
                    exerciseName = imported.name;
                    loadExercises();
                } else {
                    Alert.alert('Error', 'Failed to import exercise');
                    return;
                }
            }

            updateExercise(currentExerciseIndex, 'name', exerciseName);
            setModalVisible(false);
            setCurrentExerciseIndex(null);
            setSearchQuery('');
        }
    };

    const handleSave = async () => {
        if (!workoutName) {
            Alert.alert('Error', 'Please enter a workout name');
            return;
        }

        const formattedExercises = exercises.map(ex => ({
            name: ex.name,
            sets: parseInt(ex.sets) || 0,
            reps: parseInt(ex.reps) || 0,
            weight: parseFloat(ex.weight) || 0,
        }));

        const workoutData = {
            name: workoutName,
            exercises: formattedExercises,
            duration: timer,
        };

        const result = await createWorkout(workoutData);
        if (result && !result.error) {
            Alert.alert('Success', 'Workout saved!');
            router.back();
        } else {
            Alert.alert('Error', result?.error || 'Failed to save workout');
        }
    };

    return (
        <View className="flex-1 bg-background">
            <View className="pt-12 pb-6 px-6 border-b border-white/5 bg-background">
                <View className="flex-row justify-between items-center mb-4">
                    <TouchableOpacity onPress={() => router.back()} className="bg-surface p-2 rounded-full border border-white/10">
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-gray-400 text-xs uppercase tracking-widest font-bold font-body">Duration</Text>
                        <Text className="text-primary text-3xl font-variant-numeric font-bold tracking-wider font-heading">{formatTime(timer)}</Text>
                    </View>
                    <TouchableOpacity onPress={handleSave} className="bg-primary p-2 rounded-full">
                        <Ionicons name="checkmark" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <TextInput
                    className="text-white text-3xl font-bold bg-transparent font-heading"
                    placeholder="Workout Name"
                    placeholderTextColor="#64748b"
                    value={workoutName}
                    onChangeText={setWorkoutName}
                />
            </View>

            <ScrollView className="flex-1 p-4">
                {exercises.map((exercise, index) => (
                    <View key={index} className="bg-gray-800 p-5 rounded-2xl mb-4 border border-gray-700 shadow-sm">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-blue-400 font-bold text-xs uppercase tracking-wider">Exercise {index + 1}</Text>
                            <TouchableOpacity onPress={() => {
                                const newExercises = exercises.filter((_, i) => i !== index);
                                setExercises(newExercises);
                            }}>
                                <Ionicons name="trash-outline" size={18} color="#ef4444" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => openExerciseSelector(index)}
                            className="bg-gray-900 p-4 rounded-xl mb-4 border border-gray-700 flex-row justify-between items-center"
                        >
                            <Text className={exercise.name ? "text-white text-lg font-bold" : "text-gray-500 text-lg"}>
                                {exercise.name || "Select Exercise"}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#6b7280" />
                        </TouchableOpacity>

                        <View className="flex-row justify-between space-x-3">
                            <View className="flex-1">
                                <Text className="text-gray-500 text-xs mb-1 ml-1">Sets</Text>
                                <TextInput
                                    className="bg-gray-900 text-white p-3 rounded-xl text-center font-bold text-lg border border-gray-700"
                                    placeholder="0"
                                    placeholderTextColor="#4b5563"
                                    keyboardType="numeric"
                                    value={exercise.sets}
                                    onChangeText={(text) => updateExercise(index, 'sets', text)}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-500 text-xs mb-1 ml-1">Reps</Text>
                                <TextInput
                                    className="bg-gray-900 text-white p-3 rounded-xl text-center font-bold text-lg border border-gray-700"
                                    placeholder="0"
                                    placeholderTextColor="#4b5563"
                                    keyboardType="numeric"
                                    value={exercise.reps}
                                    onChangeText={(text) => updateExercise(index, 'reps', text)}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-500 text-xs mb-1 ml-1">Weight (kg)</Text>
                                <TextInput
                                    className="bg-gray-900 text-white p-3 rounded-xl text-center font-bold text-lg border border-gray-700"
                                    placeholder="0"
                                    placeholderTextColor="#4b5563"
                                    keyboardType="numeric"
                                    value={exercise.weight}
                                    onChangeText={(text) => updateExercise(index, 'weight', text)}
                                />
                            </View>
                        </View>
                    </View>
                ))}

                <TouchableOpacity
                    onPress={addExercise}
                    className="bg-gray-800/50 p-4 rounded-2xl mb-20 border-2 border-dashed border-gray-700 items-center justify-center active:bg-gray-800"
                >
                    <Ionicons name="add-circle-outline" size={32} color="#6b7280" />
                    <Text className="text-gray-400 font-bold mt-2">Add Exercise</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-gray-900 h-[80%] rounded-t-3xl border-t border-gray-700 overflow-hidden">
                        <View className="p-4 border-b border-gray-800 flex-row justify-between items-center">
                            <Text className="text-white text-xl font-bold">Select Exercise</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>

                        <View className="p-4 border-b border-gray-800">
                            <View className="flex-row items-center bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
                                <Ionicons name="search" size={20} color="#9ca3af" />
                                <TextInput
                                    className="flex-1 text-white ml-2"
                                    placeholder="Search library..."
                                    placeholderTextColor="#9ca3af"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoFocus
                                />
                            </View>
                        </View>

                        {isSearching ? (
                            <View className="flex-1 justify-center items-center">
                                <ActivityIndicator size="large" color="#2563eb" />
                            </View>
                        ) : (
                            <ScrollView className="flex-1 p-4">
                                {availableExercises.map((ex) => (
                                    <TouchableOpacity
                                        key={ex._id || ex.id}
                                        onPress={() => selectExercise(ex)}
                                        className="bg-gray-800 p-4 rounded-2xl mb-3 border border-gray-700 flex-row items-center"
                                    >
                                        {ex.imageUrl ? (
                                            <Image
                                                source={{ uri: ex.imageUrl }}
                                                className="w-12 h-12 rounded-lg mr-4 bg-gray-700"
                                                contentFit="cover"
                                            />
                                        ) : (
                                            <View className="w-12 h-12 rounded-lg mr-4 bg-gray-700 items-center justify-center">
                                                <Ionicons name="barbell" size={20} color="#6b7280" />
                                            </View>
                                        )}
                                        <View className="flex-1">
                                            <Text className="text-white font-bold text-lg">{ex.name}</Text>
                                            <Text className="text-gray-400 text-xs">{ex.muscleGroup || ex.target} • {ex.category || ex.bodyPart}</Text>
                                        </View>
                                        {ex.source === 'external' && (
                                            <View className="bg-blue-900/50 px-2 py-1 rounded border border-blue-800">
                                                <Text className="text-blue-400 text-[10px] font-bold">IMPORT</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                                <View className="h-20" />
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
