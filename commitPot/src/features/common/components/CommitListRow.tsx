import React, { memo } from 'react';
import { Text, View } from 'react-native';

type CommitListRowProps = {
  styles: any;
  isCompactScreen: boolean;
  title: string;
  amount: string;
  detail?: string;
};

const CommitListRowComponent = ({ styles, isCompactScreen, title, amount, detail }: CommitListRowProps) => {
  return (
    <View style={[styles.listRow, isCompactScreen && styles.listRowCompact]}>
      <View style={styles.listRowContent}>
        <Text style={styles.listLabel} numberOfLines={detail ? 3 : 2}>
          {title}
        </Text>
        {detail ? (
          <Text style={styles.listSecondaryMeta} numberOfLines={2}>
            {detail}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.listValue, isCompactScreen && styles.listValueCompact]}>{amount}</Text>
    </View>
  );
};

export const CommitListRow = memo(CommitListRowComponent);
