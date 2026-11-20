import React from 'react';

const UnavailableNotice = ({ feature = 'micro-location GPS / geospatial coordinates' }) => {
  return (
    <div className="alert alert-light border border-info-subtle d-flex align-items-start gap-2 p-3 rounded-3 my-3">
      <i className="bi bi-info-circle-fill text-primary fs-5 mt-1"></i>
      <div className="small text-secondary">
        <strong className="text-dark d-block mb-1">Source Dataset Limitation Notice:</strong>
        {feature.charAt(0).toUpperCase() + feature.slice(1)} are not recorded in the official district summary publications of the State Crime Records Bureau (SCRB) and Transport Department. In strict compliance with data integrity guidelines, no synthetic or fabricated values have been generated.
      </div>
    </div>
  );
};

export default UnavailableNotice;
