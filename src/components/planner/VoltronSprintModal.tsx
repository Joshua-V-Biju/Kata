import React from 'react';
import { VoltronCockpit } from './VoltronCockpit';

interface VoltronSprintModalProps {
  onClose: () => void;
}

export const VoltronSprintModal: React.FC<VoltronSprintModalProps> = ({ onClose }) => {
  return <VoltronCockpit onClose={onClose} isModal={true} />;
};
