import React, { memo } from 'react';
import { Text, View } from 'react-native';

type ShoppingListCardProps = {
  styles: any;
  isCompactScreen: boolean;
  title: string;
  amount: string;
  detail?: string;
};

const ShoppingListCardComponent = ({ styles, isCompactScreen, title, amount, detail }: ShoppingListCardProps) => {
  return (
    <View style={[styles.listCard, isCompactScreen && styles.listCardCompact]}>
      <View style={styles.listCardContent}>
        <Text style={styles.listCardTitle} numberOfLines={detail ? 3 : 2}>
          {title}
        </Text>
        {detail ? (
          <Text style={styles.listCardSubtext} numberOfLines={2}>
            {detail}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.listCardHint, isCompactScreen && styles.listCardHintCompact]}>{amount}</Text>
    </View>
  );
};

export const ShoppingListCard = memo(ShoppingListCardComponent);
