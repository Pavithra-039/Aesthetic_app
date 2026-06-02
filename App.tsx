import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Menu, X, ArrowRight, Instagram, Twitter, Facebook, ChevronLeft, ShieldCheck, Truck, Sparkles, Flame, Heart, Compass, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PRODUCTS, JOURNAL_POSTS } from './constants';
import { CartItem, Product } from './types';
import Cart from './components/Cart';
import Checkout, { BuyingDetails } from './components/Checkout';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentView, setCurrentView] = useState<'home' | 'journal' | 'about' | 'checkout' | 'contact' | 'faq' | 'shipping'>('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<BuyingDetails | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeHandbookTab, setActiveHandbookTab] = useState<'wabi-sabi' | 'kintsugi' | 'hygge' | 'shinrin-yoku' | 'lagom'>('wabi-sabi');

  const categories = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  const getProductDetails = (product: Product) => {
    const defaults = {
      materials: "Sustainable Natural Materials",
      dimensions: "Varies by item",
      origin: "Artisan Studios",
      care: "Wipe with a soft, damp cloth. Avoid harsh chemicals."
    };

    switch (product.category) {
      case 'Decor':
        return {
          materials: "Terracotta clay / stoneware, lead-free natural glazes",
          dimensions: '9" H x 5.5" W x 5.5" D',
          origin: "Kyoto, Japan",
          care: "Dust with a dry microfibre cloth. Hand wash carefully if needed."
        };
      case 'Fragrance':
        return {
          materials: "100% natural soy wax, pure organic essential oils, cotton wick",
          dimensions: '3.5" H x 3" W (8 oz / 45 hours burn time)',
          origin: "Grasse, France",
          care: "Trim wick to 1/4\" before lighting. Burn for a minimum of 2 hours on first use."
        };
      case 'Textiles':
        return {
          materials: "100% Organic European Flax linen, GOTS certified",
          dimensions: '50" x 70" throw dimension',
          origin: "Guimarães, Portugal",
          care: "Machine wash cold on a gentle cycle. Tumble dry on super low or hang dry."
        };
      case 'Furniture':
        return {
          materials: "FSC-Certified Solid White Oak, natural cold-pressed linseed oil finish",
          dimensions: '24" H x 18" D x 18" W',
          origin: "Småland, Sweden",
          care: "Avoid direct harsh sunlight and dampness. Polish seasonally with organic beeswax."
        };
      default:
        return defaults;
    }
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = searchQuery.trim() === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // If a search query is active, bypass active category selection to enable global catalog search
      if (searchQuery.trim() !== '') {
        return matchesSearch;
      }
      
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToProducts = () => {
    setCurrentView('home');
    setIsMenuOpen(false);
    setSelectedPostId(null);
    setTimeout(() => {
      const element = document.getElementById('products');
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navigateTo = (view: 'home' | 'journal' | 'about' | 'checkout' | 'contact' | 'faq' | 'shipping') => {
    setCurrentView(view);
    setIsMenuOpen(false);
    setSelectedPostId(null);
    setIsOrderComplete(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckoutComplete = (details: BuyingDetails) => {
    console.log('Order completed with details:', details);
    setLastOrderDetails(details);
    setIsOrderComplete(true);
    setCartItems([]);
    setTimeout(() => {
      navigateTo('home');
    }, 10000); // Give more time to read the confirmation
  };

  const selectedPost = useMemo(() => 
    JOURNAL_POSTS.find(p => p.id === selectedPostId),
  [selectedPostId]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-brand-cream/80 backdrop-blur-md border-b border-brand-ink/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-brand-ink/5 rounded-full transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center gap-6 text-sm uppercase tracking-widest font-medium text-brand-ink/60">
              <button 
                onClick={scrollToProducts}
                className={`hover:text-brand-ink transition-colors ${currentView === 'home' ? 'text-brand-ink' : ''}`}
              >
                Shop
              </button>
              <button 
                onClick={() => navigateTo('journal')}
                className={`hover:text-brand-ink transition-colors ${currentView === 'journal' ? 'text-brand-ink' : ''}`}
              >
                Journal
              </button>
              <button 
                onClick={() => navigateTo('about')}
                className={`hover:text-brand-ink transition-colors ${currentView === 'about' ? 'text-brand-ink' : ''}`}
              >
                About
              </button>
            </div>
          </div>

          <button 
            onClick={() => navigateTo('home')}
            className="text-3xl font-serif tracking-tighter absolute left-1/2 -translate-x-1/2 hover:opacity-70 transition-opacity"
          >
            AURA
          </button>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setIsSearchOpen(prev => !prev);
                if (currentView !== 'home') {
                  navigateTo('home');
                }
                setTimeout(() => {
                  const element = document.getElementById('products');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
              className={`p-2 rounded-full transition-all relative ${isSearchOpen ? 'bg-brand-clay/10 text-brand-clay' : 'hover:bg-brand-ink/5 text-brand-ink'}`}
              aria-label="Toggle Search"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-brand-ink/5 rounded-full transition-colors relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-clay text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Animated Search Bar Slide-Down Panel */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 w-full bg-brand-cream border-b border-brand-ink/10 z-30 shadow-md"
          >
            <div className="max-w-4xl mx-auto px-6 py-6 flex items-center gap-4">
              <Search size={22} className="text-brand-clay flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items... (e.g. ceramic, planter, candle, incense, chair, linen, rugs)"
                className="w-full bg-transparent text-xl font-serif text-brand-ink outline-none placeholder:text-brand-ink/25 py-2"
                autoFocus
                id="search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs uppercase tracking-widest font-bold text-brand-clay hover:opacity-80 transition-opacity bg-brand-clay/10 px-3 py-1.5 rounded-full"
                >
                  Clear
                </button>
              )}
              <button 
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-2 hover:bg-brand-ink/5 rounded-full transition-colors flex-shrink-0"
                title="Close Search"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute left-0 top-0 h-full w-4/5 max-w-sm bg-brand-cream shadow-2xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex items-center justify-between border-b border-brand-ink/5">
            <span className="text-2xl font-serif tracking-tighter">AURA</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-brand-ink/5 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-8 flex flex-col gap-8 text-2xl font-serif">
            <button onClick={scrollToProducts} className="text-left hover:text-brand-clay transition-colors">Shop</button>
            <button onClick={() => navigateTo('journal')} className="text-left hover:text-brand-clay transition-colors">Journal</button>
            <button onClick={() => navigateTo('about')} className="text-left hover:text-brand-clay transition-colors">About</button>
          </div>
        </div>
      </div>

      <main className="flex-grow pt-20">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
              <motion.div 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <img 
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2400" 
                  alt="Hero" 
                  className="w-full h-full object-cover brightness-[0.85]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              
              <div className="relative z-10 text-center text-brand-cream px-6">
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="block text-sm uppercase tracking-[0.3em] mb-4 font-medium"
                >
                  New Collection 2026
                </motion.span>
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-6xl md:text-8xl font-serif mb-8 leading-tight"
                >
                  The Art of <br /> <span className="italic">Living Simply</span>
                </motion.h2>
                <motion.button 
                  onClick={scrollToProducts}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="group flex items-center gap-3 mx-auto bg-brand-cream text-brand-ink px-8 py-4 rounded-full font-medium hover:bg-brand-sage hover:text-brand-cream transition-all duration-300"
                >
                  Explore Collection
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </section>

            {/* Products Section */}
            <section id="products" className="max-w-7xl mx-auto px-6 py-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div>
                  <h3 className="text-4xl font-serif mb-4">Curated Essentials</h3>
                  <p className="text-brand-ink/60 max-w-md">
                    Thoughtfully designed pieces that bring tranquility and balance to your everyday surroundings.
                  </p>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        activeCategory === cat 
                          ? 'bg-brand-ink text-brand-cream' 
                          : 'bg-brand-sand text-brand-ink/60 hover:bg-brand-ink/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 px-6 border border-brand-ink/10 rounded-3xl bg-brand-sand/15 max-w-2xl mx-auto space-y-6">
                  <div className="w-16 h-16 rounded-full bg-brand-clay/10 text-brand-clay flex items-center justify-center mx-auto">
                    <Search size={26} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-serif">No Curated Pieces Found</h4>
                    <p className="text-sm text-brand-ink/60 max-w-sm mx-auto leading-relaxed">
                      We couldn't find any objects matching <span className="font-semibold text-brand-clay">"{searchQuery}"</span>. Try checking your spelling or looking for broad terms like "ceramic" or "linen".
                    </p>
                  </div>
                  <div className="flex justify-center gap-4 pt-2">
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="px-6 py-3 bg-brand-ink text-brand-cream text-xs uppercase tracking-widest font-bold rounded-full hover:bg-brand-sage transition-colors"
                    >
                      Clear Search Query
                    </button>
                    {activeCategory !== 'All' && (
                      <button 
                        onClick={() => {
                          setActiveCategory('All');
                          setSearchQuery('');
                        }}
                        className="px-6 py-3 bg-brand-sand/65 text-brand-ink text-xs uppercase tracking-widest font-bold rounded-full hover:bg-brand-ink hover:text-brand-cream transition-all"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ y: 40, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="relative aspect-[4/5] bg-brand-sand rounded-2xl overflow-hidden mb-6">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-brand-ink/0 group-hover:bg-brand-ink/5 transition-colors duration-300" />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="absolute bottom-6 left-6 right-6 bg-brand-cream/90 backdrop-blur-md py-4 rounded-xl font-medium translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-brand-ink hover:text-brand-cream"
                        >
                          Add to Bag
                        </button>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-brand-ink/40 mb-1">{product.category}</p>
                          <h4 className="text-xl font-serif group-hover:text-brand-clay transition-colors">{product.name}</h4>
                        </div>
                        <span className="text-lg font-serif">${product.price}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* About/Atmospheric Section */}
            <section className="bg-brand-sand py-24">
              <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <div className="relative aspect-square rounded-3xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1200" 
                    alt="Atmospheric" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-8">
                  <span className="text-xs uppercase tracking-[0.3em] text-brand-clay font-bold">Our Philosophy</span>
                  <h3 className="text-5xl font-serif leading-tight">Crafted for the <br /> <span className="italic">Mindful Home</span></h3>
                  <p className="text-lg text-brand-ink/70 leading-relaxed">
                    We believe that the objects we surround ourselves with have a profound impact on our well-being. Aura is a celebration of craftsmanship, natural materials, and the beauty of imperfection.
                  </p>
                  <div className="pt-4">
                    <button 
                      onClick={() => navigateTo('about')}
                      className="border-b border-brand-ink pb-1 text-sm uppercase tracking-widest font-bold hover:text-brand-clay hover:border-brand-clay transition-all"
                    >
                      Read Our Story
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Latest from Journal Section */}
            <section className="max-w-7xl mx-auto px-6 py-24">
              <div className="flex items-center justify-between mb-16">
                <h3 className="text-4xl font-serif">Latest from the Journal</h3>
                <button 
                  onClick={() => navigateTo('journal')}
                  className="group flex items-center gap-2 text-sm uppercase tracking-widest font-bold hover:text-brand-clay transition-colors"
                >
                  View All
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {JOURNAL_POSTS.slice(0, 4).map((post) => (
                  <article 
                    key={post.id} 
                    className="group cursor-pointer"
                    onClick={() => {
                      setCurrentView('journal');
                      setSelectedPostId(post.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6">
                      <img 
                        src={post.image} 
                        alt={post.imageAlt || post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <div className="space-y-3">
                      <span className="text-[10px] text-brand-ink/40 uppercase tracking-widest">{post.date}</span>
                      <h4 className="text-xl font-serif group-hover:text-brand-clay transition-colors line-clamp-2">{post.title}</h4>
                      <p className="text-sm text-brand-ink/60 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Social Gallery Section */}
            <section className="bg-brand-sand/30 border-t border-brand-ink/5 py-24">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center space-y-4 mb-16">
                  <span className="text-xs uppercase tracking-[0.3em] text-brand-clay font-bold">Follow Our Journey</span>
                  <h3 className="text-4xl font-serif">Aura on Instagram</h3>
                  <p className="text-sm text-brand-ink/65 max-w-md mx-auto">
                    Share your quiet corners and mindful setups with us of our curated collections. Use <span className="font-bold text-brand-clay">#AuraLiving</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                  {[
                    { id: 'ig-1', img: 'https://images.unsplash.com/photo-1515002246390-7bf7e8f87b54?auto=format&fit=crop&q=80&w=600', tag: '@aura.living' },
                    { id: 'ig-2', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600', tag: '@aura.studio' },
                    { id: 'ig-3', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=600', tag: '@aura.home' },
                    { id: 'ig-4', img: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=600', tag: '@aura.spaces' },
                    { id: 'ig-5', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600', tag: '@aura.mindful' },
                  ].map((post, i) => (
                    <motion.div 
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img 
                        src={post.img} 
                        alt="Instagram snapshot" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-brand-ink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-brand-cream text-xs uppercase tracking-widest font-bold tracking-[0.15em]">{post.tag}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>

        )}

        {currentView === 'journal' && (
          <section className="max-w-4xl mx-auto px-6 py-24">
            {!selectedPostId ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-16"
              >
                <div className="text-center space-y-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-brand-clay font-bold">The Journal</span>
                  <h2 className="text-5xl font-serif">Stories of Living</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                  {JOURNAL_POSTS.map((post, i) => (
                    <article 
                      key={post.id} 
                      className="group cursor-pointer"
                      onClick={() => {
                        setSelectedPostId(post.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
                        <img src={post.image} alt={post.imageAlt || post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                      <div className="space-y-4">
                        <span className="text-xs text-brand-ink/40 uppercase tracking-widest">{post.date}</span>
                        <h3 className="text-3xl font-serif group-hover:text-brand-clay transition-colors">{post.title}</h3>
                        <p className="text-brand-ink/60 leading-relaxed line-clamp-3">{post.excerpt}</p>
                        <button className="text-sm font-bold border-b border-brand-ink pb-1 hover:text-brand-clay hover:border-brand-clay transition-all">Read More</button>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Artisanal Philosophy Handbook */}
                <div id="artisanal-handbook" className="border-t border-brand-ink/10 pt-20 mt-28 space-y-12">
                  <div className="text-center space-y-4">
                    <span className="text-xs uppercase tracking-[0.3em] text-brand-clay font-bold font-sans">Interactive Handbook</span>
                    <h2 className="text-4xl font-serif">Artisanal Philosophy Companion</h2>
                    <p className="text-brand-ink/65 text-sm max-w-xl mx-auto leading-relaxed font-serif">
                      Select an essential life philosophy below to unlock core home-design principles, curated material styling, and mindful daily rituals.
                    </p>
                  </div>

                  {/* Tab selectors */}
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto border-b border-brand-ink/10 pb-6">
                    {[
                      { key: 'wabi-sabi', label: 'Wabi-Sabi', icon: Sparkles, desc: 'Imperfect beauty' },
                      { key: 'kintsugi', label: 'Kintsugi', icon: ShieldCheck, desc: 'Golden repairs' },
                      { key: 'hygge', label: 'Hygge', icon: Flame, desc: 'Cozy sanctuary' },
                      { key: 'shinrin-yoku', label: 'Shinrin-Yoku', icon: Compass, desc: 'Forest breathing' },
                      { key: 'lagom', label: 'Lagom', icon: BookOpen, desc: 'Perfect balance' }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeHandbookTab === tab.key;
                      return (
                        <button
                          id={`handbook-tab-${tab.key}`}
                          key={tab.key}
                          onClick={() => setActiveHandbookTab(tab.key as any)}
                          className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 ${
                            isActive 
                              ? 'bg-brand-clay text-brand-cream shadow-md scale-102' 
                              : 'bg-brand-sand/50 text-brand-ink/70 hover:bg-brand-sand hover:text-brand-ink'
                          }`}
                        >
                          <Icon size={14} className={isActive ? 'text-brand-cream' : 'text-brand-clay'} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab panel display card */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeHandbookTab}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="bg-brand-sand/20 rounded-3xl border border-brand-ink/5 p-8 md:p-12"
                    >
                      {activeHandbookTab === 'wabi-sabi' && (
                        <div id="handbook-panel-wabi-sabi" className="grid md:grid-cols-2 gap-12 items-center">
                          <div className="space-y-6">
                            <span className="text-xs uppercase tracking-wider text-brand-clay font-bold">Wabi-Sabi • Finding Perfection in the Imperfect</span>
                            <h3 className="text-3xl font-serif">The Path of Organic Aging</h3>
                            <p className="text-sm text-brand-ink/75 leading-relaxed font-serif">
                              Rooted in traditional Japanese aesthetics, Wabi-Sabi honors the natural lifecycle of creation, decline, and raw asymmetry. It inspires spaces that feel authentic, unhurried, and deeply grounded.
                            </p>
                            <div className="space-y-3">
                              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-ink/40 font-sans">Home Design Blueprint</h4>
                              <ul className="text-xs text-brand-ink/70 space-y-2 list-disc pl-4 font-serif">
                                <li><strong>Texture priority:</strong> Incorporate weathered earthenware with uneven, dripped glazes.</li>
                                <li><strong>Material authenticity:</strong> Choose unvarnished white oak, raw slate slabs, and wrinkled pre-washed linen blankets.</li>
                                <li><strong>Space density:</strong> Keep corners spacious to allow objects space to breathe.</li>
                              </ul>
                            </div>
                            <div className="pt-4 border-t border-brand-ink/10 font-serif">
                              <p className="text-xs italic text-brand-ink/50">"Care Tip: Clean your organic ceramics with room-temperature water. Do not scrub off the natural wear — that is the object's soul growing."</p>
                            </div>
                          </div>
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                            <img 
                              src="https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800" 
                              alt="Wabi Sabi Aesthetics" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      )}

                      {activeHandbookTab === 'kintsugi' && (
                        <div id="handbook-panel-kintsugi" className="grid md:grid-cols-2 gap-12 items-center">
                          <div className="space-y-6">
                            <span className="text-xs uppercase tracking-wider text-brand-clay font-bold">Kintsugi • The Art of Golden Joinery</span>
                            <h3 className="text-3xl font-serif">Mending with Golden Grace</h3>
                            <p className="text-sm text-brand-ink/75 leading-relaxed font-serif">
                              When a treasured piece cracks, Kintsugi does not attempt to hide the damage. Instead, broken edges are painstakingly rejoined using traditional Japanese Urushi tree sap lacquer dusted with real powdered gold.
                            </p>
                            <div className="space-y-3">
                              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-ink/40 font-sans">Bespoke Restoration Steps</h4>
                              <ul className="text-xs text-brand-ink/70 space-y-2 list-decimal pl-4 font-serif">
                                <li><strong>Pre-Alignment:</strong> Gently wash and align matching fragments safely before mending.</li>
                                <li><strong>Lacquer Bonding:</strong> Apply standard Urushi adhesive to mend the breakage line.</li>
                                <li><strong>The Gold Accent:</strong> Carefully hand-dust gold lacquer along the vein to seal the repair forever.</li>
                              </ul>
                            </div>
                            <div className="pt-4 border-t border-brand-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-serif">
                              <p className="text-xs italic text-brand-ink/50">"Our Service: We run an active, bespoke restoration studio. Connect with us to mend your pottery pieces."</p>
                              <button 
                                id="btn-restoration-service"
                                onClick={() => {
                                  setCurrentView('contact');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="px-4 py-2 bg-brand-clay text-brand-cream text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-brand-ink transition-colors flex-shrink-0 animate-pulse"
                              >
                                Connect with Artisan
                              </button>
                            </div>
                          </div>
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                            <img 
                              src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800" 
                              alt="Kintsugi Golden mending artisan" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      )}

                      {activeHandbookTab === 'hygge' && (
                        <div id="handbook-panel-hygge" className="grid md:grid-cols-2 gap-12 items-center">
                          <div className="space-y-6">
                            <span className="text-xs uppercase tracking-wider text-brand-clay font-bold">Hygge • Cozy Contentment</span>
                            <h3 className="text-3xl font-serif">Cultivating Warm Sanctuary</h3>
                            <p className="text-sm text-brand-ink/75 leading-relaxed font-serif">
                              A Danish term centered around the soothing presence of warmth, safety, and deep emotional rest in the immediate sensory environment.
                            </p>
                            <div className="space-y-3">
                              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-ink/40 font-sans">Cozy Sanctuary Rules</h4>
                              <ul className="text-xs text-brand-ink/70 space-y-2 list-disc pl-4 font-serif">
                                <li><strong>Sensory light:</strong> Use soft 2200K warm candle flickers. Avoid direct harsh overhead lighting.</li>
                                <li><strong>Waffle textures:</strong> Fold a heavy waffle knit throw or cotton blanket over cozy armchairs.</li>
                                <li><strong>Clutter-free warmth:</strong> Establish dedicated, device-free reading pockets.</li>
                              </ul>
                            </div>
                            <div className="pt-4 border-t border-brand-ink/10 font-serif">
                              <p className="text-xs italic text-brand-ink/50">"Daily Prompt: Light a soy-candle today at dusk. Keep screens turned off for at least 30 minutes, allowing olfactory stillness to reset your focus."</p>
                            </div>
                          </div>
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                            <img 
                              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800" 
                              alt="Hygge cozy candles" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      )}

                      {activeHandbookTab === 'shinrin-yoku' && (
                        <div id="handbook-panel-shinrin-yoku" className="grid md:grid-cols-2 gap-12 items-center">
                          <div className="space-y-6">
                            <span className="text-xs uppercase tracking-wider text-brand-clay font-bold">Shinrin-Yoku • Forest Bathing</span>
                            <h3 className="text-3xl font-serif">Nature Olfactory Immersion</h3>
                            <p className="text-sm text-brand-ink/75 leading-relaxed font-serif">
                              The healing practice of forest bathing translates into surrounding your senses with natural wooden oils, earthy pine, and botanical properties to relieve active daily stress levels.
                            </p>
                            <div className="space-y-3">
                              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-ink/40 font-sans">Aromatherapy Mindfulness Practices</h4>
                              <ul className="text-xs text-brand-ink/70 space-y-2 list-disc pl-4 font-serif">
                                <li><strong>Hinoki wood:</strong> Distill hinoki cypress oil to drop on timber blocks for native humectant benefits.</li>
                                <li><strong>Cedar incense:</strong> Light slow-burning cedarwood cones in quiet corners.</li>
                                <li><strong>Forest views:</strong> Maximize window light and house leafy ferns or climbing ivies.</li>
                              </ul>
                            </div>
                            <div className="pt-4 border-t border-brand-ink/10 font-serif">
                              <p className="text-xs italic text-brand-ink/50">"Botanical fact: Real cedarwood and hinoki woods contain organic phytoncides that drop heart rate variability when smelled."</p>
                            </div>
                          </div>
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                            <img 
                              src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800" 
                              alt="Forest bathing nature" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      )}

                      {activeHandbookTab === 'lagom' && (
                        <div id="handbook-panel-lagom" className="grid md:grid-cols-2 gap-12 items-center">
                          <div className="space-y-6">
                            <span className="text-xs uppercase tracking-wider text-brand-clay font-bold">Lagom • The Swedish Secret</span>
                            <h3 className="text-3xl font-serif">The Balance of "Just Enough"</h3>
                            <p className="text-sm text-brand-ink/75 leading-relaxed font-serif">
                              Moderation is key. Lagom stands for selecting and displaying only what has real usage, purpose, and utility — rejecting frivolous excess while refusing extreme cold sparseness.
                            </p>
                            <div className="space-y-3">
                              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-ink/40 font-sans">Lagom Balanced Layouts</h4>
                              <ul className="text-xs text-brand-ink/70 space-y-2 list-disc pl-4 font-serif">
                                <li><strong>Functional furniture:</strong> Choose sturdy oak wood side tables and rattan seating with dual-purpose space.</li>
                                <li><strong>Honest objects:</strong> If a piece brings neither daily function nor deliberate inspiration, safely gift it away.</li>
                                <li><strong>Practical order:</strong> Keep storage elegant, visible, and carefully structured.</li>
                              </ul>
                            </div>
                            <div className="pt-4 border-t border-brand-ink/10 font-serif">
                              <p className="text-xs italic text-brand-ink/50">"Lagom Checklist: Dedicate five minutes today to audit your favorite table. Keep precisely three items on its surface, removing any redundant clutter."</p>
                            </div>
                          </div>
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                            <img 
                              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800" 
                              alt="Lagom Balance" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <button 
                  onClick={() => setSelectedPostId(null)}
                  className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold hover:text-brand-clay transition-colors"
                >
                  <ChevronLeft size={16} />
                  Back to Journal
                </button>

                {selectedPost && (
                  <article className="space-y-12">
                    <div className="space-y-6 text-center">
                      <span className="text-xs text-brand-ink/40 uppercase tracking-widest">{selectedPost.date}</span>
                      <h2 className="text-5xl font-serif leading-tight">{selectedPost.title}</h2>
                    </div>

                    <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-xl">
                      <img src={selectedPost.image} alt={selectedPost.imageAlt || selectedPost.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    <div className="font-serif text-xl text-brand-ink/80 leading-relaxed space-y-8 max-w-3xl mx-auto">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-4xl font-serif mb-6">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-3xl font-serif mt-12 mb-6">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-2xl font-serif mt-10 mb-4 italic">{children}</h3>,
                          p: (props: any) => {
                            const { children, node } = props;
                            
                            // Check recursively for any img elements or custom img components in React children
                            const isNodeAnImage = (child: any): boolean => {
                              if (!child) return false;
                              if (child.type === 'img' || child.type === 'image' || child.props?.src) return true;
                              if (child.props?.children) {
                                return React.Children.toArray(child.props.children).some(isNodeAnImage);
                              }
                              return false;
                            };

                            const hasImage = React.Children.toArray(children).some(isNodeAnImage) || 
                              node?.children?.some((child: any) => 
                                child?.tagName === 'img' || 
                                (child?.type === 'element' && child?.tagName === 'img')
                              );
                            
                            if (hasImage) {
                              return <div className="mb-6">{children}</div>;
                            }

                            // Only apply drop cap to the very first paragraph of the post safely
                            let isFirstParagraph = false;
                            try {
                              if (node?.position?.start?.line === 1) {
                                isFirstParagraph = true;
                              } else if (selectedPost && node?.children?.[0]) {
                                const firstValue = node.children[0].value || node.children[0].children?.[0]?.value;
                                if (firstValue && selectedPost.content.trim().startsWith(firstValue)) {
                                  isFirstParagraph = true;
                                }
                              }
                            } catch (e) {
                              console.warn("Error calculating drop cap", e);
                            }

                            return (
                              <p className={`mb-6 ${isFirstParagraph ? 'first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-brand-clay' : ''}`}>
                                {children}
                              </p>
                            );
                          },
                          img: ({ src, alt }) => (
                            <div className="my-12 space-y-4">
                              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                                <img src={src} alt={alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            </div>
                          ),
                          em: ({ children }) => (
                            <em className="block text-center text-sm text-brand-ink/50 font-sans not-italic tracking-wide mb-12 -mt-8">
                              {children}
                            </em>
                          ),
                          ol: ({ children }) => <ol className="list-decimal pl-6 space-y-4 mb-8">{children}</ol>,
                          ul: ({ children }) => <ul className="list-disc pl-6 space-y-4 mb-8">{children}</ul>,
                          li: ({ children }) => <li className="pl-2">{children}</li>,
                        }}
                      >
                        {selectedPost.content}
                      </ReactMarkdown>
                    </div>

                    {/* Social Sharing Section */}
                    <div className="max-w-3xl mx-auto py-12 flex flex-col items-center gap-6 border-t border-brand-ink/5">
                      <span className="text-xs uppercase tracking-[0.2em] text-brand-ink/40 font-bold">Share this Story</span>
                      <div className="flex items-center gap-4">
                        <a 
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full border border-brand-ink/10 hover:bg-brand-ink hover:text-brand-cream hover:border-brand-ink transition-all duration-300"
                          title="Share on Facebook"
                        >
                          <Facebook size={18} />
                        </a>
                        <a 
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(selectedPost.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full border border-brand-ink/10 hover:bg-brand-ink hover:text-brand-cream hover:border-brand-ink transition-all duration-300"
                          title="Share on Twitter"
                        >
                          <Twitter size={18} />
                        </a>
                        <a 
                          href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(selectedPost.image)}&description=${encodeURIComponent(selectedPost.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full border border-brand-ink/10 hover:bg-brand-ink hover:text-brand-cream hover:border-brand-ink transition-all duration-300"
                          title="Share on Pinterest"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 22c.666-3.333 2.333-11.667 2.333-11.667s-.666-1.333-.666-3.333c0-3.133 1.815-5.473 4.078-5.473 1.922 0 2.85 1.443 2.85 3.173 0 1.933-1.231 4.825-1.867 7.505-.531 2.242 1.124 4.07 3.335 4.07 4.002 0 7.078-4.22 7.078-10.31 0-5.392-3.875-9.163-9.407-9.163-6.407 0-10.167 4.805-10.167 9.77 0 1.933.745 4.007 1.675 5.133.184.223.211.418.156.638-.17.705-.548 2.233-.623 2.54-.098.405-.325.49-.748.293-2.785-1.297-4.527-5.37-4.527-8.643 0-7.037 5.112-13.5 14.74-13.5 7.738 0 13.75 5.513 13.75 12.883 0 7.688-4.847 13.875-11.573 13.875-2.26 0-4.385-1.175-5.112-2.563 0 0-1.12 4.26-1.392 5.305-.505 1.933-1.867 4.353-2.78 5.845z"/>
                          </svg>
                        </a>
                      </div>
                    </div>

                    {/* Related Articles Section */}
                    <div className="max-w-4xl mx-auto pt-24 border-t border-brand-ink/10">
                      <h3 className="text-2xl font-serif mb-12 text-center">Related Articles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(() => {
                          const currentWords = selectedPost.title.toLowerCase().split(/\s+/);
                          const relatedPosts = JOURNAL_POSTS
                            .filter(post => post.id !== selectedPost.id)
                            .map(post => {
                              const postWords = post.title.toLowerCase().split(/\s+/);
                              const commonWords = currentWords.filter(word => 
                                postWords.includes(word) && word.length > 3
                              );
                              return { ...post, score: commonWords.length };
                            })
                            .sort((a, b) => {
                              if (b.score !== a.score) return b.score - a.score;
                              const currentIndex = JOURNAL_POSTS.findIndex(p => p.id === selectedPost.id);
                              const aIndex = JOURNAL_POSTS.findIndex(p => p.id === a.id);
                              const bIndex = JOURNAL_POSTS.findIndex(p => p.id === b.id);
                              return Math.abs(aIndex - currentIndex) - Math.abs(bIndex - currentIndex);
                            })
                            .slice(0, 3);

                          return relatedPosts.map((post) => (
                            <article 
                              key={post.id} 
                              className="group cursor-pointer space-y-4"
                              onClick={() => {
                                setSelectedPostId(post.id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              <div className="aspect-[4/3] rounded-xl overflow-hidden">
                                <img 
                                  src={post.image} 
                                  alt={post.imageAlt || post.title} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  referrerPolicy="no-referrer" 
                                />
                              </div>
                              <div className="space-y-2">
                                <span className="text-[10px] text-brand-ink/40 uppercase tracking-widest">{post.date}</span>
                                <h4 className="text-lg font-serif group-hover:text-brand-clay transition-colors line-clamp-2 leading-snug">
                                  {post.title}
                                </h4>
                              </div>
                            </article>
                          ));
                        })()}
                      </div>
                    </div>
                  </article>
                )}
              </motion.div>
            )}
          </section>
        )}

        {currentView === 'checkout' && (
          <div className="flex-1">
            {isOrderComplete ? (
              <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 space-y-8">
                <div className="w-24 h-24 bg-brand-sage/10 text-brand-sage rounded-full flex items-center justify-center animate-bounce">
                  <ShieldCheck size={48} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-serif">Thank you for your order</h2>
                  <p className="text-brand-ink/60 max-w-md mx-auto">
                    Your curated essentials are being prepared with care. We've sent a confirmation email to <span className="font-bold text-brand-ink">{lastOrderDetails?.email}</span>.
                  </p>
                  {lastOrderDetails && (
                    <div className="bg-brand-sand/30 p-6 rounded-2xl inline-block mt-8 text-left space-y-4">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 mb-1">Order Type</p>
                          <p className="font-serif text-lg">
                            {lastOrderDetails.paymentMethod === 'cod' 
                              ? 'Cash on Delivery' 
                              : lastOrderDetails.paymentMethod === 'upi' 
                                ? `UPI (${lastOrderDetails.upiApp === 'gpay' ? 'Google Pay' : lastOrderDetails.upiApp === 'paytm' ? 'Paytm' : 'PhonePe'})` 
                                : 'Online Transaction'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 mb-1">Contact</p>
                          <p className="font-serif text-lg">{lastOrderDetails.phone}</p>
                        </div>
                      </div>
                      <p className="text-xs text-brand-ink/60 pt-2 border-t border-brand-ink/5">
                        {lastOrderDetails.paymentMethod === 'cod' 
                          ? 'Please have the exact amount ready for the delivery partner.' 
                          : lastOrderDetails.paymentMethod === 'upi'
                          ? `Please check your ${lastOrderDetails.upiApp === 'gpay' ? 'Google Pay' : lastOrderDetails.upiApp === 'paytm' ? 'Paytm' : 'PhonePe'} app to complete the payment.`
                          : 'Your secure payment has been processed successfully.'}
                      </p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => navigateTo('home')}
                  className="bg-brand-ink text-brand-cream px-12 py-4 rounded-full font-bold hover:bg-brand-sage transition-all"
                >
                  Return to Shop
                </button>
              </div>
            ) : (
              <Checkout 
                items={cartItems} 
                onBack={() => navigateTo('home')}
                onComplete={handleCheckoutComplete}
              />
            )}
          </div>
        )}

        {currentView === 'about' && (
          <section className="max-w-7xl mx-auto px-6 py-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-2 gap-24 items-center"
            >
              <div className="space-y-12">
                <div className="space-y-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-brand-clay font-bold">About Aura</span>
                  <h2 className="text-6xl font-serif leading-tight">Curating <br /> <span className="italic">Tranquility</span></h2>
                </div>
                <div className="space-y-6 text-lg text-brand-ink/70 leading-relaxed">
                  <p>
                    Founded in 2024, Aura was born out of a desire to create a sanctuary in the home. We believe that the objects we interact with daily should be as beautiful as they are functional.
                  </p>
                  <p>
                    Our collection is a carefully selected mix of artisanal goods, natural materials, and timeless designs. Every piece in our shop is chosen for its ability to bring a sense of calm and presence to your space.
                  </p>
                  <p>
                    We work with small-scale makers and sustainable partners who share our commitment to quality and ethical production.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-brand-ink/10">
                  <div>
                    <h4 className="text-2xl font-serif mb-2">Artisanal</h4>
                    <p className="text-sm text-brand-ink/50">Handcrafted by master makers around the globe.</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-serif mb-2">Sustainable</h4>
                    <p className="text-sm text-brand-ink/50">Mindfully sourced materials and ethical production.</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="mb-12">
                  <span className="text-xs uppercase tracking-[0.3em] text-brand-clay font-bold">The Space</span>
                  <h3 className="text-4xl font-serif mt-2">Our Studio</h3>
                  <p className="mt-4 text-brand-ink/60 max-w-sm leading-relaxed">
                    Located in the heart of the city, our studio is a sanctuary where we curate, create, and find inspiration. It's a space designed to breathe—where natural light meets raw textures, and where every object tells a story of craftsmanship.
                  </p>
                </div>
                <div className="relative">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200" 
                      alt="Our Studio Main" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Secondary overlapping image */}
                  <div className="absolute -bottom-16 -right-12 w-48 h-64 rounded-2xl overflow-hidden shadow-xl hidden xl:block border-8 border-brand-cream">
                    <img 
                      src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600" 
                      alt="Studio Detail" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-brand-sage rounded-3xl -z-10 hidden lg:block" />
              </div>
            </motion.div>
          </section>
        )}

        {currentView === 'contact' && (
          <section className="max-w-7xl mx-auto px-6 py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-16 items-start"
            >
              {/* Left Column - Contact Details & Picture */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-brand-clay font-bold">Get In Touch</span>
                  <h2 className="text-5xl font-serif">Connect With Us</h2>
                  <p className="text-brand-ink/65 leading-relaxed max-w-md">
                    Have questions about our artisanal pieces, sustainable sourcing, or custom orders? Reach out—our team is here to help guide your selections.
                  </p>
                </div>

                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl relative">
                  <img 
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200" 
                    alt="Artisanal table workspace" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-ink/5" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-brand-ink/10">
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg">Our Showroom</h4>
                    <p className="text-sm text-brand-ink/60 leading-relaxed">
                      782 Sincerity Avenue<br />
                      Suite 120, Design District<br />
                      San Francisco, CA 94103
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg">Showroom Hours</h4>
                    <p className="text-sm text-brand-ink/60 leading-relaxed">
                      Monday – Friday: 10am – 6pm<br />
                      Saturday: 11am – 5pm<br />
                      Sunday: Closed For Rest
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg">Direct Contact</h4>
                    <p className="text-sm text-brand-ink/60 leading-relaxed">
                      Email: support@aurastudio.com<br />
                      Phone: +1 (555) 304-4829
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg">Press & Design</h4>
                    <p className="text-sm text-brand-ink/60 leading-relaxed">
                      partnerships@aurastudio.com<br />
                      trade@aurastudio.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Premium form */}
              <div className="bg-brand-sand/30 rounded-3xl p-8 lg:p-12 space-y-8 border border-brand-ink/5 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif">Send A Message</h3>
                  <p className="text-sm text-brand-ink/50">We typically reply within 24 business hours.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); alert("Thank you. Your message has been sent successfully. We will connect with you soon."); navigateTo('home'); }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">Full Name</label>
                    <input required type="text" className="w-full bg-brand-cream border-b border-brand-ink/20 py-3 px-2 focus:border-brand-clay outline-none transition-colors rounded-t-lg" placeholder="Elena Rostova" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">Email Address</label>
                    <input required type="email" className="w-full bg-brand-cream border-b border-brand-ink/20 py-3 px-2 focus:border-brand-clay outline-none transition-colors rounded-t-lg" placeholder="elena@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">Subject</label>
                    <input required type="text" className="w-full bg-brand-cream border-b border-brand-ink/20 py-3 px-2 focus:border-brand-clay outline-none transition-colors rounded-t-lg" placeholder="Inquiry about Custom Stoneware Pieces" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">How Can We Help?</label>
                    <textarea required rows={4} className="w-full bg-brand-cream border border-brand-ink/10 p-3 focus:border-brand-clay outline-none transition-colors rounded-xl resize-none text-sm" placeholder="Tell us more about what you have in mind..."></textarea>
                  </div>

                  <button type="submit" className="w-full bg-brand-ink text-brand-cream py-4 rounded-full font-bold hover:bg-brand-sage transition-all duration-300 shadow-md">
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </section>
        )}

        {currentView === 'faq' && (
          <section className="max-w-7xl mx-auto px-6 py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-12 gap-16 items-start"
            >
              {/* Left Column with Sticky Image */}
              <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                <span className="text-xs uppercase tracking-[0.3em] text-brand-clay font-bold">Support Center</span>
                <h2 className="text-5xl font-serif">Common Queries</h2>
                <p className="text-brand-ink/65 leading-relaxed">
                  Find clarity and peace of mind below. We've gathered details on our materials, delivery commitments, payment terms, and sustainable ethos.
                </p>

                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative hidden lg:block">
                  <img 
                    src="https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=1200" 
                    alt="Aura beautiful hand-thrown ceramic cup" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-ink/5" />
                </div>
              </div>

              {/* Right Column Accordion */}
              <div className="lg:col-span-7 space-y-4">
                {[
                  {
                    q: "What makes Aura materials sustainable and mindful?",
                    a: "Every piece in our shop is sourced from FSC-certified sustainable timber, 100% GOTS-certified organic linen, and lead-free natural clay glazes. We establish close fair-trade agreements with family-owned artisan workshops in Sweden, France, Portugal, and Japan, ensuring complete ethical governance over wage and workflow conditions."
                  },
                  {
                    q: "How does Cash on Delivery (COD) payment work?",
                    a: "We support nationwide Cash on Delivery across our logistics network. There are no additional fees for COD orders. Simply inspect the packaging at your doorstep and pay our carrier partner in cash or local payment apps upon safe handover."
                  },
                  {
                    q: "How do I pay with UPI apps (GPay, Paytm, PhonePe)?",
                    a: "At checkout, simply choose 'UPI Payment' and select your preferred UPI provider. Enter your UPI ID (handle), and after submitting, check your chosen smartphone payment application for an instant approval notification to securely authorize the transaction."
                  },
                  {
                    q: "What is your return process if a piece does not resonate with my space?",
                    a: "An object should bring you complete serenity. If a piece does not resonate with your space, we offer a generous 30-day return policy. Items must be unmodified and returned inside original shipping materials. Reach out to trade@aurastudio.com with your order details to generate a prepaid label instantly."
                  },
                  {
                    q: "Do you ship worldwide?",
                    a: "Yes. To share tranquility globally, we provide secure carbon-neutral international air shipping to over 80 countries. Delivery times vary by location, typically taking 7-14 business days. International delivery remains fully tracked and insured."
                  }
                ].map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div 
                      key={index} 
                      className="border border-brand-ink/10 rounded-2xl overflow-hidden bg-brand-sand/10 hover:bg-brand-sand/20 transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full text-left py-6 px-8 flex justify-between items-center gap-4"
                      >
                        <span className="font-serif text-lg text-brand-ink">{faq.q}</span>
                        <span className="text-xl text-brand-clay font-bold">{isOpen ? "−" : "+"}</span>
                      </button>
                      <motion.div
                        initial={false}
                        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-6 text-sm text-brand-ink/65 leading-relaxed border-t border-brand-ink/5 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </section>
        )}

        {currentView === 'shipping' && (
          <section className="max-w-7xl mx-auto px-6 py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-brand-clay font-bold">Delivery Ethos</span>
                  <h2 className="text-5xl font-serif">Mindful Sourcing & Sustainable Shipping</h2>
                  <p className="text-brand-ink/75 text-lg leading-relaxed">
                    We approach delivery with the same level of care and presence that goes into selecting our pieces. Every order is prepared by hand in our studio and shipped using fully carbon-neutral carriage procedures.
                  </p>
                </div>

                <div className="space-y-6 pt-4 border-t border-brand-ink/10">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-brand-clay/10 text-brand-clay rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg">Carbon-Neutral Transit</h4>
                      <p className="text-sm text-brand-ink/60 leading-relaxed mt-1">
                        We balance all delivery transport footprint carbon-equivalents with certified reforestation and native wetland carbon credit offsets globally.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-brand-clay/10 text-brand-clay rounded-full flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg">Zero-Plastic Packing</h4>
                      <p className="text-sm text-brand-ink/60 leading-relaxed mt-1">
                        We mindfully encase and protect every ceramic, linen, and furniture structure using recycled honeycomb cardboard wrap, biodegradable starch pods, and organic cotton sacs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-brand-clay/10 text-brand-clay rounded-full flex items-center justify-center flex-shrink-0">
                      <ArrowRight size={20} />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg">Straightforward Return Portal</h4>
                      <p className="text-sm text-brand-ink/60 leading-relaxed mt-1">
                        Enjoy complete flexibility. If any piece fails to evoke harmony in your room, we gladly process complimentary standard returns within 30 days of standard receipt.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=1200" 
                  alt="Folded waffle linens and organic cotton products" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-ink/5" />
              </div>
            </motion.div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-ink text-brand-cream pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Buying Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-24 mb-24 border-b border-brand-cream/10">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-cream/5 flex items-center justify-center text-brand-clay">
                <Truck size={24} />
              </div>
              <h4 className="text-xl font-serif">Mindful Shipping</h4>
              <p className="text-sm text-brand-cream/60 leading-relaxed">
                We offer complimentary carbon-neutral shipping on all orders. Each package is mindfully wrapped in sustainable materials.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-cream/5 flex items-center justify-center text-brand-clay">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-xl font-serif">Flexible Payment</h4>
              <p className="text-sm text-brand-cream/60 leading-relaxed">
                Choose between Cash on Delivery, UPI, or secure online transactions. We provide multiple ways to complete your purchase with ease.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-cream/5 flex items-center justify-center text-brand-clay">
                <ArrowRight size={24} />
              </div>
              <h4 className="text-xl font-serif">Thoughtful Returns</h4>
              <p className="text-sm text-brand-cream/60 leading-relaxed">
                If a piece doesn't resonate with your space, we offer a 30-day return window for all unused items in original packaging.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif tracking-tighter">AURA</h2>
              <p className="text-brand-cream/60 text-sm leading-relaxed max-w-xs">
                Creating space for peace and presence through thoughtfully curated objects and lifestyle essentials.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-brand-clay transition-colors"><Instagram size={20} /></a>
                <a href="#" className="hover:text-brand-clay transition-colors"><Twitter size={20} /></a>
                <a href="#" className="hover:text-brand-clay transition-colors"><Facebook size={20} /></a>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm uppercase tracking-widest mb-8 font-bold text-brand-cream/40">Shop</h5>
              <ul className="space-y-4 text-sm">
                <li><button onClick={scrollToProducts} className="hover:text-brand-clay transition-colors">All Products</button></li>
                <li><button onClick={scrollToProducts} className="hover:text-brand-clay transition-colors">New Arrivals</button></li>
                <li><button onClick={scrollToProducts} className="hover:text-brand-clay transition-colors">Best Sellers</button></li>
                <li><button className="hover:text-brand-clay transition-colors">Gift Cards</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm uppercase tracking-widest mb-8 font-bold text-brand-cream/40">Support</h5>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => navigateTo('about')} className="hover:text-brand-clay transition-colors">About Us</button></li>
                <li><button onClick={() => navigateTo('shipping')} className="hover:text-brand-clay transition-colors">Shipping & Returns</button></li>
                <li><button onClick={() => navigateTo('contact')} className="hover:text-brand-clay transition-colors">Contact Us</button></li>
                <li><button onClick={() => navigateTo('faq')} className="hover:text-brand-clay transition-colors">FAQ</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm uppercase tracking-widest mb-8 font-bold text-brand-cream/40">Newsletter</h5>
              <p className="text-sm text-brand-cream/60 mb-6">Join our community for updates and inspiration.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-transparent border-b border-brand-cream/20 py-2 flex-1 text-sm focus:outline-none focus:border-brand-clay transition-colors"
                />
                <button className="text-sm uppercase tracking-widest font-bold hover:text-brand-clay transition-colors">Join</button>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-brand-cream/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-brand-cream/40">
            <p>© 2026 Aura Aesthetic Shop. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-brand-cream transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-clay transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-brand-cream max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2 relative max-h-[90vh] md:max-h-none overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute right-6 top-6 p-2 bg-brand-cream/80 backdrop-blur-md hover:bg-brand-ink hover:text-brand-cream rounded-full transition-colors z-10"
                >
                  <X size={20} />
                </button>

                {/* Left Side: Image */}
                <div className="relative aspect-[4/5] md:aspect-auto md:h-full bg-brand-sand min-h-[300px] md:min-h-[500px]">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-6 left-6 bg-brand-ink text-brand-cream text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">
                    {selectedProduct.category}
                  </span>
                </div>

                {/* Right Side: Detailed Narrative Specs */}
                <div className="p-8 md:p-12 flex flex-col justify-between space-y-8 bg-brand-cream">
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-brand-clay font-bold block mb-1">
                        Aura Curated Object
                      </span>
                      <h3 className="text-4xl font-serif text-brand-ink">{selectedProduct.name}</h3>
                      <p className="text-2xl font-serif text-brand-clay mt-2">${selectedProduct.price}</p>
                    </div>

                    <p className="text-brand-ink/75 text-sm leading-relaxed">
                      {selectedProduct.description} Aura is deeply rooted in our commitment to sustainable sourcing. Every object and material is hand-selected to support quiet spaces, mindful rituals, and simple elegance.
                    </p>

                    {/* Highly detailed specification table */}
                    <div className="space-y-3 pt-6 border-t border-brand-ink/10 text-xs text-brand-ink/70">
                      <div className="grid grid-cols-3 py-1 border-b border-brand-ink/5">
                        <span className="uppercase tracking-wider font-bold text-brand-ink/40">Composition</span>
                        <span className="col-span-2 font-medium">{getProductDetails(selectedProduct).materials}</span>
                      </div>
                      <div className="grid grid-cols-3 py-1 border-b border-brand-ink/5">
                        <span className="uppercase tracking-wider font-bold text-brand-ink/40">Dimensions</span>
                        <span className="col-span-2 font-medium">{getProductDetails(selectedProduct).dimensions}</span>
                      </div>
                      <div className="grid grid-cols-3 py-1 border-b border-brand-ink/5">
                        <span className="uppercase tracking-wider font-bold text-brand-ink/40">Origin</span>
                        <span className="col-span-2 font-medium">{getProductDetails(selectedProduct).origin}</span>
                      </div>
                      <div className="grid grid-cols-3 py-1">
                        <span className="uppercase tracking-wider font-bold text-brand-ink/40">Care Details</span>
                        <span className="col-span-2 font-medium">{getProductDetails(selectedProduct).care}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-brand-ink/10">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full bg-brand-ink text-brand-cream py-4 rounded-full font-bold hover:bg-brand-sage transition-all duration-300 shadow-lg hover:shadow-brand-sage/20 flex items-center justify-center gap-2"
                    >
                      Add This Piece to Bag — ${selectedProduct.price}
                    </button>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 text-center">
                      Complimentary tracked carbon-neutral shipping included
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          navigateTo('checkout');
        }}
      />
    </div>
  );
}
