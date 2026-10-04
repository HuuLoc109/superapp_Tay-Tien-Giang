import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { generateVoucherCode } from '../utils/formatters';
import { 
  Trophy, 
  RotateCcw, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  Sparkles, 
  Copy, 
  Check, 
  Fuel,
  Clock,
  ShieldCheck
} from 'lucide-react';

const GRID_SIZE = 20; // 20x20 grid
const SPEED_MS = 135; // gentle, playable speed for bank customers

interface Point {
  x: number;
  y: number;
}

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [milestoneNotice, setMilestoneNotice] = useState<string | null>(null);
  const [highestRewardTier, setHighestRewardTier] = useState<number>(0); // 0: none, 1: 1 voucher, 2: 2 vouchers
  const [claimSlip, setClaimSlip] = useState<{
    score: number;
    rewardText: string;
    voucherCode: string;
    time: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Mutable game state in ref
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }] as Point[],
    direction: { x: 0, y: -1 } as Point,
    nextDirection: { x: 0, y: -1 } as Point,
    food: { x: 5, y: 5 } as Point,
    score: 0,
    hasNotified20: false,
    hasNotified40: false,
    timer: null as NodeJS.Timeout | null,
  });

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood: Point;
    let collision: boolean;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      collision = snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
    } while (collision);
    return newFood;
  }, []);

  const triggerNotice = (msg: string) => {
    setMilestoneNotice(msg);
    setTimeout(() => {
      setMilestoneNotice(null);
    }, 3500);
  };

  const handleGameOver = useCallback(() => {
    if (gameStateRef.current.timer) {
      clearInterval(gameStateRef.current.timer);
      gameStateRef.current.timer = null;
    }
    setIsPlaying(false);
    setIsGameOver(true);

    const finalScore = gameStateRef.current.score;
    let rewardText = '';
    if (finalScore >= 40) {
      rewardText = '02 voucher xăng (mỗi voucher trị giá 2 lít)';
      try {
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else if (finalScore >= 20) {
      rewardText = '01 voucher xăng trị giá 2 lít';
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      } catch {}
    } else {
      rewardText = 'Chưa đạt mốc nhận voucher (Cần tối thiểu 20 điểm)';
    }

    const now = new Date();
    const formattedTime = now.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    setClaimSlip({
      score: finalScore,
      rewardText,
      voucherCode: finalScore >= 20 ? generateVoucherCode() : 'VB-TRYAGAIN',
      time: formattedTime,
    });
  }, []);

  const gameStep = useCallback(() => {
    const state = gameStateRef.current;
    state.direction = state.nextDirection;

    const head = state.snake[0];
    const newHead: Point = {
      x: head.x + state.direction.x,
      y: head.y + state.direction.y,
    };

    // Check Wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      handleGameOver();
      return;
    }

    // Check Self collision
    if (state.snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
      handleGameOver();
      return;
    }

    state.snake.unshift(newHead);

    // Check Food
    if (newHead.x === state.food.x && newHead.y === state.food.y) {
      state.score += 1;
      setScore(state.score);

      // Milestone 20 check
      if (state.score >= 20 && !state.hasNotified20) {
        state.hasNotified20 = true;
        setHighestRewardTier(1);
        triggerNotice('Chúc mừng Quý khách đã đạt 20 điểm! Quý khách nhận được 01 voucher xăng trị giá 2 lít.');
      }
      // Milestone 40 check
      if (state.score >= 40 && !state.hasNotified40) {
        state.hasNotified40 = true;
        setHighestRewardTier(2);
        triggerNotice('Xuất sắc! Quý khách đã đạt 40 điểm! Quý khách nhận được 02 voucher xăng, mỗi voucher trị giá 2 lít.');
      }

      state.food = generateFood(state.snake);
    } else {
      state.snake.pop();
    }

    draw();
  }, [handleGameOver, generateFood]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;
    const cellSize = canvas.width / GRID_SIZE;

    // Background pattern
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food (VietinBank Red Fuel Voucher Icon)
    const fx = state.food.x * cellSize;
    const fy = state.food.y * cellSize;
    ctx.fillStyle = '#ed1c24';
    ctx.beginPath();
    ctx.roundRect(fx + 2, fy + 2, cellSize - 4, cellSize - 4, 4);
    ctx.fill();

    // Food inner star
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(fx + cellSize / 2, fy + cellSize / 2, cellSize / 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Snake
    state.snake.forEach((seg, idx) => {
      const sx = seg.x * cellSize;
      const sy = seg.y * cellSize;

      if (idx === 0) {
        // Head: Blue with white eye
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(sx + 1, sy + 1, cellSize - 2, cellSize - 2, 6);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx + cellSize / 2, sy + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(sx + cellSize / 2, sy + cellSize / 2, cellSize / 8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Body: Gradient cyan/blue segments
        ctx.fillStyle = idx % 2 === 0 ? '#0369a1' : '#0284c7';
        ctx.beginPath();
        ctx.roundRect(sx + 2, sy + 2, cellSize - 4, cellSize - 4, 4);
        ctx.fill();
      }
    });
  };

  const startGame = () => {
    if (gameStateRef.current.timer) clearInterval(gameStateRef.current.timer);

    const initialSnake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    gameStateRef.current = {
      snake: initialSnake,
      direction: { x: 0, y: -1 },
      nextDirection: { x: 0, y: -1 },
      food: generateFood(initialSnake),
      score: 0,
      hasNotified20: false,
      hasNotified40: false,
      timer: null,
    };

    setScore(0);
    setHighestRewardTier(0);
    setMilestoneNotice(null);
    setClaimSlip(null);
    setIsGameOver(false);
    setIsPlaying(true);

    gameStateRef.current.timer = setInterval(gameStep, SPEED_MS);
    draw();
  };

  const changeDirection = (newDir: Point) => {
    const cur = gameStateRef.current.direction;
    // Prevent 180 reverse
    if (cur.x + newDir.x === 0 && cur.y + newDir.y === 0) return;
    gameStateRef.current.nextDirection = newDir;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (gameStateRef.current.timer) {
        clearInterval(gameStateRef.current.timer);
      }
    };
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wide">
            VietinBank Arcade
          </span>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
            VietinBank Snake Challenge
          </h3>
          <p className="text-xs text-slate-500">Chơi vui tại quầy – Săn voucher xăng hấp dẫn</p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-medium">Điểm hiện tại</span>
          <span className="text-xl font-black text-blue-700">{score}</span>
        </div>
      </div>

      {/* Rules & Milestone Badges */}
      <div className="w-full grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
          highestRewardTier >= 1 ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-white border-slate-200 text-slate-600'
        }`}>
          <Fuel className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <span className="font-bold block">Mốc 20 điểm</span>
            <span className="text-[11px]">01 voucher 2 lít xăng</span>
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
          highestRewardTier >= 2 ? 'bg-red-50 border-red-300 text-red-900' : 'bg-white border-slate-200 text-slate-600'
        }`}>
          <Award className="w-4 h-4 text-red-600 shrink-0" />
          <div>
            <span className="font-bold block">Mốc 40 điểm</span>
            <span className="text-[11px]">02 voucher 2 lít xăng</span>
          </div>
        </div>
      </div>

      {/* Milestone Non-blocking Notification */}
      {milestoneNotice && (
        <div className="w-full mb-3 p-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{milestoneNotice}</span>
        </div>
      )}

      {/* Canvas Area */}
      <div className="relative w-full max-w-[380px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className="w-full h-full block"
        />

        {/* Start Game Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>
            <h3 className="text-xl font-black mb-1">VietinBank Snake Challenge</h3>
            <p className="text-xs text-blue-200 mb-6 max-w-xs">
              Dùng phím mũi tên hoặc bàn phím ảo để điều khiển rắn ăn điểm thưởng VietinBank!
            </p>
            <button
              onClick={startGame}
              className="py-3 px-8 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-extrabold text-sm shadow-xl shadow-red-700/40 cursor-pointer active:scale-95 transition-transform"
            >
              Bắt đầu chơi
            </button>
          </div>
        )}
      </div>

      {/* On-screen D-Pad for Mobile & Counter Tablet Users */}
      <div className="mt-4 flex flex-col items-center gap-1.5 select-none touch-none">
        <button
          onClick={() => changeDirection({ x: 0, y: -1 })}
          disabled={!isPlaying}
          className="w-13 h-13 rounded-2xl bg-white border border-slate-300 text-slate-700 active:bg-blue-600 active:text-white shadow-sm flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Lên"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDirection({ x: -1, y: 0 })}
            disabled={!isPlaying}
            className="w-13 h-13 rounded-2xl bg-white border border-slate-300 text-slate-700 active:bg-blue-600 active:text-white shadow-sm flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Trái"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => changeDirection({ x: 0, y: 1 })}
            disabled={!isPlaying}
            className="w-13 h-13 rounded-2xl bg-white border border-slate-300 text-slate-700 active:bg-blue-600 active:text-white shadow-sm flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Xuống"
          >
            <ArrowDown className="w-6 h-6" />
          </button>

          <button
            onClick={() => changeDirection({ x: 1, y: 0 })}
            disabled={!isPlaying}
            className="w-13 h-13 rounded-2xl bg-white border border-slate-300 text-slate-700 active:bg-blue-600 active:text-white shadow-sm flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Phải"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Phiếu xác nhận quà tặng Modal (End of Game) */}
      {isGameOver && claimSlip && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Ticket Header */}
            <div className="text-center pb-4 border-b border-dashed border-slate-200">
              <span className="text-[11px] font-bold text-red-600 tracking-wider uppercase">
                VietinBank Quầy Giao Dịch
              </span>
              <h3 className="text-xl font-extrabold text-blue-950">
                Phiếu Xác Nhận Quà Tặng
              </h3>
              <p className="text-xs text-slate-500">Chương trình tri ân khách hàng chờ giao dịch</p>
            </div>

            {/* Ticket Content */}
            <div className="my-5 space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500">Điểm số đạt được:</span>
                <span className="font-extrabold text-base text-blue-700">{claimSlip.score} điểm</span>
              </div>

              <div className="flex items-start justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-amber-800 font-medium shrink-0">Mức quà đạt được:</span>
                <span className="font-bold text-right text-slate-900 ml-2">{claimSlip.rewardText}</span>
              </div>

              {claimSlip.score >= 20 && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-[10px] text-blue-700 font-bold block mb-1 uppercase tracking-wider">
                    Mã xác nhận voucher
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-xl font-black text-red-600 tracking-widest">
                      {claimSlip.voucherCode}
                    </span>
                    <button
                      onClick={() => copyCode(claimSlip.voucherCode)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Thời gian:
                </span>
                <span>{claimSlip.time}</span>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="p-3 rounded-xl bg-slate-100 text-slate-600 text-[11px] flex items-start gap-2 mb-6">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <p>
                <span className="font-bold">Lưu ý:</span> Vui lòng chụp màn hình hoặc thông báo với giao dịch viên để nhận quà.
              </p>
            </div>

            {/* Action */}
            <button
              onClick={() => {
                setIsGameOver(false);
                setClaimSlip(null);
                startGame();
              }}
              className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại lượt mới</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
