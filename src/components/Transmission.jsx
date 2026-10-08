import { useRef, useEffect } from 'react';
import './Transmission.css';

/**
 * Transmission — the overlay content panel that appears over the orbital system.
 * Each state's content is wrapped in a Transmission.
 * Visibility is driven by scroll state.
 */
export default function Transmission({
  id,
  stateId,
  stateLabel,
  stateDesc,
  isActive,
  children,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    if (isActive) {
      el.removeAttribute('inert');
      el.setAttribute('aria-hidden', 'false');
    } else {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    }
  }, [isActive]);

  return (
    <div
      ref={panelRef}
      id={id}
      className={`transmission ${isActive ? 'active' : ''}`}
      role="region"
      aria-label={`${stateId} — ${stateLabel}`}
      aria-hidden={!isActive}
    >
      <div className="transmission-label mono">
        <span>{stateId} / {stateLabel}</span>
        {stateDesc && <span className="transmission-desc">{stateDesc}</span>}
      </div>
      {children}
    </div>
  );
}
