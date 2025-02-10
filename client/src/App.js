import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import axios from "axios";

function App() {
  const [showApp, setShowApp] = useState(false);
  const canvasRef = useRef(null);

  const [prompt, setPrompt] = useState(
    "A stunning aurora borealis sweeps across the dark sky, its vibrant greens and purples shimmering above a vast, untouched snow-covered terrain, creating a magical and serene atmosphere."
  );
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 300;
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.35,
      sizeAttenuation: true,
      transparent: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const animate = () => {
      stars.rotation.y += 0.0005;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    camera.position.z = 50;

    animate();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const text = document.getElementById("distorted-text");
    const subtitle = document.getElementById("subtitle-text");

    gsap.to(text, {
      y: -30,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(text, {
      textShadow: `
        0px 0px 30px rgba(255, 255, 255, 1),
        0px 0px 60px rgba(0, 255, 255, 0.8),
        0px 0px 90px rgba(255, 0, 255, 0.6)
      `,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(subtitle, {
      rotate: 2,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(
      `@keyframes glowing-border {
        0% {
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
        }
        50% {
          border-color: rgba(255, 255, 255, 0.6);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.3);
        }
        100% {
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
        }
      }`,
      styleSheet.cssRules.length
    );
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/text-to-video", { prompt });
      setVideo(response.data.video);
    } catch (err) {
      setError("Failed to generate video. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    setShowApp(true);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div
        className="absolute inset-0 flex flex-col transition-transform duration-1000 ease-in-out"
        style={{
          transform: showApp ? "translateY(-100vh)" : "translateY(0)",
        }}
      >
        <section className="min-h-screen flex flex-col items-center justify-center relative z-10">
          <header className="text-center">
            <h1
              id="distorted-text"
              className="text-5xl font-extrabold tracking-tight text-white mb-12"
            >
              Text-To-Video
            </h1>
            <p id="subtitle-text" className="text-lg text-gray-300 mb-12">
              Transform your imagination into reality with AI-generated videos.
            </p>
          </header>
          <main className="mt-12 flex gap-4">
            <button
              onClick={handleGetStarted}
              style={{
                position: "relative",
                padding: "16px 40px",
                color: "#fff",
                background: "linear-gradient(90deg, #1f1f1f, #282828)",
                fontSize: "1.25rem",
                fontWeight: "bold",
                borderRadius: "50px",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                cursor: "pointer",
                outline: "none",
                zIndex: 1,
                animation: "glowing-border 2s infinite",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 0 25px rgba(255, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "";
              }}
            >
              Get Started
            </button>
          </main>
        </section>

        <section className="min-h-screen flex flex-col items-center justify-center ">
          <div className="flex flex-col md:flex-row w-full max-w-6xl bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden bg-opacity-60">
            <div className="w-full md:w-1/2 p-10">
              <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-200 tracking-wide">
                AI Video Generator
              </h1>
              <textarea
                className="w-full p-5 bg-gray-950 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-700 transition-all resize-none"
                placeholder="Describe the video you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows="8"
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                style={{
                  position: "relative",
                  marginTop: "20px",
                  padding: "16px 40px",
                  color: "#fff",
                  background: "linear-gradient(90deg, #161616, #222222)",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  borderRadius: "50px",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                  cursor: loading || !prompt ? "not-allowed" : "pointer",
                  outline: "none",
                  zIndex: 1,
                  animation: loading ? "" : "glowing-border 2s infinite",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  if (!loading && prompt) {
                    e.target.style.transform = "scale(1.1)";
                    e.target.style.boxShadow =
                      "0 0 25px rgba(255, 255, 255, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && prompt) {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "";
                  }
                }}
              >
                {loading ? "Generating..." : "Generate Video"}
              </button>
              {error && (
                <p className="text-red-500 mt-4 text-center font-medium animate-pulse">
                  {error}
                </p>
              )}
            </div>
            <div className="w-full md:w-1/2 bg-gray-950 flex items-center justify-center p-4">
              {video ? (
                <div className="w-full max-w-lg rounded-lg border border-gray-800 shadow-lg overflow-hidden">
                  <video
                    className="w-full h-full object-contain"
                    src={video.url}
                    controls
                    autoPlay
                    loop
                  />
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 mb-4">No video generated yet</p>
                  <p className="text-gray-600 italic">
                    Describe a scene to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
