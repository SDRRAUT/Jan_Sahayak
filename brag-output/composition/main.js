/**
 * JanSahayak Product Launch Video — Hyperframes Composition Controller
 * Total Duration: 23.5 seconds @ 60fps
 * Implements Hyperframes GSAP contract & window.__timelines registration.
 */

(function () {
  'use strict';

  const DURATION = 23.5;
  const COMPOSITION_ID = 'jansahayak-launch';

  const scenes = Array.from(document.querySelectorAll('.scene'));
  const progressBar = document.getElementById('timelineProgress');
  const waveformContainer = document.getElementById('waveformBars');
  const stampOverlay = document.querySelector('.stamp-overlay');
  const transcriptEl = document.getElementById('liveTranscript');

  const FULL_TRANSCRIPT =
    '"Bhai pichle 3 din se Rohini Sector 14 mein naali ka ganda paani supply mein aa raha hai aur sadak par bohot bada gaddha dhas gaya hai..."';

  // Build 32 waveform visualizer bars
  const NUM_BARS = 32;
  const waveBars = [];
  if (waveformContainer) {
    waveformContainer.innerHTML = '';
    for (let i = 0; i < NUM_BARS; i++) {
      const bar = document.createElement('div');
      bar.className = 'wave-bar';
      waveformContainer.appendChild(bar);
      waveBars.push(bar);
    }
  }

  // Scene metadata
  const sceneData = scenes.map((el) => {
    return {
      el,
      start: parseFloat(el.getAttribute('data-start') || '0'),
      duration: parseFloat(el.getAttribute('data-duration') || '5'),
      get end() {
        return this.start + this.duration;
      },
    };
  });

  /**
   * Deterministic Seek function driven by Hyperframes or live preview clock.
   * @param {number} time - current playback position in seconds
   */
  window.seekTo = function (time) {
    const t = Math.max(0, Math.min(time, DURATION));

    // Update bottom timeline progress bar
    if (progressBar) {
      progressBar.style.width = `${(t / DURATION) * 100}%`;
    }

    // 1. Activate correct scene
    sceneData.forEach((sc, idx) => {
      const isCurrent = t >= sc.start && (t < sc.end || (idx === sceneData.length - 1 && t <= sc.end));
      if (isCurrent) {
        sc.el.classList.add('active');
        sc.el.style.opacity = '1';
        sc.el.style.visibility = 'visible';
        sc.el.style.transform = 'scale(1) translateY(0)';
      } else {
        sc.el.classList.remove('active');
        sc.el.style.opacity = '0';
        sc.el.style.visibility = 'hidden';
        sc.el.style.transform = 'scale(0.96) translateY(10px)';
      }
    });

    // 2. Scene 1 Micro-animations (0.0s - 3.8s)
    if (t >= 0 && t < 3.8) {
      const s1Time = t;
      const silos = document.querySelectorAll('.silo-card');
      silos.forEach((silo, i) => {
        const delay = 0.15 + i * 0.2;
        if (s1Time >= delay) {
          silo.style.opacity = '1';
          silo.style.transform = 'translateY(0)';
        } else {
          silo.style.opacity = '0';
          silo.style.transform = 'translateY(24px)';
        }
      });

      if (stampOverlay) {
        if (s1Time >= 2.0) {
          stampOverlay.classList.add('stamped');
        } else {
          stampOverlay.classList.remove('stamped');
        }
      }
    }

    // 3. Scene 2 Micro-animations (3.8s - 9.0s)
    if (t >= 3.8 && t < 9.0) {
      const s2Time = t - 3.8;

      // Waveform animation
      waveBars.forEach((bar, i) => {
        const freq = 3.5 + (i % 5);
        const heightVal = Math.sin(s2Time * freq + i * 0.4) * 0.5 + 0.5;
        const barHeight = Math.max(10, Math.round(heightVal * 65) + 8);
        bar.style.height = `${barHeight}px`;
        if (barHeight > 35) {
          bar.classList.add('active');
        } else {
          bar.classList.remove('active');
        }
      });

      // Live transcript typing
      if (transcriptEl) {
        const progress = Math.min(1, s2Time / 3.0);
        const charCount = Math.floor(progress * FULL_TRANSCRIPT.length);
        transcriptEl.textContent = FULL_TRANSCRIPT.slice(0, charCount);
      }

      // DNA card entry
      const dnaCard = document.querySelector('.dna-card');
      const arrowLine = document.querySelector('.connection-arrow');
      if (dnaCard && arrowLine) {
        if (s2Time >= 1.8) {
          dnaCard.style.opacity = '1';
          dnaCard.style.transform = 'translateX(0) scale(1)';
          arrowLine.style.opacity = '1';
        } else {
          dnaCard.style.opacity = '0.3';
          dnaCard.style.transform = 'translateX(20px) scale(0.97)';
          arrowLine.style.opacity = '0.4';
        }
      }
    }

    // 4. Scene 3 Micro-animations (9.0s - 14.5s)
    if (t >= 9.0 && t < 14.5) {
      const s3Time = t - 9.0;
      const pins = document.querySelectorAll('.map-pin');
      pins.forEach((pin, i) => {
        const pinDelay = 0.3 + i * 0.35;
        if (s3Time >= pinDelay) {
          pin.style.opacity = '1';
          pin.style.transform = 'translate(-50%, -50%) scale(1)';
        } else {
          pin.style.opacity = '0';
          pin.style.transform = 'translate(-50%, -50%) scale(0.3)';
        }
      });

      const masterCluster = document.querySelector('.master-cluster-node');
      if (masterCluster) {
        if (s3Time >= 2.2) {
          masterCluster.style.opacity = '1';
          masterCluster.style.transform = 'translate(-50%, -50%) scale(1)';
        } else {
          masterCluster.style.opacity = '0';
          masterCluster.style.transform = 'translate(-50%, -50%) scale(0.5)';
        }
      }
    }

    // 5. Scene 4 Micro-animations (14.5s - 19.5s)
    if (t >= 14.5 && t < 19.5) {
      const s4Time = t - 14.5;
      const sopItems = document.querySelectorAll('.sop-item');
      sopItems.forEach((item, i) => {
        const itemDelay = 0.6 + i * 0.7;
        if (s4Time >= itemDelay) {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
          item.classList.add('completed');
        } else {
          item.style.opacity = '0.4';
          item.style.transform = 'translateX(-10px)';
        }
      });

      const citizenConfirm = document.querySelector('.citizen-confirmation-box');
      if (citizenConfirm) {
        if (s4Time >= 2.6) {
          citizenConfirm.style.opacity = '1';
          citizenConfirm.style.transform = 'scale(1)';
        } else {
          citizenConfirm.style.opacity = '0';
          citizenConfirm.style.transform = 'scale(0.9)';
        }
      }
    }

    // 6. Scene 5 Micro-animations (19.5s - 23.5s)
    if (t >= 19.5) {
      const s5Time = t - 19.5;
      const metrics = document.querySelectorAll('.impact-metric');
      metrics.forEach((m, i) => {
        const delay = 0.4 + i * 0.3;
        if (s5Time >= delay) {
          m.style.opacity = '1';
          m.style.transform = 'translateY(0)';
        } else {
          m.style.opacity = '0';
          m.style.transform = 'translateY(16px)';
        }
      });

      const cta = document.querySelector('.launch-cta-pill');
      if (cta) {
        if (s5Time >= 1.6) {
          cta.style.opacity = '1';
          cta.style.transform = 'translateY(0) scale(1)';
        } else {
          cta.style.opacity = '0';
          cta.style.transform = 'translateY(12px) scale(0.95)';
        }
      }
    }
  };

  // Expose composition metadata for Hyperframes
  window.compositionDuration = DURATION;
  window.compositionFps = 60;

  // Set up GSAP Timeline contract for Hyperframes
  if (typeof gsap !== 'undefined') {
    const progressObj = { t: 0 };
    const tl = gsap.timeline({
      paused: true,
      onUpdate: function () {
        window.seekTo(tl.time());
      },
    });

    tl.to(
      progressObj,
      {
        t: DURATION,
        duration: DURATION,
        ease: 'none',
        onUpdate: function () {
          window.seekTo(progressObj.t);
        },
      },
      0
    );

    // Register timeline on window.__timelines
    window.__timelines = window.__timelines || {};
    window.__timelines[COMPOSITION_ID] = tl;
  }

  // Hyperframes direct render hook
  window.render = function (t) {
    window.seekTo(t);
  };

  // Standalone playback loop when not embedded in preview controller
  let isPlaying = false;
  let startTime = null;

  function runPlaybackLoop(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000;
    if (elapsed <= DURATION) {
      window.seekTo(elapsed);
      requestAnimationFrame(runPlaybackLoop);
    } else {
      window.seekTo(DURATION);
      isPlaying = false;
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.seekTo(0);
    const isInsideIframe = window.self !== window.top;
    if (!isInsideIframe && !window.__HYPERFRAMES_CONTROLLED__) {
      setTimeout(() => {
        isPlaying = true;
        startTime = null;
        requestAnimationFrame(runPlaybackLoop);
      }, 400);
    }
  });
})();
