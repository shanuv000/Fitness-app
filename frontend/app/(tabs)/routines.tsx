import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Alert, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoutines, createRoutine } from '../../services/api';
import GlassCard from '../../components/GlassCard';

interface Routine {
    _id?: string;
    id?: string;
    name: string;
    exercises?: any[];
}

export default function Routines() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newRoutineName, setNewRoutineName] = useState('');

    useEffect(() => {
        loadRoutines();
    }, []);

    const [refreshing, setRefreshing] = useState(false);

    const loadRoutines = async () => {
        const data = await getRoutines();
        setRoutines(data);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadRoutines();
        setRefreshing(false);
    }, []);

    const handleCreateRoutine = async () => {
        if (!newRoutineName) return;
        const result = await createRoutine({ name: newRoutineName, exercises: [] });
        if (result) {
            setModalVisible(false);
            setNewRoutineName('');
            loadRoutines();
        } else {
            Alert.alert('Error', 'Failed to create routine');
        }
    };

    return (
        <View className="flex-1 bg-background">
            <View className="pt-12 pb-4 px-4 bg-background border-b border-white/5">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-white text-3xl font-heading">Routines</Text>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        className="bg-primary p-2 rounded-full"
                    >
                        <Ionicons name="add" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <Text className="text-gray-400 font-body">Manage your workout plans</Text>
            </View>

            <FlatList
                data={routines}
                keyExtractor={(item, index) => item._id || item.id || index.toString()}
                renderItem={({ item: routine }) => (
                    <TouchableOpacity activeOpacity={0.8}>
                        <GlassCard className="mb-4 flex-row justify-between items-center p-5">
                            <View>
                                <Text className="text-white text-xl font-heading mb-1">{routine.name}</Text>
                                <Text className="text-gray-400 text-sm font-body">{routine.exercises?.length || 0} Exercises</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                        </GlassCard>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ccff00" />
                }
                ListEmptyComponent={
                    <View className="items-center justify-center mt-20">
                        <Ionicons name="clipboard-outline" size={64} color="#374151" />
                        <Text className="text-gray-500 mt-4 text-lg font-heading">No routines yet</Text>
                        <Text className="text-gray-600 text-sm font-body">Create one to get started!</Text>
                    </View>
                }
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-surface p-6 rounded-t-3xl border-t border-white/10">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-xl font-heading">New Routine</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-gray-400 mb-2 font-body">Routine Name</Text>
                        <TextInput
                            className="bg-background text-white p-4 rounded-xl mb-4 border border-white/10 font-body"
                            placeholder="e.g. Push Day"
                            placeholderTextColor="#666"
                            value={newRoutineName}
                            onChangeText={setNewRoutineName}
                        />

                        <TouchableOpacity onPress={handleCreateRoutine} className="bg-primary rounded-xl p-4 items-center mt-4">
                            <Text className="text-black font-bold text-lg font-heading">Create Routine</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
