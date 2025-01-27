'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

export function Modal({ isOpen, onClose, children }) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  );
}

export function ModalHeader({ children }) {
  return <div className="modal-header">{children}</div>;
}

export function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>;
}

export function ModalFooter({ children }) {
  return <div className="modal-footer">{children}</div>;
}
