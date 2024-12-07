"use client"

import React, { useMemo } from "react"
import { Input } from "@/components/ui/input"

export const OTPInput = React.forwardRef(
  ({ value, numInputs, onChange, renderInput, containerStyle, inputStyle, ...rest }, ref) => {
    const valueArray = useMemo(() => value.split(""), [value])

    const handleChange = (e, index) => {
      const newValue = e.target.value
      if (newValue.length > 1) return
      const newOtp = value.split("")
      newOtp[index] = newValue
      onChange(newOtp.join(""))
      if (newValue && index < numInputs - 1) {
        const nextInput = e.target.nextElementSibling
        if (nextInput) nextInput.focus()
      }
    }

    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        const prevInput = e.currentTarget.previousElementSibling
        if (prevInput) prevInput.focus()
      }
    }

    const inputs = Array(numInputs).fill(null).map((_, index) => {
      const inputProps = {
        type: "text",
        inputMode: "numeric",
        pattern: "[0-9]*",
        maxLength: 1,
        value: valueArray[index] || "",
        onChange: (e) => handleChange(e, index),
        onKeyDown: (e) => handleKeyDown(e, index),
        style: inputStyle,
        ...rest,
      }

      return (
        <React.Fragment key={index}>
          {renderInput ? renderInput(inputProps) : <Input {...inputProps} />}
        </React.Fragment>
      )
    })

    return (
      <div style={containerStyle} className="flex gap-2">
        {inputs}
      </div>
    )
  }
)

OTPInput.displayName = "OTPInput"