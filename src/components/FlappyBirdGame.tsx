import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { generateVoucherCode } from '../utils/formatters';
import { Trophy, RotateCcw, Copy, Check, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';

// Game Configuration variables as specified in technical requirements
const WIN_SCORE = 20;
const GRAVITY = 0.28;
const JUMP_FORCE = -5.8;
const PIPE_SPEED = 2.0;
const PIPE_GAP = 160;
const VOUCHER_TEXT = 'Voucher 2 lít xăng';
const BRAND_NAME = 'VietinBank';
const GAME_TITLE = 'Chờ vui – Chơi hay – Nhận quà liền tay';

interface FlappyBirdGameProps {
  onBackToMenu?: () => void;
}

export const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({ onBackToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'won'>('start');
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [latestVoucher, setLatestVoucher] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // References for game loop & internal state
  const stateRef = useRef({
    gameState: 'start' as 'start' | 'playing' | 'gameover' | 'won',
    score: 0,
    birdY: 200,
    birdVelocity: 0,
    pipes: [] as Array<{ x: number; top: number; bottom: number; passed: boolean }>,
    frameCount: 0,
    animationId: 0,
  });

  // Sound generator using Web Audio API (off by default)
  const playBeep = useCallback((freq: number, type: OscillatorType = 'sine', duration = 0.1) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext not allowed before user gesture
    }
  }, [soundEnabled]);

  // Load saved high score and latest voucher from localStorage
  useEffect(() => {
    try {
      const savedHigh = localStorage.getItem('vietin_flappy_high_score');
      if (savedHigh) setHighScore(parseInt(savedHigh, 10));
      const savedVoucher = localStorage.getItem('vietin_flappy_latest_voucher');
      if (savedVoucher) setLatestVoucher(savedVoucher);
    } catch {
      // Ignore localStorage security errors
    }
  }, []);

  const getMotivationMessage = (score: number) => {
    if (score < 5) return 'Khởi động nhẹ nhàng!';
    if (score <= 9) return 'Tốt lắm, tiếp tục nào!';
    if (score <= 14) return 'Một nửa chặng đường rồi!';
    if (score <= 19) return 'Sắp nhận quà rồi!';
    return 'Xuất sắc!';
  };

  const winGame = useCallback((voucher: string) => {
    stateRef.current.gameState = 'won';
    setGameState('won');
    playBeep(880, 'triangle', 0.4);

    // Confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#005596', '#ed1c24', '#ffb800', '#ffffff'],
      });
    } catch {
      // fallback
    }

    // Call window callback if defined
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: voucher,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString(),
      });
    }
  }, [playBeep]);

  const endGame = useCallback((finalScore: number) => {
    stateRef.current.gameState = 'gameover';
    setGameState('gameover');
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
    playBeep(180, 'sawtooth', 0.25);

    // Call window callback if defined
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString(),
      });
    }
  }, [playBeep]);

  const jump = useCallback(() => {
    if (stateRef.current.gameState === 'playing') {
      stateRef.current.birdVelocity = JUMP_FORCE;
      playBeep(440, 'sine', 0.08);
    } else if (stateRef.current.gameState === 'start') {
      startGame();
    }
  }, [playBeep]);

  const startGame = () => {
    stateRef.current.gameState = 'playing';
    stateRef.current.score = 0;
    stateRef.current.birdY = 200;
    stateRef.current.birdVelocity = 0;
    stateRef.current.pipes = [];
    stateRef.current.frameCount = 0;
    setCurrentScore(0);
    setGameState('playing');
    playBeep(523, 'sine', 0.1);
  };

  const resetGame = () => {
    startGame();
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localAnimId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const state = stateRef.current;

      // 1. Clear background - Vietnamese banking daylight aesthetic
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#e0f2fe');
      skyGrad.addColorStop(0.7, '#bae6fd');
      skyGrad.addColorStop(1, '#93c5fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Clouds decoration
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(80, 70, 24, 0, Math.PI * 2);
      ctx.arc(110, 60, 32, 0, Math.PI * 2);
      ctx.arc(140, 70, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(280, 110, 20, 0, Math.PI * 2);
      ctx.arc(305, 100, 26, 0, Math.PI * 2);
      ctx.arc(330, 110, 20, 0, Math.PI * 2);
      ctx.fill();

      // Distant city / bank tower silhouette
      ctx.fillStyle = 'rgba(203, 213, 225, 0.5)';
      ctx.fillRect(40, height - 90, 35, 90);
      ctx.fillRect(80, height - 120, 45, 120);
      ctx.fillRect(135, height - 80, 30, 80);
      ctx.fillRect(240, height - 105, 40, 105);
      ctx.fillRect(290, height - 130, 50, 130);

      // Ground
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, height - 32, width, 32);
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(0, height - 32, width, 5);

      if (state.gameState === 'playing') {
        state.frameCount++;

        // Update bird physics
        state.birdVelocity += GRAVITY;
        state.birdY += state.birdVelocity;

        // Ground & ceiling collision
        if (state.birdY >= height - 32 - 14) {
          state.birdY = height - 32 - 14;
          endGame(state.score);
        }
        if (state.birdY <= 14) {
          state.birdY = 14;
          state.birdVelocity = 0;
        }

        // Spawn pipes
        if (state.frameCount % 90 === 0) {
          const pipeTopHeight = Math.floor(Math.random() * (height - PIPE_GAP - 120)) + 40;
          state.pipes.push({
            x: width,
            top: pipeTopHeight,
            bottom: height - 32 - (pipeTopHeight + PIPE_GAP),
            passed: false,
          });
        }

        // Move and draw pipes
        for (let i = state.pipes.length - 1; i >= 0; i--) {
          const pipe = state.pipes[i];
          pipe.x -= PIPE_SPEED;

          // VietinBank Branded Towers (Deep Blue with Red Accent Line)
          // Top Pipe
          const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + 52, 0);
          topGrad.addColorStop(0, '#005596');
          topGrad.addColorStop(0.5, '#0284c7');
          topGrad.addColorStop(1, '#003e6f');
          ctx.fillStyle = topGrad;
          ctx.fillRect(pipe.x, 0, 52, pipe.top);
          // Top Pipe Lip
          ctx.fillStyle = '#ed1c24';
          ctx.fillRect(pipe.x - 3, pipe.top - 12, 58, 12);

          // Bottom Pipe
          const bottomY = height - 32 - pipe.bottom;
          const botGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + 52, 0);
          botGrad.addColorStop(0, '#005596');
          botGrad.addColorStop(0.5, '#0284c7');
          botGrad.addColorStop(1, '#003e6f');
          ctx.fillStyle = botGrad;
          ctx.fillRect(pipe.x, bottomY, 52, pipe.bottom);
          // Bottom Pipe Lip
          ctx.fillStyle = '#ed1c24';
          ctx.fillRect(pipe.x - 3, bottomY, 58, 12);

          // Star / Coin icon in center of gap to guide customer
          if (!pipe.passed) {
            const coinY = pipe.top + PIPE_GAP / 2;
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(pipe.x + 26, coinY, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#b45309';
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('VB', pipe.x + 26, coinY + 3);
          }

          // Bird Collision Check (Bird is at x: 75, radius: 14)
          const birdX = 75;
          const birdRadius = 13;

          // Check if bird is horizontally inside pipe
          if (birdX + birdRadius > pipe.x && birdX - birdRadius < pipe.x + 52) {
            // Check top pipe collision or bottom pipe collision
            if (state.birdY - birdRadius < pipe.top || state.birdY + birdRadius > bottomY) {
              endGame(state.score);
            }
          }

          // Score update
          if (!pipe.passed && pipe.x + 52 < birdX) {
            pipe.passed = true;
            state.score += 1;
            const newScore = state.score;
            setCurrentScore(newScore);

            // Update High Score
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('vietin_flappy_high_score', newScore.toString());
            }

            // Check Win Condition
            if (newScore >= WIN_SCORE) {
              const code = generateVoucherCode();
              setLatestVoucher(code);
              localStorage.setItem('vietin_flappy_latest_voucher', code);
              winGame(code);
              return;
            }
          }

          // Remove offscreen pipes
          if (pipe.x < -60) {
            state.pipes.splice(i, 1);
          }
        }
      }

      // 3. Draw Bird / VietinBank Flying Mascot (Bank Card / Flying Eagle)
      const birdX = 75;
      const birdY = state.birdY;
      ctx.save();
      ctx.translate(birdX, birdY);
      // Bird rotation based on velocity
      const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (state.birdVelocity * 3.5 * Math.PI) / 180));
      ctx.rotate(rotation);

      // Flying VietinBank Gold Card Mascot
      ctx.fillStyle = '#005596';
      ctx.beginPath();
      ctx.roundRect(-18, -12, 36, 24, 5);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Card chip
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-12, -4, 8, 8);

      // Little Wing
      ctx.fillStyle = '#ed1c24';
      ctx.beginPath();
      const wingFlap = Math.sin(state.frameCount * 0.3) * 6;
      ctx.ellipse(-2, 3, 10, 6 + wingFlap, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Mascot Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, -4, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(10, -4, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Loop
      if (state.gameState === 'playing' || state.gameState === 'start') {
        localAnimId = requestAnimationFrame(render);
      }
    };

    localAnimId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(localAnimId);
    };
  }, [highScore, winGame, endGame]);

  // Handle keyboard spacebar jump
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  return (
    <div id="flappy-voucher-game" className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Game Header Bar */}
      <div className="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wide">
            {BRAND_NAME} Mini Game
          </span>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
            {GAME_TITLE}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Kỷ lục</span>
            <span className="text-xs font-bold text-slate-700">{highScore} điểm</span>
          </div>
        </div>
      </div>

      {/* Progress & Live Motivation Bar (during gameplay) */}
      <div className="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-blue-900 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            Điểm: <span className="text-base text-red-600 font-extrabold">{currentScore}</span> / {WIN_SCORE}
          </span>
          <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[11px]">
            {getMotivationMessage(currentScore)}
          </span>
        </div>

        {/* Progress Bar (0 to 20) */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-amber-400 rounded-full transition-all duration-200"
            style={{ width: `${Math.min(100, (currentScore / WIN_SCORE) * 100)}%` }}
          />
        </div>
      </div>

      {/* Interactive Game Canvas Box */}
      <div 
        className={`relative w-full max-w-[400px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-900/20 bg-sky-200 select-none touch-none cursor-pointer ${
          isShaking ? 'animate-shake' : ''
        }`}
        onClick={jump}
        onTouchStart={(e) => {
          e.preventDefault();
          jump();
        }}
      >
        <canvas
          ref={canvasRef}
          width={380}
          height={480}
          className="w-full h-full block"
        />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-lg shadow-blue-500/40">
              <Sparkles className="w-8 h-8 text-amber-300 animate-spin-slow" />
            </div>

            <h2 className="text-xl font-black mb-1 leading-tight">
              {GAME_TITLE}
            </h2>
            <p className="text-xs text-blue-200 max-w-xs mb-5">
              Vượt qua 20 thử thách để nhận voucher 2 lít xăng
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-base shadow-xl shadow-red-700/40 transition-transform active:scale-95 cursor-pointer"
            >
              Bắt đầu chơi
            </button>

            <p className="text-[11px] text-slate-300 mt-4 flex items-center justify-center gap-1">
              <span>Chạm màn hình hoặc nhấn phím Space để bay</span>
            </p>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3 border border-rose-500/30">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold mb-1">Rất tiếc!</h3>
            <p className="text-sm font-semibold text-rose-200 mb-1">
              Bạn đã vượt qua {currentScore}/{WIN_SCORE} thử thách
            </p>
            <p className="text-xs text-slate-300 mb-6 max-w-xs">
              Chỉ còn một chút nữa thôi, hãy thử lại nhé!
            </p>

            <div className="w-full space-y-2.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGameState('start');
                  if (onBackToMenu) onBackToMenu();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Win Screen */}
        {gameState === 'won' && latestVoucher && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mb-3 shadow-lg shadow-amber-400/40 ring-4 ring-amber-400/30 animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-amber-300 mb-1">Chúc mừng!</h3>
            <p className="text-xs text-slate-200 mb-4 leading-relaxed">
              Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận <span className="font-bold text-amber-300">{VOUCHER_TEXT}</span>.
            </p>

            {/* Voucher Box */}
            <div className="w-full bg-white/10 border-2 border-dashed border-amber-400/60 rounded-2xl p-4 mb-4 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 block mb-1">
                MÃ NHẬN QUÀ TẶNG CỦA BẠN
              </span>
              <span className="text-2xl sm:text-3xl font-black tracking-widest text-white block select-all font-mono">
                {latestVoucher}
              </span>
            </div>

            <p className="text-[11px] text-amber-100 bg-amber-950/40 p-2 rounded-lg border border-amber-500/30 mb-5 leading-normal">
              Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
            </p>

            <div className="w-full flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyVoucherCode(latestVoucher);
                }}
                className="flex-1 py-3 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="flex-1 py-3 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Latest Voucher Display if player reloads page */}
      {latestVoucher && (
        <div className="w-full mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-xs">
          <div>
            <span className="text-[11px] font-bold text-amber-800 block">Mã voucher gần nhất của bạn:</span>
            <span className="text-base font-extrabold text-blue-900 font-mono tracking-wider">{latestVoucher}</span>
            <span className="text-[10px] text-slate-500 block">Phần thưởng: {VOUCHER_TEXT}</span>
          </div>
          <button
            onClick={() => copyVoucherCode(latestVoucher)}
            className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Sao chép</span>
          </button>
        </div>
      )}
    </div>
  );
};
