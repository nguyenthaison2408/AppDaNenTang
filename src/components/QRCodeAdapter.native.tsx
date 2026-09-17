import React from 'react';
import QRCode from 'react-native-qrcode-svg';

interface Props {
  value: string;
  size: number;
}

export const AppQRCode: React.FC<Props> = ({ value, size }) => {
  return (
    <QRCode
      value={value}
      size={size}
      backgroundColor="#FFFFFF"
      color="#0F172A"
    />
  );
};

