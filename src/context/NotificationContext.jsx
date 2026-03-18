import { createContext, useContext, useState, useCallback } from 'react';
import './Notification.css';

const NotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const confirmAction = useCallback((message, onConfirm) => {
    setConfirmDialog({ isOpen: true, message, onConfirm });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm();
    }
    closeConfirm();
  }, [confirmDialog, closeConfirm]);

  return (
    <NotificationContext.Provider value={{ showNotification, confirmAction }}>
      {children}
      <ToastContainer notifications={notifications} removeNotification={removeNotification} />
      {confirmDialog.isOpen && (
        <ConfirmDialog 
          message={confirmDialog.message} 
          onConfirm={handleConfirm} 
          onCancel={closeConfirm} 
        />
      )}
    </NotificationContext.Provider>
  );
};

// Internal ToastContainer component
const ToastContainer = ({ notifications, removeNotification }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="toast-container">
      {notifications.map((n) => (
        <Toast key={n.id} notification={n} onRemove={() => removeNotification(n.id)} />
      ))}
    </div>
  );
};

const Toast = ({ notification, onRemove }) => {
  const { message, type } = notification;
  
  // Icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  return (
    <div className={`toast toast--${type} neo-out`} onClick={onRemove}>
      <span className="toast__icon">{getIcon()}</span>
      <span className="toast__message">{message}</span>
      <button className="toast__close">&times;</button>
    </div>
  );
};

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="confirm-dialog neo-out">
        <div className="confirm-dialog__icon">⚠️</div>
        <h3 className="confirm-dialog__title">Are you sure?</h3>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button className="confirm-btn confirm-btn--cancel neo-out" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn confirm-btn--danger neo-out" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
