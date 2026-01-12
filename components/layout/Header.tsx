import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Layers, Search, Settings, User, LogOut, CreditCard, HelpCircle } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onPlanClick?: () => void;
  onSettingsClick?: () => void;
  onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onPlanClick,
  onSettingsClick,
  onNotificationClick,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount] = useState(3);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, message: 'Enrichment completed for 5 records', time: '2m ago', read: false },
    { id: 2, message: 'New record imported successfully', time: '15m ago', read: false },
    { id: 3, message: 'Plan limit: 450 credits remaining', time: '1h ago', read: false },
    { id: 4, message: 'Weekly report is ready', time: '2d ago', read: true },
  ];

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 h-12 shadow-sm z-50 sticky top-0">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-md" aria-hidden="true">
          <Layers size={18} />
        </div>
        <nav className="flex items-center space-x-2 text-sm font-medium text-gray-700" aria-label="Breadcrumb">
          <span className="text-gray-400">Workbook</span>
          <span className="text-gray-400" aria-hidden="true">/</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-900">Bitscale UX /UI Testing</span>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative group">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
            size={14}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search records, URLs, or names..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-72 transition-all"
            aria-label="Search records"
          />
        </div>
        <Tooltip content="View plan usage and upgrade options" position="bottom">
          <button
            onClick={onPlanClick}
            className="flex items-center space-x-2 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 hover:bg-green-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500/20"
            aria-label="Plan usage: 500 of 500 credits used"
          >
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
            <span className="text-xs font-bold text-green-700">500/500</span>
            <span className="px-1.5 py-0.5 bg-green-600 text-white text-[9px] rounded uppercase font-black">Free</span>
          </button>
        </Tooltip>
        <div className="flex items-center space-x-3 text-gray-400">
          <div className="relative" ref={notificationsRef}>
            <Tooltip content={`${unreadCount} unread notifications`} position="bottom">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                  onNotificationClick?.();
                }}
                className="relative p-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                aria-expanded={showNotifications}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </Tooltip>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                        !notif.read ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => setShowNotifications(false)}
                    >
                      <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                  <button className="w-full text-xs text-center text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          <Tooltip content="Settings" position="bottom">
            <button
              onClick={() => {
                setShowProfileMenu(false);
                setShowNotifications(false);
                onSettingsClick?.();
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
          </Tooltip>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 p-1"
              aria-label="User menu"
              aria-expanded={showProfileMenu}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-sm">
                MB
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-bold text-gray-900">Mike Braham</p>
                  <p className="text-xs text-gray-500">mike@bitscale.com</p>
                </div>
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <User size={16} className="text-gray-400" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <CreditCard size={16} className="text-gray-400" />
                    <span>Billing</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <HelpCircle size={16} className="text-gray-400" />
                    <span>Help & Support</span>
                  </button>
                </div>
                <div className="border-t border-gray-200 pt-1">
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2">
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
