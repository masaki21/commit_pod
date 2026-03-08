import React from 'react';
import { CheckCircle2, ChefHat, Droplets, Flame, Layers, Scissors, Snowflake } from 'lucide-react-native';

export type CookStep = {
  titleKey: string;
  descriptionKey: string;
  tipKey: string;
  photo: any;
  icon: React.ReactNode;
  bgColor: string;
};

export const COOK_STEPS: CookStep[] = [
  {
    titleKey: 'cook.steps.step1.title',
    descriptionKey: 'cook.steps.step1.description',
    tipKey: 'cook.tips.tip1',
    photo: require('../../../../assets/cook_steps_optimized/step1.jpg'),
    icon: <Flame size={40} color="#dc2626" />,
    bgColor: '#fee2e2',
  },
  {
    titleKey: 'cook.steps.step2.title',
    descriptionKey: 'cook.steps.step2.description',
    tipKey: 'cook.tips.tip2',
    photo: require('../../../../assets/cook_steps_optimized/step2.jpg'),
    icon: <Scissors size={40} color="#16a34a" />,
    bgColor: '#dcfce7',
  },
  {
    titleKey: 'cook.steps.step3.title',
    descriptionKey: 'cook.steps.step3.description',
    tipKey: 'cook.tips.tip3',
    photo: require('../../../../assets/cook_steps_optimized/step3.jpg'),
    icon: <Layers size={40} color="#ea580c" />,
    bgColor: '#ffedd5',
  },
  {
    titleKey: 'cook.steps.step4.title',
    descriptionKey: 'cook.steps.step4.description',
    tipKey: 'cook.tips.tip4',
    photo: require('../../../../assets/cook_steps_optimized/step4.jpg'),
    icon: <ChefHat size={40} color="#dc2626" />,
    bgColor: '#fee2e2',
  },
  {
    titleKey: 'cook.steps.step5.title',
    descriptionKey: 'cook.steps.step5.description',
    tipKey: 'cook.tips.tip5',
    photo: require('../../../../assets/cook_steps_optimized/step5.jpg'),
    icon: <Droplets size={40} color="#2563eb" />,
    bgColor: '#dbeafe',
  },
  {
    titleKey: 'cook.steps.step6.title',
    descriptionKey: 'cook.steps.step6.description',
    tipKey: 'cook.tips.tip6',
    photo: require('../../../../assets/cook_steps_optimized/step6.jpg'),
    icon: <CheckCircle2 size={40} color="#10b981" />,
    bgColor: '#d1fae5',
  },
  {
    titleKey: 'cook.steps.step7.title',
    descriptionKey: 'cook.steps.step7.description',
    tipKey: 'cook.tips.tip7',
    photo: require('../../../../assets/cook_steps_optimized/step7.jpg'),
    icon: <Snowflake size={40} color="#4f46e5" />,
    bgColor: '#e0e7ff',
  },
];
