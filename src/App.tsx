import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Search, Bell, Moon, Sun, Plus, X, Check, Wallet, TrendingUp, Clock,
  Star, Shield, ExternalLink, Filter, ChevronDown, Grid, List, User,
  Twitter, Image, Package, Coins, Sparkles, ArrowUpRight, Heart, Eye,
  Copy, LogOut, Link2
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

const WALLET_OPTIONS = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵' },
  { id: 'phantom', name: 'Phantom', icon: '👻' },
];

function EniShopLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="white" />
      <ellipse cx="42" cy="55" rx="22" ry="28" fill="#003333" />
      <circle cx="55" cy="38" r="20" fill="#ff5722" />
    </svg>
  );
}

function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); }
    }, { threshold: 0.1, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isInView];
}

function ItemImage({ type, className = '' }) {
  const gradients = {
    sneakers: 'from-orange-600/40 via-amber-500/30 to-orange-700/40',
    token: 'from-orange-500/40 via-amber-400/30 to-yellow-500/40',
    nft: 'from-orange-600/40 via-red-500/30 to-orange-700/40',
    nft2: 'from-amber-500/40 via-orange-400/30 to-yellow-500/40',
    nft3: 'from-orange-500/40 via-amber-300/30 to-orange-600/40',
    nft4: 'from-yellow-500/40 via-orange-400/30 to-amber-500/40',
    token2: 'from-orange-600/40 via-amber-500/30 to-orange-500/40',
    token3: 'from-amber-400/40 via-orange-600/30 to-yellow-500/40',
    watch: 'from-neutral-500/40 via-neutral-400/30 to-neutral-600/40',
    console: 'from-orange-600/40 via-red-500/30 to-orange-700/40',
    bag: 'from-amber-500/40 via-orange-400/30 to-yellow-600/40',
    vinyl: 'from-orange-500/40 via-amber-500/30 to-orange-600/40',
  };
  const icons = {
    sneakers: '👟', token: '🪙', nft: '🎨', nft2: '🌸', nft3: '🐧', nft4: '✨',
    token2: '💎', token3: '🏛️', watch: '⌚', console: '🎮', bag: '👜', vinyl: '🎵',
  };
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradients[type] || 'from-neutral-500/30 to-neutral-600/30'} ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl filter drop-shadow-lg">{icons[type] || '📦'}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}

function TwitterMonikerModal({ onClose, onSubmit }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateTwitterUsername = (name) => {
    const cleanName = name.startsWith('@') ? name.slice(1) : name;
    if (cleanName.length < 1 || cleanName.length > 15) return 'Username must be 1-15 characters';
    if (!/^[A-Za-z0-9_]+$/.test(cleanName)) return 'Only letters, numbers, and underscores allowed';
    return null;
  };

  const handleSubmit = () => {
    const validationError = validateTwitterUsername(username);
    if (validationError) { setError(validationError); return; }
    setIsSubmitting(true);
    setTimeout(() => {
      const cleanUsername = username.startsWith('@') ? username : `@${username}`;
      onSubmit(cleanUsername);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setUsername(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-md glass rounded-3xl p-8 animate-fade-in-up border border-[var(--accent)]/20" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Set Your Moniker</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--accent)]/20 transition-colors">
            <X className="w-5 h-5" style={{ color: 'var(--text)' }} />
          </button>
        </div>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center mx-auto mb-4">
            <Twitter className="w-8 h-8 text-[#1DA1F2]" />
          </div>
          <p className="text-base" style={{ color: 'var(--muted)' }}>
            Enter your Twitter username. This will be your display name on EniSh0p.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--muted)' }}>Twitter Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] font-bold">@</span>
              <input
                type="text"
                value={username.startsWith('@') ? username.slice(1) : username}
                onChange={handleChange}
                placeholder="your_username"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition-colors text-base font-medium placeholder:opacity-50"
                style={{ color: 'var(--text)', borderColor: error ? '#ef4444' : undefined }}
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
          </div>
          <div className="glass rounded-xl p-4 border border-[var(--accent)]/10">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              <Shield className="w-4 h-4 inline mr-1 text-[var(--accent)]" />
              Your Twitter handle helps build trust in the marketplace
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !username}
            className="w-full py-3 rounded-xl btn-primary text-base font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Confirm Moniker</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function WalletModal({ onClose, onConnect }) {
  const [connecting, setConnecting] = useState(null);
  const handleConnect = (wallet) => {
    setConnecting(wallet.id);
    setTimeout(() => { setConnecting(null); onConnect(wallet); }, 1500);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-md glass rounded-3xl p-8 animate-fade-in-up border border-[var(--accent)]/20" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Connect Wallet</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--accent)]/20 transition-colors">
            <X className="w-5 h-5" style={{ color: 'var(--text)' }} />
          </button>
        </div>
        <div className="space-y-3">
          {WALLET_OPTIONS.map(wallet => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet)}
              disabled={connecting !== null}
              className="w-full flex items-center gap-4 p-4 rounded-xl glass hover:border-[var(--accent)]/50 transition-all disabled:opacity-50"
            >
              <span className="text-2xl">{wallet.icon}</span>
              <span className="flex-1 text-left text-base font-semibold" style={{ color: 'var(--text)' }}>{wallet.name}</span>
              {connecting === wallet.id ? (
                <div className="w-5 h-5 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
              ) : (
                <ArrowUpRight className="w-5 h-5" style={{ color: 'var(--muted)' }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListingModal({ item, onClose }) {
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleBid = () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) return;
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setSuccess(true); }, 1500);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl glass rounded-3xl overflow-hidden animate-fade-in-up border border-[var(--accent)]/20" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-[var(--accent)]/20 transition-colors">
          <X className="w-5 h-5" style={{ color: 'var(--text)' }} />
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 aspect-square">
            <ItemImage type={item.image} className="w-full h-full" />
          </div>
          <div className="flex-1 p-6 flex flex-col">
            {success ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Bid Placed!</h3>
                <p className="mb-6 text-base font-medium" style={{ color: 'var(--muted)' }}>Your bid of {bidAmount} $0G has been submitted</p>
                <button onClick={onClose} className="px-6 py-3 rounded-xl btn-primary text-base font-semibold">Done</button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    item.category === 'whitelists' ? 'badge-nft' :
                    item.category === 'tokens' ? 'badge-token' : 'badge-item'
                  } text-white`}>
                    {CATEGORIES.find(c => c.id === item.category)?.name}
                  </span>
                  {item.trending && (
                    <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-[var(--accent)]/20 text-[var(--accent)] flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> Hot
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>{item.title}</h2>
                <div className="flex items-center gap-2 text-sm mb-4 font-medium" style={{ color: 'var(--muted)' }}>
                  <User className="w-4 h-4" /><span>{item.seller}</span>
                  <span style={{ color: 'var(--border)' }}>•</span>
                  <Shield className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-[var(--accent)]">Verified</span>
                </div>
                <div className="glass rounded-xl p-4 mb-4 border border-[var(--accent)]/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Current Price</span>
                    <span className="text-2xl font-bold text-[var(--accent)]">{item.price} $0G</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium" style={{ color: 'var(--muted)' }}>{item.bids} bids</span>
                    <span className="flex items-center gap-1 text-[var(--accent)] font-medium">
                      <Clock className="w-4 h-4" /> {item.timeLeft}
                    </span>
                  </div>
                </div>
                <div className="mt-auto">
                  <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--muted)' }}>Your Bid ($0G)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      placeholder={String(item.price + 10)}
                      className="flex-1 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition-colors text-base font-medium placeholder:opacity-50"
                      style={{ color: 'var(--text)' }}
                    />
                    <button
                      onClick={handleBid}
                      disabled={isSubmitting || !bidAmount}
                      className="px-6 py-3 rounded-xl btn-primary text-base font-semibold disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Place Bid <ArrowUpRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateModal({ onClose }) {
  const [formData, setFormData] = useState({ title: '', category: 'items', price: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleSubmit = () => {
    if (!formData.title || !formData.price) return;
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setSuccess(true); }, 1500);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg glass rounded-3xl p-8 animate-fade-in-up border border-[var(--accent)]/20" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Create New Listing</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--accent)]/20 transition-colors">
            <X className="w-5 h-5" style={{ color: 'var(--text)' }} />
          </button>
        </div>
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Listing Created!</h3>
            <p className="mb-6 text-base font-medium" style={{ color: 'var(--muted)' }}>Your item is now live on the marketplace</p>
            <button onClick={onClose} className="px-6 py-3 rounded-xl btn-primary text-base font-semibold">Done</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--muted)' }}>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Enter item title..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition-colors text-base font-medium placeholder:opacity-50"
                style={{ color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--muted)' }}>Category</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFormData({...formData, category: cat.id})}
                    className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                      formData.category === cat.id ? 'btn-primary' : 'bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]'
                    }`}
                    style={{ color: formData.category === cat.id ? 'white' : 'var(--text)' }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--muted)' }}>Price ($0G)</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition-colors text-base font-medium placeholder:opacity-50"
                style={{ color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--muted)' }}>Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your item..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition-colors resize-none text-base font-medium placeholder:opacity-50"
                style={{ color: 'var(--text)' }}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.title || !formData.price}
              className="w-full py-3 rounded-xl btn-primary text-base font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Listing <ArrowUpRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationPanel({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full right-0 mt-2 w-80 glass rounded-2xl overflow-hidden animate-fade-in-up z-50 border border-[var(--accent)]/20">
      <div className="p-4 border-b border-[var(--border)]">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Notifications</h3>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {NOTIFICATIONS.map(notif => (
          <div key={notif.id} className={`p-4 border-b border-[var(--border)] hover:bg-[var(--accent)]/5 transition-colors cursor-pointer ${notif.unread ? 'bg-[var(--accent)]/10' : ''}`}>
            <div className="flex items-start gap-3">
              {notif.unread && <div className="w-2 h-2 rounded-full bg-[var(--accent)] mt-2 flex-shrink-0" />}
              <div className={notif.unread ? '' : 'ml-5'}>
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{notif.text}</p>
                <p className="text-sm mt-1 font-medium" style={{ color: 'var(--muted)' }}>{notif.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 text-center">
        <button className="text-sm text-[var(--accent)] hover:underline font-semibold">View All</button>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showTwitterModal, setShowTwitterModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [twitterMoniker, setTwitterMoniker] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [ref] = useInView();

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const filteredItems = useMemo(() => {
    return MOCK_ITEMS.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
      return newSet;
    });
  }, []);

  const handleWalletConnect = useCallback(() => {
    setIsConnected(true);
    setShowWallet(false);
    setTimeout(() => setShowTwitterModal(true), 300);
  }, []);

  const handleTwitterSubmit = useCallback((username) => {
    setTwitterMoniker(username);
    setShowTwitterModal(false);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="pulse-glow rounded-xl overflow-hidden">
                <EniShopLogo size={40} />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>EniSh0p</h1>
                <p className="text-sm text-[var(--accent)] font-semibold">Powered by 0G</p>
              </div>
            </div>
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search items, tokens, WL spots..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition-colors text-base font-medium placeholder:opacity-50"
                  style={{ color: 'var(--text)' }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl hover:bg-[var(--surface)] transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-[var(--accent)]" /> : <Moon className="w-5 h-5" style={{ color: 'var(--text)' }} />}
              </button>
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 rounded-xl hover:bg-[var(--surface)] transition-colors relative">
                  <Bell className="w-5 h-5" style={{ color: 'var(--text)' }} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[var(--accent)] text-white text-xs flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
              </div>
              <button onClick={() => setShowCreate(true)} className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-base font-semibold">
                <Plus className="w-5 h-5" /> List Item
              </button>
              <button onClick={() => isConnected ? null : setShowWallet(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:border-[var(--accent)]/50 transition-colors">
                <Wallet className="w-5 h-5 text-[var(--accent)]" />
                <span className="hidden sm:inline text-base font-semibold" style={{ color: 'var(--text)' }}>
                  {isConnected && twitterMoniker ? twitterMoniker : 'Connect'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative hero-gradient py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[var(--accent)]/15 blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl animate-float" style={{animationDelay: '1.5s'}} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-6 animate-fade-in-up border border-[var(--accent)]/30">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
            <span className="text-base font-semibold" style={{ color: 'var(--text)' }}>Decentralized Marketplace on 0G</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-in-up" style={{ color: 'var(--text)', animationDelay: '0.1s' }}>
            Trade <span className="gradient-text">Anything</span>
            <br />
            Anywhere, Trustlessly
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 animate-fade-in-up font-medium" style={{ color: 'var(--muted)', animationDelay: '0.2s' }}>
            Real items, tokens, and NFT whitelists — all in one place.
            <br />
            Powered by 0G's infinite scalability and zero gas fees.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => setShowCreate(true)} className="px-8 py-4 rounded-xl btn-primary text-lg font-semibold flex items-center gap-2">
              Start Selling <ArrowUpRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 rounded-xl glass hover:border-[var(--accent)]/50 transition-colors flex items-center gap-2 text-lg font-semibold" style={{ color: 'var(--text)' }}>
              Explore <ChevronDown className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto">
            {[
              { value: '$2.4M+', label: 'Total Volume' },
              { value: '15K+', label: 'Active Users' },
              { value: '8,500+', label: 'Items Listed' },
              { value: '0.01s', label: 'Avg. Finality' },
            ].map((stat, i) => (
              <div key={stat.label} className="glass rounded-2xl p-5 animate-fade-in-up border-glow" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                <div className="text-2xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-base font-semibold transition-all ${
                  selectedCategory === cat.id ? 'btn-primary' : 'glass hover:border-[var(--accent)]/50'
                }`}
                style={{ color: selectedCategory === cat.id ? 'white' : 'var(--text)' }}
              >
                <cat.icon className="w-5 h-5" />{cat.name}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[var(--accent)] text-white' : 'hover:bg-[var(--surface)]'}`}>
                <Grid className="w-5 h-5" style={{ color: viewMode === 'grid' ? 'white' : 'var(--text)' }} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[var(--accent)] text-white' : 'hover:bg-[var(--surface)]'}`}>
                <List className="w-5 h-5" style={{ color: viewMode === 'list' ? 'white' : 'var(--text)' }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Items */}
      <section ref={ref} className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted)' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>No items found</h3>
              <p className="text-base font-medium" style={{ color: 'var(--muted)' }}>Try adjusting your search or filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group glass rounded-2xl overflow-hidden cursor-pointer card-hover animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <ItemImage type={item.image} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    <button
                      onClick={e => { e.stopPropagation(); toggleFavorite(item.id); }}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                        favorites.has(item.id) ? 'bg-[var(--accent)] text-white' : 'bg-black/50 backdrop-blur-sm hover:bg-[var(--accent)]/80'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                    </button>
                    {item.trending && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[var(--accent)] text-white text-sm font-bold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> Hot
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        item.category === 'whitelists' ? 'badge-nft' :
                        item.category === 'tokens' ? 'badge-token' : 'badge-item'
                      } text-white`}>
                        {CATEGORIES.find(c => c.id === item.category)?.name}
                      </span>
                    </div>
                    <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-[var(--accent)]">{item.price} $0G</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{item.bids} bids</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm flex items-center gap-1 font-medium" style={{ color: 'var(--muted)' }}>
                          <Clock className="w-4 h-4" /> {item.timeLeft}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group glass rounded-xl p-4 cursor-pointer card-hover animate-fade-in-up flex items-center gap-4"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <ItemImage type={item.image} className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold truncate group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>{item.title}</h3>
                    <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{item.seller}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.category === 'whitelists' ? 'badge-nft' :
                      item.category === 'tokens' ? 'badge-token' : 'badge-item'
                    } text-white`}>
                      {CATEGORIES.find(c => c.id === item.category)?.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-[var(--accent)]">{item.price} $0G</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{item.bids} bids</p>
                  </div>
                  <div className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                    <Clock className="w-4 h-4 inline mr-1" /> {item.timeLeft}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <EniShopLogo size={32} />
              <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>EniSh0p — Powered by 0G</span>
            </div>
            <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--muted)' }}>
              <a href="#" className="hover:text-[var(--accent)] transition-colors font-semibold">Terms</a>
              <a href="#" className="hover:text-[var(--accent)] transition-colors font-semibold">Privacy</a>
              <a href="#" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-semibold">
                <Twitter className="w-4 h-4" /> Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>

      {selectedItem && <ListingModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
      {showWallet && <WalletModal onClose={() => setShowWallet(false)} onConnect={handleWalletConnect} />}
      {showTwitterModal && <TwitterMonikerModal onClose={() => setShowTwitterModal(false)} onSubmit={handleTwitterSubmit} />}

      {/* Mobile Search */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-30">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-3 rounded-xl glass border border-[var(--accent)]/30 focus:border-[var(--accent)] focus:outline-none transition-colors text-base font-medium placeholder:opacity-50"
            style={{ color: 'var(--text)' }}
          />
        </div>
      </div>
    </div>
  );
}
