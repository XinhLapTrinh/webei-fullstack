import React from 'react';
import { Tooltip } from 'antd';

const ZaloFloatingButton = ({ phone = '0989671511' }) => {
  return (
    <Tooltip title="Chat Zalo ngay!" placement="left">
      <a
        href={`https://zalo.me/${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
          }}
          className="zalo-floating-button"
        >
          <img
            src="/zalo-icon.png"
            alt="Zalo"
            style={{
              width: 36,
              height: 36,
              objectFit: 'contain',
            }}
          />
        </div>
      </a>
    </Tooltip>
  );
};

export default ZaloFloatingButton;
