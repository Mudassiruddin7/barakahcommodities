import { useEffect, useState } from 'react';

/**
 * Canvas text only uses a web font that has already loaded. The stamps and
 * stencils drawn into textures are built once and cached, so they must wait
 * for the real lettering rather than bake in a fallback.
 */
export function useFontsReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const done = () => alive && setReady(true);
    if (!document.fonts) {
      done();
      return;
    }
    Promise.all([
      document.fonts.load('800 80px "Big Shoulders Stencil"', 'BARAKAH 0123'),
      document.fonts.load('700 40px "Libre Franklin"', 'FINE GOLD 999.9'),
    ])
      .then(done)
      .catch(done);
    return () => {
      alive = false;
    };
  }, []);

  return ready;
}
