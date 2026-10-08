import { useState } from 'react';
import { IDENTITY } from '../data/content';
import { playNodeClick } from '../utils/audio';
import './StateReach.css';

export default function StateReach() {
  const [copied, setCopied] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    'FREQUENCY: 142.8 MHz — ACTIVE',
    'ALL CHANNELS OPEN FOR TRANSMISSION.',
  ]);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    playNodeClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(IDENTITY.email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      });
    }
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    playNodeClick();
    let response = '';
    if (cmd === 'help') {
      response = 'COMMANDS: status, ping, bio, channels, clear';
    } else if (cmd === 'ping') {
      response = 'PONG — latency: 14ms (signal strong)';
    } else if (cmd === 'status') {
      response = 'CURRENT: B.Tech student / building / learning in public';
    } else if (cmd === 'bio') {
      response = IDENTITY.bio;
    } else if (cmd === 'channels') {
      response = 'CHANNELS: 01 PRESENCE / 02 BUILD / 03 BROADCAST / 04 EVOLVE / 05 REACH';
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else {
      response = `UNKNOWN SIGNAL "${cmd}". TYPE "help" FOR COMMANDS.`;
    }

    setTerminalLogs((prev) => [...prev.slice(-4), `> ${cmd}`, response]);
    setTerminalInput('');
  };

  return (
    <div className="reach">
      {/* Conceptual headline */}
      <div className="reach-headline">
        <h2 className="reach-title">
          START A<br />
          <span className="reach-title-accent">THREAD.</span>
        </h2>
        <div className="reach-sub mono">
          05 / REACH — open frequency
        </div>
      </div>

      {/* Contact links */}
      <div className="reach-contacts">
        <div className="reach-label mono">COLLABORATIONS / PROJECTS / OPPORTUNITIES</div>

        <div className="reach-email-group">
          <a
            href={`mailto:${IDENTITY.email}`}
            className="reach-primary-link"
            aria-label="Send email"
          >
            <span className="reach-email">{IDENTITY.email}</span>
            <span className="reach-email-arrow" aria-hidden="true">↗</span>
          </a>

          <button
            className={`reach-copy-btn mono ${copied ? 'copied' : ''}`}
            onClick={handleCopyEmail}
            aria-label="Copy email address"
          >
            {copied ? 'COPIED ✓' : 'COPY'}
          </button>
        </div>

        <div className="reach-links" role="list">
          {[
            { label: 'GITHUB', href: IDENTITY.github },
            { label: 'LINKEDIN', href: IDENTITY.linkedin },
            { label: 'YOUTUBE', href: IDENTITY.youtube },
            { label: 'INSTAGRAM', href: IDENTITY.instagram },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="reach-link"
              role="listitem"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${label}`}
            >
              <span>{label}</span>
              <span className="reach-link-arrow">↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* Interactive terminal */}
      <div className="reach-terminal mono" aria-label="Terminal instrument">
        <div className="reach-terminal-bar">
          <span>TERMINAL / SIGNAL ECHO</span>
          <span>FREQ / MEHDI ALI / 2026</span>
        </div>
        <div className="reach-terminal-body">
          {terminalLogs.map((log, i) => (
            <div key={i} className="reach-log-line">{log}</div>
          ))}
          <form className="reach-term-form" onSubmit={handleTerminalSubmit}>
            <span className="reach-prompt">&gt;</span>
            <input
              type="text"
              className="reach-term-input mono"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="type 'help' or 'status'..."
              aria-label="Terminal command input"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
