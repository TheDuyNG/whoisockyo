import { useState } from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';

interface ConfirmButtonProps extends Omit<ButtonProps, 'onClick'> {
  confirmationLabel?: string;
  onConfirm: () => void;
}

export function ConfirmButton({
  confirmationLabel = 'Confirm delete',
  onConfirm,
  children,
  ...props
}: ConfirmButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <Button size="sm" variant="destructive" onClick={onConfirm} {...props}>
          {confirmationLabel}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setIsConfirming(false)}>
          Cancel
        </Button>
      </span>
    );
  }

  return (
    <Button {...props} onClick={() => setIsConfirming(true)}>
      {children}
    </Button>
  );
}
