// ============================================================
// ScaleScene — a brass beam balance, tipping.
//
// Gold on one pan, cast-iron weights on the other. The beam does not
// settle: it swings with the scroll, overshoots and rights itself, the
// way a real balance does when something is added or taken away. That is
// the whole argument of the section — a business result can go either
// way, and the books should show both.
// ============================================================

import { memo, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import Lighting from '../Lighting';
import FitWidth from '../FitWidth';
import Ground from '../objects/Ground';
import GoldBar from '../objects/GoldBar';
import { bowlGeometry, lathe, weightGeometry } from '../geometry';
import { brass } from '../materials';
import { useStage } from '../context';

export interface ScaleSceneProps {
  /** 0..1 as the section passes through the viewport. */
  progressRef: RefObject<number>;
}

const ARM = 2.3; // half the beam
const PIVOT_Y = 3.15;
const CHAIN = 1.35;
const PAN_R = 0.95;
const TARGET: [number, number, number] = [0, 1.75, 0];

const iron = new THREE.MeshStandardMaterial({ color: '#23211d', metalness: 0.85, roughness: 0.42 });

/** A thin rod between two points. */
function Rod({ from, to, radius = 0.014 }: { from: THREE.Vector3; to: THREE.Vector3; radius?: number }) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = to.clone().sub(from);
    const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { position: from.clone().add(to).multiplyScalar(0.5), quaternion: q, length: len };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion} material={brass()} castShadow>
      <cylinderGeometry args={[radius, radius, length, 6]} />
    </mesh>
  );
}

/** A pan on three chains. Origin is the hook it hangs from. */
function Pan({ children }: { children: React.ReactNode }) {
  const dish = useMemo(() => bowlGeometry(PAN_R, 0.3), []);
  const chains = useMemo(
    () =>
      [0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
        return {
          from: new THREE.Vector3(0, 0, 0),
          // chains meet the pan at its rim, not under it
          to: new THREE.Vector3(Math.cos(a) * PAN_R * 0.99, -CHAIN + 0.3 * 1.02, Math.sin(a) * PAN_R * 0.99),
        };
      }),
    []
  );

  return (
    <group>
      {chains.map((c, i) => (
        <Rod key={i} from={c.from} to={c.to} />
      ))}
      <mesh position={[0, -CHAIN - 0.02, 0]} geometry={dish} material={brass()} castShadow receiveShadow />
      <group position={[0, -CHAIN + 0.05, 0]}>{children}</group>
    </group>
  );
}

function Balance({ progressRef }: ScaleSceneProps) {
  const { reducedMotion } = useStage();
  const beam = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const tilt = useRef({ angle: 0.2, velocity: 0 });

  const stand = useMemo(
    () =>
      lathe(
        [
          [0.001, 0],
          [1.25, 0],
          [1.3, 0.07],
          [1.2, 0.17],
          [0.82, 0.26],
          [0.42, 0.4],
          [0.17, 0.7],
          [0.1, 1.3],
          [0.1, 2.8],
          [0.16, 2.98],
          [0.2, 3.1],
          [0.001, 3.14],
        ],
        72,
        120
      ),
    []
  );
  const weight = useMemo(weightGeometry, []);

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0;
    const t = state.clock.elapsedTime;
    // Scroll swings the beam; a faint sway keeps it alive when it is not scrolled.
    const target = reducedMotion
      ? 0.12
      : 0.3 * Math.sin(p * Math.PI * 3.2 + 0.7) + 0.018 * Math.sin(t * 0.9);

    const s = tilt.current;
    const dt = Math.min(delta, 1 / 30);
    s.velocity += ((target - s.angle) * 38 - s.velocity * 4.2) * dt;
    s.angle += s.velocity * dt;

    if (beam.current) beam.current.rotation.z = s.angle;
    // Pans hang plumb however the beam leans.
    if (left.current) left.current.rotation.z = -s.angle;
    if (right.current) right.current.rotation.z = -s.angle;
  });

  return (
    <>
      <mesh geometry={stand} material={brass()} castShadow receiveShadow />

      <group ref={beam} position={[0, PIVOT_Y, 0]}>
        {/* the beam: a tapered bar with a boss at the centre */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={brass()} castShadow>
          <capsuleGeometry args={[0.055, ARM * 2, 10, 24]} />
        </mesh>
        <mesh material={brass()} castShadow>
          <sphereGeometry args={[0.18, 32, 24]} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * ARM, 0, 0]} material={brass()} castShadow>
            <sphereGeometry args={[0.1, 24, 18]} />
          </mesh>
        ))}
        {/* pointer */}
        <mesh position={[0, -0.5, 0]} material={brass()} castShadow>
          <coneGeometry args={[0.035, 0.9, 12]} />
        </mesh>

        <group ref={left} position={[-ARM, 0, 0]}>
          <Pan>
            <GoldBar position={[0, 0.0, 0.14]} rotation={[0, 0.25, 0]} scale={0.5} />
            <GoldBar position={[0.03, 0.2, -0.12]} rotation={[0, -0.2, 0]} scale={0.5} />
          </Pan>
        </group>

        <group ref={right} position={[ARM, 0, 0]}>
          <Pan>
            <mesh geometry={weight} material={iron} position={[-0.3, 0, 0.1]} scale={0.8} castShadow />
            <mesh geometry={weight} material={iron} position={[0.28, 0, -0.12]} scale={0.7} castShadow />
            <mesh geometry={weight} material={iron} position={[0, 0, 0.35]} scale={0.55} castShadow />
          </Pan>
        </group>
      </group>
    </>
  );
}

function ScaleScene(props: ScaleSceneProps) {
  const { tier } = useStage();

  return (
    <>
      <Lighting tier={tier} />
      <FitWidth width={7.4} target={TARGET} />
      <Balance {...props} />
      <Ground size={40} />
    </>
  );
}

export default memo(ScaleScene);
