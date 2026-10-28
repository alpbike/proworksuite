import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  FileText, 
  Wallet, 
  BarChart3, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Circle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CalendarDays, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Tag, 
  PieChart as PieChartIcon, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  X,
  User,
  Eye,
  Maximize2,
  Share2,
  Copy,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';

// Custom Local Storage Hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

// Türk Lirası Formatlayıcı
const formatTL = (amount) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useLocalStorage('theme_mode', true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  // Data Stores
  const [todos, setTodos] = useLocalStorage('app_todos', [
    { id: '1', title: 'Aylık bütçe raporunu incele', description: 'Şirket ve kişisel harcama kalemlerini karşılaştırıp tasarruf oranını %15 seviyesine çıkar.', dueDate: '2026-10-29', priority: 'high', completed: false, category: 'Finans' },
    { id: '2', title: 'Yapay zeka projesi için araştırma yap', description: 'Mobil uyumluluk için hafif LLM modelleri ve Capacitor entegrasyonlarını sına.', dueDate: '2026-10-30', priority: 'medium', completed: true, category: 'İş' },
    { id: '3', title: 'Haftalık Kardiyo ve Spor', description: 'Spor salonunda 45 dk egzersiz ve hafif tempo koşu.', dueDate: '2026-10-28', priority: 'low', completed: false, category: 'Kişisel' }
  ]);

  const [notes, setNotes] = useLocalStorage('app_notes', [
    { id: '1', title: 'Haftalık Strateji Notları', content: 'Önümüzdeki hafta yazılım mimarisi güncellenecek.\n\n- Mobil uyumluluk ön planda tutulmalı.\n- Offline önbellekleme desteği eklenecek.\n- UI animasyonları optimize edilecek.', tags: ['İş', 'Plan'], date: '2026-10-28' },
    { id: '2', title: 'Okuma & Kitap Önerileri', content: '1. Atomik Alışkanlıklar - James Clear\n2. Derin Çalışma - Cal Newport\n3. Psikoloji ve Para - Morgan Housel', tags: ['Kişisel', 'Gelişim'], date: '2026-10-25' }
  ]);

  const [transactions, setTransactions] = useLocalStorage('app_transactions', [
    { id: '1', title: 'Yazılım Sektör Maaşı', amount: 55000, type: 'income', category: 'Maaş', date: '2026-10-01', note: 'Ekim ayı net maaş ödemesi' },
    { id: '2', title: 'Haftalık Market Alışverişi', amount: 2450, type: 'expense', category: 'Gıda', date: '2026-10-15', note: 'Süpermarket mutfak ihtiyaçları' },
    { id: '3', title: 'Elektrik & İnternet Faturası', amount: 1350, type: 'expense', category: 'Fatura', date: '2026-10-20', note: 'Fiber internet ve ev elektriği' },
    { id: '4', title: 'Aylık Akbil / Ulaşım', amount: 1800, type: 'expense', category: 'Ulaşım', date: '2026-10-22', note: 'Abonman yüklemesi ve taksi' },
    { id: '5', title: 'Sinema ve Dışarıda Yemek', amount: 1100, type: 'expense', category: 'Eğlence', date: '2026-10-26', note: 'Hafta sonu etkinliği' }
  ]);

  // Active Modals & View States
  const [modalType, setModalType] = useState(null); // 'todo', 'note', 'transaction'
  const [editingItem, setEditingItem] = useState(null);
  const [viewItem, setViewItem] = useState(null); // Detail Reader Modal State

  // Stats Computations
  const totalIncome = useMemo(() => {
    return transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  }, [transactions]);

  const netBalance = totalIncome - totalExpense;
  const completedTodosCount = todos.filter(t => t.completed).length;
  const todoCompletionRate = todos.length ? Math.round((completedTodosCount / todos.length) * 100) : 0;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 select-none ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* 1. TOP HEADER */}
      <header className={`sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'}`}
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/30">
              P
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">ProSuite</h1>
              <p className="text-[10px] text-slate-400">Kişisel Verimlilik & Finans</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold text-xs border border-indigo-500/20">
            ₺ TRY
          </div>
        </div>
      </header>

      {/* 2. DRAWER MENU */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            onClick={() => setIsDrawerOpen(false)} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />
          <div className={`relative w-4/5 max-w-xs h-full p-5 flex flex-col justify-between shadow-2xl z-10 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}`}>
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    U
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Kullanıcı Profil</h3>
                    <p className="text-xs text-indigo-400 font-medium">Pro Sürüm • Aktif</p>
                  </div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <nav className="mt-6 space-y-1">
                <DrawerNavItem id="dashboard" label="Genel Bakış" icon={<LayoutDashboard size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} setIsDrawerOpen={setIsDrawerOpen} isDarkMode={isDarkMode} />
                <DrawerNavItem id="todos" label="Yapılacaklar" icon={<CheckSquare size={20} />} badge={todos.filter(t => !t.completed).length} activeTab={activeTab} setActiveTab={setActiveTab} setIsDrawerOpen={setIsDrawerOpen} isDarkMode={isDarkMode} />
                <DrawerNavItem id="calendar" label="Takvim" icon={<CalendarIcon size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} setIsDrawerOpen={setIsDrawerOpen} isDarkMode={isDarkMode} />
                <DrawerNavItem id="notes" label="Notlarım" icon={<FileText size={20} />} badge={notes.length} activeTab={activeTab} setActiveTab={setActiveTab} setIsDrawerOpen={setIsDrawerOpen} isDarkMode={isDarkMode} />
                <DrawerNavItem id="finance" label="Cüzdan & Harcamalar" icon={<Wallet size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} setIsDrawerOpen={setIsDrawerOpen} isDarkMode={isDarkMode} />
                <DrawerNavItem id="analytics" label="İstatistikler & Analiz" icon={<BarChart3 size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} setIsDrawerOpen={setIsDrawerOpen} isDarkMode={isDarkMode} />
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800/60 text-xs text-slate-500 text-center">
              ProWorkSuite Mobile v3.0 • 2026
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 overflow-y-auto pb-24 p-4 max-w-xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <DashboardView 
            todos={todos} 
            notes={notes} 
            transactions={transactions} 
            totalIncome={totalIncome} 
            totalExpense={totalExpense} 
            netBalance={netBalance} 
            todoCompletionRate={todoCompletionRate} 
            setActiveTab={setActiveTab}
            isDarkMode={isDarkMode}
            setViewItem={setViewItem}
          />
        )}

        {activeTab === 'todos' && (
          <TodosView 
            todos={todos} 
            setTodos={setTodos} 
            isDarkMode={isDarkMode} 
            setModalType={setModalType} 
            setEditingItem={setEditingItem} 
            setViewItem={setViewItem}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView 
            todos={todos} 
            transactions={transactions} 
            isDarkMode={isDarkMode} 
            setViewItem={setViewItem}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView 
            notes={notes} 
            setNotes={setNotes} 
            isDarkMode={isDarkMode} 
            setModalType={setModalType} 
            setEditingItem={setEditingItem} 
            setViewItem={setViewItem}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceView 
            transactions={transactions} 
            setTransactions={setTransactions} 
            totalIncome={totalIncome} 
            totalExpense={totalExpense} 
            netBalance={netBalance} 
            isDarkMode={isDarkMode} 
            setModalType={setModalType} 
            setEditingItem={setEditingItem} 
            setViewItem={setViewItem}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView 
            todos={todos} 
            transactions={transactions} 
            notes={notes} 
            isDarkMode={isDarkMode} 
          />
        )}
      </main>

      {/* 3. FLOATING ACTION BUTTON */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end space-y-2">
        {isFabOpen && (
          <div className="flex flex-col items-end space-y-2 mb-2 animate-fadeIn">
            <button 
              onClick={() => { setIsFabOpen(false); setEditingItem(null); setModalType('todo'); }}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold transition-all transform active:scale-95"
            >
              <span>Yeni Görev</span>
              <CheckSquare size={16} />
            </button>
            <button 
              onClick={() => { setIsFabOpen(false); setEditingItem(null); setModalType('note'); }}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold transition-all transform active:scale-95"
            >
              <span>Yeni Not</span>
              <FileText size={16} />
            </button>
            <button 
              onClick={() => { setIsFabOpen(false); setEditingItem(null); setModalType('transaction'); }}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold transition-all transform active:scale-95"
            >
              <span>Yeni Finans İşlemi</span>
              <Wallet size={16} />
            </button>
          </div>
        )}
        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 transition-transform active:scale-95 ${isFabOpen ? 'rotate-45 bg-rose-600 hover:bg-rose-700' : ''}`}
        >
          <Plus size={28} />
        </button>
      </div>

      {/* 4. BOTTOM NAVIGATION BAR */}
      <nav className={`fixed bottom-0 left-0 right-0 z-30 h-16 border-t flex items-center justify-around px-2 backdrop-blur-lg ${isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
        <BottomNavItem id="dashboard" label="Özet" icon={<LayoutDashboard size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
        <BottomNavItem id="todos" label="Görevler" icon={<CheckSquare size={20} />} badge={todos.filter(t => !t.completed).length} activeTab={activeTab} setActiveTab={setActiveTab} />
        <BottomNavItem id="calendar" label="Takvim" icon={<CalendarIcon size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
        <BottomNavItem id="notes" label="Notlar" icon={<FileText size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
        <BottomNavItem id="finance" label="Cüzdan" icon={<Wallet size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
      </nav>

      {/* EDIT/CREATE MODALS */}
      {modalType && (
        <ModalWrapper isDarkMode={isDarkMode} onClose={() => { setModalType(null); setEditingItem(null); }}>
          {modalType === 'todo' && (
            <TodoForm 
              todos={todos} 
              setTodos={setTodos} 
              editingItem={editingItem} 
              onClose={() => { setModalType(null); setEditingItem(null); }} 
              isDarkMode={isDarkMode} 
            />
          )}
          {modalType === 'note' && (
            <NoteForm 
              notes={notes} 
              setNotes={setNotes} 
              editingItem={editingItem} 
              onClose={() => { setModalType(null); setEditingItem(null); }} 
              isDarkMode={isDarkMode} 
            />
          )}
          {modalType === 'transaction' && (
            <TransactionForm 
              transactions={transactions} 
              setTransactions={setTransactions} 
              editingItem={editingItem} 
              onClose={() => { setModalType(null); setEditingItem(null); }} 
              isDarkMode={isDarkMode} 
            />
          )}
        </ModalWrapper>
      )}

      {/* VIEW READER MODAL (Tıklanıp Açılan İçerik Okuyucu) */}
      {viewItem && (
        <ModalWrapper isDarkMode={isDarkMode} onClose={() => setViewItem(null)}>
          <DetailReaderModal 
            item={viewItem} 
            onClose={() => setViewItem(null)} 
            isDarkMode={isDarkMode} 
            setEditingItem={setEditingItem}
            setModalType={setModalType}
          />
        </ModalWrapper>
      )}
    </div>
  );
}

// NAVIGATION COMPONENTS
function BottomNavItem({ id, label, icon, badge, activeTab, setActiveTab }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
        isActive ? 'text-indigo-500 font-bold' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <div className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] tracking-tight">{label}</span>
      {isActive && <div className="absolute bottom-1 w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
    </button>
  );
}

function DrawerNavItem({ id, label, icon, badge, activeTab, setActiveTab, setIsDrawerOpen, isDarkMode }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => { setActiveTab(id); setIsDrawerOpen(false); }}
      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl font-medium text-sm transition-all ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
          : isDarkMode 
            ? 'text-slate-300 hover:bg-slate-800' 
            : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-0.5 text-xs rounded-full font-bold bg-indigo-500/20 text-indigo-400">
          {badge}
        </span>
      )}
    </button>
  );
}

function ModalWrapper({ children, onClose, isDarkMode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl transition-all ${isDarkMode ? 'bg-slate-900 text-slate-100 border border-slate-800' : 'bg-white text-slate-800'}`}>
        {children}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// DETAIL READER MODAL (Tıklanan Kalemlerin Açılıp Okunması)
// ----------------------------------------------------
function DetailReaderModal({ item, onClose, isDarkMode, setEditingItem, setModalType }) {
  const isNote = item.content !== undefined;
  const isTodo = item.priority !== undefined;
  const isTransaction = item.amount !== undefined;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800/60 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            {isNote ? '📄 Not Detayı' : isTodo ? '☑️ Görev Detayı' : '💳 Finansal İşlem Fişi'}
          </span>
          <h2 className="text-xl font-bold mt-1">{item.title}</h2>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400">
          <X size={20} />
        </button>
      </div>

      {/* Content Body */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {isNote && (
          <div className="space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{item.content}</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {item.tags?.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1 pt-2">
              <Clock size={14} /> Oluşturulma: {item.date}
            </div>
          </div>
        )}

        {isTodo && (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Açıklama:</span>
              <p className="text-sm text-slate-200">{item.description || 'Açıklama eklenmemiş.'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                <span className="text-slate-400 block mb-1">Öncelik Seviyesi:</span>
                <PriorityBadge priority={item.priority} />
              </div>
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                <span className="text-slate-400 block mb-1">Son Tarih:</span>
                <span className="font-semibold text-slate-200">{item.dueDate}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${item.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {item.completed ? '✓ Tamamlandı' : '⏳ Bekliyor'}
              </span>
            </div>
          </div>
        )}

        {isTransaction && (
          <div className="space-y-4">
            <div className="text-center py-4 bg-slate-800/30 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">İşlem Tutarı</span>
              <span className={`text-3xl font-black ${item.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.type === 'income' ? '+' : '-'}{formatTL(item.amount)}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/20">
                <span className="text-slate-400">Kategori:</span>
                <span className="font-bold">{item.category}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/20">
                <span className="text-slate-400">Tarih:</span>
                <span className="font-bold">{item.date}</span>
              </div>
              {item.note && (
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/20">
                  <span className="text-slate-400">Not:</span>
                  <span className="font-bold">{item.note}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
        <button 
          onClick={() => {
            onClose();
            setEditingItem(item);
            setModalType(isNote ? 'note' : isTodo ? 'todo' : 'transaction');
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 text-xs font-bold transition-colors"
        >
          <Edit3 size={14} />
          <span>Düzenle</span>
        </button>
        <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold">
          Kapat
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1. DASHBOARD VIEW
// ----------------------------------------------------
function DashboardView({ todos, notes, transactions, totalIncome, totalExpense, netBalance, todoCompletionRate, setActiveTab, isDarkMode, setViewItem }) {
  const pendingTodos = todos.filter(t => !t.completed).slice(0, 4);
  const recentTransactions = [...transactions].reverse().slice(0, 4);
  const recentNotes = notes.slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Hoş Geldiniz 👋</h2>
          <p className="text-slate-400 text-xs mt-0.5">Bugünkü verimlilik ve finans özetiniz.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard 
          title="Net Bakiye" 
          value={formatTL(netBalance)} 
          icon={<Wallet className="text-indigo-400" size={20} />} 
          subtitle="Toplam varlık"
          isDarkMode={isDarkMode} 
        />
        <SummaryCard 
          title="Görev Durumu" 
          value={`%${todoCompletionRate}`} 
          icon={<CheckCircle className="text-emerald-400" size={20} />} 
          subtitle={`${todos.filter(t => t.completed).length}/${todos.length} Görev`}
          isDarkMode={isDarkMode} 
        />
        <SummaryCard 
          title="Toplam Gelir" 
          value={formatTL(totalIncome)} 
          icon={<ArrowUpRight className="text-emerald-400" size={20} />} 
          subtitle="Aylık Giriş"
          isDarkMode={isDarkMode} 
        />
        <SummaryCard 
          title="Toplam Gider" 
          value={formatTL(totalExpense)} 
          icon={<ArrowDownRight className="text-rose-400" size={20} />} 
          subtitle="Aylık Çıkış"
          isDarkMode={isDarkMode} 
        />
      </div>

      {/* Pending Tasks */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <CheckSquare className="text-indigo-400" size={18} />
            <h3 className="font-bold text-sm">Bekleyen Görevler</h3>
          </div>
          <button onClick={() => setActiveTab('todos')} className="text-xs font-semibold text-indigo-400 hover:underline">
            Tümü ({todos.length})
          </button>
        </div>

        <div className="space-y-2">
          {pendingTodos.map(todo => (
            <div 
              key={todo.id} 
              onClick={() => setViewItem(todo)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer hover:border-indigo-500/40 ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}
            >
              <div className="flex items-center space-x-3">
                <PriorityBadge priority={todo.priority} />
                <span className="font-medium text-xs truncate max-w-[160px]">{todo.title}</span>
              </div>
              <Eye size={14} className="text-slate-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notes */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FileText className="text-purple-400" size={18} />
            <h3 className="font-bold text-sm">Son Notlar (Tıkla ve Oku)</h3>
          </div>
          <button onClick={() => setActiveTab('notes')} className="text-xs font-semibold text-indigo-400 hover:underline">
            Tüm Notlar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {recentNotes.map(note => (
            <div 
              key={note.id} 
              onClick={() => setViewItem(note)}
              className={`p-3 rounded-xl border space-y-1.5 cursor-pointer transition-all hover:border-purple-500/40 ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-indigo-300">{note.title}</h4>
                <Eye size={12} className="text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, subtitle, isDarkMode }) {
  return (
    <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{title}</span>
        <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{icon}</div>
      </div>
      <div>
        <h3 className="text-base font-bold tracking-tight">{value}</h3>
        <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const colors = {
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };
  const labels = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' };

  return (
    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md border ${colors[priority]}`}>
      {labels[priority]}
    </span>
  );
}

// ----------------------------------------------------
// 2. TODOS VIEW
// ----------------------------------------------------
function TodosView({ todos, setTodos, isDarkMode, setModalType, setEditingItem, setViewItem }) {
  const [search, setSearch] = useState('');

  const toggleTodo = (id, e) => {
    e.stopPropagation();
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id, e) => {
    e.stopPropagation();
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = todos.filter(todo => todo.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Yapılacaklar</h2>
          <p className="text-xs text-slate-400">Detay için göreve tıklayın.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setModalType('todo'); }} 
          className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md"
        >
          <Plus size={16} />
          <span>Ekle</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Görev ara..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
        />
      </div>

      <div className="space-y-2">
        {filteredTodos.map(todo => (
          <div 
            key={todo.id} 
            onClick={() => setViewItem(todo)}
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              todo.completed 
                ? 'opacity-50 bg-slate-900/30 border-slate-800' 
                : isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-3">
              <button onClick={(e) => toggleTodo(todo.id, e)} className="text-slate-400 hover:text-indigo-400">
                {todo.completed ? <CheckCircle className="text-indigo-500" size={20} /> : <Circle size={20} />}
              </button>
              <div>
                <h4 className={`font-medium text-xs ${todo.completed ? 'line-through text-slate-500' : ''}`}>
                  {todo.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                  <span>{todo.dueDate}</span>
                  <span>•</span>
                  <span>{todo.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <PriorityBadge priority={todo.priority} />
              <button onClick={(e) => deleteTodo(todo.id, e)} className="p-1 text-slate-400 hover:text-rose-400">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. CALENDAR VIEW
// ----------------------------------------------------
function CalendarView({ todos, transactions, isDarkMode, setViewItem }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 28));

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Takvim</h2>
        <div className="flex items-center space-x-2">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1.5 rounded-lg border border-slate-800">
            <ChevronLeft size={16} />
          </button>
          <span className="font-bold text-xs">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1.5 rounded-lg border border-slate-800">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="grid grid-cols-7 gap-1 mb-2 text-center font-bold text-[10px] text-slate-400">
          <div>Paz</div><div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div><div>Cmt</div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 rounded-lg bg-transparent" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNumber = i + 1;
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
            const dayTodos = todos.filter(t => t.dueDate === dateStr);
            const dayTransactions = transactions.filter(t => t.date === dateStr);

            return (
              <div 
                key={dayNumber} 
                className={`h-20 p-1 rounded-lg border flex flex-col justify-between overflow-hidden ${
                  dayNumber === 28 ? 'border-indigo-500 bg-indigo-500/10 font-bold' : 'border-slate-800/40 bg-slate-800/20'
                }`}
              >
                <span className="text-[10px] text-slate-400">{dayNumber}</span>
                <div className="space-y-0.5">
                  {dayTodos.map(t => (
                    <div key={t.id} onClick={() => setViewItem(t)} className="text-[8px] bg-indigo-500/20 text-indigo-300 rounded p-0.5 truncate cursor-pointer">
                      ✓ {t.title}
                    </div>
                  ))}
                  {dayTransactions.map(t => (
                    <div key={t.id} onClick={() => setViewItem(t)} className="text-[8px] bg-emerald-500/20 text-emerald-300 rounded p-0.5 truncate cursor-pointer">
                      ₺{t.amount}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. NOTES VIEW
// ----------------------------------------------------
function NotesView({ notes, setNotes, isDarkMode, setModalType, setEditingItem, setViewItem }) {
  const [search, setSearch] = useState('');

  const deleteNote = (id, e) => {
    e.stopPropagation();
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Notlarım</h2>
          <p className="text-xs text-slate-400">Okumak ve açmak için karta tıklayın.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setModalType('note'); }} 
          className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md"
        >
          <Plus size={16} />
          <span>Not Ekle</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Notlarda ara..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredNotes.map(note => (
          <div 
            key={note.id} 
            onClick={() => setViewItem(note)}
            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 cursor-pointer transition-all hover:border-indigo-500/50 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-bold text-sm text-indigo-300">{note.title}</h3>
                <span className="text-[10px] text-slate-500">{note.date}</span>
              </div>
              <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed">{note.content}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">
              <div className="flex flex-wrap gap-1">
                {note.tags?.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[9px] bg-indigo-500/10 text-indigo-400 font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Eye size={14} />
                <button onClick={(e) => deleteNote(note.id, e)} className="hover:text-rose-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. FINANCE VIEW
// ----------------------------------------------------
function FinanceView({ transactions, setTransactions, totalIncome, totalExpense, netBalance, isDarkMode, setModalType, setEditingItem, setViewItem }) {
  const deleteTransaction = (id, e) => {
    e.stopPropagation();
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Cüzdan & Harcamalar</h2>
          <p className="text-xs text-slate-400">Türk Lirası (₺) cinsinden bütçe takibi.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setModalType('transaction'); }} 
          className="flex items-center space-x-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md"
        >
          <Plus size={16} />
          <span>İşlem Ekle</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Gelir</span>
          <h4 className="text-xs font-bold text-emerald-400 mt-1">{formatTL(totalIncome)}</h4>
        </div>
        <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Gider</span>
          <h4 className="text-xs font-bold text-rose-400 mt-1">{formatTL(totalExpense)}</h4>
        </div>
        <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Bakiye</span>
          <h4 className="text-xs font-bold text-indigo-400 mt-1">{formatTL(netBalance)}</h4>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <h3 className="font-bold text-sm mb-3">Son İşlemler (Detay Fişi İçin Tıklayın)</h3>
        <div className="space-y-2">
          {transactions.map(t => (
            <div 
              key={t.id} 
              onClick={() => setViewItem(t)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-800/40 hover:border-slate-700 cursor-pointer transition-all"
            >
              <div>
                <p className="font-semibold text-xs">{t.title}</p>
                <span className="text-[10px] text-slate-400">{t.category} • {t.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`font-bold text-xs ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatTL(t.amount)}
                </span>
                <button onClick={(e) => deleteTransaction(t.id, e)} className="text-slate-500 hover:text-rose-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 6. ANALYTICS VIEW
// ----------------------------------------------------
function AnalyticsView({ todos, transactions, isDarkMode }) {
  const expenseByCategory = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return Object.keys(map).map(cat => ({ name: cat, value: map[cat] }));
  }, [transactions]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Analiz ve Grafik</h2>

      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="font-bold text-xs mb-3">Kategoriye Göre Harcama Dağılımı</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {expenseByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// FORMS (MODAL CREATION/EDITING)
// ----------------------------------------------------
function TodoForm({ todos, setTodos, editingItem, onClose, isDarkMode }) {
  const [title, setTitle] = useState(editingItem ? editingItem.title : '');
  const [description, setDescription] = useState(editingItem ? editingItem.description || '' : '');
  const [category, setCategory] = useState(editingItem ? editingItem.category : 'İş');
  const [priority, setPriority] = useState(editingItem ? editingItem.priority : 'medium');
  const [dueDate, setDueDate] = useState(editingItem ? editingItem.dueDate : '2026-10-29');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    if (editingItem) {
      setTodos(todos.map(t => t.id === editingItem.id ? { ...t, title, description, category, priority, dueDate } : t));
    } else {
      setTodos([...todos, { id: Date.now().toString(), title, description, category, priority, dueDate, completed: false }]);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-bold text-base">{editingItem ? 'Görevi Düzenle' : 'Yeni Görev'}</h3>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Görev Başlığı" className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} required />
      <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Görev Detayı & Notu" className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
      <div className="grid grid-cols-2 gap-2">
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className={`px-3 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <option value="high">Yüksek Öncelik</option>
          <option value="medium">Orta Öncelik</option>
          <option value="low">Düşük Öncelik</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={`px-3 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs rounded-xl border border-slate-700">İptal</button>
        <button type="submit" className="px-4 py-1.5 text-xs rounded-xl bg-indigo-600 text-white font-bold">Kaydet</button>
      </div>
    </form>
  );
}

function NoteForm({ notes, setNotes, editingItem, onClose, isDarkMode }) {
  const [title, setTitle] = useState(editingItem ? editingItem.title : '');
  const [content, setContent] = useState(editingItem ? editingItem.content : '');
  const [tagInput, setTagInput] = useState(editingItem ? editingItem.tags?.join(', ') : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);

    if (editingItem) {
      setNotes(notes.map(n => n.id === editingItem.id ? { ...n, title, content, tags } : n));
    } else {
      setNotes([{ id: Date.now().toString(), title, content, tags, date: new Date().toISOString().split('T')[0] }, ...notes]);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-bold text-base">{editingItem ? 'Notu Düzenle' : 'Yeni Not'}</h3>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Not Başlığı" className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} required />
      <textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Not İçeriği..." className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
      <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Etiketler (Virgülle ayırın)" className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
      <div className="flex justify-end space-x-2 pt-2">
        <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs rounded-xl border border-slate-700">İptal</button>
        <button type="submit" className="px-4 py-1.5 text-xs rounded-xl bg-indigo-600 text-white font-bold">Kaydet</button>
      </div>
    </form>
  );
}

function TransactionForm({ transactions, setTransactions, editingItem, onClose, isDarkMode }) {
  const [title, setTitle] = useState(editingItem ? editingItem.title : '');
  const [amount, setAmount] = useState(editingItem ? editingItem.amount : '');
  const [type, setType] = useState(editingItem ? editingItem.type : 'expense');
  const [category, setCategory] = useState(editingItem ? editingItem.category : 'Gıda');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    if (editingItem) {
      setTransactions(transactions.map(t => t.id === editingItem.id ? { ...t, title, amount: Number(amount), type, category } : t));
    } else {
      setTransactions([{ id: Date.now().toString(), title, amount: Number(amount), type, category, date: new Date().toISOString().split('T')[0] }, ...transactions]);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-bold text-base">{editingItem ? 'İşlemi Düzenle' : 'Yeni Finans Kalemi'}</h3>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="İşlem Başlığı" className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} required />
      <div className="grid grid-cols-2 gap-2">
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Tutar (₺)" className={`px-3 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} required />
        <select value={type} onChange={(e) => setType(e.target.value)} className={`px-3 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <option value="expense">Gider (-)</option>
          <option value="income">Gelir (+)</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs rounded-xl border border-slate-700">İptal</button>
        <button type="submit" className="px-4 py-1.5 text-xs rounded-xl bg-emerald-600 text-white font-bold">Kaydet</button>
      </div>
    </form>
  );
}
