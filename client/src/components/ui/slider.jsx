import React from "react"

const Slider = React.forwardRef(({ className, value, onValueChange, max = 10000, min = 0, step = 100, ...props }, ref) => {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    onValueChange([newValue, value ? value[1] : max]);
  };

  const handleChange2 = (e) => {
    const newValue = parseInt(e.target.value);
    onValueChange([value ? value[0] : min, newValue]);
  };

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value ? value[0] : min}
          onChange={handleChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value ? value[1] : max}
          onChange={handleChange2}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>₹{value ? value[0] : min}</span>
        <span>₹{value ? value[1] : max}</span>
      </div>
    </div>
  );
});

Slider.displayName = "Slider";

export { Slider }; 