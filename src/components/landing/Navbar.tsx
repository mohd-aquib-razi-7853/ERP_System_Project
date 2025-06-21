import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold"
            >
              AI
            </motion.div>
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              ERP<span className="text-blue-600">IQ</span>
            </span>
          </Link>
          <div className="flex space-x-8">
            <Link href="/features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition">
              Pricing
            </Link>
            <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition">
              Sign In
            </Link>
          </div>
          <Link
            href="/onboarding"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}