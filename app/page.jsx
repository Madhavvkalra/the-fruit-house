"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Turn the scroll engine back on
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const text4Ref = useRef(null);

  // Set to 60 so you can actually see movement without crashing your PC!
  const frameCount = 60; 
  
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
        pin: true, // THIS IS THE MAGIC TRICK! It locks the screen in place.
        start: 'top top',
        end: '+=300%', // Gives you a nice long scroll distance to play the video
        scrub: 0.5, 
      }
    });

    tl.to(sequence, {
      frame: frameCount,
      snap: 'frame',
      ease: 'none',
      onUpdate: () => render(sequence.frame)
    }, 0);

    tl.to(text1Ref.current, { opacity: 0, duration: 0.5 }, 0.2) 
      .to(text2Ref.current, { opacity: 1, duration: 0.5 }, 0.4)
      .to(text2Ref.current, { opacity: 0, duration: 0.5 }, 0.8)
      .to(text3Ref.current, { opacity: 1, duration: 0.5 }, 1.0)
      .to(text3Ref.current, { opacity: 0, duration: 0.5 }, 1.4)
      .to(text4Ref.current, { opacity: 1, duration: 0.5 }, 1.6);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(sequence.frame);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill(); 
      ScrollTrigger.getAll().forEach(t => t.kill()); // Cleans up the scroll lock
    };
  }, []);

  return (
    <main ref={containerRef} className="relative h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
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
          <div ref={text4Ref} className="absolute inset-0 flex flex-col items-center justify-center opacity-0 pointer-events-none">
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase drop-shadow-2xl">
              The New Standard.
            </h1>
            <div className="pointer-events-auto mt-8">
              <button className="text-lg font-bold tracking-widest uppercase border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors duration-300">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
}
