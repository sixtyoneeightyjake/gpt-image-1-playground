'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface CustomAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  showCheckbox?: boolean;
  checkboxLabel?: string;
  onCheckboxChange?: (checked: boolean) => void;
}

export function CustomAlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  showCheckbox = false,
  checkboxLabel = '',
  onCheckboxChange,
}: CustomAlertDialogProps) {
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setCheckboxChecked(checked);
    onCheckboxChange?.(checked);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="border-white/20 bg-black text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-white/70">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {showCheckbox && checkboxLabel && (
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="alert-checkbox"
              checked={checkboxChecked}
              onCheckedChange={handleCheckboxChange}
              className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label
              htmlFor="alert-checkbox"
              className="text-sm text-white/80 cursor-pointer"
            >
              {checkboxLabel}
            </label>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            className="border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-white text-black hover:bg-white/90"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}