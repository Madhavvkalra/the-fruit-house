"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hideLoader, setHideLoader] = useState(false);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const text4Ref = useRef(null);

  const frameCount = 156; 
  
  const currentFrame = (index) => {
    const paddedIndex = index.toString().padStart(3, '0'); 
    return `/sequence/ezgif-frame-${paddedIndex}.webp`;
  };

  useEffect(() => {
    if (progress === 100) {
      const timer1 = setTimeout(() => {
        setIsLoading(false); 
      }, 400); 
      
      const timer2 = setTimeout(() => {
        setHideLoader(true); 
      }, 1400); 

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(sequence.frame);
    };
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const images = [];
    const sequence = { frame: 1 }; 
    let renderRequested = false; 
    let loadedCount = 0; 

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      
      const handleImageLoadOrError = () => {
        loadedCount++;
        setProgress(Math.floor((loadedCount / frameCount) * 100)); 
        
        if (i === 1) {
          render(1);
        }
      };

      img.onload = handleImageLoadOrError;
      
      img.onerror = () => {
        console.warn(`Frame ${i} missing, but we are skipping it!`);
        handleImageLoadOrError();
      };

      img.src = currentFrame(i);
      img.decode().catch(() => {}); 
      images.push(img);
    }

    function render(index) {
      renderRequested = false; 
      const exactFrame = Math.round(index);
      
      if (!images[exactFrame - 1]) return;
      const img = images[exactFrame - 1];
      
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;
      
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    }

    function requestRender() {
      if (!renderRequested) {
        renderRequested = true;
        window.requestAnimationFrame(() => render(sequence.frame));
      }
    }

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true, 
        start: 'top top',
        end: '+=400%', 
        scrub: 1.5, 
      }
    });

    tl.to(sequence, {
      frame: frameCount,
      snap: 'frame',
      ease: 'none',
      duration: 1, 
      onUpdate: requestRender 
    }, 0);

    tl.to(text1Ref.current, { opacity: 0, duration: 0.1 }, 0.15) 
      .to(text2Ref.current, { opacity: 1, duration: 0.1 }, 0.3)  
      .to(text2Ref.current, { opacity: 0, duration: 0.1 }, 0.45) 
      .to(text3Ref.current, { opacity: 1, duration: 0.1 }, 0.6)  
      .to(text3Ref.current, { opacity: 0, duration: 0.1 }, 0.75) 
      .to(text4Ref.current, { opacity: 1, duration: 0.1 }, 0.85); 

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill(); 
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      {/* --- THE PRELOADER SCREEN --- */}
      {!hideLoader && (
        <div 
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-all duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)] ${
            isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* This container keeps the logo and percentage perfectly centered */}
          <div 
            className={`flex flex-col items-center justify-center transition-transform duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)] ${
              isLoading ? 'scale-100' : 'scale-[20]'
            }`}
          >
            {/* --- YOUR LOGO --- */}
            {/* If your file is named something else, change the src="/logo.png" below! */}
            <img 
              src="/logo.png" 
              alt="The Fruit House Logo" 
              className="w-48 md:w-64 h-auto object-contain mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            />
            
            <div className="text-white/60 font-bold text-xl md:text-2xl tracking-widest">
              {progress}%
            </div>
          </div>
        </div>
      )}

      {/* --- THE MAIN WEBSITE --- */}
      <main ref={containerRef} className="relative h-screen bg-black overflow-hidden">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ willChange: 'transform' }} />
          <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none"></div>

          <div className="relative z-20 w-full h-full flex items-center justify-center text-center px-4">
            <h1 ref={text1Ref} className="absolute w-full text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black text-white tracking-tighter uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] opacity-100">
              Pure Origins.
            </h1>
            <h1 ref={text2Ref} className="absolute w-full text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black text-white tracking-tighter uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] opacity-0">
              Precision Packed.
            </h1>
            <h1 ref={text3Ref} className="absolute w-full text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black text-white tracking-tighter uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] opacity-0">
              Flawless Yield.
            </h1>
            <div ref={text4Ref} className="absolute w-full flex flex-col items-center justify-center opacity-0 pointer-events-none">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black text-white tracking-tighter uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                The New Standard.
              </h1>
              <div className="pointer-events-auto mt-8 md:mt-12">
                <button className="text-sm md:text-lg font-bold tracking-widest uppercase border-2 border-white text-white bg-black/20 backdrop-blur-sm px-8 py-4 hover:bg-white hover:text-black transition-colors duration-300">
                  Partner With Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
