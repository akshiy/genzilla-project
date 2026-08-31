import { useEffect, useMemo, useState } from 'react';
import {
  Activity, BarChart3, Boxes, Check, ChevronRight, ClipboardList, Copy, Eye, FileText,
  Image as ImageIcon, LayoutDashboard, LogOut, Menu, PackageCheck, Pencil, Plus, RefreshCw,
  Search, Settings, ShoppingBag, Tag, Trash2, Truck, Users, X, Zap, Megaphone, Save,
  ExternalLink, Layers3, ShieldCheck, Sparkles, UploadCloud, CircleDollarSign, PackageOpen
} from 'lucide-react';
import { supabase } from './lib/supabase';

type Product = {
  id: string; name: string; tagline: string | null; description: string | null; price: number;
  sale_price: number | null; image_url: string | null; image_urls: string[] | null; category: string;
  badge: string | null; featured: boolean; stock: number; sku: string | null; tags: string[] | null;
  published: boolean; created_at: string;
};

type Order = {
  id: string; customer_name: string; email: string; phone: string | null; address: string;
  city: string | null; pincode: string | null; items: { id: string; name: string; price: number; qty: number }[];
  total: number; status: string; created_at: string;
};

type Tab = 'dashboard' | 'products' | 'orders' | 'inventory' | 'customers' | 'analytics' | 'content' | 'marketing' | 'settings';

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'content', label: 'Website Editor', icon: Layers3 },
  { id: 'marketing', label: 'Marketing', icon: Tag },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const orderStatuses = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'];
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
const dateTime = (value: string) => new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export function AdminApp() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="center"><div className="loader-mark">G</div>Loading GENZILLA Admin…</div>;
  if (!session) return <Login onError={setError} />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand"><span className="brand-mark">G</span><div><strong>GENZILLA</strong><small>CONTROL CENTER</small></div></div>
        <div className="side-caption">STORE OS</div>
        <nav>{tabs.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? 'nav-item active' : 'nav-item'} onClick={() => { setTab(id); setMobileOpen(false); }}><Icon size={18}/>{label}</button>)}</nav>
        <div className="sidebar-bottom">
          <a className="live-link" href="https://genzilla-project.pages.dev/" target="_blank" rel="noreferrer"><ExternalLink size={16}/> View live store</a>
          <button className="nav-item" onClick={() => supabase.auth.signOut()}><LogOut size={18}/> Logout</button>
        </div>
      </aside>
      {mobileOpen && <button className="backdrop" onClick={() => setMobileOpen(false)} aria-label="close"/>}
      <main className="content">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={20}/></button>
          <div><p className="eyebrow">GENZILLA / {tab.toUpperCase()}</p><h1>{tabs.find(t => t.id === tab)?.label}</h1></div>
          <div className="top-actions"><span className="live-pill"><span className="dot"/> Live</span><button className="avatar" title={session.user.email}>{(session.user.email?.[0] ?? 'A').toUpperCase()}</button></div>
        </header>
        {error && <div className="error-banner">{error}<button onClick={() => setError('')}><X size={15}/></button></div>}
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'products' && <Products />}
        {tab === 'orders' && <Orders />}
        {tab === 'inventory' && <Inventory />}
        {tab === 'customers' && <Customers />}
        {tab === 'analytics' && <Analytics />}
        {tab === 'content' && <WebsiteEditor />}
        {tab === 'marketing' && <Marketing />}
        {tab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  );
}

function Login({ onError }: { onError: (x: string) => void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [busy, setBusy] = useState(false); const [mode, setMode] = useState<'login'|'signup'>('login');
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); onError('');
    const result = mode === 'login' ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (result.error) onError(result.error.message);
    else if (mode === 'signup') onError('Account created. If email confirmation is enabled, confirm it and sign in. The account must also be listed in admin_users.');
  }
  return <div className="login-page"><div className="login-glow one"/><div className="login-glow two"/><div className="login-card"><div className="brand login-brand"><span className="brand-mark">G</span><div><strong>GENZILLA</strong><small>ADMIN OS</small></div></div><div className="login-kicker"><ShieldCheck size={14}/> PRIVATE CONTROL CENTER</div><h1>{mode === 'login' ? 'Run the store.' : 'Create an admin.'}</h1><p className="muted">Products, customers, orders, content and growth — controlled from one place.</p><form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@yourstore.com"/></label><label>Password<input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"/></label><button className="primary full" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button></form><button className="link-btn" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Create the first account' : 'Already have an account? Sign in'}</button></div></div>;
}

function Stat({ label, value, icon, sub }: { label: string; value: string; icon: React.ReactNode; sub?: string }) { return <div className="stat"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong>{sub && <small>{sub}</small>}</div></div>; }

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]); const [orders, setOrders] = useState<Order[]>([]); const [loading, setLoading] = useState(true);
  async function load() { setLoading(true); const [p, o] = await Promise.all([supabase.from('products').select('*').order('created_at', { ascending: false }), supabase.from('orders').select('*').order('created_at', { ascending: false })]); if (!p.error) setProducts((p.data ?? []) as Product[]); if (!o.error) setOrders((o.data ?? []) as Order[]); setLoading(false); }
  useEffect(() => { load(); }, []);
  const revenue = orders.reduce((s, o) => s + Number(o.total || 0), 0); const pending = orders.filter(o => ['pending','confirmed'].includes(o.status)).length; const low = products.filter(p => p.stock <= 5).length; const published = products.filter(p => p.published).length;
  return <>
    <div className="hero-panel"><div><p className="eyebrow orange">CONTROL EVERYTHING</p><h2>Store command center.</h2><p>Manage products, content, customers and orders without touching production code.</p></div><button className="secondary" onClick={load}><RefreshCw size={16}/> Refresh</button></div>
    <div className="stats-grid"><Stat label="Revenue" value={money(revenue)} icon={<CircleDollarSign/>} sub="All recorded orders"/><Stat label="Orders" value={String(orders.length)} icon={<ClipboardList/>} sub={`${pending} need attention`}/><Stat label="Products" value={String(published)} icon={<PackageOpen/>} sub={`${products.length - published} drafts`}/><Stat label="Low stock" value={String(low)} icon={<Boxes/>} sub="5 or fewer units"/></div>
    <div className="grid-2"><div className="panel"><div className="panel-head"><h3>Recent orders</h3><span>{loading ? 'Loading…' : `${orders.length} total`}</span></div><OrderTable orders={orders.slice(0, 8)} onChange={load}/></div><QuickActions /></div>
  </>;
}

function QuickActions() { const items = [{ icon: Plus, title: 'Add product', note: 'Launch a new SKU' }, { icon: FileText, title: 'Edit homepage', note: 'Hero, about, reviews' }, { icon: UploadCloud, title: 'Media', note: 'Manage product visuals' }, { icon: Megaphone, title: 'Campaigns', note: 'Coupons and offers' }]; return <div className="panel"><div className="panel-head"><h3>Quick actions</h3><Zap size={16}/></div><div className="quick-grid">{items.map(({icon:Icon,title,note})=><div key={title} className="quick-card"><Icon size={19}/><div><strong>{title}</strong><span>{note}</span></div><ChevronRight size={15}/></div>)}</div></div>; }

function Products() {
  const [rows, setRows] = useState<Product[]>([]); const [q, setQ] = useState(''); const [open, setOpen] = useState(false); const [editing, setEditing] = useState<Product | null>(null); const [loading, setLoading] = useState(true);
  async function load() { setLoading(true); const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false }); if (error) alert(error.message); setRows((data ?? []) as Product[]); setLoading(false); }
  useEffect(() => { load(); }, []);
  const filtered = rows.filter(p => `${p.name} ${p.category} ${p.badge ?? ''} ${p.sku ?? ''} ${(p.tags ?? []).join(' ')}`.toLowerCase().includes(q.toLowerCase()));
  async function deleteProduct(p: Product) { if (!confirm(`Delete ${p.name}?`)) return; const { error } = await supabase.from('products').delete().eq('id', p.id); if (error) alert(error.message); else load(); }
  return <><div className="toolbar"><div><p className="muted">Full catalog control</p><h2>{rows.length} products</h2></div><div className="toolbar-actions"><label className="search"><Search size={16}/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, SKU, category…"/></label><button className="primary" onClick={() => { setEditing(null); setOpen(true); }}><Plus size={17}/> Add product</button></div></div><div className="panel table-wrap"><table><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th>Featured</th><th></th></tr></thead><tbody>{loading ? <tr><td colSpan={6}>Loading…</td></tr> : filtered.map(p => <tr key={p.id}><td><div className="product-cell">{p.image_url ? <img src={p.image_url} alt=""/> : <div className="thumb-fallback">G</div>}<div><strong>{p.name}</strong><small>{p.sku ?? 'No SKU'} · {p.category}</small></div></div></td><td><strong>{money(Number(p.sale_price ?? p.price))}</strong>{p.sale_price ? <small className="strike">{money(Number(p.price))}</small> : null}</td><td><span className={p.stock <= 5 ? 'pill danger' : 'pill'}>{p.stock}</span></td><td><span className={p.published ? 'status delivered' : 'status pending'}>{p.published ? 'Published' : 'Draft'}</span></td><td>{p.featured ? 'Yes' : '—'}</td><td className="actions"><button className="icon-btn" title="Preview" onClick={() => { setEditing(p); setOpen(true); }}><Eye size={16}/></button><button className="icon-btn" title="Edit" onClick={() => { setEditing(p); setOpen(true); }}><Pencil size={16}/></button><button className="icon-btn danger-icon" title="Delete" onClick={() => deleteProduct(p)}><Trash2 size={16}/></button></td></tr>)}</tbody></table></div>{open && <ProductModal product={editing} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); load(); }}/>}</>;
}

function ProductModal({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void }) {
  const initial = product ? {
    name: product.name, tagline: product.tagline ?? '', description: product.description ?? '', price: String(product.price), sale_price: product.sale_price == null ? '' : String(product.sale_price),
    image_url: product.image_url ?? '', image_urls: (product.image_urls ?? []).join('\n'), category: product.category, badge: product.badge ?? '', sku: product.sku ?? '', tags: (product.tags ?? []).join(', '), stock: String(product.stock), featured: product.featured, published: product.published
  } : { name:'',tagline:'',description:'',price:'0',sale_price:'',image_url:'',image_urls:'',category:'lighters',badge:'',sku:'',tags:'',stock:'0',featured:false,published:false };
  const [form, setForm] = useState(initial); const [busy,setBusy]=useState(false); const [preview,setPreview]=useState(false); const [uploading,setUploading]=useState<'main'|'gallery'|null>(null); const [uploadError,setUploadError]=useState('');
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));
  async function uploadFiles(files: FileList | null, mode: 'main'|'gallery') {
    if (!files?.length) return;
    setUploading(mode); setUploadError('');
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image.`);
        if (file.size > 8 * 1024 * 1024) throw new Error(`${file.name} is larger than 8 MB.`);
        const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/-+/g, '-');
        const path = `products/${crypto.randomUUID()}-${safe}`;
        const { error } = await supabase.storage.from('product-images').upload(path, file, { cacheControl: '3600', upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      setForm(f => ({ ...f, image_url: mode === 'main' ? (urls[0] ?? f.image_url) : f.image_url, image_urls: mode === 'gallery' ? [...f.image_urls.split('\n').map(x=>x.trim()).filter(Boolean), ...urls].join('\n') : f.image_urls }));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Image upload failed.');
    } finally { setUploading(null); }
  }
  async function save() {
    setBusy(true);
    const payload = { name: form.name, tagline: form.tagline || null, description: form.description || null, price: Number(form.price || 0), sale_price: form.sale_price === '' ? null : Number(form.sale_price), image_url: form.image_url || null, image_urls: form.image_urls.split('\n').map(x => x.trim()).filter(Boolean), category: form.category || 'lighters', badge: form.badge || null, sku: form.sku || null, tags: form.tags.split(',').map(x => x.trim()).filter(Boolean), stock: Number(form.stock || 0), featured: form.featured, published: form.published };
    const result = product ? await supabase.from('products').update(payload).eq('id', product.id) : await supabase.from('products').insert(payload);
    setBusy(false); if (result.error) alert(result.error.message); else onSaved();
  }
  return <div className="modal-backdrop"><div className="modal modal-xl"><div className="modal-head"><div><p className="eyebrow">CATALOG EDITOR</p><h3>{product ? 'Edit product' : 'Add product'}</h3></div><button className="icon-btn" onClick={onClose}><X/></button></div>
    <div className="form-grid product-form"><div className="field-section"><h4>Core details</h4><div className="fields-2"><Field label="Product name"><input value={form.name} onChange={e=>set('name',e.target.value)}/></Field><Field label="SKU"><input value={form.sku} onChange={e=>set('sku',e.target.value)}/></Field><Field label="Tagline"><input value={form.tagline} onChange={e=>set('tagline',e.target.value)}/></Field><Field label="Category"><input value={form.category} onChange={e=>set('category',e.target.value)}/></Field><Field label="Badge"><input value={form.badge} onChange={e=>set('badge',e.target.value)} placeholder="NEW / BESTSELLER / SALE"/></Field><Field label="Tags"><input value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="torch, chrome, limited"/></Field></div><Field label="Description"><textarea rows={6} value={form.description} onChange={e=>set('description',e.target.value)}/></Field></div>
    <div className="field-section"><h4>Pricing & stock</h4><div className="fields-3"><Field label="Price"><input type="number" value={form.price} onChange={e=>set('price',e.target.value)}/></Field><Field label="Sale price"><input type="number" value={form.sale_price} onChange={e=>set('sale_price',e.target.value)}/></Field><Field label="Stock"><input type="number" value={form.stock} onChange={e=>set('stock',e.target.value)}/></Field></div><h4 className="mt">Images</h4><div className="upload-grid"><div className="upload-card"><div className="upload-card-head"><div><strong>Main image</strong><span>JPG, PNG, WEBP · up to 8 MB</span></div><label className="upload-btn"><UploadCloud size={16}/>{uploading==='main'?'Uploading…':'Choose from disk'}<input type="file" accept="image/*" hidden disabled={!!uploading} onChange={e=>uploadFiles(e.target.files,'main')}/></label></div>{form.image_url ? <div className="image-preview"><img src={form.image_url} alt="Main product"/><button className="icon-btn danger-icon" type="button" title="Remove" onClick={()=>set('image_url','')}><Trash2 size={15}/></button></div> : <div className="upload-empty"><ImageIcon size={22}/><span>No main image selected</span></div>}<Field label="Or paste image URL"><input value={form.image_url} onChange={e=>set('image_url',e.target.value)} placeholder="https://…"/></Field></div><div className="upload-card"><div className="upload-card-head"><div><strong>Gallery images</strong><span>Upload multiple images at once</span></div><label className="upload-btn"><UploadCloud size={16}/>{uploading==='gallery'?'Uploading…':'Choose images'}<input type="file" accept="image/*" multiple hidden disabled={!!uploading} onChange={e=>uploadFiles(e.target.files,'gallery')}/></label></div>{form.image_urls ? <div className="gallery-previews">{form.image_urls.split('\n').map((url,i)=><div className="image-preview" key={`${url}-${i}`}><img src={url} alt={`Gallery ${i+1}`}/><button className="icon-btn danger-icon" type="button" title="Remove" onClick={()=>set('image_urls',form.image_urls.split('\n').filter((_,j)=>j!==i).join('\n'))}><Trash2 size={15}/></button></div>)}</div> : <div className="upload-empty"><ImageIcon size={22}/><span>No gallery images selected</span></div>}<small className="muted">You can still paste URLs below, one per line.</small><textarea rows={4} value={form.image_urls} onChange={e=>set('image_urls',e.target.value)} placeholder="https://…"/></div></div>{uploadError && <div className="error-banner compact">{uploadError}<button type="button" onClick={()=>setUploadError('')}><X size={15}/></button></div>}<div className="toggle-row"><label className="toggle"><input type="checkbox" checked={form.featured} onChange={e=>set('featured',e.target.checked)}/><span>Featured product</span></label><label className="toggle"><input type="checkbox" checked={form.published} onChange={e=>set('published',e.target.checked)}/><span>Published / visible on store</span></label></div></div></div>
    <div className="modal-foot"><button className="secondary" onClick={()=>setPreview(true)}><Eye size={16}/> Preview before saving</button><div className="foot-actions"><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={busy} onClick={save}><Save size={16}/>{busy ? 'Saving…' : product ? 'Save changes' : 'Create product'}</button></div></div></div>{preview && <ProductPreview form={form} onClose={()=>setPreview(false)}/>}</div>;
}

function ProductPreview({ form, onClose }: { form: any; onClose:()=>void }) { const image = form.image_url || (form.image_urls?.split('\n')[0] ?? ''); const price = Number(form.sale_price || form.price || 0); return <div className="preview-sheet"><div className="preview-card"><div className="preview-head"><span>STORE PREVIEW</span><button className="icon-btn" onClick={onClose}><X/></button></div><div className="preview-grid"><div className="preview-media">{image ? <img src={image} alt=""/> : <div className="preview-empty">No image</div>}</div><div><div className="preview-kicker">{form.category} {form.badge && `· ${form.badge}`}</div><h2>{form.name || 'Untitled product'}</h2><p>{form.tagline}</p><div className="preview-price">{money(price)}</div><p className="preview-copy">{form.description || 'Add a full product description in the editor.'}</p><div className="preview-meta"><span>SKU {form.sku || '—'}</span><span>{form.stock} in stock</span></div></div></div></div></div> }

function OrderTable({ orders, onChange }: { orders: Order[]; onChange: ()=>void }) { return <div className="table-wrap"><table><thead><tr><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td><strong>{o.customer_name}</strong><small>{o.email}</small></td><td>{money(Number(o.total))}</td><td><select className={`status ${o.status}`} value={o.status} onChange={async e=>{const {error}=await supabase.from('orders').update({status:e.target.value}).eq('id',o.id);if(error)alert(error.message);else onChange();}}>{orderStatuses.map(s=><option key={s}>{s}</option>)}</select></td><td>{dateTime(o.created_at)}</td></tr>)}</tbody></table></div> }

function Orders() { const [orders,setOrders]=useState<Order[]>([]); const [q,setQ]=useState(''); const [status,setStatus]=useState('all'); useEffect(()=>{supabase.from('orders').select('*').order('created_at',{ascending:false}).then(({data,error})=>{if(error)alert(error.message);setOrders((data??[]) as Order[])});},[]); const rows=orders.filter(o=>`${o.customer_name} ${o.email} ${o.phone??''} ${o.id}`.toLowerCase().includes(q.toLowerCase())&&(status==='all'||o.status===status)); return <><div className="toolbar"><div><p className="muted">Every customer purchase in one place</p><h2>{orders.length} orders</h2></div><div className="toolbar-actions"><label className="search"><Search size={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search order or customer…"/></label><select className="filter" value={status} onChange={e=>setStatus(e.target.value)}><option value="all">All statuses</option>{orderStatuses.map(s=><option key={s}>{s}</option>)}</select></div></div><div className="panel"><OrderTable orders={rows} onChange={()=>location.reload()}/></div></> }

function Inventory() { const [rows,setRows]=useState<Product[]>([]); const [busy,setBusy]=useState<string|null>(null); async function load(){const {data}=await supabase.from('products').select('*').order('stock',{ascending:true});setRows((data??[]) as Product[])} useEffect(()=>{load()},[]); async function adjust(p:Product,delta:number){setBusy(p.id);const {error}=await supabase.from('products').update({stock:Math.max(0,p.stock+delta)}).eq('id',p.id);setBusy(null);if(error)alert(error.message);else load()} return <><div className="toolbar"><div><p className="muted">Stock control</p><h2>Inventory</h2></div><button className="secondary" onClick={load}><RefreshCw size={16}/> Refresh</button></div><div className="inventory-grid">{rows.map(p=><div className="inventory-card" key={p.id}><div className="inventory-top">{p.image_url?<img src={p.image_url} alt=""/>:<div className="thumb-fallback">G</div>}<div><strong>{p.name}</strong><span>{p.sku??'No SKU'}</span></div><span className={p.stock<=5?'pill danger':'pill'}>{p.stock}</span></div><div className="stock-actions"><button className="secondary" disabled={busy===p.id} onClick={()=>adjust(p,-1)}>−</button><div className="stock-number">{p.stock}</div><button className="primary" disabled={busy===p.id} onClick={()=>adjust(p,1)}>+</button></div></div>)}</div></> }

function Customers() { const [orders,setOrders]=useState<Order[]>([]); const [q,setQ]=useState(''); useEffect(()=>{supabase.from('orders').select('*').order('created_at',{ascending:false}).then(({data,error})=>{if(error)alert(error.message);setOrders((data??[]) as Order[])});},[]); const customers=useMemo(()=>{const m=new Map<string,{name:string,email:string,phone:string,orders:number,total:number,last:string}>();orders.forEach(o=>{const key=o.email.toLowerCase();const cur=m.get(key)||{name:o.customer_name,email:o.email,phone:o.phone??'',orders:0,total:0,last:o.created_at};cur.orders++;cur.total+=Number(o.total||0);if(new Date(o.created_at)>new Date(cur.last))cur.last=o.created_at;m.set(key,cur)});return [...m.values()];},[orders]); const rows=customers.filter(c=>`${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q.toLowerCase())); return <><div className="toolbar"><div><p className="muted">Customer database from checkout orders</p><h2>{customers.length} customers</h2></div><label className="search"><Search size={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search customer…"/></label></div><div className="panel table-wrap"><table><thead><tr><th>Customer</th><th>Phone</th><th>Orders</th><th>Total spent</th><th>Last order</th></tr></thead><tbody>{rows.map(c=><tr key={c.email}><td><strong>{c.name}</strong><small>{c.email}</small></td><td>{c.phone||'—'}</td><td>{c.orders}</td><td>{money(c.total)}</td><td>{dateTime(c.last)}</td></tr>)}</tbody></table></div></> }

function Analytics() { const [orders,setOrders]=useState<Order[]>([]); const [products,setProducts]=useState<Product[]>([]); useEffect(()=>{Promise.all([supabase.from('orders').select('*'),supabase.from('products').select('*')]).then(([o,p])=>{setOrders((o.data??[]) as Order[]);setProducts((p.data??[]) as Product[])});},[]); const revenue=orders.reduce((s,o)=>s+Number(o.total||0),0);const aov=orders.length?revenue/orders.length:0;const top=useMemo(()=>{const map=new Map<string,{name:string,qty:number,revenue:number}>();orders.forEach(o=>(o.items||[]).forEach(i=>{const x=map.get(i.id)||{name:i.name,qty:0,revenue:0};x.qty+=Number(i.qty||0);x.revenue+=Number(i.price||0)*Number(i.qty||0);map.set(i.id,x)}));return [...map.values()].sort((a,b)=>b.revenue-a.revenue).slice(0,8)},[orders]);return <><div className="stats-grid"><Stat label="Revenue" value={money(revenue)} icon={<BarChart3/>}/><Stat label="AOV" value={money(aov)} icon={<CircleDollarSign/>}/><Stat label="Orders" value={String(orders.length)} icon={<ClipboardList/>}/><Stat label="Catalog" value={String(products.length)} icon={<ShoppingBag/>}/></div><div className="panel"><div className="panel-head"><h3>Top products by recorded order value</h3><span>Derived from orders</span></div><div className="bars">{top.length?top.map((x,i)=><div className="bar-row" key={x.name}><span>{i+1}. {x.name}</span><div className="bar"><i style={{width:`${Math.max(8,Math.round((x.revenue/(top[0]?.revenue||1))*100))}%`}}/></div><strong>{money(x.revenue)}</strong></div>):<div className="empty">No order data yet.</div>}</div></div></> }

const defaultHero = { kicker:'The Gen Z lighter collective', title1:'LIGHT', title2:'YOUR ERA', description:'Refillable lighters, torch flames, and collectible matchbooks built for the feed-first generation.', primaryCta:'Shop the drop', secondaryCta:'Our story', stats:[{value:'50K+',label:'Lighters lit'},{value:'4.9',label:'Avg rating'},{value:'24H',label:'Dispatch'}] };
const defaultAbout = { kicker:'Our story', title:'Built for the feed-first generation', body1:'Genzilla started with one question — why do lighters all look the same? We design refillable lighters, torch flames and collectible pieces that feel like they belong on your shelf and your story.', body2:'Windproof, reusable and unapologetically loud.', chips:['Refillable','Windproof','Gen Z owned','Carbon-aware shipping'] };
const defaultReviews = [{name:'Maya R.',handle:'@mayalights',text:'The Neon Ghost glows in the dark. I get asked about it every time I pull it out.',rating:5},{name:'Devon K.',handle:'@devkeeps',text:'Inferno X1 cuts through wind like nothing.',rating:5},{name:'Priya S.',handle:'@priyagram',text:'Refillable AND aesthetic? Finally.',rating:5},{name:'Leo M.',handle:'@leomakes',text:'Forge Master is a game changer.',rating:5}];
const defaultContact = { title:'Join the collective', description:'Early access to drops, restock alerts, and special offers. No spam, just fire.', subscribeCta:'Subscribe', instagram:'#', email:'#' };
const defaultLookbook = { title:'In the wild', description:'Shot on the street, styled for the feed. Tag #genzilla to be featured.', images:[
  'https://images.pexels.com/photos/7742848/pexels-photo-7742848.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6365187/pexels-photo-6365187.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/14754790/pexels-photo-14754790.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6580543/pexels-photo-6580543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/38489198/pexels-photo-38489198.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/14057996/pexels-photo-14057996.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
]};
const defaultMarquee = { items:['FREE SHIPPING OVER ₹1500','NEW DROP — NEON GHOST','REFILLABLE. REUSABLE. ICONIC.','GEN Z APPROVED','WINDPROOF TORCH FLAME','SHIPS IN 24H'] };
const defaultFooter = { copyright:'© 2026 Genzilla Collective. Keep it lit.', safety:'Products are intended for adults 18+. Keep away from children. Use responsibly and in accordance with local regulations.' };

const contentDefaults: Record<string, any> = { hero:defaultHero, about:defaultAbout, reviews:defaultReviews, contact:defaultContact, lookbook:defaultLookbook, marquee:defaultMarquee, footer:defaultFooter };

function WebsiteEditor(){
  const [data,setData]=useState<Record<string,any>>(contentDefaults); const [settings,setSettings]=useState<any>({store_name:'GENZILLA',logo_url:'',favicon_url:'',whatsapp:'',support_email:'',phone:'',address:'',seo_title:'GENZILLA',seo_description:''}); const [active,setActive]=useState('hero'); const [saved,setSaved]=useState(false);
  useEffect(()=>{Promise.all([supabase.from('homepage_content').select('*').in('section_key',Object.keys(contentDefaults)),supabase.from('store_settings').select('*').limit(1).maybeSingle()]).then(([c,s])=>{const next={...contentDefaults};for(const row of (c.data??[])){next[row.section_key]={...contentDefaults[row.section_key],...(row.draft_content&&Object.keys(row.draft_content).length?row.draft_content:row.content)};if(row.section_key==='reviews' && Array.isArray(row.draft_content||row.content))next.reviews=row.draft_content||row.content;}setData(next);if(s.data)setSettings(s.data)})},[]);
  async function saveSection(key:string){const {error}=await supabase.from('homepage_content').upsert({section_key:key,draft_content:data[key],enabled:true},{onConflict:'section_key'});if(error){alert(error.message);return false}return true}
  async function publish(key:string){if(!(await saveSection(key)))return;const {error}=await supabase.from('homepage_content').update({content:data[key],published_at:new Date().toISOString(),enabled:true}).eq('section_key',key);if(error)alert(error.message);else flash()}
  async function saveSettings(){const payload={store_name:settings.store_name,logo_url:settings.logo_url||null,favicon_url:settings.favicon_url||null,whatsapp:settings.whatsapp||null,support_email:settings.support_email||null,phone:settings.phone||null,address:settings.address||null,seo_title:settings.seo_title||null,seo_description:settings.seo_description||null};const {error}=await supabase.from('store_settings').update(payload).eq('id',settings.id);if(error)alert(error.message);else flash()}
  const flash=()=>{setSaved(true);setTimeout(()=>setSaved(false),1600)};
  const change=(key:string,val:any)=>setData({...data,[key]:val});
  const sectionList=[['hero','Hero'],['about','About'],['reviews','Reviews'],['contact','Contact'],['lookbook','Lookbook'],['marquee','Announcement bar'],['footer','Footer'],['branding','Branding & contact']];
  return <><div className="toolbar"><div><p className="muted">Control the storefront without editing code</p><h2>Website Editor</h2></div>{saved&&<span className="saved-pill"><Check size={14}/> Published</span>}</div><div className="editor-layout"><aside className="editor-nav">{sectionList.map(([id,label])=><button key={id} className={active===id?'active':''} onClick={()=>setActive(id)}>{label}<ChevronRight size={15}/></button>)}</aside><div className="panel editor-panel">
    {active==='hero'&&<SectionEditor title="Hero section" data={data.hero} setData={(v:any)=>change('hero',v)} onDraft={()=>saveSection('hero')} onPublish={()=>publish('hero')} fields={['kicker','title1','title2','description','primaryCta','secondaryCta']}/>} 
    {active==='about'&&<SectionEditor title="About section" data={data.about} setData={(v:any)=>change('about',v)} onDraft={()=>saveSection('about')} onPublish={()=>publish('about')} fields={['kicker','title','body1','body2','chips']}/>} 
    {active==='reviews'&&<ReviewsEditor reviews={data.reviews} setReviews={(v:any[])=>change('reviews',v)} onDraft={()=>saveSection('reviews')} onPublish={()=>publish('reviews')}/>} 
    {active==='contact'&&<SectionEditor title="Contact / newsletter" data={data.contact} setData={(v:any)=>change('contact',v)} onDraft={()=>saveSection('contact')} onPublish={()=>publish('contact')} fields={['title','description','subscribeCta','instagram','email']}/>} 
    {active==='lookbook'&&<LookbookEditor value={data.lookbook} setValue={(v:any)=>change('lookbook',v)} onDraft={()=>saveSection('lookbook')} onPublish={()=>publish('lookbook')}/>} 
    {active==='marquee'&&<SectionEditor title="Announcement bar" data={data.marquee} setData={(v:any)=>change('marquee',v)} onDraft={()=>saveSection('marquee')} onPublish={()=>publish('marquee')} fields={['items']}/>} 
    {active==='footer'&&<SectionEditor title="Footer" data={data.footer} setData={(v:any)=>change('footer',v)} onDraft={()=>saveSection('footer')} onPublish={()=>publish('footer')} fields={['copyright','safety']}/>} 
    {active==='branding'&&<SettingsEditor settings={settings} setSettings={setSettings} save={saveSettings}/>} 
  </div></div></>
}

function SectionEditor({title,data,setData,onDraft,onPublish,fields}:{title:string,data:any,setData:(x:any)=>void,onDraft:()=>Promise<any>|void,onPublish:()=>Promise<any>|void,fields:string[]}){const update=(k:string,v:any)=>setData({...data,[k]:v});return <div><div className="panel-head no-border"><div><p className="eyebrow">CONTENT MODULE</p><h3>{title}</h3></div><div className="foot-actions"><button className="secondary" onClick={()=>onDraft()}><Save size={15}/> Save draft</button><button className="primary" onClick={()=>onPublish()}><Check size={15}/> Publish</button></div></div><div className="form-grid content-form">{fields.map(k=>k==='chips'||k==='items'?<Field key={k} label={`${k} (comma separated)`}><textarea rows={4} value={(data[k]??[]).join(', ')} onChange={e=>update(k,e.target.value.split(',').map((x:string)=>x.trim()).filter(Boolean))}/></Field>:<Field key={k} label={k.replace(/([A-Z])/g,' $1')}><textarea rows={k.includes('body')||k==='description'||k==='safety'?5:2} value={data[k]??''} onChange={e=>update(k,e.target.value)}/></Field>)}</div><div className="editor-note"><Sparkles size={15}/> Changes stay in draft until you press Publish. Customer storefront reads the published content.</div></div>}

function ReviewsEditor({reviews,setReviews,onDraft,onPublish}:{reviews:any[],setReviews:(x:any[])=>void,onDraft:()=>Promise<any>|void,onPublish:()=>Promise<any>|void}){const update=(i:number,k:string,v:any)=>setReviews(reviews.map((r,j)=>j===i?{...r,[k]:v}:r));return <div><div className="panel-head no-border"><div><p className="eyebrow">CONTENT MODULE</p><h3>Reviews</h3></div><div className="foot-actions"><button className="secondary" onClick={()=>onDraft()}><Save size={15}/> Save draft</button><button className="primary" onClick={()=>onPublish()}><Check size={15}/> Publish</button></div></div><div className="review-editor">{reviews.map((r,i)=><div className="review-edit" key={i}><div className="fields-2"><Field label="Name"><input value={r.name??''} onChange={e=>update(i,'name',e.target.value)}/></Field><Field label="Handle"><input value={r.handle??''} onChange={e=>update(i,'handle',e.target.value)}/></Field></div><Field label="Review"><textarea rows={3} value={r.text??''} onChange={e=>update(i,'text',e.target.value)}/></Field><Field label="Rating"><input type="number" min={1} max={5} value={r.rating??5} onChange={e=>update(i,'rating',Number(e.target.value))}/></Field><button className="link-btn danger-link" onClick={()=>setReviews(reviews.filter((_,j)=>j!==i))}><Trash2 size={14}/> Remove review</button></div>)}<button className="secondary" onClick={()=>setReviews([...reviews,{name:'',handle:'',text:'',rating:5}])}><Plus size={15}/> Add review</button></div></div>}

function LookbookEditor({value,setValue,onDraft,onPublish}:{value:any,setValue:(x:any)=>void,onDraft:()=>Promise<any>|void,onPublish:()=>Promise<any>|void}){return <div><div className="panel-head no-border"><div><p className="eyebrow">CONTENT MODULE</p><h3>Lookbook</h3></div><div className="foot-actions"><button className="secondary" onClick={()=>onDraft()}><Save size={15}/> Save draft</button><button className="primary" onClick={()=>onPublish()}><Check size={15}/> Publish</button></div></div><div className="form-grid content-form"><Field label="Title"><input value={value.title??''} onChange={e=>setValue({...value,title:e.target.value})}/></Field><Field label="Description"><textarea rows={3} value={value.description??''} onChange={e=>setValue({...value,description:e.target.value})}/></Field><Field label="Image URLs (one per line)"><textarea rows={10} value={(value.images??[]).join('\n')} onChange={e=>setValue({...value,images:e.target.value.split('\n').map((x:string)=>x.trim()).filter(Boolean)})}/></Field></div></div>}

function SettingsEditor({settings,setSettings,save}:{settings:any,setSettings:(x:any)=>void,save:()=>void}){const set=(k:string,v:string)=>setSettings({...settings,[k]:v});return <div><div className="panel-head no-border"><div><p className="eyebrow">STORE PROFILE</p><h3>Branding & contact</h3></div><button className="primary" onClick={save}><Save size={15}/> Save settings</button></div><div className="form-grid content-form"><Field label="Store name"><input value={settings.store_name??''} onChange={e=>set('store_name',e.target.value)}/></Field><Field label="Logo URL"><input value={settings.logo_url??''} onChange={e=>set('logo_url',e.target.value)}/></Field><Field label="Favicon URL"><input value={settings.favicon_url??''} onChange={e=>set('favicon_url',e.target.value)}/></Field><Field label="WhatsApp"><input value={settings.whatsapp??''} onChange={e=>set('whatsapp',e.target.value)}/></Field><Field label="Support email"><input value={settings.support_email??''} onChange={e=>set('support_email',e.target.value)}/></Field><Field label="Phone"><input value={settings.phone??''} onChange={e=>set('phone',e.target.value)}/></Field><Field label="Address"><textarea rows={3} value={settings.address??''} onChange={e=>set('address',e.target.value)}/></Field><Field label="SEO title"><input value={settings.seo_title??''} onChange={e=>set('seo_title',e.target.value)}/></Field><Field label="SEO description"><textarea rows={3} value={settings.seo_description??''} onChange={e=>set('seo_description',e.target.value)}/></Field></div></div>}

function Marketing(){const [rows,setRows]=useState<any[]>([]);const [open,setOpen]=useState(false);const [form,setForm]=useState({code:'',discount_type:'percentage',discount_value:'10',min_order_value:'0',max_uses:'',active:true});async function load(){const {data,error}=await supabase.from('coupons').select('*').order('created_at',{ascending:false});if(error)alert(error.message);setRows(data??[])}useEffect(()=>{load()},[]);async function save(){const {error}=await supabase.from('coupons').insert({code:form.code.toUpperCase(),discount_type:form.discount_type,discount_value:Number(form.discount_value),min_order_value:Number(form.min_order_value),max_uses:form.max_uses?Number(form.max_uses):null,active:form.active});if(error)alert(error.message);else{setOpen(false);setForm({code:'',discount_type:'percentage',discount_value:'10',min_order_value:'0',max_uses:'',active:true});load()}}return <><div className="toolbar"><div><p className="muted">Promotions without code edits</p><h2>Coupons</h2></div><button className="primary" onClick={()=>setOpen(true)}><Plus size={16}/> New coupon</button></div><div className="panel table-wrap"><table><thead><tr><th>Code</th><th>Discount</th><th>Min order</th><th>Usage</th><th>Status</th></tr></thead><tbody>{rows.map(c=><tr key={c.id}><td><strong>{c.code}</strong></td><td>{c.discount_value}{c.discount_type==='percentage'?'%':'₹'}</td><td>{money(Number(c.min_order_value||0))}</td><td>{c.used_count}{c.max_uses?` / ${c.max_uses}`:' / ∞'}</td><td><span className={c.active?'status delivered':'status cancelled'}>{c.active?'Active':'Inactive'}</span></td></tr>)}</tbody></table></div>{open&&<div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><p className="eyebrow">CAMPAIGN</p><h3>New coupon</h3></div><button className="icon-btn" onClick={()=>setOpen(false)}><X/></button></div><div className="form-grid"><Field label="Code"><input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="GENZILLA10"/></Field><Field label="Discount type"><select value={form.discount_type} onChange={e=>setForm({...form,discount_type:e.target.value})}><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select></Field><Field label="Value"><input type="number" value={form.discount_value} onChange={e=>setForm({...form,discount_value:e.target.value})}/></Field><Field label="Minimum order"><input type="number" value={form.min_order_value} onChange={e=>setForm({...form,min_order_value:e.target.value})}/></Field><Field label="Max uses"><input type="number" value={form.max_uses} onChange={e=>setForm({...form,max_uses:e.target.value})}/></Field></div><div className="modal-foot"><div/><div className="foot-actions"><button className="secondary" onClick={()=>setOpen(false)}>Cancel</button><button className="primary" onClick={save}><Save size={15}/> Create coupon</button></div></div></div></div>}</>}

function SettingsPanel(){return <div className="module-grid"><div><Settings size={18}/><strong>Store configuration</strong><span>Use Website Editor → Branding & contact for live-editable store details.</span></div><div><ShieldCheck size={18}/><strong>Admin security</strong><span>Supabase Auth + admin_users gate dashboard access.</span></div><div><Activity size={18}/><strong>Automation</strong><span>GitHub → Cloudflare Pages remains the code deployment path.</span></div><div><ImageIcon size={18}/><strong>Media strategy</strong><span>Product images can be changed from the catalog editor without code edits.</span></div></div>}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="field">{label}{children}</label>}
