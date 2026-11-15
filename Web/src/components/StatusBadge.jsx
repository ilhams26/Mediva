const statusConfig = {
  'Aman': 'bg-mediva-success-bg text-mediva-success-text',
  'Menipis': 'bg-yellow-100 text-yellow-800',
  'Habis': 'bg-red-100 text-red-800',
  'Kedaluwarsa': 'bg-orange-100 text-orange-700',
};

export function StatusBadge({ status }) {
  const classes = statusConfig[status] || statusConfig['Aman'];
  
  return (
    <span className={`inline-flex items-center rounded-[5px] px-2 py-0.5 text-xs font-semibold ${classes}`}>
      {status}
    </span>
  );
}
