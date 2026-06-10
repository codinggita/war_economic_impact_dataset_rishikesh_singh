import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { X, Save, AlertCircle, Loader } from 'lucide-react';

const ConflictModal = ({ conflict, onClose, onSuccess }) => {
  const isEdit = !!conflict;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form Fields State
  const [conflictName, setConflictName] = useState('');
  const [conflictType, setConflictType] = useState('Interstate War');
  const [region, setRegion] = useState('Middle East');
  const [primaryCountry, setPrimaryCountry] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [status, setStatus] = useState('Ongoing');
  
  // Economic & Poverty details
  const [preWarUnemployment, setPreWarUnemployment] = useState('');
  const [duringWarUnemployment, setDuringWarUnemployment] = useState('');
  const [preWarPovertyRate, setPreWarPovertyRate] = useState('');
  const [duringWarPovertyRate, setDuringWarPovertyRate] = useState('');
  const [foodInsecurityRate, setFoodInsecurityRate] = useState('');
  const [gdpChange, setGdpChange] = useState('');
  const [inflationRate, setInflationRate] = useState('');
  const [warCostUsd, setWarCostUsd] = useState('');
  const [reconstructionCostUsd, setReconstructionCostUsd] = useState('');

  // Hydrate form fields if editing an existing conflict
  useEffect(() => {
    if (conflict) {
      setConflictName(conflict.conflictName || '');
      setConflictType(conflict.conflictType || 'Interstate War');
      setRegion(conflict.region || 'Middle East');
      setPrimaryCountry(conflict.primaryCountry || '');
      setStartYear(conflict.startYear || '');
      setEndYear(conflict.endYear || '');
      setStatus(conflict.status || 'Ongoing');
      
      setPreWarUnemployment(conflict.preWarUnemployment ?? '');
      setDuringWarUnemployment(conflict.duringWarUnemployment ?? '');
      setPreWarPovertyRate(conflict.preWarPovertyRate ?? '');
      setDuringWarPovertyRate(conflict.duringWarPovertyRate ?? '');
      setFoodInsecurityRate(conflict.foodInsecurityRate ?? '');
      
      setGdpChange(conflict.gdpChange ?? '');
      setInflationRate(conflict.inflationRate ?? '');
      setWarCostUsd(conflict.warCostUsd ?? '');
      setReconstructionCostUsd(conflict.reconstructionCostUsd ?? '');
    }
  }, [conflict]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Form payload data validation and building
    const payload = {
      conflictName: conflictName.trim(),
      conflictType,
      region,
      primaryCountry: primaryCountry.trim(),
      startYear: Number(startYear),
      endYear: endYear ? Number(endYear) : null,
      status,
      gdpChange: Number(gdpChange),
      inflationRate: Number(inflationRate)
    };

    if (preWarUnemployment !== '') payload.preWarUnemployment = Number(preWarUnemployment);
    if (duringWarUnemployment !== '') payload.duringWarUnemployment = Number(duringWarUnemployment);
    if (preWarPovertyRate !== '') payload.preWarPovertyRate = Number(preWarPovertyRate);
    if (duringWarPovertyRate !== '') payload.duringWarPovertyRate = Number(duringWarPovertyRate);
    if (foodInsecurityRate !== '') payload.foodInsecurityRate = Number(foodInsecurityRate);
    if (warCostUsd !== '') payload.warCostUsd = Number(warCostUsd);
    if (reconstructionCostUsd !== '') payload.reconstructionCostUsd = Number(reconstructionCostUsd);

    try {
      let response;
      if (isEdit) {
        response = await api.patch(`/conflicts/${conflict._id}`, payload);
      } else {
        response = await api.post('/conflicts', payload);
      }

      if (response.data && response.data.success) {
        onSuccess();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit form details. Verify field limits.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} className="animate-fade-in">
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '32px'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          title="Close Modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <h2 style={{ marginBottom: '8px', fontSize: '1.4rem' }}>
          {isEdit ? `Edit Registry: ${conflict.conflictName}` : 'Register New Conflict Details'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
          {isEdit ? 'Update macroeconomic variables and financial costs.' : 'Input macroeconomic data points for conflict impact analysis.'}
        </p>

        {error && (
          <div className="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Grid */}
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* Core details */}
            <div className="form-group">
              <label htmlFor="modal-name">Conflict Name</label>
              <input
                id="modal-name"
                type="text"
                value={conflictName}
                onChange={(e) => setConflictName(e.target.value)}
                placeholder="e.g. Yom Kippur War"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-country">Primary Country</label>
              <input
                id="modal-country"
                type="text"
                value={primaryCountry}
                onChange={(e) => setPrimaryCountry(e.target.value)}
                placeholder="e.g. Israel"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-type">Conflict Type</label>
              <select
                id="modal-type"
                value={conflictType}
                onChange={(e) => setConflictType(e.target.value)}
              >
                <option value="Interstate War">Interstate War</option>
                <option value="Civil War">Civil War</option>
                <option value="Proxy War">Proxy War</option>
                <option value="Insurgency">Insurgency</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="modal-region">Region</label>
              <select
                id="modal-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="Middle East">Middle East</option>
                <option value="East Africa">East Africa</option>
                <option value="South Asia">South Asia</option>
                <option value="Eastern Europe">Eastern Europe</option>
                <option value="Southeast Asia">Southeast Asia</option>
                <option value="South America">South America</option>
                <option value="Central America">Central America</option>
                <option value="Global">Global</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="modal-start">Start Year</label>
              <input
                id="modal-start"
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                placeholder="e.g. 1973"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-end">End Year (Optional)</label>
              <input
                id="modal-end"
                type="number"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                placeholder="Leave blank if ongoing"
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-status">Status</label>
              <select
                id="modal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Economic indices */}
            <div className="form-group">
              <label htmlFor="modal-gdp">GDP Change (%)</label>
              <input
                id="modal-gdp"
                type="number"
                step="any"
                value={gdpChange}
                onChange={(e) => setGdpChange(e.target.value)}
                placeholder="e.g. -4.5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-inflation">Inflation Rate (%)</label>
              <input
                id="modal-inflation"
                type="number"
                step="any"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                placeholder="e.g. 12.4"
                required
              />
            </div>

            {/* Financial costs */}
            <div className="form-group">
              <label htmlFor="modal-warcost">War Cost (USD)</label>
              <input
                id="modal-warcost"
                type="number"
                value={warCostUsd}
                onChange={(e) => setWarCostUsd(e.target.value)}
                placeholder="e.g. 8000000000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-reconstruction">Reconstruction Cost (USD)</label>
              <input
                id="modal-reconstruction"
                type="number"
                value={reconstructionCostUsd}
                onChange={(e) => setReconstructionCostUsd(e.target.value)}
                placeholder="e.g. 15000000000"
              />
            </div>

            {/* Social details */}
            <div className="form-group">
              <label htmlFor="modal-unemp-pre">Pre-War Unemployment (%)</label>
              <input
                id="modal-unemp-pre"
                type="number"
                step="any"
                value={preWarUnemployment}
                onChange={(e) => setPreWarUnemployment(e.target.value)}
                placeholder="e.g. 5.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-unemp-dur">During-War Unemployment (%)</label>
              <input
                id="modal-unemp-dur"
                type="number"
                step="any"
                value={duringWarUnemployment}
                onChange={(e) => setDuringWarUnemployment(e.target.value)}
                placeholder="e.g. 18.2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-poverty-pre">Pre-War Poverty Rate (%)</label>
              <input
                id="modal-poverty-pre"
                type="number"
                step="any"
                value={preWarPovertyRate}
                onChange={(e) => setPreWarPovertyRate(e.target.value)}
                placeholder="e.g. 12.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-poverty-dur">During-War Poverty Rate (%)</label>
              <input
                id="modal-poverty-dur"
                type="number"
                step="any"
                value={duringWarPovertyRate}
                onChange={(e) => setDuringWarPovertyRate(e.target.value)}
                placeholder="e.g. 30.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-food">Food Insecurity Rate (%)</label>
              <input
                id="modal-food"
                type="number"
                step="any"
                value={foodInsecurityRate}
                onChange={(e) => setFoodInsecurityRate(e.target.value)}
                placeholder="e.g. 24.5"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Record
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConflictModal;
