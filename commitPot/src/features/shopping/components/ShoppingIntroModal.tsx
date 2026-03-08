import React, { memo } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { ChefHat } from 'lucide-react-native';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type ShoppingIntroModalProps = {
  t: TFunc;
  styles: any;
  visible: boolean;
  skipChecked: boolean;
  onRequestClose: () => void;
  onToggleSkip: () => void;
  onConfirm: () => void;
};

const ShoppingIntroModalComponent = ({
  t,
  styles,
  visible,
  skipChecked,
  onRequestClose,
  onToggleSkip,
  onConfirm,
}: ShoppingIntroModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalTitleRow}>
            <ChefHat size={16} color="#f97316" strokeWidth={2.5} />
            <Text style={styles.modalTitle}>{t('ui.modal_notice_title')}</Text>
          </View>
          <Text style={styles.modalBody}>{t('ui.modal_shop_done_body')}</Text>
          <Pressable style={styles.modalCheckRow} onPress={onToggleSkip}>
            <View style={[styles.modalCheckBox, skipChecked && styles.modalCheckBoxActive]} />
            <Text style={styles.modalCheckLabel}>{t('ui.modal_hide_next_time')}</Text>
          </Pressable>
          <Pressable style={styles.modalButton} onPress={onConfirm}>
            <Text style={styles.modalButtonText}>{t('ui.ok')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export const ShoppingIntroModal = memo(ShoppingIntroModalComponent);
