import React from 'react';
import {treatmentColors} from '../data/treatmentColors';

const TREATMENTS = [
    {key: 'filling', label: 'Filling'},
    {key: 'crown', label: 'Crown'},
    {key: 'bridges', label: 'Bridges'},
    {key: 'implants', label: 'Implants'},
    {key: 'extraction', label: 'Extraction'},
    {key: 'root_canal', label: 'Root Canal'},
    {key: 'veneers', label: 'Veneers'},
    {key: 'sealant', label: 'Sealant'},
];

export default function FilterMenu({selected, onSelect}) {
    return (
        <div className="filter-menu">
            <div className="filter-title">Filter</div>
            {TREATMENTS.map(item => (
                <div key={item.key} className="filter-item" onClick={() => onSelect(item.key)}>
          <span className="filter-dot" style={{
              background: treatmentColors[item.key],
              border: selected === item.key ? '2px solid #333' : 'none'
          }}/>
                    <span className="filter-label" style={{color: selected === item.key ? '#333' : '#888'}}>
            {item.label}
          </span>
                </div>
            ))}
            <div className="filter-item" onClick={() => onSelect(null)}>
                <span className="filter-label" style={{color: '#888'}}>Show All</span>
            </div>
        </div>
    );
}