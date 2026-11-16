import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Login3DBackground({ stageRef, lookDown = 0, eyesClosed = false }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ lookDown, eyesClosed });

  useEffect(() => {
    stateRef.current = { lookDown, eyesClosed };
  }, [lookDown, eyesClosed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const V3 = THREE.Vector3;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xcfe6fb, 11, 34);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3, 5, 6);
    scene.add(key);

    const rimL = new THREE.PointLight(0x4dd0ff, 1.4);
    rimL.position.set(-3, 3, -2);
    scene.add(rimL);

    /* ---------- Background 3D: Kapsul melayang ---------- */
    const bg = new THREE.Group();
    scene.add(bg);

    function capsule(c1, c2) {
      const g = new THREE.Group();
      const r = 0.28;
      const h = 0.6;
      const m1 = new THREE.MeshPhysicalMaterial({
        color: c1,
        roughness: 0.25,
        clearcoat: 1,
      });
      const m2 = new THREE.MeshPhysicalMaterial({
        color: c2,
        roughness: 0.25,
        clearcoat: 1,
      });
      const a = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 20), m1);
      a.position.y = h / 2;
      const b = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 20), m2);
      b.position.y = -h / 2;
      const s1 = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), m1);
      s1.position.y = h;
      const s2 = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), m2);
      s2.position.y = -h;
      g.add(a, b, s1, s2);
      return g;
    }

    const pairs = [
      [0x1976d2, 0xffffff],
      [0x42a5f5, 0xffffff],
      [0x4caf50, 0xffffff],
      [0xff9800, 0xffffff],
      [0x1565c0, 0x90caf9],
    ];

    const caps = [];
    for (let i = 0; i < 24; i++) {
      const p = pairs[i % pairs.length];
      const c = capsule(p[0], p[1]);
      const s = 0.5 + Math.random() * 0.8;
      c.scale.setScalar(s);
      c.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 11,
        -12 + Math.random() * 13
      );
      c.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      c.userData = {
        vx: (Math.random() - 0.5) * 0.012,
        vy: (Math.random() - 0.5) * 0.012,
        ph: Math.random() * 6,
        by: c.position.y,
      };
      bg.add(c);
      caps.push(c);
    }

    /* ---------- Partikel Bintang ---------- */
    const N = 240;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = -10 + Math.random() * 12;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const sc = document.createElement('canvas');
    sc.width = sc.height = 64;
    const sx = sc.getContext('2d');
    if (sx) {
      sx.fillStyle = '#fff';
      sx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 ? 7 : 30;
        const a = (i * Math.PI) / 4 - Math.PI / 2;
        sx.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r);
      }
      sx.fill();
    }
    const starTex = new THREE.CanvasTexture(sc);

    const pts = new THREE.Points(
      pg,
      new THREE.PointsMaterial({
        map: starTex,
        size: 0.3,
        color: 0x42a5f5,
        transparent: true,
        opacity: 0.75,
        alphaTest: 0.05,
        depthWrite: false,
      })
    );
    bg.add(pts);

    const pos2 = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      pos2[i * 3] = (Math.random() - 0.5) * 24;
      pos2[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos2[i * 3 + 2] = -10 + Math.random() * 12;
    }
    const pg2 = new THREE.BufferGeometry();
    pg2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
    const pts2 = new THREE.Points(
      pg2,
      new THREE.PointsMaterial({
        map: starTex,
        size: 0.36,
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        alphaTest: 0.05,
        depthWrite: false,
      })
    );
    bg.add(pts2);

    /* ---------- Robot Mediva AI ---------- */
    const robot = new THREE.Group();
    scene.add(robot);

    const white = new THREE.MeshPhysicalMaterial({
      color: 0xe8f1fc,
      roughness: 0.3,
      metalness: 0.1,
      clearcoat: 0.7,
      clearcoatRoughness: 0.2,
    });
    const blue = new THREE.MeshPhysicalMaterial({
      color: 0x1976d2,
      roughness: 0.3,
      metalness: 0.3,
      clearcoat: 0.8,
    });
    const visorM = new THREE.MeshPhysicalMaterial({
      color: 0x0a2350,
      roughness: 0.1,
      metalness: 0.5,
      clearcoat: 1,
    });
    const glow = (c) =>
      new THREE.MeshStandardMaterial({
        color: c,
        emissive: c,
        emissiveIntensity: 1.5,
      });

    const M = (geo, mat, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      return m;
    };

    const torso = M(new THREE.SphereGeometry(1, 32, 24), white, 0, 1.35, 0);
    torso.scale.set(1.25, 1.05, 0.85);
    robot.add(torso);

    const chestRing = M(
      new THREE.CylinderGeometry(0.22, 0.22, 0.05, 24),
      glow(0x4dd0ff),
      0,
      1.5,
      0.84
    );
    chestRing.rotation.x = Math.PI / 2;
    robot.add(chestRing);

    robot.add(M(new THREE.CylinderGeometry(0.35, 0.4, 0.5, 20), blue, 0, 2.3, 0));

    const head = new THREE.Group();
    head.position.set(0, 3.1, 0);
    robot.add(head);

    const skull = M(new THREE.SphereGeometry(1, 40, 32), white);
    skull.scale.set(1.12, 0.98, 1);
    head.add(skull);

    const visor = M(new THREE.SphereGeometry(0.8, 32, 24), visorM, 0, 0, 0.62);
    visor.scale.set(1.05, 0.72, 0.5);
    head.add(visor);

    const eyeG = new THREE.SphereGeometry(0.11, 16, 16);
    const eyeM = glow(0x4dd0ff);
    const eL = M(eyeG, eyeM, -0.34, 0.03, 0.97);
    const eR = M(eyeG, eyeM, 0.34, 0.03, 0.97);
    eL.scale.set(1, 1.3, 0.5);
    eR.scale.set(1, 1.3, 0.5);
    head.add(eL, eR);

    [-1, 1].forEach((s) => {
      const ear = M(
        new THREE.CylinderGeometry(0.22, 0.22, 0.25, 24),
        blue,
        s * 1.12,
        0,
        0
      );
      ear.rotation.z = Math.PI / 2;
      head.add(ear);
    });

    head.add(M(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), white, 0, 1.05, 0));
    const tip = M(new THREE.SphereGeometry(0.09, 12, 12), glow(0x4caf50), 0, 1.32, 0);
    head.add(tip);

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.7, 0.035, 12, 90),
      new THREE.MeshBasicMaterial({
        color: 0x1e88e5,
        transparent: true,
        opacity: 0.5,
      })
    );
    ring1.position.set(0, 3.1, -0.8);
    robot.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.3, 0.02, 12, 90),
      new THREE.MeshBasicMaterial({
        color: 0x42a5f5,
        transparent: true,
        opacity: 0.35,
      })
    );
    ring2.position.set(0, 3.1, -0.8);
    ring2.rotation.x = 1.15;
    robot.add(ring2);

    const armGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    const arms = [];
    const hands = [];
    [-1, 1].forEach((s) => {
      robot.add(M(new THREE.SphereGeometry(0.3, 20, 16), white, s * 1.4, 1.75, 0));
      const a = new THREE.Mesh(armGeo, white);
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 16), blue);
      robot.add(a, h);
      arms.push(a);
      hands.push(h);
    });

    function poseArms(hx) {
      [-1, 1].forEach((s, i) => {
        const a = new V3(s * 1.4, 1.75, 0);
        const b = new V3(s * hx, 0.22, 0.1);
        const d = b.clone().sub(a);
        const L = d.length();
        arms[i].position.copy(a).addScaledVector(d, 0.5);
        arms[i].quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize());
        arms[i].scale.set(1, L, 1);
        hands[i].position.copy(b);
      });
    }

    let W = window.innerWidth;
    let H = window.innerHeight;
    let wpp = 1;
    let rp = 46;

    function layout() {
      W = window.innerWidth;
      H = window.innerHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      wpp = (2 * 10 * Math.tan(THREE.MathUtils.degToRad(22.5))) / H;
      rp = Math.max(38, Math.min(54, H * 0.075, W * 0.13));
      poseArms(Math.min(2.4, (360 * 0.34) / rp));
    }

    function place() {
      if (stageRef?.current) {
        const r = stageRef.current.getBoundingClientRect();
        // r.top adalah posisi tepi atas card dalam px dari atas layar
        // Robot diposisikan tepat bertengger di atas card
        const cardTopY = (H / 2 - r.top) * wpp;
        robot.position.set(
          (r.left + r.width / 2 - W / 2) * wpp,
          cardTopY + 0.15,
          0
        );
      } else {
        robot.position.set(0, 1.6, 0);
      }
      robot.scale.setScalar(rp * wpp);
    }

    let mx = 0;
    let my = 0;
    const handlePointerMove = (e) => {
      mx = (e.clientX / W) * 2 - 1;
      my = (e.clientY / H) * 2 - 1;
    };

    window.addEventListener('resize', layout);
    window.addEventListener('pointermove', handlePointerMove);
    layout();

    let animId;
    let t = 0;

    function loop() {
      animId = requestAnimationFrame(loop);
      t += 0.016;

      const currentLookDown = stateRef.current.lookDown;
      const currentEyesClosed = stateRef.current.eyesClosed;

      head.rotation.y += (mx * 0.55 - head.rotation.y) * 0.08;
      head.rotation.x +=
        (-my * 0.3 + currentLookDown - head.rotation.x) * 0.08;

      head.position.y = 3.1 + Math.sin(t * 1.6) * 0.04;
      torso.scale.y = 1.05 + Math.sin(t * 1.6) * 0.01;

      const target = currentEyesClosed ? 0.08 : t % 4.2 > 4.05 ? 0.1 : 1;
      eL.scale.y += (target * 1.3 - eL.scale.y) * 0.35;
      eR.scale.y = eL.scale.y;

      tip.scale.setScalar(1 + Math.sin(t * 4) * 0.25);
      ring1.rotation.z += 0.004;
      ring2.rotation.y += 0.003;
      ring2.rotation.z -= 0.002;

      bg.position.x += (-mx * 0.9 - bg.position.x) * 0.05;
      bg.position.y += (my * 0.5 - bg.position.y) * 0.05;
      bg.rotation.y = mx * 0.05;

      caps.forEach((c) => {
        const d = c.userData;
        c.rotation.x += d.vx;
        c.rotation.y += d.vy;
        c.position.y = d.by + Math.sin(t + d.ph) * 0.35;
      });

      const a = pg.attributes.position;
      for (let i = 0; i < N; i++) {
        a.array[i * 3 + 1] += 0.004;
        if (a.array[i * 3 + 1] > 6) a.array[i * 3 + 1] = -6;
      }
      a.needsUpdate = true;

      pts.material.opacity = 0.6 + Math.sin(t * 2) * 0.2;
      pts2.material.opacity = 0.7 + Math.sin(t * 2.7) * 0.25;
      pts2.rotation.z = t * 0.01;

      place();
      renderer.render(scene, camera);
    }

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', layout);
      window.removeEventListener('pointermove', handlePointerMove);
      renderer.dispose();
    };
  }, [stageRef]);

  return (
    <>
      {/* Aurora glow blobs */}
      <div className="aurora-blob-1 pointer-events-none fixed -left-[120px] -top-[160px] z-0 h-[520px] w-[520px] rounded-full bg-[#42a5f5] opacity-40 blur-[90px]" />
      <div className="aurora-blob-2 pointer-events-none fixed -bottom-[160px] -right-[100px] z-0 h-[460px] w-[460px] rounded-full bg-[#64b5f6] opacity-45 blur-[90px]" />

      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
      />
    </>
  );
}
