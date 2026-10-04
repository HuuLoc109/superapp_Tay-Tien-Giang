import React, { useState } from 'react';
import { FlappyBirdGame } from './FlappyBirdGame';
import { SnakeGame } from './SnakeGame';
import contentData from '../data/contentData.json';
import { Gamepad2, Gift, Sparkles, Fuel, Trophy } from 'lucide-react';

export const GamesSection: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'flappy' | 'snake'>('flappy');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
          <Gift className="w-3.5 h-3.5 text-amber-600" />
          <span>Chơi Vui Tại Quầy – Nhận Quà Liền Tay</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight mb-2">
          Góc Giải Trí & Săn Voucher Xăng
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Trong lúc chờ giao dịch viên phục vụ, Quý khách hãy tham gia mini game vui nhộn để rinh voucher đổ xăng 2 lít từ VietinBank!
        </p>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setActiveGame('flappy')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
            activeGame === 'flappy'
              ? 'bg-blue-700 text-white shadow-blue-600/30 ring-2 ring-blue-700/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Game 1: Flappy Bird (Bay Vượt 20 Cột)</span>
        </button>

        <button
          onClick={() => setActiveGame('snake')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
            activeGame === 'snake'
              ? 'bg-blue-700 text-white shadow-blue-600/30 ring-2 ring-blue-700/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span>Game 2: VietinBank Snake (Rắn Săn Mồi)</span>
        </button>
      </div>

      {/* Rewards Reminder Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Fuel className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Cơ Cấu Quà Tặng Voucher Xăng</h4>
            <p className="text-xs text-red-100">
              Đạt 20 điểm nhận 01 voucher 2 lít • Đạt 40 điểm nhận 02 voucher 2 lít xăng
            </p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5" />
          Đổi quà tại quầy ngay
        </span>
      </div>

      {/* Active Game Component */}
      <div className="bg-slate-100/80 p-4 sm:p-8 rounded-3xl border border-slate-200 shadow-inner">
        {activeGame === 'flappy' ? <FlappyBirdGame /> : <SnakeGame />}
      </div>
    </div>
  );
};
