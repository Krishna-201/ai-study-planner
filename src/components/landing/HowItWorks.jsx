import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const steps = [
  { step: '01', title: 'Add subjects & exam dates', desc: 'Create your subjects and set exam dates. Set priorities and total hours you need.' },
  { step: '02', title: 'Generate your plan', desc: 'Our AI builds a day-by-day schedule and tasks so you know exactly what to do.' },
  { step: '03', title: 'Track & adjust', desc: 'Check off tasks, log study time, and reschedule when life gets in the way.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark-950" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16 md:mb-20">
          <span className="inline-block text-violet-400 font-medium text-sm tracking-wide uppercase mb-4">
            How it works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Three steps to a <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">clear plan</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((item, i) => (
            <ScrollReveal key={item.step} once delay={i * 0.12}>
              <motion.div
                className="relative p-6 md:p-8 rounded-2xl border border-white/5 bg-dark-800/30 backdrop-blur-sm hover:border-violet-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)] transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <span className="text-4xl font-display font-bold text-white/10">{item.step}</span>
                <h3 className="mt-4 font-display text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-slate-400 leading-relaxed">{item.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
