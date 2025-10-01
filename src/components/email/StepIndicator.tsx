import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './StepIndicator.styles';
import { StepIndicatorProps } from './StepIndicator.types';

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;

        return (
          <React.Fragment key={stepNumber}>
            {index > 0 && <View style={styles.line} />}
            <View style={[styles.step, isActive ? styles.stepActive : styles.stepInactive]}>
              <Text style={[styles.stepNumber, isActive ? styles.stepNumberActive : styles.stepNumberInactive]}>
                {stepNumber}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
};
