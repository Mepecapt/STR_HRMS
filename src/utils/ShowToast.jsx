import React, { useEffect, useState } from 'react';

const ShowToast = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const toast_value = localStorage.getItem('toast')
    if (toast_value === 'none') {
      setShow(false)
    }else{
      setShow(true)
      setMessage(toast_value)
      localStorage.setItem('toast', 'none')
    }
  }, [])

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className="card-body m-4">
      {show && (
        <div
          className="toast align-items-center text-bg-primary border-0 fade show mb-4"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              {message}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={handleClose}
              aria-label="Close"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowToast;
