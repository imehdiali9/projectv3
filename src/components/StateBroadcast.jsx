import { BROADCAST_ITEMS } from '../data/content';
import './StateBroadcast.css';

export default function StateBroadcast() {
  return (
    <div className="broadcast">
      {/* Featured broadcast panel */}
      <div className="bc-featured" aria-label="Featured broadcast">
        <div className="bc-featured-stamp mono">ON AIR / 2026</div>

        {/* Animated screen/viewport element */}
        <div className="bc-screen" aria-hidden="true">
          <div className="bc-screen-inner">
            <div className="bc-scanline" />
          </div>
          <div className="bc-screen-label mono">SHORT FORM / REELS</div>
        </div>

        <h2 className="bc-featured-title">
          CODE<br />
          MEETS<br />
          CONTENT.
        </h2>

        <p className="bc-featured-sub">
          Short-form content about building, learning,
          and what it actually looks like to make things.
        </p>
      </div>

      {/* Broadcast list */}
      <div className="bc-list" role="list" aria-label="Broadcast archive">
        {BROADCAST_ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.link}
            className="bc-item"
            role="listitem"
            aria-label={`${item.label}: ${item.title}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="bc-item-meta">
              <span className="bc-item-id mono">{item.id}</span>
              <span className="bc-item-type mono">{item.label}</span>
            </div>
            <div className="bc-item-content">
              <span className="bc-item-title">{item.title}</span>
              <span className="bc-item-caption">{item.caption}</span>
            </div>
            <span className="bc-item-platform mono">{item.platform} ↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
