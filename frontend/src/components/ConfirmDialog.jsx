import { useState } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ConfirmDialog = ({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, type = 'warning' }) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: <FaExclamationTriangle className="text-red-500" size={24} />,
                    button: 'bg-red-600 hover:bg-red-700 text-white',
                    bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
                };
            case 'success':
                return {
                    icon: <FaExclamationTriangle className="text-green-500" size={24} />,
                    button: 'bg-green-600 hover:bg-green-700 text-white',
                    bg: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20'
                };
            default:
                return {
                    icon: <FaExclamationTriangle className="text-yellow-500" size={24} />,
                    button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                    bg: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className={`w-full max-w-md glass-panel p-6 ${styles.bg} border`}>
                <div className="flex items-start gap-4">
                    <div className="mt-1">
                        {styles.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {message}
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="flex-1 btn-secondary"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 ${styles.button} px-4 py-2 rounded-lg font-medium transition-colors`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;