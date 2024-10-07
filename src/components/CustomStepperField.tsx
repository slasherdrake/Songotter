import React, { useState } from 'react';
import { StepperField } from '@aws-amplify/ui-react';

interface CustomStepperFieldProps {
  label: string;
  onChange?: (value: number) => void;
}

const CustomStepperField: React.FC<CustomStepperFieldProps> = ({ label, onChange }) => {
  const [value, setValue] = useState(0);

  const handleChange = (newValue: number) => {
    // Round to one decimal place
    const roundedValue = Math.round(newValue * 10) / 10;
    
    // Ensure the value is between 0 and 10
    const clampedValue = Math.min(Math.max(roundedValue, 0), 10);
    
    setValue(clampedValue);
    if (onChange) {
      onChange(clampedValue);
    }
  };
  const handleInputChange = (newValue: number) => {
    // Round to one decimal place
    const roundedValue = Math.round(newValue * 10) / 10;

    // Ensure the value is between 0 and 10
    const clampedValue = Math.min(Math.max(roundedValue, 0), 10);

    setValue(clampedValue);
    if (onChange) {
      onChange(clampedValue);
    }
  };

  return (
    <StepperField
      label={label}
      min={0}
      max={10}
      step={0.1}
      defaultValue= {0}
      value={value}
      // Parse the value directly from the field without accessing event.target
      onStepChange={(val) => handleChange(val)}
      onChange={(e) => handleInputChange(parseFloat(e.target.value))}

    />
  );
};

export default CustomStepperField;
