import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';

export default function Profile() {
    return (
        <ScrollView className="flex-1 bg-background">
            <View className="items-center pt-12 pb-8 bg-background border-b border-white/5">
                <View className="relative">
                    <View className="w-24 h-24 bg-surface rounded-full items-center justify-center border-4 border-background mb-4 overflow-hidden">
                        <Ionicons name="person" size={48} color="#9ca3af" />
                    </View>
                    <TouchableOpacity className="absolute bottom-4 right-0 bg-primary p-2 rounded-full border-2 border-background">
                        <Ionicons name="camera" size={16} color="black" />
                    </TouchableOpacity>
                </View>
                <Text className="text-white text-2xl font-heading">John Doe</Text>
                <Text className="text-gray-400 font-body">Fitness Enthusiast</Text>
            </View>

            {/* Stats Row */}
            <View className="flex-row justify-between px-6 mb-8 mt-6">
                <GlassCard className="w-[31%] items-center py-4">
                    <Text className="text-primary font-bold text-xl font-heading">12</Text>
                    <Text className="text-gray-400 text-xs mt-1 font-body">Workouts</Text>
                </GlassCard>
                <GlassCard className="w-[31%] items-center py-4">
                    <Text className="text-secondary font-bold text-xl font-heading">75kg</Text>
                    <Text className="text-gray-400 text-xs mt-1 font-body">Weight</Text>
                </GlassCard>
                <GlassCard className="w-[31%] items-center py-4">
                    <Text className="text-accent font-bold text-xl font-heading">5</Text>
                    <Text className="text-gray-400 text-xs mt-1 font-body">Streak</Text>
                </GlassCard>
            </View>

            {/* Menu */}
            <View className="px-6 space-y-4 mb-10">
                <Text className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-2 font-body">Settings</Text>

                <TouchableOpacity activeOpacity={0.8}>
                    <GlassCard className="flex-row items-center justify-between p-4 mb-3">
                        <View className="flex-row items-center">
                            <View className="bg-primary/20 p-2 rounded-lg mr-4">
                                <Ionicons name="person-outline" size={20} color="#ccff00" />
                            </View>
                            <Text className="text-white font-medium font-body">Edit Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                    </GlassCard>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8}>
                    <GlassCard className="flex-row items-center justify-between p-4 mb-3">
                        <View className="flex-row items-center">
                            <View className="bg-secondary/20 p-2 rounded-lg mr-4">
                                <Ionicons name="notifications-outline" size={20} color="#8b5cf6" />
                            </View>
                            <Text className="text-white font-medium font-body">Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                    </GlassCard>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8}>
                    <GlassCard className="flex-row items-center justify-between p-4">
                        <View className="flex-row items-center">
                            <View className="bg-red-500/20 p-2 rounded-lg mr-4">
                                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                            </View>
                            <Text className="text-red-400 font-medium font-body">Log Out</Text>
                        </View>
                    </GlassCard>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
