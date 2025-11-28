import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { getWorkouts } from '../services/api';

export default function History() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWorkouts();
    }, []);

    const loadWorkouts = async () => {
        const data = await getWorkouts();
        setWorkouts(data);
        setLoading(false);
    };

    if (loading) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-900 p-4">
            <Text className="text-white text-2xl font-bold mb-6">Workout History</Text>

            {workouts.map((workout) => (
                <View key={workout._id} className="bg-gray-800 p-4 rounded-xl mb-4">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-white text-lg font-bold">{workout.name}</Text>
                        <Text className="text-gray-400 text-sm">
                            {new Date(workout.date).toLocaleDateString()}
                        </Text>
                    </View>
                    <Text className="text-gray-400 mb-2">{workout.exercises.length} Exercises</Text>
                    <View className="space-y-1">
                        {workout.exercises.map((exLog, idx) => (
                            <View key={idx}>
                                <Text className="text-gray-500 text-sm font-bold">• {exLog.exercise.name}</Text>
                                {exLog.sets.map((set, sIdx) => (
                                    <Text key={sIdx} className="text-gray-600 text-xs ml-2">
                                        Set {set.setNumber}: {set.reps} reps @ {set.weight}kg
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}
