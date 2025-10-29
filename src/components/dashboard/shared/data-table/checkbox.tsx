type CheckboxProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    id: string | number;
    label: string;
};


const Checkbox = ({ checked, onChange, label }: CheckboxProps) => {
    return (
        <label className="flex items-center justify-between w-full gap-2 cursor-pointer f rowspace-x-3">
            <span className="text-gray-700 dark:text-white">{label}</span>

            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        const newValue = checked ? true : false;
                        onChange(newValue);
                    }}
                >
                </input>
                <div className="h-6 transition-colors duration-300 bg-gray-700 rounded-full w-11 peer-checked:bg-green-600"></div>
                <div className="absolute w-4 h-4 transition-all duration-300 bg-white rounded-full left-1 top-1 peer-checked:left-6"></div>

            </div>
        </label>
    );
};

export default Checkbox;