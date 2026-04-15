// Static SVG grain texture overlay for gradient surfaces.
// Positions are generated once at module load — the pattern is stable for
// the lifetime of the running app. The component is memoised so it does not
// re-render on parent state changes.
//
// Used by the reveal screen to add a subtle material feel on top of the
// archetype gradient. pointerEvents='none' so it never intercepts taps.

import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const GRAIN_POINT_COUNT = 90;
const VIEWBOX_SIZE = 200;

type Point = { cx: number; cy: number; r: number };

const GRAIN_POINTS: Point[] = Array.from({ length: GRAIN_POINT_COUNT }, () => ({
  cx: Math.random() * VIEWBOX_SIZE,
  cy: Math.random() * VIEWBOX_SIZE,
  r: 0.5 + Math.random() * 0.5, // 0.5 – 1.0
}));

type Props = {
  opacity: number;
};

function GrainOverlayImpl({ opacity }: Props) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {GRAIN_POINTS.map((p, i) => (
          <Circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill="#000000"
            opacity={opacity}
          />
        ))}
      </Svg>
    </View>
  );
}

export const GrainOverlay = memo(GrainOverlayImpl);
