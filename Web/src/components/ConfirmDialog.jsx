import { ExclamationTriangleIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Modal } from './Modal';
import { Button } from './Button';

const variantConfig = {
  danger: {
    iconWrap: 'bg-mediva-danger-bg text-mediva-danger-text',
    buttonVariant: 'danger',
    defaultIcon: TrashIcon,
  },
  warning: {
    iconWrap: 'bg-mediva-warning-bg text-mediva-warning-text',
    buttonVariant: 'primary',
    defaultIcon: ExclamationTriangleIcon,
  },
  primary: {
    iconWrap: 'bg-mediva-chip text-mediva-primary',
    buttonVariant: 'primary',
    defaultIcon: InformationCircleIcon,
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'danger',
  icon: CustomIcon,
  loading = false,
}) {
  const cfg = variantConfig[variant] || variantConfig.danger;
  const Icon = CustomIcon || cfg.defaultIcon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      closeOnBackdrop={!loading}
      hideCloseButton={loading}
      size="sm"
    >
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-mediva-md ${cfg.iconWrap}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-mediva-text">{title}</h3>
        {description && (
          <p className="mt-2 text-xs leading-relaxed text-mediva-muted sm:text-sm">
            {description}
          </p>
        )}

        <div className="mt-6 flex w-full items-center gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={cfg.buttonVariant}
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
