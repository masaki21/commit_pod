import React, { memo } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Dumbbell } from 'lucide-react-native';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type SplashScreenProps = {
  t: TFunc;
  styles: any;
  isWeb: boolean;
  wrapContent: (children: React.ReactNode) => React.ReactNode;
};

const SplashScreenComponent = ({ t, styles, isWeb, wrapContent }: SplashScreenProps) => {
  return (
    <SafeAreaView style={[styles.safeArea, styles.splash, isWeb && styles.webRoot]}>
      {wrapContent(
        <>
          <View style={styles.splashIconWrap}>
            <View style={styles.splashGlow} />
            <Dumbbell size={96} color="#f97316" strokeWidth={3} />
          </View>
          <Text style={styles.splashTitle}>
            COMMIT <Text style={styles.splashAccent}>POT</Text>
          </Text>
          <Text style={styles.splashSubtitle}>{t('ui.subtitle')}</Text>
        </>
      )}
    </SafeAreaView>
  );
};

export const SplashScreen = memo(SplashScreenComponent);
