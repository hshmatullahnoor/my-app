const navItems = [
  {
    name: 'dashboard',
    label: 'داشبورد',
    path: '/dashboard',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 9V3h8v6h-8ZM3 13V3h8v10H3Zm10 8V11h8v10h-8ZM3 21v-6h8v6H3Z"/></svg>',
    role: ['admin', 'user']
  },
  {
    name: 'account',
    label: 'حساب کاربری',
    path: '/dashboard/account',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M16 7.992C16 3.58 12.416 0 8 0S0 3.58 0 7.992c0 2.43 1.104 4.62 2.832 6.09c.016.016.032.016.032.032c.144.112.288.224.448.336c.08.048.144.111.224.175A7.98 7.98 0 0 0 8.016 16a7.98 7.98 0 0 0 4.48-1.375c.08-.048.144-.111.224-.16c.144-.111.304-.223.448-.335c.016-.016.032-.016.032-.032c1.696-1.487 2.8-3.676 2.8-6.106zm-8 7.001c-1.504 0-2.88-.48-4.016-1.279c.016-.128.048-.255.08-.383a4.17 4.17 0 0 1 .416-.991c.176-.304.384-.576.64-.816c.24-.24.528-.463.816-.639c.304-.176.624-.304.976-.4A4.15 4.15 0 0 1 8 10.342a4.185 4.185 0 0 1 2.928 1.166c.368.368.656.8.864 1.295c.112.288.192.592.24.911A7.03 7.03 0 0 1 8 14.993zm-2.448-7.4a2.49 2.49 0 0 1-.208-1.024c0-.351.064-.703.208-1.023c.144-.32.336-.607.576-.847c.24-.24.528-.431.848-.575c.32-.144.672-.208 1.024-.208c.368 0 .704.064 1.024.208c.32.144.608.336.848.575c.24.24.432.528.576.847c.144.32.208.672.208 1.023c0 .368-.064.704-.208 1.023a2.84 2.84 0 0 1-.576.848a2.84 2.84 0 0 1-.848.575a2.715 2.715 0 0 1-2.064 0a2.84 2.84 0 0 1-.848-.575a2.526 2.526 0 0 1-.56-.848zm7.424 5.306c0-.032-.016-.048-.016-.08a5.22 5.22 0 0 0-.688-1.406a4.883 4.883 0 0 0-1.088-1.135a5.207 5.207 0 0 0-1.04-.608a2.82 2.82 0 0 0 .464-.383a4.2 4.2 0 0 0 .624-.784a3.624 3.624 0 0 0 .528-1.934a3.71 3.71 0 0 0-.288-1.47a3.799 3.799 0 0 0-.816-1.199a3.845 3.845 0 0 0-1.2-.8a3.72 3.72 0 0 0-1.472-.287a3.72 3.72 0 0 0-1.472.288a3.631 3.631 0 0 0-1.2.815a3.84 3.84 0 0 0-.8 1.199a3.71 3.71 0 0 0-.288 1.47c0 .352.048.688.144 1.007c.096.336.224.64.4.927c.16.288.384.544.624.784c.144.144.304.271.48.383a5.12 5.12 0 0 0-1.04.624c-.416.32-.784.703-1.088 1.119a4.999 4.999 0 0 0-.688 1.406c-.016.032-.016.064-.016.08C1.776 11.636.992 9.91.992 7.992C.992 4.14 4.144.991 8 .991s7.008 3.149 7.008 7.001a6.96 6.96 0 0 1-2.032 4.907z"/></svg>',
    role: ['admin', 'user']
  },
  {
    name: 'advertisings',
    label: 'آگهی ها',
    path: '/dashboard/advertisings',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="39.5" cy="24" rx="4" ry="15.5"/><path d="M23.999 33.813L39.323 39.5m0-31L13.608 18H6.393a1.5 1.5 0 0 0-1.455 1.135c-.025.098-.09.295-.145.623C4.611 20.848 4.5 22.34 4.5 24s.111 3.151.293 4.242c.055.328.12.524.145.623A1.5 1.5 0 0 0 6.393 30H7"/><rect x="7" y="22.5" width="17" height="17" rx="1.5" ry="1.5"/><path d="M17.675 32.641h-4.35m-1.078 3.219l3.253-9.722l3.252 9.723"/></svg>',
    role: ['admin', 'user']
  },
  {
    name: 'messages',
    label: 'پیام ها',
    path: '/dashboard/messages',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.25 7.506v6.607a3.963 3.963 0 0 1-3.964 3.965h-2.643l-2.18 2.18a.636.636 0 0 1-.925 0l-2.18-2.18H6.713a3.964 3.964 0 0 1-3.964-3.965V7.506a3.964 3.964 0 0 1 3.964-3.964h10.572a3.964 3.964 0 0 1 3.964 3.964"/></svg>',
    role: ['admin', 'user']
  },
  {
    name: 'markeds',
    label: 'نشانک ها',
    path: '/dashboard/markeds',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M410.9 0H85.1C72.3 0 61.8 10.4 61.8 23.3V512L248 325.8L434.2 512V23.3c0-12.9-10.4-23.3-23.3-23.3z"/></svg>',
    role: ['admin', 'user']
  },
  {
    name: 'users',
    label: 'کاربران',
    path: '/dashboard/admin/users',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 12.25a3.75 3.75 0 1 1 3.75-3.75A3.75 3.75 0 0 1 14 12.25Zm0-6a2.25 2.25 0 1 0 2.25 2.25A2.25 2.25 0 0 0 14 6.25Zm7 13a.76.76 0 0 1-.75-.75c0-1.95-1.06-3.25-6.25-3.25s-6.25 1.3-6.25 3.25a.75.75 0 0 1-1.5 0c0-4.75 5.43-4.75 7.75-4.75s7.75 0 7.75 4.75a.76.76 0 0 1-.75.75ZM8.32 13.06H8a3 3 0 1 1 .58-6a.75.75 0 1 1-.15 1.49a1.46 1.46 0 0 0-1.09.34a1.47 1.47 0 0 0-.54 1a1.49 1.49 0 0 0 1.35 1.64a1.53 1.53 0 0 0 .93-.22a.75.75 0 0 1 .79 1.28a3 3 0 0 1-1.55.47ZM3 18.5a.76.76 0 0 1-.75-.75c0-2.7.72-4.5 4.25-4.5a.75.75 0 0 1 0 1.5c-2.35 0-2.75.75-2.75 3a.76.76 0 0 1-.75.75Z"/></svg>',
    role: ['admin']
  },
  {
    name: 'tickets',
    label: 'تیکت ها',
    path: '/dashboard/admin/tickets',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9h8m-8 4h6m.5 5.5L12 21l-3-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v4.5M19 22v.01M19 19a2.003 2.003 0 0 0 .914-3.782a1.98 1.98 0 0 0-2.414.483"/></svg>',
    role: ['admin']
  },
  {
    name: 'advertisings manegment',
    label: 'مدیریت آگهی ها',
    path: '/dashboard/admin/advertisings',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5.506 15.992L8.03 9.029c.46-.967 1.162-1.766 1.967.151c.743 1.77 1.85 5.01 2.505 6.815m-5.85-2.993h4.669"/><path d="M3.464 4.318C2 5.636 2 7.758 2 12s0 6.364 1.464 7.682C4.93 21 7.286 21 12 21s7.071 0 8.535-1.318S22 16.242 22 12s0-6.364-1.465-7.682C19.072 3 16.714 3 12 3S4.929 3 3.464 4.318"/><path d="M18.484 8.987v2.995m0 0v3.943m0-3.943h-2.018c-.24 0-.478.044-.702.131c-1.693.657-1.693 3.1 0 3.757c.225.087.462.131.702.131h2.018"/></svg>',
    role: ['admin']
  },
  {
    name: 'reports',
    label: 'گذارش ها',
    path: '/dashboard/admin/reports',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17q.425 0 .713-.288T13 16q0-.425-.288-.713T12 15q-.425 0-.713.288T11 16q0 .425.288.713T12 17Zm0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8v4q0 .425.288.713T12 13Zm-2.925 8q-.4 0-.762-.15t-.638-.425l-4.1-4.1q-.275-.275-.425-.638T3 14.925v-5.85q0-.4.15-.762t.425-.638l4.1-4.1q.275-.275.638-.425T9.075 3h5.85q.4 0 .763.15t.637.425l4.1 4.1q.275.275.425.638t.15.762v5.85q0 .4-.15.763t-.425.637l-4.1 4.1q-.275.275-.638.425t-.762.15h-5.85Zm.025-2h5.8l4.1-4.1V9.1L14.9 5H9.1L5 9.1v5.8L9.1 19Zm2.9-7Z"/></svg>',
    role: ['admin']
  },
  {
    name: 'categories manegment',
    label: 'مدیریت دسته بندی ها',
    path: '/dashboard/admin/categories',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5 7h13v10H2V4h7l2 2H4v9h1V7z"/></svg>',
    role: ['admin']
  },
  {
    name: 'category features',
    label: 'ویژگی های دسته بندی',
    path: '/dashboard/admin/category-features',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-feather" aria-hidden="true"><path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"></path><path d="M16 8 2 22"></path><path d="M17.5 15H9"></path></svg>',
    role: ['admin']
  }
];

export default navItems;