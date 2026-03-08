import React, { memo } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ShoppingBag } from 'lucide-react-native';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type BuilderModalsProps = {
  t: TFunc;
  styles: any;
  fiveServingsPotImage: any;
  showFiveServingsModal: boolean;
  skipFiveServingsModal: boolean;
  showPlanConfirm: boolean;
  skipPlanConfirm: boolean;
  onRequestCloseFiveServings: () => void;
  onToggleSkipFiveServings: () => void;
  onConfirmFiveServings: () => void | Promise<void>;
  onRequestClosePlanConfirm: () => void;
  onToggleSkipPlanConfirm: () => void;
  onConfirmPlan: () => void | Promise<void>;
};

const BuilderModalsComponent = ({
  t,
  styles,
  fiveServingsPotImage,
  showFiveServingsModal,
  skipFiveServingsModal,
  showPlanConfirm,
  skipPlanConfirm,
  onRequestCloseFiveServings,
  onToggleSkipFiveServings,
  onConfirmFiveServings,
  onRequestClosePlanConfirm,
  onToggleSkipPlanConfirm,
  onConfirmPlan,
}: BuilderModalsProps) => {
  return (
    <>
      <Modal
        visible={showFiveServingsModal}
        transparent
        animationType="fade"
        onRequestClose={onRequestCloseFiveServings}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('ui.modal_attention_title')}</Text>
            <Text style={styles.modalBody}>{t('ui.modal_five_servings_body')}</Text>
            <Image source={fiveServingsPotImage} style={styles.modalImage} contentFit="cover" transition={150} />
            <Pressable style={styles.modalCheckRow} onPress={onToggleSkipFiveServings}>
              <View style={[styles.modalCheckBox, skipFiveServingsModal && styles.modalCheckBoxActive]} />
              <Text style={styles.modalCheckLabel}>{t('ui.modal_hide_next_time')}</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={onConfirmFiveServings}>
              <Text style={styles.modalButtonText}>{t('ui.ok')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPlanConfirm}
        transparent
        animationType="fade"
        onRequestClose={onRequestClosePlanConfirm}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('ui.modal_confirm_title')}</Text>
            <Text style={styles.modalBody}>{t('ui.modal_plan_saved')}</Text>
            <View style={styles.modalShopRow}>
              <Text style={styles.modalBody}>{t('ui.modal_shop_prefix')}</Text>
              <View style={styles.modalShopBadge}>
                <ShoppingBag size={14} color="#f97316" strokeWidth={2.5} />
                <Text style={styles.modalShopLabel}>{t('ui.shop_label')}</Text>
              </View>
              <Text style={styles.modalBody}>{t('ui.modal_shop_suffix')}</Text>
            </View>
            <Pressable style={styles.modalCheckRow} onPress={onToggleSkipPlanConfirm}>
              <View style={[styles.modalCheckBox, skipPlanConfirm && styles.modalCheckBoxActive]} />
              <Text style={styles.modalCheckLabel}>{t('ui.modal_hide_next_time')}</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={onConfirmPlan}>
              <Text style={styles.modalButtonText}>{t('ui.modal_go_shop')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export const BuilderModals = memo(BuilderModalsComponent);
