import React from 'react';
import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps extends ViewProps {
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    children: React.ReactNode;
}

export default function GlassCard({
    children,
    intensity = 30,
    tint = 'dark',
    style,
    className,
    ...props
}: GlassCardProps) {
    return (
        <View
            className={`rounded-2xl overflow-hidden border border-white/10 shadow-lg ${className}`}
            style={style}
            {...props}
        >
            <BlurView intensity={intensity} tint={tint} className="p-0">
                <View className="bg-white/5 p-4">
                    {children}
                </View>
            </BlurView>
        </View>
    );
}
