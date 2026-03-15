import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI schedule generator',
    description: 'Tell us your subjects and exam dates. Our AI builds a realistic study plan and daily tasks so you stay on track.',
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    borderGlow: 'group-hover:shadow-glow-cyan',
    iconColor: 'text-cyan-400',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Tasks & calendar',
    description: 'Daily task list and calendar view. Mark tasks done, reschedule with one tap, and see your progress at a glance.',
    gradient: 'from-violet-500/20 to-violet-500/5',
    borderGlow: 'group-hover:shadow-glow-violet',
    iconColor: 'text-violet-400',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Progress tracking',
    description: 'Charts and stats per subject. See study time, completion rate, and streaks so you know exactly where you stand.',
    gradient: 'from-fuchsia-500/20 to-fuchsia-500/5',
    borderGlow: 'group-hover:shadow-[0_0_40px_rgba(217,70,239,0.2)]',
    iconColor: 'text-fuchsia-400',
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(139,92,246,0.06),transparent)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16 md:mb-20">
          <span className="inline-block text-cyan-400 font-medium text-sm tracking-wide uppercase mb-4">
            Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">succeed</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-slate-400 text-lg">
            One place for planning, tasks, and progress. Built for students who want clarity and control.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} once delay={i * 0.1}>
              <motion.div
                className="group relative"
                initial={false}
              >
                <motion.div
                  className={`relative h-full p-6 md:p-8 rounded-2xl bg-dark-800/40 border border-white/5 backdrop-blur-sm bg-gradient-to-b ${feature.gradient} hover:border-white/10 transition-all duration-300 ${feature.borderGlow}`}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  />
                  <div className="relative">
                    <motion.div
                      className={`inline-flex p-3 rounded-xl bg-white/5 border border-white/10 ${feature.iconColor} mb-5`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="font-display text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
