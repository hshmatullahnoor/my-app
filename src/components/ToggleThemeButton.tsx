// ToggleDarkMode.tsx
import { MoonStar, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const ToggleThemeButton = () => {
  // بار اول: تم ذخیره‌شده یا تنظیمات سیستم رو بخون
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const html = document.documentElement;
  const isDark = html.classList.contains('dark');

  const toggleDarkMode = () => {
    if (checked) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const [checked, setChecked] = useState<boolean>(isDark);

  return (
    <label className="flex items-center justify-between w-full gap-2 cursor-pointer f rowspace-x-3">
      {/* <span className="text-gray-700 dark:text-white">{label}</span> */}

      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          // checked={checked}
          onChange={(e) => {
            const checked = e.target.checked;
            const newValue = checked ? true : false;
            console.log(newValue);
            setChecked(newValue)
            toggleDarkMode()
            
          }}
        >
        </input>
        <div className="h-6 transition-colors duration-300 bg-white border border-gray-800 rounded-full w-11 peer-checked:border-white peer-checked:bg-gray-950"></div>
        <div className="absolute w-4 h-4 transition-all duration-300 rounded-full left-1 top-1 peer-checked:left-6">
          {checked ? (
            <MoonStar size={16} className='text-white' />
          ) : (
            <SunIcon size={16} />
          )}
        </div>

      </div>
    </label>
  );
};

export default ToggleThemeButton;