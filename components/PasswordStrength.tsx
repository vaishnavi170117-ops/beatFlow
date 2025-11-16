import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const checks = [
    { label: "At least 8 characters", test: password.length >= 8 },
    { label: "Contains uppercase letter", test: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", test: /[a-z]/.test(password) },
    { label: "Contains number", test: /\d/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1 animate-fade-in">
      {checks.map((check, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 text-xs transition-all duration-300 ${
            check.test ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
          }`}
        >
          {check.test ? (
            <Check className="w-3 h-3 animate-scale-in" />
          ) : (
            <X className="w-3 h-3" />
          )}
          <span>{check.label}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordStrength;
