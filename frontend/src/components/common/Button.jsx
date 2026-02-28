import { motion } from 'framer-motion'
import Spinner from './Spinner'

const variants = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  outline:   'btn-outline',
  ghost:     'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl px-4 py-2 transition-colors',
  danger:    'bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl px-5 py-2.5 transition-all duration-200',
}

const sizes = {
  xs:  'text-xs px-3 py-1.5',
  sm:  'text-sm px-4 py-2',
  md:  '',        // default from variant
  lg:  'text-base px-6 py-3',
  xl:  'text-lg px-8 py-4',
}

export default function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  icon      = null,
  iconRight = false,
  className = '',
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      className={`
        inline-flex items-center justify-center gap-2 font-body select-none
        ${variants[variant] || variants.primary}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" color="current" />
      ) : (
        icon && !iconRight && <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconRight && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </motion.button>
  )
}
