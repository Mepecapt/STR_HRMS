import React from "react";
import { doc, deleteDoc, onSnapshot } from "firebase/firestore"; // Import Firestore functions
import db from "../../firebase";
import { Link } from "react-router-dom";
import {refreshPage} from '../../firebase_utils/fetchData'


const DeleteModal = ({ document_id, table, name, routeref}) => {

  const handleDelete = async () => {
    try {
      // Reference to the document to be deleted
      const docRef = doc(db, table, document_id);
      // Delete the document
      await deleteDoc(docRef);
    console.log("Document successfully deleted!");
      // You might want to close the modal or perform additional actions after deletion
    } catch (error) {
      console.error("Error removing document: ", error);
    }
    const toast_message = `${ table.charAt(0).toUpperCase() + table.slice(1) } deleted`

    localStorage.setItem('toast', toast_message)
    window.location.href=routeref
  };
  
  return(
    <>
      {/* Delete Performance Indicator Modal */}
      <div className="modal custom-modal fade" id="delete" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>{name}</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6" onClick={() => handleDelete()}>
                    <Link to="#" className="btn btn-primary continue-btn" >
                          Delete
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      to="#"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      className="btn btn-primary cancel-btn"
                    >
                      Cancel
                    </Link>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Performance Indicator Modal */}
    </>
  );
};

export default DeleteModal;