import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Loader = () => {
  const loaderRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.3
    });

    // Enhanced attractive loader animation with GSAP
    function animateDynamicSizes() {
      // Staggered entrance with elastic effects
      tl.set(".box", {
        transformOrigin: "center center",
        rotation: 0
      })
      
      // Header drops in with bounce
      .to(".header", {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
      })
      
      // Navigation items cascade in with wave effect
      .to(".nav-item", {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, "-=0.4")
      
      // Main Components with staggered entrance
      .to(".sidebar", {
        opacity: 1,
        scale: 1,
        x: 0,
        rotation: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.2")
      .to(".content", {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.3")
      .to(".card", {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.2")
      .to(".aside", {
        opacity: 1,
        scale: 1,
        x: 0,
        rotation: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.1")
      .to(".footer", {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.5,
        ease: "power3.out"
      }, "-=0.1")
      
      // Pulse and glow effect
      .to(".box", {
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        duration: 0.3,
        stagger: 0.05
      })
      .to(".box", {
        boxShadow: "0 0 0px rgba(59, 130, 246, 0)",
        duration: 0.3,
        stagger: 0.05
      })
      
      // Morphing animation - Components breathe
      .to(".sidebar", {
        width: "140px",
        height: "170px",
        rotation: 2,
        duration: 1.2,
        ease: "sine.inOut"
      })
      .to(".aside", {
        width: "40px",
        height: "130px",
        rotation: -2,
        duration: 1.2,
        ease: "sine.inOut"
      }, "-=1.2")
      .to(".content", {
        height: "110px",
        scale: 1.05,
        duration: 1.2,
        ease: "sine.inOut"
      }, "-=1.2")
      .to(".card", {
        height: "70px",
        scale: 1.1,
        duration: 1.2,
        ease: "sine.inOut"
      }, "-=1.2")
      .to(".nav-item", {
        height: "45px",
        scale: 1.05,
        duration: 0.8,
        stagger: 0.08,
        ease: "sine.inOut"
      }, "-=0.6")
      .to(".header", {
        height: "80px",
        scale: 1.02,
        duration: 0.8,
        ease: "sine.inOut"
      }, "-=0.6")
      .to(".footer", {
        height: "70px",
        scale: 1.02,
        duration: 0.8,
        ease: "sine.inOut"
      }, "-=0.6")
      
      // Wave motion through navigation
      .to(".nav-item", {
        y: -10,
        duration: 0.4,
        stagger: {
          each: 0.1,
          from: "start"
        },
        ease: "power2.inOut"
      })
      .to(".nav-item", {
        y: 0,
        duration: 0.4,
        stagger: {
          each: 0.1,
          from: "start"
        },
        ease: "power2.inOut"
      }, "-=0.2")
      
      // Content area dominates, sidebar retreats
      .to(".sidebar", {
        width: "50px",
        height: "120px",
        rotation: -3,
        duration: 1.4,
        ease: "power2.inOut"
      })
      .to(".aside", {
        width: "90px",
        height: "180px",
        rotation: 3,
        duration: 1.4,
        ease: "power2.inOut"
      }, "-=1.4")
      .to(".content", {
        height: "140px",
        scale: 1.15,
        duration: 1.4,
        ease: "power2.inOut"
      }, "-=1.4")
      .to(".card", {
        height: "30px",
        scale: 0.9,
        duration: 1.4,
        ease: "power2.inOut"
      }, "-=1.4")
      
      // Rotation effects on main Components
      .to(".content", {
        rotation: 5,
        duration: 0.6,
        ease: "power2.inOut"
      }, "-=0.8")
      .to(".content", {
        rotation: 0,
        duration: 0.6,
        ease: "power2.inOut"
      }, "-=0.4")
      
      // Navigation items dance
      .to(".nav-item", {
        height: "35px",
        scale: 0.95,
        rotation: 1,
        duration: 0.7,
        stagger: 0.06,
        ease: "back.inOut(1.7)"
      }, "-=0.5")
      .to(".header", {
        height: "55px",
        scale: 0.98,
        duration: 0.7,
        ease: "back.inOut(1.7)"
      }, "-=0.5")
      .to(".footer", {
        height: "45px",
        scale: 0.98,
        duration: 0.7,
        ease: "back.inOut(1.7)"
      }, "-=0.5")
      
      // Reset with elastic return
      .to(".sidebar", {
        width: "80px",
        height: "150px",
        rotation: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      })
      .to(".aside", {
        width: "60px",
        height: "150px",
        rotation: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      }, "-=1")
      .to(".content", {
        height: "90px",
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      }, "-=1")
      .to(".card", {
        height: "50px",
        scale: 1,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      }, "-=1")
      .to(".nav-item", {
        height: "30px",
        scale: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: "elastic.out(1, 0.3)"
      }, "-=0.6")
      .to(".header", {
        height: "50px",
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)"
      }, "-=0.6")
      .to(".footer", {
        height: "40px",
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)"
      }, "-=0.6")
      
      // Final pulse before restart
      .to(".layout", {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.inOut"
      })
      .to(".layout", {
        scale: 1,
        duration: 0.2,
        ease: "power2.inOut"
      });
    }

    animateDynamicSizes();

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <style jsx>{`
        body {
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #0f172a;
          color: white;
          font-family: Arial, sans-serif;
        }

        #loader {
          text-align: center;
        }

        .layout {
          width: 400px;
          margin-top: 20px;
        }

        .box {
          background: #1e293b;
          border-radius: 8px;
          opacity: 0;
          transform: scale(0.8);
        }

        /* Header */
        .header {
          height: 50px;
          margin-bottom: 10px;
        }

        /* Navigation */
        .nav-container {
          display: flex;
          gap: 8px;
          margin-bottom: 15px;
        }

        .nav-item {
          height: 30px;
          flex: 1;
        }

        /* Main layout */
        .main-container {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .sidebar {
          height: 150px;
          width: 80px;
        }

        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .content {
          height: 90px;
          position: relative;
        }

        .card {
          height: 50px;
        }

        .aside {
          height: 150px;
          width: 60px;
        }

        /* Footer */
        .footer {
          clear: both;
          height: 40px;
        }
      `}</style>
      
      <div id="loader" ref={loaderRef}>
        <div className="layout">
          <div className="box header"></div>
          <div className="nav-container">
            <div className="box nav-item"></div>
            <div className="box nav-item"></div>
            <div className="box nav-item"></div>
          </div>
          <div className="main-container">
            <div className="box sidebar"></div>
            <div className="content-area">
              <div className="box content"></div>
              <div className="box card"></div>
            </div>
            <div className="box aside"></div>
          </div>
          <div className="box footer"></div>
        </div>
      </div>
    </>
  );
};

export default Loader;
