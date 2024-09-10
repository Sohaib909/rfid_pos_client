import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent } from '@mui/material';

export default function ImageModal({
  openModal,
  closeModal,
  imageUrl,
}) {
  return (
    <Dialog open={openModal} onClose={closeModal} maxWidth="sm" fullWidth>
      <DialogContent style={{ textAlign: 'center' }}>
        <img src={imageUrl} alt="Product" style={{ width: '100%', objectFit: 'contain' }} />
      </DialogContent>
    </Dialog>
  );
}

ImageModal.propTypes = {
  openModal: PropTypes.bool,
  closeModal: PropTypes.func,
  imageUrl: PropTypes.string
};
