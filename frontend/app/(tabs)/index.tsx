import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getWorkouts } from '../../services/api';
import GenerateButton from '../../components/GenerateButton';
import BrandLogo from '../../components/BrandLogo';
import GlassCard from '../../components/GlassCard';

export default function Dashboard() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [recentWorkouts, setRecentWorkouts] = useState([]);

    useEffect(() => {
        loadRecentWorkouts();
    }, []);

    const loadRecentWorkouts = async () => {
        const data = await getWorkouts();
        setRecentWorkouts(data.slice(0, 3)); // Show top 3
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate async action
        setTimeout(() => {
            setIsGenerating(false);
        }, 3000);
    };
    return (
        <ScrollView className="flex-1 bg-background">
            {/* Header Section */}
            <View className="pt-12 pb-6 px-6 bg-background">
                <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-row items-center space-x-4">
                        <BrandLogo size={80} />
                        <View>
                            <Text className="text-gray-400 text-sm font-body font-medium uppercase tracking-wider">Welcome Back</Text>
                            <Text className="text-white text-3xl font-heading mt-1">Let's Crush It! 💪</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="bg-surface p-2 rounded-full border border-white/10">
                        <Ionicons name="notifications-outline" size={24} color="#ccff00" />
                    </TouchableOpacity>
                </View>

                {/* Weekly Progress Card */}
                <GlassCard className="mb-8">
                    <View className="flex-row justify-between items-start mb-4">
                        <View>
                            <Text className="text-white text-lg font-heading">Weekly Progress</Text>
                            <Text className="text-gray-400 text-sm font-body">3 of 5 workouts completed</Text>
                        </View>
                        <View className="bg-primary/20 px-3 py-1 rounded-full">
                            <Text className="text-primary font-bold text-xs">60%</Text>
                        </View>
                    </View>
                    <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <LinearGradient
                            colors={['#ccff00', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="h-full w-[60%]"
                        />
                    </View>
                    <View className="flex-row justify-between mt-4">
                        <View className="items-center">
                            <Text className="text-gray-400 text-xs font-body">Mon</Text>
                            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mt-1">
                                <Ionicons name="checkmark" size={16} color="black" />
                            </View>
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-400 text-xs font-body">Tue</Text>
                            <View className="w-8 h-8 rounded-full bg-surface border border-white/10 items-center justify-center mt-1">
                                <Text className="text-gray-500 text-xs">-</Text>
                            </View>
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-400 text-xs font-body">Wed</Text>
                            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mt-1">
                                <Ionicons name="checkmark" size={16} color="black" />
                            </View>
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-400 text-xs font-body">Thu</Text>
                            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mt-1">
                                <Ionicons name="checkmark" size={16} color="black" />
                            </View>
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-400 text-xs font-body">Fri</Text>
                            <View className="w-8 h-8 rounded-full bg-surface border border-white/10 items-center justify-center mt-1">
                                <Text className="text-gray-500 text-xs">-</Text>
                            </View>
                        </View>
                    </View>
                </GlassCard>

                {/* Quick Actions */}
                <Text className="text-white text-xl font-heading mb-4">Quick Actions</Text>

                <View className="mb-6">
                    <GenerateButton
                        isGenerating={isGenerating}
                        onPress={handleGenerate}
                    />
                </View>

                <View className="flex-row justify-between mb-8">
                    <Link href="/track" asChild>
                        <TouchableOpacity className="w-[48%]">
                            <GlassCard className="items-center py-6">
                                <View className="bg-primary/20 w-12 h-12 rounded-full items-center justify-center mb-3">
                                    <Ionicons name="play" size={24} color="#ccff00" />
                                </View>
                                <Text className="text-white font-heading text-lg">Start Workout</Text>
                                <Text className="text-gray-400 text-xs mt-1 font-body">Log a new session</Text>
                            </GlassCard>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/(tabs)/exercises" asChild>
                        <TouchableOpacity className="w-[48%]">
                            <GlassCard className="items-center py-6">
                                <View className="bg-secondary/20 w-12 h-12 rounded-full items-center justify-center mb-3">
                                    <Ionicons name="search" size={24} color="#8b5cf6" />
                                </View>
                                <Text className="text-white font-heading text-lg">Discover</Text>
                                <Text className="text-gray-400 text-xs mt-1 font-body">Find new exercises</Text>
                            </GlassCard>
                        </TouchableOpacity>
                    </Link>
                </View>

                {/* Recent Activity */}
                <Text className="text-white text-xl font-heading mb-4">Recent Activity</Text>
                <View className="pb-20">
                    {recentWorkouts.length > 0 ? (
                        recentWorkouts.map((workout: any) => (
                            <GlassCard key={workout._id} className="mb-3 flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 rounded-xl bg-surface items-center justify-center mr-4 border border-white/5">
                                        <Ionicons name="barbell" size={20} color="#ccff00" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-heading text-base">{workout.name}</Text>
                                        <Text className="text-gray-400 text-xs font-body">
                                            {new Date(workout.date).toLocaleDateString()} • {workout.duration ? Math.floor(workout.duration / 60) : 0} mins
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                            </GlassCard>
                        ))
                    ) : (
                        <Text className="text-gray-500 font-body">No recent activity</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
