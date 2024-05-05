import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Modal from 'react-bootstrap/Modal';
import { BASE_URL } from '../../services/helper';

function PDFViewer(props) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            {/* <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter" className='fw-bold lh-1'>
                    {props.title || "View Article"}
                </Modal.Title>
            </Modal.Header> */}
            {/* <Modal.Body> */}
                <div style={{ height: "800px" }}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer
                            fileUrl={`${BASE_URL}/articles/merged-script/${props.fileurl}`}
                            plugins={[defaultLayoutPluginInstance]}
                            pageLayout={'SinglePage'}
                        />
                    </Worker>
                </div>
            {/* </Modal.Body> */}
            {/* <Modal.Footer>
                <Button onClick={handleClose}>Close</Button>
            </Modal.Footer> */}
        </Modal>
    );
}

export default PDFViewer;