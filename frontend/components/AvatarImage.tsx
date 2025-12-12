/**
 * AvatarImage Component
 * Displays user profile picture with fallback to generated avatar
 * Handles network failures and provides consistent avatar experience
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageStyle,
  ViewStyle,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

interface AvatarImageProps {
  uri?: string;
  name: string;
  size: number;
  style?: ViewStyle;
  editable?: boolean;
  onPress?: () => void;
  showEditIcon?: boolean;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  uri,
  name,
  size,
  style,
  editable = false,
  onPress,
  showEditIcon = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Color palette for generated avatars
  const avatarColors = [
    '#6EEB83', // Primary green
    '#FFA500', // Orange
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#9C27B0', // Purple
    '#F44336', // Red
    '#00BCD4', // Cyan
    '#FF9800', // Amber
    '#795548', // Brown
    '#607D8B', // Blue Grey
  ];

  /**
   * Get background color based on user's name
   */
  const getDefaultAvatar = (name: string): string => {
    const nameSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colorIndex = nameSum % avatarColors.length;
    return avatarColors[colorIndex];
  };

  /**
   * Get initials from user's name
   */
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return parts.map(part => part[0]).join('').toUpperCase().slice(0, 2);
  };

  /**
   * Handle image load start
   */
  const handleImageLoadStart = () => {
    if (uri && !imageError) {
      setIsLoading(true);
    }
  };

  /**
   * Handle successful image load
   */
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  /**
   * Handle image load error
   */
  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  /**
   * Handle avatar press
   */
  const handlePress = () => {
    if (editable && onPress) {
      onPress();
    }
  };

  const avatarContainerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: getDefaultAvatar(name),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    ...style,
  };

  const avatarImageStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: Colors.backgroundDark,
  };

  const initialsStyle = {
    fontSize: size * 0.4,
    fontWeight: 'bold' as const,
    color: Colors.textLight,
    fontFamily: 'System',
  };

  const editButtonStyle = {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: size * 0.25,
    height: size * 0.25,
    borderRadius: (size * 0.25) / 2,
    backgroundColor: Colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: Colors.backgroundDark,
  };

  const editIconStyle = {
    fontSize: size * 0.15,
    color: Colors.textLight,
  };

  // Show loading state while image is loading
  if (isLoading) {
    return (
      <View style={avatarContainerStyle}>
        <ActivityIndicator size="small" color={Colors.textLight} />
      </View>
    );
  }

  // Show fallback avatar if there's an error or no URI
  if (imageError || !uri) {
    const content = (
      <>
        <Text style={initialsStyle}>
          {getInitials(name)}
        </Text>
        {editable && showEditIcon && (
          <View style={editButtonStyle}>
            <MaterialIcons name="edit" style={editIconStyle} />
          </View>
        )}
      </>
    );

    if (editable) {
      return (
        <TouchableOpacity
          style={avatarContainerStyle}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          {content}
        </TouchableOpacity>
      );
    }

    return <View style={avatarContainerStyle}>{content}</View>;
  }

  // Show actual image if URI is provided and no errors
  const imageContent = (
    <>
      <Image
        source={{ uri }}
        style={avatarImageStyle}
        onLoadStart={handleImageLoadStart}
        onLoad={handleImageLoad}
        onError={handleImageError}
        resizeMode="cover"
      />
      {editable && showEditIcon && (
        <View style={editButtonStyle}>
          <MaterialIcons name="edit" style={editIconStyle} />
        </View>
      )}
    </>
  );

  if (editable) {
    return (
      <TouchableOpacity
        style={avatarContainerStyle}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {imageContent}
      </TouchableOpacity>
    );
  }

  return <View style={avatarContainerStyle}>{imageContent}</View>;
};

/**
 * Preset avatar sizes for common use cases
 */
export const AvatarSizes = {
  small: 32,
  medium: 48,
  large: 64,
  extraLarge: 96,
  profile: 128,
} as const;

export default AvatarImage;