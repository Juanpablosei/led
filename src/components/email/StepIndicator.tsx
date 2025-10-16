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
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={stepNumber}>
            {index > 0 && (
              <View style={[
                styles.line, 
                // La línea debe estar roja si estamos en el paso actual o superior
                currentStep > index ? styles.lineCompleted : styles.lineInactive
              ]} />
            )}
            <View style={[
              styles.step, 
              isActive ? styles.stepActive : 
              isCompleted ? styles.stepCompleted : styles.stepInactive
            ]}>
              <Text style={[
                styles.stepNumber, 
                isActive ? styles.stepNumberActive : 
                isCompleted ? styles.stepNumberCompleted : styles.stepNumberInactive
              ]}>
                {stepNumber}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
};
