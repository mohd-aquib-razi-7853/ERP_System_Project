import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Cut our inventory costs by 30% with predictive analytics.",
    name: "Sarah K., CFO",
    company: "RetailChain",
  },
  {
    quote: "The AI invoice processing saves us 20 hours per week.",
    name: "Mark T., Operations",
    company: "LogiCorp",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trusted by Industry Leaders</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md"
            >
              <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{testimonial.quote}"</p>
              <div className="font-medium text-gray-900 dark:text-white">{testimonial.name}</div>
              <div className="text-gray-500 dark:text-gray-400">{testimonial.company}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}