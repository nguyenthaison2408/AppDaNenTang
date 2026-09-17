import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  value: string;
  size: number;
}

export const AppQRCode: React.FC<Props> = ({ value, size }) => {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      level="H"
      includeMargin={false}
    />
  );
};

