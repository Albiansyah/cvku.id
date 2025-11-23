// src/components/common/ConfirmModal.js
import React from 'react';
import { AlertTriangle } from 'lucide-react'; // Hanya butuh AlertTriangle

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  confirmButtonVariant = "danger",
}) => {

  if (!isOpen) {
    return null;
  }

  // Style dasar
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      // TAMBAHAN: Efek fade-in halus
      opacity: 1,
      transition: 'opacity 0.2s ease-in-out',
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
      maxWidth: '450px',
      width: '90%',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      // === TAMBAHAN: Font family disamakan ===
      fontFamily: "'Inter', 'Poppins', sans-serif",
      // === AKHIR TAMBAHAN ===
      // TAMBAHAN: Animasi scale-up
      transform: 'scale(1)',
      transition: 'transform 0.2s ease-in-out',
    },
    // TAMBAHAN: Style untuk animasi saat modal terbuka/tertutup
    overlayHidden: {
      opacity: 0,
    },
    modalHidden: {
      transform: 'scale(0.95)',
    },
    //------------------------------------------
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#1f2937',
    },
    iconWrapper: {
      backgroundColor: confirmButtonVariant === 'danger' ? '#fef2f2' : '#eff6ff',
      color: confirmButtonVariant === 'danger' ? '#ef4444' : '#3b82f6',
      borderRadius: '50%',
      padding: '8px',
      display: 'inline-flex',
    },
    title: {
      fontSize: '1.125rem', // 18px
      fontWeight: '600',
      margin: 0,
    },
    message: {
      fontSize: '0.9rem', // 14px
      color: '#4b5563',
      lineHeight: 1.6,
      margin: 0,
      whiteSpace: 'pre-wrap' // Aktifkan biar bisa enter di message
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '12px',
    },
    button: {
      padding: '10px 18px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, filter 0.2s ease', // Tambah transisi filter
      // === TAMBAHAN: Font family di tombol (opsional, harusnya sudah inherit) ===
      fontFamily: "'Inter', 'Poppins', sans-serif",
      // === AKHIR TAMBAHAN ===
    },
    confirmButtonDanger: {
      backgroundColor: '#ef4444',
      color: 'white',
    },
    confirmButtonPrimary: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    cancelButton: {
      backgroundColor: 'white',
      color: '#4b5563',
      border: '1px solid #d1d5db',
    }
  };

  const confirmButtonStyle = confirmButtonVariant === 'danger'
    ? styles.confirmButtonDanger
    : styles.confirmButtonPrimary;

  // State untuk animasi (opsional tapi bagus)
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      // Sedikit delay agar transisi terlihat
      requestAnimationFrame(() => setIsVisible(true)); 
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Handle penutupan dengan animasi
  const handleClose = () => {
     setIsVisible(false);
     // Tunggu animasi selesai baru panggil onClose prop
     setTimeout(onClose, 200); // Sesuaikan durasi dengan transisi CSS
  };
   
  // Handle konfirmasi dengan animasi
  const handleConfirm = () => {
    setIsVisible(false);
    // Tunggu animasi selesai baru panggil onConfirm prop
    setTimeout(onConfirm, 200);
  };

  // Gabungkan style dasar dengan style animasi
  const overlayStyle = isVisible ? styles.overlay : { ...styles.overlay, ...styles.overlayHidden };
  const modalStyle = isVisible ? styles.modal : { ...styles.modal, ...styles.modalHidden };


  return (
    // REVISI: Gunakan handleClose untuk overlay click
    <div style={overlayStyle} onClick={handleClose}> 
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        
        <div style={styles.header}>
          <span style={styles.iconWrapper}>
            <AlertTriangle size={24} /> 
          </span>
          <h2 style={styles.title}>{title}</h2>
        </div>

        <p style={styles.message}>{message}</p>

        <div style={styles.footer}>
          <button 
            style={{...styles.button, ...styles.cancelButton}} 
            // REVISI: Gunakan handleClose
            onClick={handleClose} 
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'} 
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            {cancelText}
          </button>
          <button 
            style={{...styles.button, ...confirmButtonStyle}} 
            // REVISI: Gunakan handleConfirm
            onClick={handleConfirm} 
            onMouseEnter={(e) => e.target.style.filter = 'brightness(90%)'}
            onMouseLeave={(e) => e.target.style.filter = 'brightness(100%)'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;