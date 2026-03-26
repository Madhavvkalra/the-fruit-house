"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const text4Ref = useRef(null);

  const frameCount = 10; 
  
  const currentFrame = (index) => {
    const paddedIndex = index.toString().padStart(3, '0'); 
    return `/sequence/ezgif-frame-${paddedIndex}.webp`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const images = [];
    const sequence = { frame: 1 }; 

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    images[0].onload = () => render(1);

    function render(index) {
      if (!images[index - 1]) return;
      const img = images[index - 1];
      
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    }

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5, 
      }
    });

    tl.to(sequence, {
      frame: frameCount,
      snap: 'frame',
      ease: 'none',
      onUpdate: () => render(sequence.frame)
    }, 0);

    tl.to(text1Ref.current, { opacity: 0, duration: 0.5 }, 0.5) 
      .to(text2Ref.current, { opacity: 1, duration: 0.5 }, 0.5)
      .to(text2Ref.current, { opacity: 0, duration: 0.5 }, 1.5)
      .to(text3Ref.current, { opacity: 1, duration: 0.5 }, 1.5)
      .to(text3Ref.current, { opacity: 0, duration: 0.5 }, 2.5)
      .to(text4Ref.current, { opacity: 1, duration: 0.5 }, 2.5);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(sequence.frame);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill(); 
    };
  }, []);

  return (
    <main ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>

        <div className="relative z-20 w-full text-center px-4">
          <h1 ref={text1Ref} className="absolute inset-0 flex flex-col items-center justify-center text-5xl md:text-8xl font-black text-white tracking-tighter uppercase drop-shadow-2xl opacity-100">
            Pure Origins.
          </h1>
          <h1 ref={text2Ref} className="absolute inset-0 flex flex-col items-center justify-center text-5xl md:text-8xl font-black text-white tracking-tighter uppercase drop-shadow-2xl opacity-0">
            Precision Packed.
          </h1>
          <h1 ref={text3Ref} className="absolute inset-0 flex flex-col items-center justify-center text-5xl md:text-8xl font-black text-white tracking-tighter uppercase drop-shadow-2xl opacity-0">
            Flawless Yield.
          </h1>
          <div ref={text4Ref} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase drop-shadow-2xl">
              The New Standard.
            </h1>
            <button className="mt-8 text-lg font-bold tracking-widest uppercase border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors duration-300 pointer-events-auto">
              Partner With Us
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}