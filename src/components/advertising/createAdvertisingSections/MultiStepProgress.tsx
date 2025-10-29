import React from "react";

type MultiStepProgressProps = {
  totalSteps: number;
  currentStep: number; // می‌تونه اعشاری باشه
  titles?: string[];
};

const MultiStepProgress: React.FC<MultiStepProgressProps> = ({
  totalSteps,
  currentStep,
  titles = [],
}) => {
  // محدود کردن مقدار به بازه‌ی مجاز
  const stepValue = Math.min(Math.max(currentStep, 1), totalSteps);
  const progressPercent =
    ((stepValue - 1) / (totalSteps - 1)) * 100 || 0;

  return (
    <div className="progressbar transition-colors">
      <div
        className="progress"
        style={{ width: `${progressPercent}%` }}
      ></div>

      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step <= stepValue;

        return (
          <div
            key={index}
            className={`progress-step ${isActive ? "active" : ""}`}
            data-title={titles[index] || ""}
          ></div>
        );
      })}
    </div>
  );
};

export default MultiStepProgress;
