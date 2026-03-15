import React from 'react';
import { motion } from 'framer-motion';

const BORDER_GRADIENT = 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #6366f1, #3b82f6)';

export default function DashboardPreview() {
  return (
    <motion.div
      className="relative w-full max-w-5xl mx-auto aspect-video min-h-[280px]"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      variants={{
        hover: {
          transition: { duration: 0.3 },
        },
      }}
    >
      {/* Rotating gradient border — moving light effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl"
        style={{
          background: BORDER_GRADIENT,
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.15), 0 0 80px rgba(139, 92, 246, 0.1)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      {/* Inner container: inset so rotating border is visible */}
      <motion.div
        className="absolute inset-[2px] rounded-2xl sm:rounded-[22px] overflow-hidden bg-gradient-to-b from-dashboard-surface to-dashboard-base backdrop-blur-xl border border-white/5 shadow-2xl shadow-black/40 z-10"
        variants={{
          hover: {
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 80px rgba(59, 130, 246, 0.08)',
            transition: { duration: 0.3 },
          },
        }}
      >
        {/* Floating gradient light inside */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-blue-500/20 blur-3xl"
          animate={{
            x: [0, 15, -10, 0],
            y: [0, -20, 10, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-violet-500/15 blur-3xl"
          animate={{
            x: [0, -12, 8, 0],
            y: [0, 15, -10, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Mock dashboard layout */}
        <div className="relative flex h-full min-h-[260px] sm:min-h-[300px] md:min-h-[340px]">
          {/* Sidebar */}
          <aside className="hidden sm:flex flex-col w-14 md:w-16 shrink-0 border-r border-white/5 bg-black/20">
            {['layout-dashboard', 'bar-chart-3', 'calendar', 'trending-up', 'settings'].map((icon, i) => (
              <div
                key={icon}
                className="flex items-center justify-center h-12 md:h-14 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
              >
                <MockIcon name={icon} />
              </div>
            ))}
          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0 p-3 sm:p-4 md:p-5">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="h-6 w-24 sm:w-32 rounded bg-white/5" />
              <div className="flex gap-2">
                <div className="h-7 w-7 rounded-full bg-white/5" />
                <div className="h-7 w-16 sm:w-20 rounded-full bg-white/5" />
              </div>
            </div>

            {/* Analytics cards row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
              {[
                { label: 'Total Tasks', value: '24', sub: '+12%' },
                { label: 'Completed', value: '18', sub: '75%' },
                { label: 'Streak', value: '7d', sub: 'days' },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  className="rounded-xl bg-white/5 border border-white/5 p-2.5 sm:p-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                >
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate">{card.label}</p>
                  <p className="text-sm sm:text-base font-semibold text-white mt-0.5">{card.value}</p>
                  <p className="text-[10px] sm:text-xs text-emerald-400/80 mt-0.5">{card.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Chart / Activity area */}
            <motion.div
              className="flex-1 rounded-xl bg-white/5 border border-white/5 overflow-hidden min-h-[100px] sm:min-h-[120px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className="h-full flex items-end gap-1 sm:gap-2 p-2 sm:p-3">
                {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75, 55, 90].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 min-w-0 rounded-t bg-gradient-to-t from-blue-500/30 to-violet-500/20"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.03, duration: 0.5, ease: 'easeOut' }}
                  />
                ))}
              </div>
              <div className="px-2 sm:px-3 pb-1.5 flex justify-between text-[10px] sm:text-xs text-slate-500">
                <span>Activity</span>
                <span>Last 12 days</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MockIcon({ name }) {
  const size = 18;
  const stroke = 1.8;
  const icons = {
    'layout-dashboard': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="4" rx="1" />
      </svg>
    ),
    'bar-chart-3': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    'trending-up': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  };
  return icons[name] || null;
}
