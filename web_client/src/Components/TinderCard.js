import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const SWIPE_THRESHOLD = 90;
const EXIT_DISTANCE = 900;

const getDirection = (x, y) => {
  if (Math.abs(x) > Math.abs(y)) {
    return x > 0 ? 'right' : 'left';
  }

  return y > 0 ? 'down' : 'up';
};

const getExitTransform = (dir) => {
  const transforms = {
    left: `translate(${-EXIT_DISTANCE}px, 0) rotate(-24deg)`,
    right: `translate(${EXIT_DISTANCE}px, 0) rotate(24deg)`,
    up: `translate(0, ${-EXIT_DISTANCE}px) rotate(-12deg)`,
    down: `translate(0, ${EXIT_DISTANCE}px) rotate(12deg)`,
  };

  return transforms[dir] || transforms.right;
};

const TinderCard = forwardRef(
  ({ children, className, onSwipe, onCardLeftScreen, preventSwipe = [] }, ref) => {
    const startPoint = useRef(null);
    const [drag, setDrag] = useState({ x: 0, y: 0 });
    const [transitioning, setTransitioning] = useState(false);
    const [exitTransform, setExitTransform] = useState('');

    const finishSwipe = (dir) => {
      if (preventSwipe.includes(dir)) {
        return;
      }

      setTransitioning(true);
      setExitTransform(getExitTransform(dir));
      onSwipe && onSwipe(dir);

      window.setTimeout(() => {
        onCardLeftScreen && onCardLeftScreen(dir);
      }, 280);
    };

    useImperativeHandle(ref, () => ({
      async swipe(dir = 'right') {
        finishSwipe(dir);
      },
      async restoreCard() {
        setTransitioning(true);
        setExitTransform('');
        setDrag({ x: 0, y: 0 });
      },
    }));

    const handlePointerDown = (event) => {
      if (transitioning) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      startPoint.current = { x: event.clientX, y: event.clientY };
    };

    const handlePointerMove = (event) => {
      if (!startPoint.current || transitioning) {
        return;
      }

      setDrag({
        x: event.clientX - startPoint.current.x,
        y: event.clientY - startPoint.current.y,
      });
    };

    const handlePointerUp = () => {
      if (!startPoint.current || transitioning) {
        return;
      }

      const dir = getDirection(drag.x, drag.y);
      const shouldSwipe = Math.max(Math.abs(drag.x), Math.abs(drag.y)) > SWIPE_THRESHOLD;
      startPoint.current = null;

      if (shouldSwipe) {
        finishSwipe(dir);
        return;
      }

      setTransitioning(true);
      setDrag({ x: 0, y: 0 });
      window.setTimeout(() => setTransitioning(false), 180);
    };

    const transform =
      exitTransform || `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 16}deg)`;

    return (
      <div
        className={className}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTransitionEnd={() => !exitTransform && setTransitioning(false)}
        style={{
          cursor: 'grab',
          touchAction: 'none',
          transform,
          transition: transitioning ? 'transform 280ms ease' : 'none',
          userSelect: 'none',
        }}
      >
        {children}
      </div>
    );
  }
);

export default TinderCard;
