import './StatePresence.css';

export default function StatePresence() {
  return (
    <div className="presence">
      <h2 className="presence-title serif">
        A STUDENT<br />
        <em>IN MOTION.</em>
      </h2>
      <div className="presence-body">
        <p className="presence-copy">
          I'm a B.Tech student standing at the intersection of engineering
          and expression. Not finished. Not polished. Moving.
        </p>
        <div className="presence-micro mono">
          <p>THE POINT IS NOT TO LOOK FINISHED.</p>
          <p>
            It is to make the work visible<br />
            while it is still changing.
          </p>
        </div>
      </div>
    </div>
  );
}
