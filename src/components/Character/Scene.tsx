import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { getCameraZoom } from "./utils/cameraFraming";
import { isCompactView } from "../../utils/device";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (canvasDiv.current) {
      const rect = canvasDiv.current.getBoundingClientRect();
      const container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      // Each effect needs isolated Three.js state. React Strict Mode mounts,
      // cleans up, then mounts again in development to expose lifecycle bugs.
      const scene = new THREE.Scene();
      let isActive = true;

      // Phones: lighter renderer (no MSAA, lower pixel ratio) for smooth scrolling.
      const compact = isCompactView();
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !compact && window.devicePixelRatio < 2,
        powerPreference: compact ? "default" : "high-performance",
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.5 : 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = getCameraZoom(aspect);
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: THREE.Object3D | null = null;
      let mixer: THREE.AnimationMixer | null = null;
      let character: THREE.Object3D | null = null;
      let removeHoverListener: (() => void) | undefined;
      let introTimeout: ReturnType<typeof setTimeout> | undefined;

      let lastWidth = window.innerWidth;
      let onResize: (() => void) | null = null;
      let raf = 0;
      const clock = new THREE.Clock();

      const light = setLighting(scene);
      const progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter()
        .then((gltf) => {
          // The first Strict Mode mount may finish loading after it has been
          // disposed. Never let that stale request add to the current scene.
          if (!gltf || !isActive) return;

          const animations = setAnimations(gltf);
          if (hoverDivRef.current) {
            removeHoverListener = animations.hover(gltf, hoverDivRef.current);
          }
          mixer = animations.mixer;
          const loadedCharacter = gltf.scene;
          character = loadedCharacter;
          scene.add(loadedCharacter);
          headBone = loadedCharacter.getObjectByName("spine006") || null;
          screenLight = loadedCharacter.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            if (!isActive) return;
            introTimeout = setTimeout(() => {
              if (!isActive) return;
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
          lastWidth = window.innerWidth;
          onResize = () => {
            // Mobile browsers fire resize when the URL bar shows/hides;
            // rebuilding every ScrollTrigger for that would cause jank.
            if (isCompactView() && window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            if (character) handleResize(renderer, camera, canvasDiv, character);
          };
          window.addEventListener("resize", onResize);
        })
        .catch((error) => {
          if (isActive) console.error("Unable to load character:", error);
        });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: ReturnType<typeof setTimeout> | undefined;
      const onTouchMove = (event: TouchEvent) => {
        handleTouchMove(event, (x, y) => (mouse = { x, y }));
      };
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", onTouchMove);
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove);
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = () => {
        raf = requestAnimationFrame(animate);
        // On phones the character only lives in the first screen; stop
        // rendering once it has scrolled well out of view.
        if (isCompactView() && window.scrollY > window.innerHeight * 1.5) {
          clock.getDelta();
          return;
        }
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        isActive = false;
        clearTimeout(debounce);
        clearTimeout(introTimeout);
        progress.clear(false);
        removeHoverListener?.();
        mixer?.stopAllAction();
        if (character) mixer?.uncacheRoot(character);
        scene.environment?.dispose();
        scene.clear();
        renderer.dispose();
        cancelAnimationFrame(raf);
        if (onResize) window.removeEventListener("resize", onResize);
        renderer.domElement.remove();
        document.removeEventListener("mousemove", onMouseMove);
        if (landingDiv) {
          landingDiv.removeEventListener("touchmove", onTouchMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
