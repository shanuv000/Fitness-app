import React from 'react';
import { View, Image } from 'react-native';
import { Link } from 'expo-router';

interface BrandLogoProps {
    size?: number;
    href?: any;
}

export default function BrandLogo({ size = 100, href = "/" }: BrandLogoProps) {
    return (
        <Link href={href} asChild>
            <View
                className="items-center justify-center rounded-xl overflow-hidden"
                style={{ width: size, height: size / 2.5 }}
            >
                <Image
                    source={require('../assets/images/maze_logo.png')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                />
            </View>
        </Link>
    );
}
