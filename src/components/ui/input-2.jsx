import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MultiDigitInput = ({ 
  label, 
  placeholder, 
  length, 
  type = 'text',
  onChange 
}) => {
  const [digits, setDigits] = useState(Array(length).fill(""));

  const handleChange = (index, value) => {
    // Ensure only numeric input for PIN, alphanumeric for NPM
    const sanitizedValue = type === 'password' 
      ? value.replace(/[^0-9]/g, '')  // Only numbers for PIN
      : value.toUpperCase().replace(/[^A-Z0-9]/g, '');  // Uppercase alphanumeric for NPM
    
    // Create a copy of the current digits array
    const newDigits = [...digits];
    newDigits[index] = sanitizedValue;
    
    // Update local state
    setDigits(newDigits);
    
    // Call the onChange prop with the full value
    onChange(newDigits.join(''));
  };

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">{label}</Label>
      <div className="flex space-x-1 justify-center">
        {digits.map((digit, index) => (
          <Input 
            key={index}
            type={type}
            maxLength={1}
            value={digit}
            placeholder="-"
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-10 text-center text-white bg-[#002A35] border-[#00E5CC]/20 focus:border-[#00E5CC]"
          />
        ))}
      </div>
    </div>
  );
};

export default MultiDigitInput;