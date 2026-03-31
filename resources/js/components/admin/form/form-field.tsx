import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormFieldProps = {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
};

export function FormField({
    label,
    name,
    value,
    onChange,
    error,
    type = 'text',
    placeholder,
    required,
    disabled,
}: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={!!error}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
    );
}
