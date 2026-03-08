import React from 'react';
import {
  AppCard,
  AppProgressBar,
  AppSectionTitle,
} from '../../../features/common/components/AppUiPrimitives';

type AppStyles = Record<string, any>;

export const parseNumericInput = (text: string) => {
  const digits = text.replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
};

export function createRouteUiAdapters(styles: AppStyles) {
  const ProgressBar = ({ current, total }: { current: number; total: number }) => (
    <AppProgressBar current={current} total={total} styles={styles} />
  );

  const Card = ({ children, style }: { children: React.ReactNode; style?: object }) => (
    <AppCard styles={styles} style={style}>
      {children}
    </AppCard>
  );

  const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
    <AppSectionTitle styles={styles} subtitle={subtitle}>
      {children}
    </AppSectionTitle>
  );

  return { ProgressBar, Card, SectionTitle };
}
