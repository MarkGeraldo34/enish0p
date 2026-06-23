import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Search, Bell, Moon, Sun, Plus, X, Check, Wallet, TrendingUp, Clock,
  Star, Shield, ExternalLink, Filter, ChevronDown, Grid, List, User,
  Twitter, Image, Package, Coins, Sparkles, ArrowUpRight, Heart, Eye
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: Grid },
  { id: 'items', name: 'Real Items', icon: Package },
  { id: 'tokens', name: 'Tokens', icon: Coins },
  { id: 'whitelists', name: 'NFT Whitelists', icon: Sparkles },
];

const MOCK_ITEMS = [
  { id: 1, title: 'Limited Edition Sneakers - Nike Air Max', category: 'items', price: 250, seller: '@sneakerhead_jp', image: 'sneakers', bids: 12, timeLeft: '2d 4h', trending: true },
  { id: 2, title: '0G Token Pack - 1000 $0G', category: 'tokens', price: 85, seller: '@crypto_whale', image: 'token', bids: 34, timeLeft: '5h 30m', trending: true },
  { id: 3, title: 'Bored Ape WL Spot #4289', category: 'whitelists', price: 420, seller: '@nft_alpha', image: 'nft', bids: 89, timeLeft: '1d 12h', trending: true },
  { id: 4, title: 'Vintage Rolex Submariner', category: 'items', price: 15000, seller: '@luxury_dealer', image: 'watch', bids: 5, timeLeft: '5d 8h', trending: false },
  { id: 5, title: 'Azuki WL Spot - Garden', category: 'whitelists', price: 280, seller: '@wl_spotter', image: 'nft2', bids: 67, timeLeft: '8h 15m', trending: true },
  { id: 6, title: '500 $0G Staking Rewards', category: 'tokens', price: 45, seller: '@defi_farmer', image: 'token2', bids: 23, timeLeft: '3d 2h', trending: false },
  { id: 7, title: 'PS5 Limited Spider-Man Edition', category: 'items', price: 650, seller: '@gamer_trades', image: 'console', bids: 18, timeLeft: '1d 6h', trending: false },
  { id: 8, title: 'Pudgy Penguins WL', category: 'whitelists', price: 150, seller: '@penguin_hunter', image: 'nft3', bids: 45, timeLeft: '4h 20m', trending: true },
  { id: 9, title: 'Designer Handbag - Hermès Birkin', category: 'items', price: 8500, seller: '@fashion_vault', image: 'bag', bids: 8, timeLeft: '4d 1h', trending: false },
  { id: 10, title: '2000 $0G Governance Tokens', category: 'tokens', price: 180, seller: '@gov_delegator', image: 'token3', bids: 56, timeLeft: '2d 18h', trending: true },
  { id: 11, title: 'Doodles WL - Mint Guaranteed', category: 'whitelists', price: 95, seller: '@doodle_master', image: 'nft4', bids: 31, timeLeft: '6h 45m', trending: false },
  { id: 12, title: 'Rare Vinyl Collection - Beatles First Press', category: 'items', price: 2200, seller: '@vinyl_collector', image: 'vinyl', bids: 14, timeLeft: '6d 3h', trending: false },
];

const NOTIFICATIONS = [
  { id: 1, text: 'Your bid on "Bored Ape WL" was outbid!', time: '2m ago', unread: true },
  { id: 2, text: 'New listing: 0G Token Pack at 85 $0G', time: '15m ago', unread: true },
  { id: 3, text: 'Auction won: Nike Air Max', time: '1h ago', unread: false },
];

function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  
  return [ref, isInView];
}

function AnyShopLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="white" />
      <ellipse cx="42" cy="55" rx="22" ry="28" fill="#0f3d3e" />
      <circle cx="55" cy="38" r="20" fill="#ff5c00" />
    </svg>
  );
}

function ItemCard({ item, index, isVisible, onBuy }) {
  const [liked, setLiked] = useState(false);
  const categoryColors = {
    items: 'badge-item',
    tokens: 'badge-token',
    whitelists: 'badge-nft',
  };
  
  return (
    <div
      className={`glass rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.02] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="relative h-48 bg-gradient-to-br from-[var(--card)] to-[var(--surface)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/60 to-transparent z-10" />
        {item.category === 'whitelists' && (
          <div className="relative z-0">
            <Sparkles className="w-20 h-20 text-[var(--accent-secondary)] opacity-60 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl" />
          </div>
        )}
        {item.category === 'tokens' && (
          <div className="relative z-0">
            <Coins className="w-20 h-20 text-[var(--accent)] opacity-60 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-2xl" />
          </div>
        )}
        {item.category === 'items' && (
          <div className="relative z-0">
            <Package className="w-20 h-20 text-orange-400 opacity-60 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-2xl" />
          </div>
        )}
        {item.trending && (
          <span className="absolute top-3 left-3 z-20 px-2 py-1 rounded-full text-[10px] font-semibold bg-[var(--accent)]/90 text-black flex items-center gap-1 animate-pulse">
            <TrendingUp className="w-3 h-3" /> TRENDING
          </span>
        )}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors hover:scale-110"
        >
          <Heart className={`w-4 h-4 transition-all duration-300 ${liked ? 'fill-red-500 text-red-500 scale-110' : 'text-white'}`} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold text-white ${categoryColors[item.category]}`}>
            {item.category === 'whitelists' ? 'NFT WL' : item.category === 'tokens' ? 'TOKEN' : 'ITEM'}
          </span>
          <span className="text-xs text-[var(--muted)] flex items-center gap-1">
            <Clock className="w-3 h-3" /> {item.timeLeft}
          </span>
        </div>
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-[var(--text)]">{item.title}</h3>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-[var(--muted)]">Current Bid</p>
            <p className="text-lg font-bold text-[var(--accent)]">{item.price.toLocaleString()} <span className="text-xs font-normal">$0G</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--muted)]">{item.bids} bids</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs text-[var(--muted)]">{item.seller}</span>
        </div>
        <button
          onClick={() => onBuy(item)}
          className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-black font-semibold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 group/btn"
        >
          Place Bid <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function LoginModal({ onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const validateTwitter = (name) => {
    const cleanName = name.replace(/^@/, '');
    return /^[a-zA-Z0-9_]{1,15}$/.test(cleanName);
  };
  
  const handleSubmit = () => {
    const cleanUsername = username.replace(/^@/, '');
    
    if (!cleanUsername) {
      setError('Please enter a Twitter username');
      return;
    }
    
    if (!validateTwitter(cleanUsername)) {
      setError('Invalid username: Use 1-15 letters, numbers, or underscores only');
      return;
    }
    
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        const handle = '@' + cleanUsername;
        onLogin(handle);
        onClose();
      }, 800);
    }, 1200);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && username) {
      handleSubmit();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass rounded-3xl p-8 max-w-md w-full animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Connect to AnyShop</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {!success ? (
          <>
            <p className="text-[var(--muted)] text-sm mb-6">Access the marketplace using your Twitter account</p>
            
            <button className="w-full py-3 rounded-xl bg-[#1da1f2] text-white font-semibold flex items-center justify-center gap-3 hover:bg-[#1a8cd8] transition-colors mb-4">
              <Twitter className="w-5 h-5" /> Continue with Twitter
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
              <div className="relative flex justify-center"><span className="px-4 bg-[var(--bg)] text-xs text-[var(--muted)]">or enter username</span></div>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] font-medium">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value.replace(/^@/, '')); setError(''); }}
                  onKeyDown={handleKeyDown}
                  placeholder="twitter_username"
                  className="w-full py-3 pl-8 pr-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              
              {error && (
                <p className="text-red-400 text-xs flex items-center gap-1 animate-fade-in-up">
                  <X className="w-3 h-3" />{error}
                </p>
              )}
              
              <p className="text-xs text-[var(--muted)]">
                Username must be 1-15 characters (letters, numbers, underscores)
              </p>
              
              <button
                onClick={handleSubmit}
                disabled={loading || !username}
                className="w-full py-3 rounded-xl bg-[var(--accent)] text-black font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Enter Marketplace
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-[var(--success)]/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[var(--success)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Welcome to AnyShop!</h3>
            <p className="text-[var(--muted)] text-sm">
              Verified as <span className="text-[var(--accent)] font-semibold">@{username}</span>
            </p>
          </div>
        )}
        
        {!success && (
          <p className="text-[var(--muted)] text-xs text-center mt-6">By connecting, you agree to our Terms of Service</p>
        )}
      </div>
    </div>
  );
}

function ListItemModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', category: 'items', price: '', description: '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    if (!form.title || !form.price) return;
    setLoading(true);
    setTimeout(() => {
      onSubmit({ ...form, price: parseInt(form.price) });
      onClose();
    }, 1500);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">List an Item</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.slice(1).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={`py-3 rounded-xl text-sm font-medium flex flex-col items-center gap-1 transition-all ${
                    form.category === cat.id
                      ? 'bg-[var(--accent)] text-black'
                      : 'bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]'
                  }`}
                >
                  <cat.icon className="w-5 h-5" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Enter item title..."
              className="w-full py-3 px-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Starting Price ($0G)</label>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              placeholder="0"
              className="w-full py-3 px-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your item..."
              rows={3}
              className="w-full py-3 px-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] resize-none"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.title || !form.price}
            className="w-full py-3 rounded-xl bg-[var(--accent)] text-black font-semibold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Listing...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> List Item
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function BidModal({ item, onClose, onSubmit }) {
  const [bid, setBid] = useState(item.price + 10);
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      onSubmit(item, bid);
      onClose();
    }, 1200);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass rounded-3xl p-8 max-w-md w-full animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Place a Bid</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-[var(--surface)] rounded-xl p-4 mb-6">
          <p className="text-sm text-[var(--muted)] mb-1">{item.title}</p>
          <p className="text-xs text-[var(--muted)]">Current bid: <span className="text-[var(--accent)] font-semibold">{item.price} $0G</span></p>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Your Bid ($0G)</label>
          <input
            type="number"
            value={bid}
            onChange={e => setBid(parseInt(e.target.value) || 0)}
            className="w-full py-3 px-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-xl font-bold focus:outline-none focus:border-[var(--accent)]"
          />
          <p className="text-xs text-[var(--muted)] mt-2">Minimum bid: {item.price + 1} $0G</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || bid <= item.price}
          className="w-full py-3 rounded-xl bg-[var(--accent)] text-black font-semibold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" /> Confirm Bid
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [showLogin, setShowLogin] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [bidItem, setBidItem] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [items, setItems] = useState(MOCK_ITEMS);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [heroRef, heroInView] = useInView();
  const [filtersRef, filtersInView] = useInView();
  const [gridRef, gridInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const [visibleItems, setVisibleItems] = useState(new Set());

  const filteredItems = useMemo(() => {
    let result = items.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.seller.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'trending') result.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    else if (sortBy === 'ending') result.sort((a, b) => a.timeLeft.localeCompare(b.timeLeft));
    return result;
  }, [items, activeCategory, searchQuery, sortBy]);

  useEffect(() => {
    if (gridInView) {
      const timer = setTimeout(() => {
        const itemCount = filteredItems.length;
        const items = Array.from({ length: itemCount }, (_, i) => i);
        items.forEach((i, idx) => {
          setTimeout(() => {
            setVisibleItems(prev => new Set([...prev, i]));
          }, idx * 80);
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [gridInView, filteredItems.length]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  const handleBid = (item, amount) => {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, price: amount, bids: i.bids + 1 } : i));
  };

  const handleListItem = (newItem) => {
    setItems(prev => [{ ...newItem, id: Date.now(), seller: user, bids: 0, timeLeft: '7d 0h', trending: false }, ...prev]);
  };

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[var(--bg)]/80 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <AnyShopLogo size={44} />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff5c00]/20 to-[#0f3d3e]/20 blur-md -z-10" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">AnyShop</h1>
                <p className="text-[10px] text-[var(--muted)] -mt-1">Powered by 0G</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search items, tokens, whitelists..."
                  className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-white/10 transition-colors">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <div className="relative">
                <button onClick={() => setShowNotif(!showNotif)} className="p-2.5 rounded-xl hover:bg-white/10 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>
                  )}
                </button>
                {showNotif && (
                  <div className="absolute right-0 top-full mt-2 w-80 glass rounded-2xl p-4 animate-fade-in-up shadow-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Notifications</h3>
                      <button onClick={() => setShowNotif(false)} className="text-xs text-[var(--accent)] hover:underline">Mark all read</button>
                    </div>
                    <div className="space-y-2">
                      {NOTIFICATIONS.map(n => (
                        <div key={n.id} className={`p-3 rounded-xl ${n.unread ? 'bg-[var(--accent)]/10' : 'bg-[var(--surface)]'}`}>
                          <p className="text-sm">{n.text}</p>
                          <p className="text-xs text-[var(--muted)] mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {user ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowListModal(true)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-black font-semibold text-sm hover:brightness-110 transition-all"
                  >
                    <Plus className="w-4 h-4" /> List Item
                  </button>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <Twitter className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium">{user}</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-black font-semibold text-sm hover:brightness-110 transition-all"
                >
                  <Twitter className="w-4 h-4" /> Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-gradient py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-6 transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Sparkles className="w-4 h-4 text-[var(--accent)] animate-pulse" />
            <span className="text-sm text-[var(--accent)]">The Premier 0G Marketplace</span>
          </div>
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 transition-all duration-700 delay-100 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Trade <span className="gradient-text">Anything</span> with <span className="gradient-text">$0G</span>
          </h2>
          <p className={`text-lg text-[var(--muted)] max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Real-world items, crypto tokens, and exclusive NFT whitelist spots — all in one place.
          </p>
          <div className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-300 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:scale-105 transition-all duration-300">
              <Shield className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-sm">Twitter Verified</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:scale-105 transition-all duration-300">
              <Wallet className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-sm">$0G Payments</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:scale-105 transition-all duration-300">
              <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-sm">{items.length}+ Active Listings</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs & Filters */}
        <div ref={filtersRef} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 transition-all duration-700 ${filtersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-[var(--accent)] text-black scale-105'
                    : 'bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-[var(--text)] hover:scale-105'
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors"
            >
              <Filter className="w-4 h-4" />
              Sort: {sortBy === 'trending' ? 'Trending' : sortBy === 'price-low' ? 'Price: Low' : sortBy === 'price-high' ? 'Price: High' : 'Ending Soon'}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl p-2 animate-fade-in-up z-10">
                {['trending', 'price-low', 'price-high', 'ending'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setShowSortMenu(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      sortBy === opt ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'hover:bg-white/5'
                    }`}
                  >
                    {opt === 'trending' ? 'Trending' : opt === 'price-low' ? 'Price: Low to High' : opt === 'price-high' ? 'Price: High to Low' : 'Ending Soon'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {/* Items Grid */}
        <div ref={gridRef}>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  isVisible={visibleItems.has(index)}
                  onBuy={setBidItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-[var(--muted)] mx-auto mb-4 opacity-50" />
              <p className="text-[var(--muted)]">No items found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <section ref={statsRef} className={`mt-16 glass rounded-3xl p-8 transition-all duration-700 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <h3 className="text-2xl font-bold mb-8 text-center">Marketplace Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Volume', value: '2.4M $0G', icon: TrendingUp },
              { label: 'Active Listings', value: items.length.toString(), icon: Package },
              { label: 'Total Users', value: '12.5K', icon: User },
              { label: 'Trades Today', value: '847', icon: ArrowUpRight },
            ].map((stat, i) => (
              <div 
                key={i} 
                className={`text-center p-4 rounded-2xl bg-[var(--surface)] transition-all duration-500 hover:scale-105 hover:bg-[var(--accent)]/10 ${
                  statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                <stat.icon className="w-8 h-8 text-[var(--accent)] mx-auto mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-[var(--muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-16 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AnyShopLogo size={32} />
            <span className="font-semibold">AnyShop</span>
          </div>
          <p className="text-sm text-[var(--muted)]">Powered by 0G Network • All transactions in $0G</p>
        </div>
      </footer>

      {/* Modals */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={setUser} />}
      {showListModal && <ListItemModal onClose={() => setShowListModal(false)} onSubmit={handleListItem} />}
      {bidItem && <BidModal item={bidItem} onClose={() => setBidItem(null)} onSubmit={handleBid} />}
    </div>
  );
}
