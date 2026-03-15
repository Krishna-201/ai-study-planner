import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(34,211,238,0.06),transparent)]" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <span className="inline-block text-cyan-400 font-medium text-sm tracking-wide uppercase mb-4">
            Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-12">
            Start free. No credit card required. Upgrade when you need more.
          </p>

          <ScrollReveal delay={0.15}>
            <motion.div
              className="relative rounded-3xl border border-white/10 bg-dark-800/50 backdrop-blur-xl p-8 md:p-12 max-w-lg mx-auto"
              whileHover={{ borderColor: 'rgba(34, 211, 238, 0.2)', boxShadow: '0 0 50px rgba(34, 211, 238, 0.08)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-baseline justify-center gap-2 mb-6">
                <span className="font-display text-5xl font-bold text-white">Free</span>
                <span className="text-slate-400">to start</span>
              </div>
              <p className="text-slate-400 mb-8">
                Unlimited subjects, AI-generated plans, tasks, calendar, and progress tracking.
              </p>
              <Link to="/register">
                <motion.span
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 shadow-[0_0_30px_rgba(34,211,238,0.25)] border border-white/10"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get started for free
                </motion.span>
              </Link>
            </motion.div>
          </ScrollReveal>
        </ScrollReveal>
      </div>
    </section>
  );
}
