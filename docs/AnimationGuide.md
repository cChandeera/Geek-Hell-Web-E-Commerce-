# Animation & 3D Rendering Guide - Geek Hell

## Principles
1. **Target Frame Rate**: Maintain 60 FPS across desktop and mobile devices.
2. **Smooth Scroll**: Lenis smooth scroll controls page scroll inertia, updated on GSAP ticker.
3. **ScrollTrigger**: Pin cinematic section transitions and sync 3D camera sweeps.
4. **Three.js Mesh Rendering**:
   - Use Draco-compressed `.glb` models.
   - Project textures dynamically via Drei `<Decal>` geometry.
   - Dynamic Marvel-red and DC-blue environment lighting accents.
