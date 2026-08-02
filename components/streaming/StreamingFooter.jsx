import { motion } from "framer-motion";

export default function StreamingFooter({ Icon, title, subTitle }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="w-fit mx-auto mt-8 p-5 glass rounded-2xl flex flex-row items-center gap-3 border border-white/6"
    >
      <div className="shrink-0 size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
        <Icon size={18} className="text-accent" />
      </div>
      <div>
        <p className="font-jakarta font-semibold text-text-primary text-sm mb-0.5">
          {title}
        </p>
        <p className="font-inter text-text-secondary text-xs leading-relaxed">
          {subTitle}
        </p>
      </div>
    </motion.div>
  );
}
