// Shared by Android and Pages. The token is used in memory only (never in a storage key).
export const options = [['auto','По календарю'],['on','Включить'],['off','Выключить']];
const valid = value => options.some(([v])=>v===value);
export function effectiveMode(mode,state) {
  if(mode==='off') return false;
  if(mode==='on') return true;
  return !!(state?.active || state?.isSaturday); // Preserve the existing calendar for everyone else.
}
export function usePersonalSabbath(R,io,user,realm) {
  const id=String(user?.accountId||user?.effectiveUserId||user?.login||''), admin=!!user?.isAdmin&&!user?.isGuest;
  const key=id?'zau_sabbath_self_v2:'+encodeURIComponent(realm)+':'+(admin?'admin:':'member:')+encodeURIComponent(id):'';
  const token=io.token();
  const ctx=R.useMemo(()=>({key,token,rev:-1,busy:false}),[key,token]);
  const live=R.useRef(ctx); live.current=ctx;
  const [view,show]=R.useState({});
  const current=()=>live.current===ctx && io.token()===token && !!key;
  const commit=(v,cache)=>{
    if(!current()||!valid(v?.mode)||(!admin&&v.mode==='off')||v.accountId!==id||!Number.isSafeInteger(v.revision)||v.revision<ctx.rev)return false;
    ctx.rev=v.revision;show({ctx,mode:v.mode});
    if(cache) Promise.resolve().then(()=>io.write(key,JSON.stringify({accountId:id,mode:v.mode,revision:v.revision}))).catch(()=>{});
    return true;
  };
  R.useEffect(()=>{
    let stopped=false,pending=false;
    if(!key||!token)return;
    const refresh=async()=>{
      if(!admin||pending||ctx.busy||stopped||!current())return;
      pending=true;
      try {const v=await io.api('/api/mobile/me/sabbath-mode',{timeoutMs:5500});if(!stopped&&!ctx.busy)commit(v,true);}
      catch(e){if(!stopped&&current()&&e?.isApiResponse&&[401,403].includes(e.status)){ctx.rev=-1;show({ctx,mode:'auto'});Promise.resolve().then(()=>io.remove(key)).catch(()=>{});}}
      finally {pending=false;}
    };
    Promise.resolve().then(()=>io.read(key)).then(s=>{if(!stopped&&ctx.rev<0&&s)commit(JSON.parse(s),false);}).catch(()=>{});
    refresh();const timer=admin?setInterval(refresh,45000):null, unsub=admin?io.onFocus(refresh):null;
    return ()=>{stopped=true;if(timer)clearInterval(timer);unsub?.();};
  },[ctx]);
  const mode=view.ctx===ctx?view.mode:'auto';
  const setMode=async next=>{
    if(!current()||ctx.busy||!valid(next)||(!admin&&next==='off'))return;
    ctx.busy=true;
    try {
      if(admin){const v=await io.api('/api/mobile/me/sabbath-mode',{method:'PUT',body:{mode:next},timeoutMs:8000});
        if(current()&&!commit(v,true))throw Error('Сервер не подтвердил личную настройку. Обновите данные.');
      }else{const v={mode:next,accountId:id,revision:Math.max(0,ctx.rev+1)};await io.write(key,JSON.stringify(v));commit(v,false);}
    }finally{ctx.busy=false;}
  };
  return {admin,mode,setMode};
}
