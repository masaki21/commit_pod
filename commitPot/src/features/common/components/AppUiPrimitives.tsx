import React from 'react';
import { Text, View } from 'react-native';

type ProgressBarProps = {
  current: number;
  total: number;
  styles: any;
};

type CardProps = {
  children: React.ReactNode;
  style?: object;
  styles: any;
};

type SectionTitleProps = {
  children: React.ReactNode;
  subtitle?: string;
  styles: any;
};

export function AppProgressBar({ current, total, styles }: ProgressBarProps) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${(current / total) * 100}%` }]} />
    </View>
  );
}

export function AppCard({ children, style, styles }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function AppSectionTitle({ children, subtitle, styles }: SectionTitleProps) {
  return (
    <View style={styles.sectionTitleWrap}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}
