"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Archivo_Black } from 'next/font/google'; 

const archivoBlack = Archivo_Black({ subsets: ['latin'], weight: '400' });

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
        
        if (i === 1) render(1);
        
        if (loadedCount === frameCount) {
          render(1); 
        }
      };

      img.onload = handleImageLoadOrError;
      
      img.onerror = () => {
        console.warn(`Frame ${i} missing, skipping.`);
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

    requestRender(); 

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill(); 
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      {!hideLoader && (
        <div 
          className={`fixed top-0 left-0 w-screen h-screen z-[9999] flex flex-col items-center justify-center bg-black transition-all duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)] ${
            isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div 
            className={`flex flex-col items-center justify-center transition-transform duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)] w-full max-w-lg px-4 ${
              isLoading ? 'scale-100' : 'scale-[20]'
            }`}
          >
            <img 
              src="/logo.png" 
              alt="The Fruit House" 
              style={{ width: '120px', height: 'auto', display: 'block', margin: '0 auto' }} 
              className="object-contain mb-8"
              onError={(e) => {
                e.target.style.display = 'none';
                document.getElementById('text-fallback').style.display = 'block';
              }}
            />
            
            <h1 
              id="text-fallback" 
              style={{ display: 'none' }} 
              className={`${archivoBlack.className} text-4xl md:text-6xl text-white uppercase mb-8 text-center`}
            >
              The Fruit House
            </h1>
            
            <div className={`${archivoBlack.className} text-white/60 text-xl md:text-3xl tracking-widest text-center`}>
              {progress}%
            </div>
          </div>
        </div>
      )}

      <main ref={containerRef} className={`relative h-screen bg-black overflow-hidden ${archivoBlack.className}`}>
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ willChange: 'transform' }} />
          <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none"></div>

          <div className={`relative z-20 w-full h-full flex items-center justify-center text-center px-4 transition-opacity duration-1000 ease-in-out ${hideLoader ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* FIXED: Removed ALL shadows, bumped up text size dramatically, added leading-none so lines stay tight */}
            <h1 ref={text1Ref} className="absolute w-full text-7xl sm:text-[7rem] md:text-[10rem] lg:text-[14rem] leading-none text-white uppercase opacity-100">
              Pure Origins.
            </h1>
            
            <h1 ref={text2Ref} className="absolute w-full text-7xl sm:text-[7rem] md:text-[10rem] lg:text-[14rem] leading-none text-white uppercase opacity-0">
              Precision Packed.
            </h1>
            
            <h1 ref={text3Ref} className="absolute w-full text-7xl sm:text-[7rem] md:text-[10rem] lg:text-[14rem] leading-none text-white uppercase opacity-0">
              Flawless Yield.
            </h1>
            
            <div ref={text4Ref} className="absolute w-full flex flex-col items-center justify-center opacity-0 pointer-events-none">
              <h1 className="text-7xl sm:text-[7rem] md:text-[10rem] lg:text-[14rem] leading-none text-white uppercase">
                The New Standard.
              </h1>
              <div className="pointer-events-auto mt-12 md:mt-16">
                <button className="text-lg md:text-2xl tracking-widest uppercase border-4 border-white text-white bg-black/20 backdrop-blur-sm px-12 py-6 hover:bg-white hover:text-black transition-colors duration-300">
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
