import { InboxIcon } from '@heroicons/react/24/outline';

export function EmptyState({ message, icon: IconComponent = InboxIcon }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-mediva-muted">
      <IconComponent className="mb-3 h-12 w-12" aria-hidden="true" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
