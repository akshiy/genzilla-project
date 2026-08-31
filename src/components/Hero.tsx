import { useEffect, useState } from 'react';
import { ArrowDown, Flame, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const fallback = { kicker:'The Gen Z lighter collective', title1:'LIGHT', title2:'YOUR ERA', description:'Refillable lighters, torch flames, and collectible matchbooks built for the feed-first generation.', primaryCta:'Shop the drop', secondaryCta:'Our story', stats:[{value:'50K+',label:'Lighters lit'},{value:'4.9',label:'Avg rating'},{value:'24H',label:'Dispatch'}] };

export function Hero() {
  const [content,setContent]=useState(fallback); const [mounted,setMounted]=useState(false);
  useEffect(()=>{setMounted(true);supabase.from('homepage_content').select('content').eq('section_key','hero').eq('enabled',true).maybeSingle().then(({data})=>{if(data?.content)setContent({...fallback,...data.content})})},[]);
  return <section className="relative min-h-[92vh] overflow-hidden" id="home">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(255,110,0,.14),transparent_30%),radial-gradient(circle_at_75%_65%,rgba(255,30,80,.10),transparent_35%)]"/>
    <div className="pointer-events-none absolute left-[8%] top-[22%] h-72 w-72 rounded-full bg-orange-500/20 blur-[100px] animate-float-slow"/>
    <div className="pointer-events-none absolute right-[10%] top-[40%] h-96 w-96 rounded-full bg-red-600/15 blur-[120px] animate-float-slow" style={{animationDelay:'2s'}}/>
    <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pt-36 pb-20 text-center md:pt-44">
      <div className={`mb-7 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white/80 transition-all duration-700 ${mounted?'translate-y-0 opacity-100':'translate-y-4 opacity-0'}`}><Sparkles className="h-3.5 w-3.5 text-orange-400"/>{content.kicker}</div>
      <h1 className={`font-display text-6xl font-extrabold leading-[0.95] tracking-tight transition-all duration-700 sm:text-7xl md:text-8xl lg:text-9xl ${mounted?'translate-y-0 opacity-100':'translate-y-6 opacity-0'}`}><span className="block">{content.title1}</span><span className="block text-gradient-fire">{content.title2}</span></h1>
      <p className={`mt-7 max-w-xl text-base leading-relaxed text-white/65 md:text-lg transition-all delay-150 duration-700 ${mounted?'translate-y-0 opacity-100':'translate-y-6 opacity-0'}`}>{content.description}</p>
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row"><a href="#shop" className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 text-base font-bold text-white glow-fire transition-transform hover:scale-105"><Flame className="h-5 w-5 animate-flicker"/>{content.primaryCta}</a><a href="#about" className="flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white hover:bg-white/5">{content.secondaryCta}</a></div>
      <div className="mt-20 grid w-full max-w-2xl grid-cols-3 gap-4">{(content.stats||fallback.stats).map((s:any)=><div key={s.label} className="glass rounded-2xl px-4 py-5"><div className="font-display text-2xl font-extrabold text-gradient-fire md:text-3xl">{s.value}</div><div className="mt-1 text-xs uppercase tracking-wider text-white/50">{s.label}</div></div>)}</div>
    </div>
    <a href="#shop" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white" aria-label="Scroll to shop"><ArrowDown className="h-6 w-6 animate-bounce"/></a>
  </section>;
}
