import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, FlatList, RefreshControl, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { getExercises, createExercise, searchExercises, importExercise } from '../../services/api';
import GlassCard from '../../components/GlassCard';

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

export default function Exercises() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newExercise, setNewExercise] = useState({ name: '', category: 'Strength', muscleGroup: 'Full Body' });

    useEffect(() => {
        loadExercises();
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

    const [refreshing, setRefreshing] = useState(false);

    const loadExercises = async () => {
        const data = await getExercises();
        setExercises(data);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadExercises();
        setRefreshing(false);
    }, []);

    const performSearch = async () => {
        setIsSearching(true);
        const results = await searchExercises(searchQuery);
        setExercises(results);
        setIsSearching(false);
    };

    const handleImport = async (exercise: Exercise) => {
        const result = await importExercise(exercise);
        if (result && !result.error) {
            Alert.alert('Success', 'Exercise imported!');
            performSearch();
        } else {
            Alert.alert('Error', result?.error || 'Failed to import exercise');
        }
    };

    const handleAddExercise = async () => {
        if (!newExercise.name) {
            Alert.alert('Error', 'Please enter an exercise name');
            return;
        }
        const result = await createExercise(newExercise);
        if (result && !result.error) {
            Alert.alert('Success', 'Exercise created!');
            setModalVisible(false);
            setNewExercise({ name: '', category: 'Strength', muscleGroup: 'Full Body' });
            loadExercises();
        } else {
            Alert.alert('Error', result?.error || 'Failed to create exercise');
        }
    };

    return (
        <View className="flex-1 bg-background">
            <View className="pt-12 pb-4 px-4 bg-background">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-white text-3xl font-heading">Exercises</Text>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        className="bg-primary p-2 rounded-full"
                    >
                        <Ionicons name="add" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center bg-surface rounded-xl px-4 py-2 border border-white/10">
                    <Ionicons name="search" size={20} color="#9ca3af" />
                    <TextInput
                        className="flex-1 text-white ml-2 h-10 font-body"
                        placeholder="Search exercises..."
                        placeholderTextColor="#9ca3af"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {isSearching ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#ccff00" />
                </View>
            ) : (
                <FlatList
                    data={exercises}
                    keyExtractor={(item, index) => item._id || item.id || index.toString()}
                    renderItem={({ item: ex }) => (
                        <GlassCard className="mb-3 flex-row justify-between items-center">
                            <View className="flex-1 flex-row items-center">
                                {ex.imageUrl ? (
                                    <Image
                                        source={{ uri: ex.imageUrl }}
                                        className="w-16 h-16 rounded-xl mr-4 bg-surface"
                                        contentFit="cover"
                                        transition={500}
                                    />
                                ) : (
                                    <View className="w-16 h-16 rounded-xl mr-4 bg-surface items-center justify-center border border-white/5">
                                        <Ionicons name="barbell-outline" size={24} color="#6b7280" />
                                    </View>
                                )}
                                <View className="flex-1">
                                    <Text className="text-white text-lg font-heading mb-1">{ex.name}</Text>
                                    <View className="flex-row flex-wrap">
                                        <Text className="text-secondary text-xs bg-secondary/10 px-2 py-1 rounded mr-2 mb-1 overflow-hidden font-body">{ex.category || ex.bodyPart}</Text>
                                        <Text className="text-primary text-xs bg-primary/10 px-2 py-1 rounded mb-1 overflow-hidden font-body">{ex.muscleGroup || ex.target}</Text>
                                    </View>
                                </View>
                            </View>
                            {ex.source === 'external' && (
                                <TouchableOpacity
                                    onPress={() => handleImport(ex)}
                                    className="bg-surface p-2 rounded-full ml-2 border border-white/10"
                                >
                                    <Ionicons name="download-outline" size={20} color="#ccff00" />
                                </TouchableOpacity>
                            )}
                        </GlassCard>
                    )}
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ccff00" />
                    }
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center mt-20">
                            <Text className="text-gray-400 text-lg font-body">No exercises found</Text>
                        </View>
                    }
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-surface p-6 rounded-t-3xl border-t border-white/10">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-xl font-heading">New Exercise</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-gray-400 mb-2 font-body">Name</Text>
                        <TextInput
                            className="bg-background text-white p-4 rounded-xl mb-4 border border-white/10 font-body"
                            placeholder="e.g. Bench Press"
                            placeholderTextColor="#666"
                            value={newExercise.name}
                            onChangeText={(text) => setNewExercise({ ...newExercise, name: text })}
                        />

                        <TouchableOpacity onPress={handleAddExercise} className="bg-primary rounded-xl p-4 items-center mt-4">
                            <Text className="text-black font-bold text-lg font-heading">Create Exercise</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
