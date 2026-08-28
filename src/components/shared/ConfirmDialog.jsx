import Modal from './Modal';
import Button from './Button';
import { LuTriangleAlert as LuAlertTriangle } from 'react-icons/lu';

/**
 * Confirmation dialog for destructive actions.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {function} props.onConfirm
 * @param {string} [props.title='Confirm Delete']
 * @param {string} [props.message='Are you sure? This action cannot be undone.']
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  message = 'Are you sure? This action cannot be undone.',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center py-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-red-900/30 border border-red-800/40 flex items-center justify-center mb-4">
          <LuAlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold font-[var(--font-display)] mb-2">{title}</h3>
        <p className="text-sm text-text-muted mb-6">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" size="md" onClick={onClose} id="confirm-cancel-btn">
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            id="confirm-delete-btn"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
