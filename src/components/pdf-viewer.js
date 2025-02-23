"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight } from "untitledui-js-base";
import styles from "./pdf-viewer.module.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

export default function PDFViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const handleDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
  };

  const changePage = (offset) => {
    setPageNumber((prev) => Math.min(Math.max(1, prev + offset), numPages));
  };

  return (
    <div className={styles.container}>
      {/* {isLoading && <div>Loading...</div>} */}

      <Document
        file={url}
        onLoadSuccess={handleDocumentLoadSuccess}
        onLoadError={handleDocumentLoadError}
        loading={null}
        className={styles.document}
      >
        <Page pageNumber={pageNumber} className={styles.page} />
      </Document>

      <div className={styles.controls}>
        <button
          onClick={() => changePage(-1)}
          disabled={pageNumber <= 1}
          className={`${styles.button} ${pageNumber <= 1 ? styles.buttonDisabled : ""}`}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>

        <span className={styles.pageInfo}>
          {pageNumber} of {numPages || "--"}
        </span>

        <button
          onClick={() => changePage(1)}
          disabled={pageNumber >= numPages}
          className={`${styles.button} ${pageNumber >= numPages ? styles.buttonDisabled : ""}`}
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
