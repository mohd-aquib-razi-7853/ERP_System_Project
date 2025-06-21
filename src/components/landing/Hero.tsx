import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white"
        >
          AI-Powered <span className="text-blue-600">ERP</span> for Modern Businesses
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
        >
          Automate workflows, predict trends, and streamline operations with our AI-driven enterprise platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
          className="mt-10 flex justify-center gap-4"
        >
          <Link
            href="/onboarding"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Start Free Trial
          </Link>
          <Link
            href="/demo"
            className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
          >
            Watch Demo
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.6 } }}
          className="mt-16 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 max-w-5xl mx-auto"
        >
          <img
            src="/images/erp-dashboard-preview.png"
            alt="ERP Dashboard Preview"
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}