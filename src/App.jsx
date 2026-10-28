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
  MoreVertical
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

// Color Palette for Categories & Charts
const CATEGORY_COLORS = {
  Gıda: '#f59e0b',
  Ulaşım: '#3b82f6',
  Fatura: '#ef4444',
  Eğlence: '#8b5cf6',
  Maaş: '#10b981',
  Yatırım: '#06b6d4',
  Diğer: '#6b7280'
};

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useLocalStorage('theme_mode', true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  // State Stores
  const [todos, setTodos] = useLocalStorage('app_todos', [
    { id: '1', title: 'Aylık bütçe raporunu incele', dueDate: '2026-10-29', priority: 'high', completed: false, category: 'Finans' },
    { id: '2', title: 'Yapay zeka projesi için araştırma yap', dueDate: '2026-10-30', priority: 'medium', completed: true, category: 'İş' },
    { id: '3', title: 'Spor salonuna git', dueDate: '2026-10-28', priority: 'low', completed: false, category: 'Kişisel' }
  ]);

  const [notes, setNotes] = useLocalStorage('app_notes', [
    { id: '1', title: 'Haftalık Strateji Notları', content: 'Önümüzdeki hafta yazılım mimarisi güncellenecek. Mobil uyumluluk ön planda tutulmalı.', tags: ['İş', 'Plan'], date: '2026-10-28' },
    { id: '2', title: 'Kitap Önerileri', content: '1. Atomik Alışkanlıklar\n2. Derin Çalışma\n3. Psikoloji ve Para', tags: ['Kişisel'], date: '2026-10-25' }
  ]);

  const [transactions, setTransactions] = useLocalStorage('app_transactions', [
    { id: '1', title: 'Yazılım Sektör Maaşı', amount: 45000, type: 'income', category: 'Maaş', date: '2026-10-01' },
    { id: '2', title: 'Market Alışverişi', amount: 1850, type: 'expense', category: 'Gıda', date: '2026-10-15' },
    { id: '3', title: 'Elektrik & İnternet Faturası', amount: 1200, type: 'expense', category: 'Fatura', date: '2026-10-20' },
    { id: '4', title: 'Aylık Akbil / Yakıt', amount: 1500, type: 'expense', category: 'Ulaşım', date: '2026-10-22' },
    { id: '5', title: 'Sinema ve Yemek', amount: 850, type: 'expense', category: 'Eğlence', date: '2026-10-26' }
  ]);

  // Modal / Form States
  const [modalType, setModalType] = useState(null); // 'todo', 'note', 'transaction'
  const [editingItem, setEditingItem] = useState(null);

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
      
      {/* 1. TOP BAR (ANDRoid HEADER) */}
      <header className={`sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'}`}
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-500/30">
              P
            </div>
            <span className="font-bold text-base tracking-tight">ProWorkspace</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
            TR
          </div>
        </div>
      </header>

      {/* 2. DRAWER MENU (ÜST AÇILIR MENÜ / YAN ÇEKMECE) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsDrawerOpen(false)} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />

          {/* Drawer Content */}
          <div className={`relative w-4/5 max-w-xs h-full p-5 flex flex-col justify-between shadow-2xl z-10 transition-transform ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}`}>
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    U
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Kullanıcı Profil</h3>
                    <p className="text-xs text-slate-400">Pro Sürüm</p>
                  </div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="mt-6 space-y-1">
                <DrawerNavItem id="dashboard" label="Genel Bakış" icon={<LayoutDashboard size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} setIsDrawerOpen={setIsDrawerOpen} isDarkMode={isDarkMode} />
                <DrawerNavItem id="todos" label="Yapılacaklar" icon={<CheckSquare size={20} />} badge={todos.filter(t => !t.completed).length} activeTab={activeTab} setActiveTab={setActiveTab} setIsDrawerOpen={setIsDrawerOpen} isDarkMode={isDarkMode} />
                <DrawerNavItem id="calendar" label="Takvim" icon={<CalendarIcon size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} setIsDrawerOpen={setIsDrawerOpen} isDarkMode={isDarkMode} />
                <DrawerNavItem id="notes" label="Notlarım" icon={<FileText size={20} />} badge={notes.length} activeTab={activeTab} setActiveTab={setActiveTab} setIsDrawerOpen={setIsDrawerOpen} isDarkMode={isDarkMode} />
                <DrawerNavItem id="finance" label="Harcamalarım" icon={<Wallet size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} setIsDrawerOpen={setIsDrawerOpen} isDarkMode={isDarkMode} />
                <DrawerNavItem id="analytics" label="İstatistikler & Analiz" icon={<BarChart3 size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} setIsDrawerOpen={setIsDrawerOpen} isDarkMode={isDarkMode} />
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800/60 text-xs text-slate-500 text-center">
              Android WorkSuite v2.4 • 2026
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pb-24 p-4 max-w-lg mx-auto w-full">
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
            setModalType={setModalType}
          />
        )}

        {activeTab === 'todos' && (
          <TodosView 
            todos={todos} 
            setTodos={setTodos} 
            isDarkMode={isDarkMode} 
            setModalType={setModalType} 
            setEditingItem={setEditingItem} 
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView 
            todos={todos} 
            transactions={transactions} 
            isDarkMode={isDarkMode} 
          />
        )}

        {activeTab === 'notes' && (
          <NotesView 
            notes={notes} 
            setNotes={setNotes} 
            isDarkMode={isDarkMode} 
            setModalType={setModalType} 
            setEditingItem={setEditingItem} 
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

      {/* 3. FLOATING ACTION BUTTON (HIZLI EKLE SÜRÜKLE/AÇILIR MENÜ) */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end space-y-2">
        {isFabOpen && (
          <div className="flex flex-col items-end space-y-2 mb-2 animate-fadeIn">
            <button 
              onClick={() => { setIsFabOpen(false); setEditingItem(null); setModalType('todo'); }}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-3 py-2 rounded-full shadow-lg text-xs font-semibold"
            >
              <span>Görev Ekle</span>
              <CheckSquare size={16} />
            </button>
            <button 
              onClick={() => { setIsFabOpen(false); setEditingItem(null); setModalType('note'); }}
              className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-full shadow-lg text-xs font-semibold"
            >
              <span>Not Ekle</span>
              <FileText size={16} />
            </button>
            <button 
              onClick={() => { setIsFabOpen(false); setEditingItem(null); setModalType('transaction'); }}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-3 py-2 rounded-full shadow-lg text-xs font-semibold"
            >
              <span>İşlem Ekle</span>
              <Wallet size={16} />
            </button>
          </div>
        )}
        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 transition-transform active:scale-95 ${isFabOpen ? 'rotate-45 bg-rose-600' : ''}`}
        >
          <Plus size={28} />
        </button>
      </div>

      {/* 4. BOTTOM NAVIGATION BAR (ANDROID ALT SEKMELER) */}
      <nav className={`fixed bottom-0 left-0 right-0 z-30 h-16 border-t flex items-center justify-around px-2 backdrop-blur-lg ${isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
        <BottomNavItem id="dashboard" label="Özet" icon={<LayoutDashboard size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
        <BottomNavItem id="todos" label="Görevler" icon={<CheckSquare size={20} />} badge={todos.filter(t => !t.completed).length} activeTab={activeTab} setActiveTab={setActiveTab} />
        <BottomNavItem id="calendar" label="Takvim" icon={<CalendarIcon size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
        <BottomNavItem id="notes" label="Notlar" icon={<FileText size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
        <BottomNavItem id="finance" label="Cüzdan" icon={<Wallet size={20} />} activeTab={activeTab} setActiveTab={setActiveTab} />
      </nav>

      {/* MODAL SYSTEM */}
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
    </div>
  );
}

// BOTTOM NAVIGATION ITEM
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
      {isActive && <div className="absolute bottom-1 w-1 h-1 bg-indigo-500 rounded-full" />}
    </button>
  );
}

// DRAWER NAVIGATION ITEM
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

// MODAL CONTAINER
function ModalWrapper({ children, onClose, isDarkMode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl transition-all ${isDarkMode ? 'bg-slate-900 text-slate-100 border border-slate-800' : 'bg-white text-slate-800'}`}>
        {children}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1. DASHBOARD VIEW
// ----------------------------------------------------
function DashboardView({ todos, notes, transactions, totalIncome, totalExpense, netBalance, todoCompletionRate, setActiveTab, isDarkMode, setModalType }) {
  const pendingTodos = todos.filter(t => !t.completed).slice(0, 4);
  const recentTransactions = [...transactions].reverse().slice(0, 4);
  const recentNotes = notes.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Hoş Geldiniz 👋</h2>
          <p className="text-slate-400 text-sm mt-1">İşte bugünkü yapılacaklar ve finansal durumunuzun özeti.</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
            📅 28 Ekim 2026
          </span>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Toplam Bakiye" 
          value={`₺${netBalance.toLocaleString('tr-TR')}`} 
          icon={<Wallet className="text-indigo-500" size={24} />} 
          subtitle={`${totalIncome > 0 ? '+' : ''}${((netBalance / (totalIncome || 1)) * 100).toFixed(0)}% Net Oran`}
          isDarkMode={isDarkMode} 
        />
        <SummaryCard 
          title="Aylık Gelir" 
          value={`₺${totalIncome.toLocaleString('tr-TR')}`} 
          icon={<ArrowUpRight className="text-emerald-500" size={24} />} 
          subtitle="Tüm gelirler"
          isDarkMode={isDarkMode} 
        />
        <SummaryCard 
          title="Aylık Gider" 
          value={`₺${totalExpense.toLocaleString('tr-TR')}`} 
          icon={<ArrowDownRight className="text-rose-500" size={24} />} 
          subtitle="Tüm harcamalar"
          isDarkMode={isDarkMode} 
        />
        <SummaryCard 
          title="Tamamlanan Görevler" 
          value={`%${todoCompletionRate}`} 
          icon={<CheckCircle className="text-amber-500" size={24} />} 
          subtitle={`${todos.filter(t => t.completed).length} / ${todos.length} Görev`}
          isDarkMode={isDarkMode} 
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Todos & Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Tasks */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CheckSquare className="text-indigo-500" size={20} />
                <h3 className="font-bold text-lg">Bekleyen Görevler</h3>
              </div>
              <button onClick={() => setActiveTab('todos')} className="text-xs font-semibold text-indigo-500 hover:underline">
                Tümünü Gör ({todos.length})
              </button>
            </div>

            {pendingTodos.length === 0 ? (
              <p className="text-slate-400 text-sm py-4 text-center">Harika! Bekleyen hiç göreviniz yok. 🎉</p>
            ) : (
              <div className="space-y-3">
                {pendingTodos.map(todo => (
                  <div key={todo.id} className={`p-3 rounded-xl border flex items-center justify-between transition-all ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center space-x-3">
                      <PriorityBadge priority={todo.priority} />
                      <span className="font-medium text-sm">{todo.title}</span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {todo.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Finance Chart Preview */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="text-indigo-500" size={20} />
                <h3 className="font-bold text-lg">Finansal Akış</h3>
              </div>
              <button onClick={() => setActiveTab('finance')} className="text-xs font-semibold text-indigo-500 hover:underline">
                Detaylar
              </button>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactions.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                  <XAxis dataKey="category" stroke={isDarkMode ? '#94a3b8' : '#64748b'} fontSize={12} />
                  <YAxis stroke={isDarkMode ? '#94a3b8' : '#64748b'} fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
                      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column - Finance & Recent Notes */}
        <div className="space-y-6">
          {/* Recent Notes */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="text-indigo-500" size={20} />
                <h3 className="font-bold text-lg">Son Notlar</h3>
              </div>
              <button onClick={() => setActiveTab('notes')} className="text-xs font-semibold text-indigo-500 hover:underline">
                Tüm Notlar
              </button>
            </div>

            <div className="space-y-3">
              {recentNotes.map(note => (
                <div key={note.id} className={`p-3 rounded-xl border space-y-2 ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                  <h4 className="font-semibold text-sm line-clamp-1">{note.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{note.content}</p>
                  <div className="flex items-center gap-1 pt-1">
                    {note.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wallet className="text-indigo-500" size={20} />
                <h3 className="font-bold text-lg">Son İşlemler</h3>
              </div>
              <button onClick={() => setActiveTab('finance')} className="text-xs font-semibold text-indigo-500 hover:underline">
                Tüm Harcamalar
              </button>
            </div>

            <div className="space-y-3">
              {recentTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{t.title}</p>
                    <span className="text-xs text-slate-400">{t.category} • {t.date}</span>
                  </div>
                  <span className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {t.type === 'income' ? '+' : '-'}₺{Number(t.amount).toLocaleString('tr-TR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, subtitle, isDarkMode }) {
  return (
    <div className={`p-5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{icon}</div>
      </div>
      <div>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const colors = {
    high: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  };
  const labels = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${colors[priority]}`}>
      {labels[priority]}
    </span>
  );
}

// ----------------------------------------------------
// 2. TODOS VIEW
// ----------------------------------------------------
function TodosView({ todos, setTodos, isDarkMode, setModalType, setEditingItem }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [search, setSearch] = useState('');

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || todo.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Yapılacaklar Listesi</h2>
          <p className="text-slate-400 text-sm">Görevlerinizi planlayın, önceliklendirin ve takip edin.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setModalType('todo'); }} 
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus size={18} />
          <span>Yeni Görev Ekle</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Görev ara..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`px-3 py-2 text-sm rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="İş">İş</option>
            <option value="Kişisel">Kişisel</option>
            <option value="Finans">Finans</option>
          </select>

          {/* Priority Filter */}
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className={`px-3 py-2 text-sm rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
          >
            <option value="all">Tüm Öncelikler</option>
            <option value="high">Yüksek</option>
            <option value="medium">Orta</option>
            <option value="low">Düşük</option>
          </select>
        </div>
      </div>

      {/* Todo Items List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <CheckSquare size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Hiç görev bulunamadı.</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div 
              key={todo.id} 
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                todo.completed 
                  ? 'opacity-60 bg-slate-900/20 border-slate-800/40' 
                  : isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => toggleTodo(todo.id)}
                  className={`text-slate-400 hover:text-indigo-500 transition-colors`}
                >
                  {todo.completed ? <CheckCircle className="text-indigo-500" size={22} /> : <Circle size={22} />}
                </button>
                <div>
                  <h4 className={`font-medium text-base ${todo.completed ? 'line-through text-slate-500' : ''}`}>
                    {todo.title}
                  </h4>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock size={12} /> {todo.dueDate}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">{todo.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <PriorityBadge priority={todo.priority} />
                <button 
                  onClick={() => { setEditingItem(todo); setModalType('todo'); }} 
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => deleteTodo(todo.id)} 
                  className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. CALENDAR VIEW
// ----------------------------------------------------
function CalendarView({ todos, transactions, isDarkMode }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 28)); // October 2026

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Takvim Görünümü</h2>
          <p className="text-slate-400 text-sm">Etkinlikler, görev zamanları ve ödeme günleri.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={prevMonth} className={`p-2 rounded-xl border ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}>
            <ChevronLeft size={18} />
          </button>
          <span className="font-bold text-lg">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={nextMonth} className={`p-2 rounded-xl border ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-4 text-center font-bold text-xs uppercase tracking-wider text-slate-400">
          <div>Paz</div>
          <div>Pzt</div>
          <div>Sal</div>
          <div>Çar</div>
          <div>Per</div>
          <div>Cum</div>
          <div>Cmt</div>
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-28 rounded-xl bg-transparent" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNumber = i + 1;
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
            
            const dayTodos = todos.filter(t => t.dueDate === dateStr);
            const dayTransactions = transactions.filter(t => t.date === dateStr);

            return (
              <div 
                key={dayNumber} 
                className={`h-28 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                  dayNumber === 28 
                    ? 'border-indigo-500 bg-indigo-500/5 font-bold' 
                    : isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <span className={`text-xs ${dayNumber === 28 ? 'text-indigo-500 font-bold' : 'text-slate-400'}`}>
                  {dayNumber}
                </span>

                <div className="space-y-1 overflow-y-auto max-h-20">
                  {dayTodos.map(t => (
                    <div key={t.id} className="text-[10px] p-1 rounded bg-indigo-500/20 text-indigo-400 font-semibold truncate">
                      ✓ {t.title}
                    </div>
                  ))}
                  {dayTransactions.map(t => (
                    <div key={t.id} className={`text-[10px] p-1 rounded font-semibold truncate ${t.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      ₺{t.amount} ({t.title})
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
function NotesView({ notes, setNotes, isDarkMode, setModalType, setEditingItem }) {
  const [search, setSearch] = useState('');

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Notlarım</h2>
          <p className="text-slate-400 text-sm">Fikirlerinizi, taslaklarınızı ve önemli bilgileri kaydedin.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setModalType('note'); }} 
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus size={18} />
          <span>Yeni Not Ekle</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Notlarda ara..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 focus:border-indigo-500'}`}
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <p className="col-span-full text-center py-12 text-slate-400">Not bulunamadı.</p>
        ) : (
          filteredNotes.map(note => (
            <div 
              key={note.id} 
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all hover:border-indigo-500/50 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{note.title}</h3>
                  <span className="text-[10px] text-slate-400">{note.date}</span>
                </div>
                <p className="text-slate-400 text-sm whitespace-pre-line line-clamp-4">{note.content}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/40">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => { setEditingItem(note); setModalType('note'); }} 
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteNote(note.id)} 
                    className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. FINANCE VIEW
// ----------------------------------------------------
function FinanceView({ transactions, setTransactions, totalIncome, totalExpense, netBalance, isDarkMode, setModalType, setEditingItem }) {
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Harcamalar ve Gelirler</h2>
          <p className="text-slate-400 text-sm">Bütçenizi yönetin, kategorilere göre harcamalarınızı izleyin.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setModalType('transaction'); }} 
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus size={18} />
          <span>İşlem Ekle</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-xs text-slate-400 uppercase font-semibold">Toplam Gelir</span>
          <h3 className="text-2xl font-bold text-emerald-500 mt-1">₺{totalIncome.toLocaleString('tr-TR')}</h3>
        </div>
        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-xs text-slate-400 uppercase font-semibold">Toplam Gider</span>
          <h3 className="text-2xl font-bold text-rose-500 mt-1">₺{totalExpense.toLocaleString('tr-TR')}</h3>
        </div>
        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-xs text-slate-400 uppercase font-semibold">Net Bakiye</span>
          <h3 className={`text-2xl font-bold mt-1 ${netBalance >= 0 ? 'text-indigo-400' : 'text-rose-500'}`}>
            ₺{netBalance.toLocaleString('tr-TR')}
          </h3>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <h3 className="font-bold text-lg mb-4">İşlem Geçmişi</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={`border-b text-slate-400 font-semibold ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <th className="pb-3">Başlık</th>
                <th className="pb-3">Kategori</th>
                <th className="pb-3">Tarih</th>
                <th className="pb-3">Tutar</th>
                <th className="pb-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 font-medium">{t.title}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-800 font-medium text-slate-300">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{t.date}</td>
                  <td className={`py-3 font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {t.type === 'income' ? '+' : '-'}₺{Number(t.amount).toLocaleString('tr-TR')}
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button 
                      onClick={() => { setEditingItem(t); setModalType('transaction'); }} 
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteTransaction(t.id)} 
                      className="p-1 hover:bg-rose-500/10 rounded text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 6. ANALYTICS VIEW
// ----------------------------------------------------
function AnalyticsView({ todos, transactions, notes, isDarkMode }) {
  // Aggregate Finance Data by Category
  const expenseByCategory = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return Object.keys(map).map(cat => ({ name: cat, value: map[cat] }));
  }, [transactions]);

  // Priority Distribution for Todos
  const todoPriorityData = useMemo(() => {
    const high = todos.filter(t => t.priority === 'high').length;
    const medium = todos.filter(t => t.priority === 'medium').length;
    const low = todos.filter(t => t.priority === 'low').length;
    return [
      { name: 'Yüksek', value: high },
      { name: 'Orta', value: medium },
      { name: 'Düşük', value: low }
    ];
  }, [todos]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Detaylı İstatistikler & Analiz</h2>
        <p className="text-slate-400 text-sm">Üretkenliğiniz ve finansal alışkanlıklarınıza dair derinlemesine bakış.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Expenses Pie Chart */}
        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="font-bold text-lg mb-4">Harcama Dağılımı (Kategori)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={expenseByCategory} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  label 
                >
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

        {/* Todo Priorities Bar Chart */}
        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="font-bold text-lg mb-4">Görev Öncelik Dağılımı</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={todoPriorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" stroke={isDarkMode ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={isDarkMode ? '#94a3b8' : '#64748b'} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// FORM COMPONENTS (MODAL CONTENTS)
// ----------------------------------------------------

function TodoForm({ todos, setTodos, editingItem, onClose, isDarkMode }) {
  const [title, setTitle] = useState(editingItem ? editingItem.title : '');
  const [category, setCategory] = useState(editingItem ? editingItem.category : 'İş');
  const [priority, setPriority] = useState(editingItem ? editingItem.priority : 'medium');
  const [dueDate, setDueDate] = useState(editingItem ? editingItem.dueDate : '2026-10-29');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    if (editingItem) {
      setTodos(todos.map(t => t.id === editingItem.id ? { ...t, title, category, priority, dueDate } : t));
    } else {
      const newTodo = {
        id: Date.now().toString(),
        title,
        category,
        priority,
        dueDate,
        completed: false
      };
      setTodos([...todos, newTodo]);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-lg">{editingItem ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}</h3>
      
      <div>
        <label className="text-xs text-slate-400 font-semibold">Görev Başlığı</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Örn: Proje sunumunu hazırla" 
          className={`w-full px-3 py-2 text-sm rounded-xl border mt-1 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
          required 
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 font-semibold">Kategori</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-xl border mt-1 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
          >
            <option value="İş">İş</option>
            <option value="Kişisel">Kişisel</option>
            <option value="Finans">Finans</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 font-semibold">Öncelik</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-xl border mt-1 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
          >
            <option value="high">Yüksek</option>
            <option value="medium">Orta</option>
            <option value="low">Düşük</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 font-semibold">Bitiş Tarihi</label>
        <input 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)}
          className={`w-full px-3 py-2 text-sm rounded-xl border mt-1 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
        />
      </div>

      <div className="flex items-center justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-xl border border-slate-700 hover:bg-slate-800">
          İptal
        </button>
        <button type="submit" className="px-4 py-2 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
          Kaydet
        </button>
      </div>
    </form>
  );
}

function NoteForm({ notes, setNotes, editingItem, onClose, isDarkMode }) {
  const [title, setTitle] = useState(editingItem ? editingItem.title : '');
  const [content, setContent] = useState(editingItem ? editingItem.content : '');
  const [tagInput, setTagInput] = useState(editingItem ? editingItem.tags.join(', ') : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);

    if (editingItem) {
      setNotes(notes.map(n => n.id === editingItem.id ? { ...n, title, content, tags } : n));
    } else {
      const newNote = {
        id: Date.now().toString(),
        title,
        content,
        tags,
        date: new Date().toISOString().split('T')[0]
      };
      setNotes([newNote, ...notes]);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-lg">{editingItem ? 'Notu Düzenle' : 'Yeni Not Ekle'}</h3>
      
      <div>
        <label className="text-xs text-slate-400 font-semibold">Not Başlığı</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Başlık girin..." 
          className={`w-full px-3 py-2 text-sm rounded-xl border mt-1 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
          required 
        />
      </div>

      <div>
        <label className="text-xs text-slate-400 font-semibold">İçerik</label>
        <textarea 
          rows={4} 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          placeholder="Not içeriğinizi buraya yazın..." 
          className={`w-full px-3 py-2 text-sm rounded-xl border mt-1 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
        />
      </div>

      <div>
        <label className="text-xs text-slate-400 font-semibold">Etiketler (Virgülle ayırın)</label>
        <input 
          type="text" 
          value={tagInput} 
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="İş, Fikir, Proje" 
          className={`w-full px-3 py-2 text-sm rounded-xl border mt-1 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
        />
      </div>

      <div className="flex items-center justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-xl border border-slate-700 hover:bg-slate-800">
          İptal
        </button>
        <button type="submit" className="px-4 py-2 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
          Kaydet
        </button>
      </div>
    </form>
  );
}

function TransactionForm({ transactions, setTransactions, editingItem, onClose, isDarkMode }) {
  const [title, setTitle] = useState(editingItem ? editingItem.title : '');
  const [amount, setAmount] = useState(editingItem ? editingItem.amount : '');
  const [type, setType] = useState(editingItem ? editingItem.type : 'expense');
  const [category, setCategory] = useState(editingItem ? editingItem.category : 'Gıda');
  const [date, setDate] = useState(editingItem ? editingItem.date : '2026-10-28');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    if (editingItem) {
      setTransactions(transactions.map(t => t.id === editingItem.id ? { ...t, title, amount: Number(amount), type, category, date } : t));
    } else {
      const newTransaction = {
        id: Date.now().toString(),
        title,
        amount: Number(amount),
        type,
        category,
        date
      };
      setTransactions([newTransaction, ...transactions]);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-lg">{editingItem ? 'İşlemi Düzenle' : 'Yeni İşlem Ekle'}</h3>
      
      <div>
        <label className="text-xs text-slate-400 font-semibold">İşlem Tanımı</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Örn: Market alışverişi" 
          className={`w-full px-3 py-2 text-sm rounded-xl border mt-1 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
          required 
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 font-semibold">Tutar (₺)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00" 
            className={`w-full px-3 py-2 text-sm rounded-xl border mt-1 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            required 
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-semibold">İşlem Tipi</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-xl border mt-1 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
          >
            <option value="expense">Gider (-)</option>
            <option value="income">Gelir (+)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 font-semibold">Kategori</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-xl border mt-1 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
          >
            <option value="Gıda">Gıda</option>
            <option value="Ulaşım">Ulaşım</option>
            <option value="Fatura">Fatura</option>
            <option value="Eğlence">Eğlence</option>
            <option value="Maaş">Maaş</option>
            <option value="Yatırım">Yatırım</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 font-semibold">Tarih</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-xl border mt-1 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-xl border border-slate-700 hover:bg-slate-800">
          İptal
        </button>
        <button type="submit" className="px-4 py-2 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
          Kaydet
        </button>
      </div>
    </form>
  );
}
