import { motion } from 'framer-motion';

const features = [
  {
    title: "AI-Powered Analytics",
    description: "Predict inventory needs and sales trends with 95% accuracy.",
    icon: "📊",
  },
  {
    title: "Automated Invoicing",
    description: "Extract data from invoices using OCR and AI.",
    icon: "🧾",
  },
  {
    title: "Smart HR Management",
    description: "Automate payroll, leave requests, and employee onboarding.",
    icon: "👥",
  },
  {
    title: "Real-Time Collaboration",
    description: "Integrated chat and task management for teams.",
    icon: "💬",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Everything You Need to Scale</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our AI tools handle the busywork so you can focus on growth.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}