import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withRepeat,
    Easing,
    FadeIn,
    FadeOut
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface GenerateButtonProps {
    onPress?: () => void;
    isGenerating?: boolean;
}

export default function GenerateButton({ onPress, isGenerating = false }: GenerateButtonProps) {
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (isGenerating) {
            rotation.value = withRepeat(
                withTiming(360, { duration: 2000, easing: Easing.linear }),
                -1
            );
        } else {
            rotation.value = 0; // Reset or stop smoothly
        }
    }, [isGenerating]);

    const iconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isGenerating}
            className="w-full"
        >
            <LinearGradient
                colors={['#2563eb', '#4f46e5']} // Blue-600 to Indigo-600
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-xl p-[1px]" // Border gradient effect if needed, or just background
            >
                <View className="bg-gray-900/50 rounded-xl px-6 py-4 flex-row items-center justify-center space-x-3 backdrop-blur-sm">
                    <Animated.View style={iconStyle}>
                        <Ionicons name="sparkles" size={20} color="#60a5fa" />
                    </Animated.View>

                    <View className="h-6 justify-center">
                        {isGenerating ? (
                            <Animated.Text
                                entering={FadeIn.duration(300)}
                                exiting={FadeOut.duration(300)}
                                className="text-white font-bold text-lg tracking-wider"
                            >
                                Generating...
                            </Animated.Text>
                        ) : (
                            <Animated.Text
                                entering={FadeIn.duration(300)}
                                exiting={FadeOut.duration(300)}
                                className="text-white font-bold text-lg tracking-wider"
                            >
                                Generate
                            </Animated.Text>
                        )}
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}
