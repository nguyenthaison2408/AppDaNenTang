/// <reference types="react" />

declare module 'react-native' {
  import * as React from 'react';

  export interface ViewProps {
    style?: any;
    children?: React.ReactNode;
  }

  export interface TextProps {
    style?: any;
    numberOfLines?: number;
    children?: React.ReactNode;
  }

  export interface TextInputProps {
    style?: any;
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    keyboardType?: string;
    secureTextEntry?: boolean;
    autoCapitalize?: string;
  }

  export interface TouchableOpacityProps {
    style?: any;
    onPress?: (event: any) => void;
    activeOpacity?: number;
    disabled?: boolean;
    children?: React.ReactNode;
  }

  export interface ImageProps {
    source: { uri: string } | number;
    style?: any;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  }

  export interface ScrollViewProps {
    style?: any;
    contentContainerStyle?: any;
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    children?: React.ReactNode;
  }

  export interface ModalProps {
    visible?: boolean;
    transparent?: boolean;
    animationType?: 'none' | 'slide' | 'fade';
    onRequestClose?: () => void;
    children?: React.ReactNode;
  }

  export interface ListRenderItemInfo<ItemT> {
    item: ItemT;
    index: number;
    separators?: any;
  }

  export type ListRenderItem<ItemT> = (info: ListRenderItemInfo<ItemT>) => React.ReactElement | null;

  export interface FlatListProps<ItemT> {
    data: readonly ItemT[] | null | undefined;
    renderItem: (info: { item: ItemT; index: number }) => React.ReactElement | null;
    keyExtractor?: (item: ItemT, index?: number) => string;
    getItemLayout?: (data: any, index: number) => { length: number; offset: number; index: number };
    initialNumToRender?: number;
    maxToRenderPerBatch?: number;
    windowSize?: number;
    removeClippedSubviews?: boolean;
    showsVerticalScrollIndicator?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    contentContainerStyle?: any;
    ListEmptyComponent?: React.ReactNode | React.ComponentType<any> | null;
    style?: any;
  }

  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;
  export const TextInput: React.FC<TextInputProps>;
  export const TouchableOpacity: React.FC<TouchableOpacityProps>;
  export const Image: React.FC<ImageProps>;
  export const ScrollView: React.FC<ScrollViewProps>;
  export const Modal: React.FC<ModalProps>;
  export const SafeAreaView: React.FC<ViewProps>;
  export function FlatList<ItemT>(props: FlatListProps<ItemT>): React.ReactElement;

  export const StyleSheet: {
    create: <T extends Record<string, any>>(styles: T) => T;
  };

  export const Platform: {
    OS: 'ios' | 'android' | 'web';
    select: <T>(obj: { ios?: T; android?: T; web?: T; default?: T }) => T;
  };

  export const Alert: {
    alert: (title: string, message?: string, buttons?: any[]) => void;
  };
}

