import { motion } from 'framer-motion'

const features = [
  {
    title: 'Projects & cycles',
    description: 'Organize work into projects and time-boxed cycles. See progress at a glance and ship on schedule.',
    icon: '◉',
  },
  {
    title: 'Issues that move',
    description: 'Create, triage, and assign issues with statuses that match your workflow. No more lost tasks.',
    icon: '◇',
  },
  {
    title: 'Built for teams',
    description: 'Workspaces, teams, and roles. Keep everyone aligned without the overhead of enterprise bloat.',
    icon: '▣',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: '100px 0 120px',
        background: 'var(--workbit-bg)',
      }}
    >
      <div className="landing__container">
        <motion.h2
          className="landing__heading-lg"
          style={{ textAlign: 'center', marginBottom: 16 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          Built for how you work
        </motion.h2>
        <motion.p
          className="landing__text-muted"
          style={{ margin: '0 auto 64px', textAlign: 'center' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Purpose-built for planning and shipping. Less noise, more focus.
        </motion.p>
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              className="landing__card"
              variants={item}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                padding: 28,
                border: '1px solid var(--workbit-border)',
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'var(--workbit-accent-soft)',
                  color: 'var(--workbit-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  marginBottom: 16,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {f.title}
              </h3>
              <p
                className="landing__text-muted"
                style={{ fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}
              >
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
