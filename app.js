const STORAGE_KEY = 'usit_final_plain_v1';
const $ = (sel) => document.querySelector(sel);
const app = $('#app');
const toastEl = $('#toast');

const categories = [
  { id:'Ferramentas', icon:'<i class="fa-solid fa-wrench"></i>' },
  { id:'Eletrónicos', icon:'<i class="fa-solid fa-computer"></i>' },
  { id:'Casa', icon:'<i class="fa-solid fa-house-chimney"></i>' },
  { id:'Eventos', icon:'<i class="fa-solid fa-champagne-glasses"></i>' },
  { id:'Fotografia', icon:'<i class="fa-solid fa-camera-retro"></i>' },
  { id:'Desporto', icon:'<i class="fa-solid fa-football"></i>' }
];

const demo = {
  users: [
    { id:'u1', role:'user', name:'Rui Santos', email:'rui@usit.pt', password:'usit123', paymentMethod:'Cartão terminado em 4242', payoutMethod:'', location:'Lisboa, Portugal' },
    { id:'u2', role:'user', name:'Carla Costa', email:'carla@usit.pt', password:'usit123', paymentMethod:'', payoutMethod:'IBAN terminado em 9031', location:'Lisboa, Benfica' },
    { id:'u3', role:'user', name:'Miguel Ferreira', email:'miguel@usit.pt', password:'usit123', paymentMethod:'Cartão terminado em 1234', payoutMethod:'IBAN terminado em 4421', location:'Lisboa, Mouraria' },
    { id:'u4', role:'user', name:'Ana Lopes', email:'ana@usit.pt', password:'usit123', paymentMethod:'MB Way 912 345 678', payoutMethod:'IBAN terminado em 7732', location:'Lisboa, Belém' },
    { id:'u5', role:'user', name:'João Mendes', email:'joao@usit.pt', password:'usit123', paymentMethod:'', payoutMethod:'IBAN terminado em 5510', location:'Lisboa, Intendente' },
    { id:'u6', role:'user', name:'Sofia Pinheiro', email:'sofia@usit.pt', password:'usit123', paymentMethod:'Cartão terminado em 9871', payoutMethod:'IBAN terminado em 3301', location:'Lisboa, Príncipe Real' },
    { id:'admin1', role:'admin', name:'Administrador Usit', email:'admin@usit.pt', password:'admin123', location:'Backoffice' },
    { id:'partner1', role:'partner', name:'Parceiro Comercial', email:'parceiro@usit.pt', password:'parceiro123', company:'ToolHub Lisboa', location:'Lisboa, Alvalade' }
  ],
  items: [
    { id:'i1', ownerId:'u2', ownerName:'Carla Costa', title:'Berbequim Elétrico Bosch', category:'Ferramentas', description:'Berbequim compacto para pequenas reparações domésticas. Inclui mala e brocas básicas.', location:'Lisboa, Benfica', distance:0.8, price:5, deposit:25, status:'Ativo', verified:true, emoji:'🔩', image:'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80', views:46, partner:false, conditions:'Entregar limpo e sem danos visíveis.', available:['2026-05-22','2026-05-23','2026-05-24','2026-05-25','2026-05-28'] },
    { id:'i2', ownerId:'partner1', ownerName:'ToolHub Lisboa', title:'Máquina de Lavar Roupa', category:'Casa', description:'Máquina para aluguer pontual em mudanças, eventos ou situações temporárias.', location:'Lisboa, Alvalade', distance:1.2, price:15, deposit:80, status:'Alugado', verified:false, emoji:'🧺', image:'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80', views:68, partner:true, conditions:'Recolha em loja. Transporte a cargo do locatário.', available:['2026-05-26','2026-05-27','2026-05-29'] },
    { id:'i3', ownerId:'u2', ownerName:'Carla Costa', title:'Escada Extensível', category:'Ferramentas', description:'Escada extensível para trabalhos de pintura e pequenas reparações.', location:'Lisboa, Benfica', distance:0.9, price:7, deposit:30, status:'Alugado', verified:false, emoji:'🪜', image:'https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=800&auto=format&fit=crop&q=80', views:21, partner:false, conditions:'Usar em piso estável.', available:['2026-05-30'] },
    { id:'i4', ownerId:'u2', ownerName:'Carla Costa', title:'Bicicleta de Montanha', category:'Desporto', description:'Bicicleta para trilhos leves e passeios urbanos.', location:'Lisboa, Parque das Nações', distance:2.5, price:8, deposit:45, status:'Ativo', verified:true, emoji:'🚲', image:'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&auto=format&fit=crop&q=80', views:39, partner:false, conditions:'Devolver com pneus cheios.', available:['2026-05-22','2026-05-23','2026-05-24','2026-05-26'] },
    { id:'i5', ownerId:'partner1', ownerName:'ToolHub Lisboa', title:'Projetor Full HD', category:'Eletrónicos', description:'Projetor Full HD para apresentações, aulas e eventos pequenos.', location:'Lisboa, Saldanha', distance:1.8, price:12, deposit:60, status:'Ativo', verified:false, emoji:'📽️', image:'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=80', views:88, partner:true, conditions:'Inclui cabo HDMI. Não usar no exterior com chuva.', available:['2026-05-22','2026-05-25','2026-05-28','2026-05-29'] },
    { id:'i6', ownerId:'u3', ownerName:'Miguel Ferreira', title:'Tenda de Campismo 4 Pessoas', category:'Desporto', description:'Tenda impermeável para campismo familiar. Fácil de montar, inclui saco de transporte e estacas.', location:'Lisboa, Mouraria', distance:1.1, price:10, deposit:50, status:'Ativo', verified:true, emoji:'⛺', image:'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80', views:34, partner:false, conditions:'Devolver limpa e seca. Verificar estacas antes de devolver.', available:[] },
    { id:'i7', ownerId:'u4', ownerName:'Ana Lopes', title:'Câmara Sony Alpha A7', category:'Fotografia', description:'Câmara mirrorless full-frame com objetiva 28-70mm. Ideal para eventos, retratos e fotografia de rua.', location:'Lisboa, Belém', distance:3.2, price:25, deposit:200, status:'Ativo', verified:true, emoji:'📷', image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80', views:92, partner:false, conditions:'Entregar com bateria carregada. Proibido uso sob chuva sem proteção.', available:[] },
    { id:'i8', ownerId:'u3', ownerName:'Miguel Ferreira', title:'Sistema de Som Portátil', category:'Eventos', description:'Coluna Bluetooth 200W com microfone sem fios. Adequado para festas e apresentações até 100 pessoas.', location:'Lisboa, Mouraria', distance:1.0, price:35, deposit:150, status:'Ativo', verified:false, emoji:'🔊', image:'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', views:71, partner:false, conditions:'Devolver com cabos originais. Não expor à chuva.', available:[] },
    { id:'i9', ownerId:'u5', ownerName:'João Mendes', title:'Drone DJI Mini 3', category:'Fotografia', description:'Drone compacto com câmara 4K. Ótimo para filmagens aéreas em eventos e viagens.', location:'Lisboa, Intendente', distance:1.4, price:30, deposit:180, status:'Ativo', verified:true, emoji:'🚁', image:'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop&q=80', views:110, partner:false, conditions:'Utilizar apenas em zonas permitidas por lei. Devolver com baterias carregadas.', available:[] },
    { id:'i10', ownerId:'u6', ownerName:'Sofia Pinheiro', title:'Kayak Individual', category:'Desporto', description:'Kayak rígido para uso em rio e mar calmo. Inclui remo e colete salva-vidas.', location:'Lisboa, Príncipe Real', distance:2.1, price:18, deposit:80, status:'Ativo', verified:false, emoji:'🛶', image:'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=800&auto=format&fit=crop&q=80', views:29, partner:false, conditions:'Uso exclusivo em águas calmas. Devolver sem riscos ou amolgadelas.', available:[] },
    { id:'i11', ownerId:'u4', ownerName:'Ana Lopes', title:'Mesa e Cadeiras de Jardim', category:'Casa', description:'Conjunto de mesa redonda e 4 cadeiras dobráveis. Ideal para festas de jardim ou esplanadas temporárias.', location:'Lisboa, Belém', distance:3.5, price:12, deposit:40, status:'Ativo', verified:true, emoji:'🪑', image:'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&auto=format&fit=crop&q=80', views:41, partner:false, conditions:'Devolver limpo. Cadeiras devem ser dobradas antes da devolução.', available:[] },
    { id:'i12', ownerId:'u5', ownerName:'João Mendes', title:'Cortador de Relva Elétrico', category:'Ferramentas', description:'Cortador de relva elétrico com saco recolhedor. Adequado para jardins até 300m².', location:'Lisboa, Intendente', distance:1.6, price:14, deposit:60, status:'Ativo', verified:false, emoji:'🌿', image:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80', views:38, partner:false, conditions:'Devolver limpo. Cabo de extensão não incluído.', available:[] },
    { id:'i13', ownerId:'u6', ownerName:'Sofia Pinheiro', title:'Máquina Fotográfica Instantânea Fujifilm', category:'Fotografia', description:'Fujifilm Instax Wide 300. Perfeita para festas, casamentos e eventos. Inclui 2 packs de filme.', location:'Lisboa, Príncipe Real', distance:2.3, price:8, deposit:30, status:'Ativo', verified:true, emoji:'📸', image:'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80', views:57, partner:false, conditions:'Filme extra não incluído. Devolver com a objetiva limpa.', available:[] },
    { id:'i14', ownerId:'u3', ownerName:'Miguel Ferreira', title:'Baloiço de Jardim', category:'Eventos', description:'Baloiço decorativo de madeira para jardins e festas ao ar livre. Suporta até 120kg.', location:'Lisboa, Mouraria', distance:1.2, price:9, deposit:35, status:'Ativo', verified:false, emoji:'🌸', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80', views:22, partner:false, conditions:'Montagem incluída na entrega. Não usar com chuva forte.', available:[] },
    { id:'i15', ownerId:'u4', ownerName:'Ana Lopes', title:'Patins em Linha', category:'Desporto', description:'Par de patins em linha tamanho 40. Inclui proteções de joelho, pulso e cotovelo.', location:'Lisboa, Belém', distance:3.1, price:6, deposit:25, status:'Ativo', verified:true, emoji:'🛼', image:'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&auto=format&fit=crop&q=80', views:18, partner:false, conditions:'Devolver com proteções. Lavar antes de devolver.', available:[] },
    { id:'i16', ownerId:'u5', ownerName:'João Mendes', title:'Televisão 55" 4K', category:'Eletrónicos', description:'Smart TV 55 polegadas 4K para eventos, festas e apresentações. Inclui suporte de chão.', location:'Lisboa, Intendente', distance:1.5, price:20, deposit:90, status:'Ativo', verified:false, emoji:'📺', image:'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', views:45, partner:false, conditions:'Transporte e instalação a cargo do locatário. Não transportar sem embalagem.', available:[] },
    { id:'i17', ownerId:'u6', ownerName:'Sofia Pinheiro', title:'Kit Decoração para Festas', category:'Eventos', description:'Conjunto de balões, guirlandas, luzes LED e toalhas de mesa. Para festas de aniversário ou celebrações.', location:'Lisboa, Príncipe Real', distance:2.4, price:15, deposit:20, status:'Ativo', verified:true, emoji:'🎉', image:'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80', views:66, partner:false, conditions:'Devolver tudo no saco original. Luzes LED devolvidas enroladas.', available:[] },
    { id:'i18', ownerId:'partner1', ownerName:'ToolHub Lisboa', title:'Andaime Tubular', category:'Ferramentas', description:'Andaime modular de alumínio para trabalhos em altura. Altura máxima 4 metros.', location:'Lisboa, Alvalade', distance:1.2, price:20, deposit:100, status:'Ativo', verified:true, emoji:'🏗️', image:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80', views:55, partner:true, conditions:'Montagem e desmontagem a cargo do locatário. Não usar em superfícies inclinadas.', available:[] },
  ],
  reservations: [
    { id:'r1', itemId:'i2', itemTitle:'Máquina de Lavar Roupa', ownerId:'partner1', locatarioId:'u1', start:'2026-05-21', end:'2026-05-22', days:2, total:110.6, state:'Confirmada', paid:true, received:false, createdAt:'2026-05-18' },
    { id:'r2', itemId:'i1', itemTitle:'Berbequim Elétrico Bosch', ownerId:'u2', locatarioId:'u1', start:'2026-05-28', end:'2026-05-29', days:2, total:35.2, state:'Pendente', paid:false, received:false, createdAt:'2026-05-20' }
  ],
  messages: [
    { id:'m1', from:'u1', to:'u2', text:'Olá Carla, o berbequim está disponível no fim de semana?', date:'2026-05-20 10:12' },
    { id:'m2', from:'u2', to:'u1', text:'Sim, está disponível. Posso entregar no sábado de manhã.', date:'2026-05-20 10:21' }
  ],
  currentUserId: null,
  activeView: 'explore',
  selectedItemId: 'i1',
  selectedThreadUserId: 'u2'
};

let state = load();

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const loaded = JSON.parse(raw);
      if(Array.isArray(loaded.items)){
        loaded.items.forEach(it => {
          if(!it.image){
            const seed = demo.items.find(d => d.id === it.id);
            if(seed && seed.image) it.image = seed.image;
          }
        });
      }
      return loaded;
    }
  }catch(e){ console.warn(e); }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  return structuredClone(demo);
}
function itemMedia(item){
  if(item && item.image){
    const fallback = (item.emoji || '📦').replace(/'/g, "\\'");
    return `<img src="${item.image}" alt="${item.title || ''}" loading="lazy" onerror="this.outerHTML='${fallback}'">`;
  }
  return (item && item.emoji) || '📦';
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function uid(prefix){ return `${prefix}${Math.random().toString(36).slice(2,8)}${Date.now().toString(36).slice(-4)}`; }
function money(v){ return `${Number(v || 0).toFixed(2).replace('.', ',')}€`; }
function user(){ return state.users.find(u => u.id === state.currentUserId) || null; }
function toast(text){ toastEl.textContent = text; toastEl.classList.add('show'); setTimeout(()=>toastEl.classList.remove('show'),2600); }
function roleHome(role){ return role === 'admin' ? 'admin' : role === 'partner' ? 'partner' : 'explore'; }
function setView(view){ state.activeView = view; save(); render(); }
function logout(){ state.currentUserId = null; state.activeView = 'explore'; save(); render(); }

function init(){ render(); }

function render(){
  const current = user();
  if(!current){ renderLogin(); return; }
  if(current.role === 'admin') renderAdmin();
  else if(current.role === 'partner') renderPartner();
  else renderUserApp();
}

function renderLogin(createMode=false){
  app.innerHTML = `
    <main class="login-page">
      <section class="login-card">
      <div class="login-title">
        <h1>${createMode ? 'Criar conta' : 'Bem-vindo à Usit'}</h1>
        <p>use it. share it.</p>
     </div>
        <form class="login-form" id="authForm">
          ${createMode ? `<div><label>Nome</label><input class="input" id="name" placeholder="O teu nome" required></div>` : ''}
          <div><label>Email</label><input class="input" id="email" type="email" placeholder="seu@email.com" required></div>
          <div><label>Palavra-passe</label><input class="input" id="password" type="password" placeholder="••••••••" required></div>
          <button class="btn primary full" type="submit">${createMode ? 'Criar conta' : 'Entrar'} →</button>
        </form>
        ${!createMode ? `
          <div class="login-form">
            <div class="divider">ou continuar com</div>
            <div class="social">
              <button class="btn ghost full" id="googleBtn"><i class="fa-brands fa-google"></i>Entrar com Google</button>
              <button class="btn ghost full" id="appleBtn"><i class="fa-brands fa-apple"></i>Entrar com Apple ID</button>
            </div>
          </div>
        ` : ''}
        <div class="login-form">
          <p class="muted" style="text-align:center;margin:0">
            ${createMode ? 'Já tem conta?' : 'Não tem conta?'}
            <button class="link-btn" id="switchMode">${createMode ? 'Entrar' : 'Criar conta'}</button>
          </p>
        </div>
      </section>
    </main>
  `;
  $('#switchMode').onclick = () => renderLogin(!createMode);
  if(!createMode){
    $('#googleBtn').onclick = () => socialLogin('Google');
    $('#appleBtn').onclick = () => socialLogin('Apple');
  }
  $('#authForm').onsubmit = (ev) => {
    ev.preventDefault();
    const email = $('#email').value.trim().toLowerCase();
    const password = $('#password').value;
    if(createMode){
      const name = $('#name').value.trim();
      if(state.users.some(u=>u.email.toLowerCase()===email)){ toast('Já existe uma conta com esse email.'); return; }
      const created = { id: uid('u'), role:'user', name, email, password, paymentMethod:'', payoutMethod:'', location:'Lisboa, Portugal' };
      state.users.push(created); state.currentUserId = created.id; state.activeView = 'explore'; save(); render(); return;
    }
    const found = state.users.find(u => u.email.toLowerCase() === email && u.password === password);
    if(!found){ toast('Credenciais inválidas.'); return; }
    state.currentUserId = found.id; state.activeView = roleHome(found.role); save(); render();
  };
}
function socialLogin(provider){
  let u = state.users.find(x => x.email === `${provider.toLowerCase()}@usit.pt`);
  if(!u){ u = { id:uid('u'), role:'user', name:`Utilizador ${provider}`, email:`${provider.toLowerCase()}@usit.pt`, password:'social', paymentMethod:'', payoutMethod:'', location:'Lisboa, Portugal' }; state.users.push(u); }
  state.currentUserId = u.id; state.activeView = 'explore'; save(); render();
}

function layout(content, active='explore'){
  const u = user();
  const nav = navItems(u.role);
  const navHtml = nav.map(n=>`<button class="${active===n.id?'active':''}" data-view="${n.id}"><span class="ico">${n.icon}</span><span>${n.label}</span></button>`).join('');
  return `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand"><div><img src="logo-usit.png" width = 150></div></div>
        <nav class="nav">${navHtml}</nav>
        <div class="sidebar-footer">
          <div class="profile-chip"><div class="avatar">${u.name.slice(0,1).toUpperCase()}</div><div style="min-width:0"><strong>${u.name}</strong><div class="tiny">${roleLabel(u.role)}</div></div></div>
          <button class="btn ghost full" id="logoutA">Sair</button>
        </div>
      </aside>
      <main class="content">
        <div class="topbar"><div class="mobile-brand"><div><img src="logo-usit.png" width = 150></div></div><h1>${pageTitle(active)}</h1><button class="btn ghost" id="logoutB">Sair</button></div>
        <section class="view">${content}</section>
      </main>
      <nav class="mobile-nav"><div class="nav">${navHtml}</div></nav>
    </div>
  `;
}
function navItems(role){
  if(role==='admin') return [
    {id:'admin', label:'Dashboard', icon:'<i class="fa-solid fa-chart-column"></i>'},
    {id:'admin-users', label:'Utilizadores', icon:'<i class="fa-solid fa-users"></i>'}
  ];
  if(role==='partner') return [
    {id:'partner', label:'Dashboard', icon:'<i class="fa-solid fa-chart-column"></i>'},
    {id:'partner-items', label:'Itens', icon:'<i class="fa-solid fa-cubes"></i>'},
    {id:'partner-billing', label:'Faturação', icon:'<i class="fa-solid fa-receipt"></i>'}

  ];
  return [
    {id:'explore', label:'Explorar', icon:'<i class="fa-solid fa-magnifying-glass"></i>'}, {id:'items', label:'Os meus itens', icon:'<i class="fa-solid fa-cubes"></i>'}, {id:'messages', label:'Mensagens', icon:'<i class="fa-regular fa-comment-dots"></i>'}, {id:'reservations', label:'Reservas', icon:'<i class="fa-regular fa-calendar-days"></i>'}, {id:'profile', label:'Perfil', icon:'<i class="fa-solid fa-user"></i>'}
  ];
}
function roleLabel(role){ return role==='admin'?'Administrador':role==='partner'?'Parceiro comercial':'Utilizador comum'; }
function pageTitle(view){
  const map = {explore:'Explorar', items:'Os meus itens', messages:'Mensagens', reservations:'Reservas', profile:'Perfil', admin:'Dashboard administrador', 'admin-users':'Gestão e dados agregados', partner:'Dashboard parceiro', 'partner-items':'Itens do parceiro', 'partner-billing':'Faturação', 'partner-add':'Adicionar item', detail:'Detalhe do item', add:'Adicionar item', payment:'Pagamento'};
  return map[view] || 'Usit';
}
function bindShell(){
  document.querySelectorAll('[data-view]').forEach(btn => btn.onclick = () => setView(btn.dataset.view));
  const a=$('#logoutA'), b=$('#logoutB'); if(a) a.onclick=logout; if(b) b.onclick=logout;
}

function renderUserApp(){
  const v = state.activeView;
  let body = '';
  if(v==='items') body = viewItems();
  else if(v==='messages') body = viewMessages();
  else if(v==='reservations') body = viewReservations();
  else if(v==='profile') body = viewProfile();
  else if(v==='detail') body = viewDetail();
  else if(v==='add') body = viewAddItem();
  else if(v==='payment') body = viewPayment();
  else body = viewExplore();
  app.innerHTML = layout(body, v === 'detail' ? 'explore' : v === 'add' ? 'items' : v === 'payment' ? 'reservations' : v);
  bindShell();
  bindUserView();
}

function viewExplore(){
  return `
    <div class="hero"><div><h2>Encontra o que precisas sem comprar.</h2><p>Pesquisa ferramentas, eletrónicos e equipamentos perto de ti. A Usit liga quem precisa de usar a quem tem objetos parados.</p></div><div class="hero-panel"><strong>${state.items.filter(i=>i.status==='Ativo').length}</strong><span>itens disponíveis agora</span></div></div>
    <div class="search-panel">
      <div class="search-row"><input class="input" id="searchText" placeholder="Procurar equipamentos..."><select id="sortFilter"><option value="near">Mais perto</option><option value="price">Preço mais baixo</option><option value="views">Mais vistos</option></select></div>
      <div class="cat-row"><button class="cat-btn active" data-cat=""><span><i class="fa-solid fa-list"></i></span><span>Todas</span></button>${categories.map(c=>`<button class="cat-btn" data-cat="${c.id}"><span>${c.icon}</span><span>${c.id}</span></button>`).join('')}</div>
    </div>
    <div class="section-title"><h2>Perto de si</h2><span class="muted" id="resultCount"></span></div>
    <div class="item-list" id="itemsList"></div>
  `;
}
function renderItemsList(){
  const text = ($('#searchText')?.value || '').trim().toLowerCase();
  const cat = $('#categoryFilter')?.value || document.querySelector('.cat-btn.active')?.dataset.cat || '';
  const sort = $('#sortFilter')?.value || 'near';
  let items = state.items.filter(i => i.status !== 'Não disponível');
  if(text) items = items.filter(i => `${i.title} ${i.category} ${i.description} ${i.location}`.toLowerCase().includes(text));
  if(cat) items = items.filter(i => i.category === cat);
  if(sort === 'price') items.sort((a,b)=>a.price-b.price);
  else if(sort === 'views') items.sort((a,b)=>b.views-a.views);
  else items.sort((a,b)=>a.distance-b.distance);
  $('#resultCount').textContent = `${items.length} resultado${items.length===1?'':'s'}`;
  $('#itemsList').innerHTML = items.map(itemCard).join('') || `<div class="card"><h3>Sem resultados</h3><p>Altera a pesquisa ou escolhe outra categoria.</p></div>`;
  bindDetailButtons();
}
function openItemDetail(itemId){
  const item = state.items.find(i => i.id === itemId);
  if(!item){ toast('Não foi possível abrir os detalhes do anúncio.'); return; }
  state.selectedItemId = item.id;
  item.views = Number(item.views || 0) + 1;
  state.activeView = 'detail';
  save();
  render();
}
function bindDetailButtons(){
  document.querySelectorAll('[data-detail]').forEach(b => {
    b.onclick = () => openItemDetail(b.dataset.detail);
  });
}
function itemCard(i){
  return `<article class="item-card"><div class="item-img">${itemMedia(i)}</div><div class="item-info"><h3>${i.title}</h3><p>📍 ${i.location} · ${i.distance} km</p><p class="price">${money(i.price)}/dia</p><div class="status-line"><span class="badge ${i.verified?'success':'gray'}">${i.verified?'Verificado':'Por verificar'}</span><span class="badge ${i.status==='Ativo'?'success':'warn'}">${i.status}</span></div></div><div class="item-actions"><button class="btn secondary" data-detail="${i.id}">Ver detalhes</button></div></article>`;
}

function viewDetail(){
  const i = state.items.find(x=>x.id===state.selectedItemId) || state.items[0];
  state.selectedItemId = i.id;
  const min = new Date().toISOString().slice(0,10);
  const isOwnItem = i.ownerId === user()?.id;
  return `
    <button class="btn ghost" data-view="explore">← Voltar</button>
    <div class="detail-layout">
      <div class="card"><div class="big-visual">${itemMedia(i)}</div><h2>${i.title}</h2><p>${i.description}</p><div class="status-line"><span class="badge">${i.category}</span><span class="badge ${i.verified?'success':'gray'}">${i.verified?'Verificado':'Por verificar'}</span><span class="badge ${i.status==='Ativo'?'success':'warn'}">${i.status}</span></div><div class="section-title"><h2>Condições</h2></div><p>${i.conditions}</p><p class="muted">Proprietário: ${i.ownerName} · ${i.location}</p><div class="status-line"><button class="btn ghost" data-chat-owner="${i.ownerId}" ${isOwnItem?'disabled':''}><i class="fa-regular fa-comment-dots"></i> Falar com proprietário</button></div></div>
      <aside class="card"><h3>Solicitar aluguer</h3><div class="summary-box"><div class="summary-row"><span>Preço diário</span><strong>${money(i.price)}</strong></div><div class="summary-row"><span>Caução</span><strong>${money(i.deposit)}</strong></div><div class="summary-row"><span>Comissão Usit</span><strong>2%</strong></div></div><form id="requestForm" class="login-form"><div><label>Data de início</label><input class="input" type="date" id="startDate" min="${min}" required></div><div><label>Data de fim</label><input class="input" type="date" id="endDate" min="${min}" required></div><div class="summary-box" id="costBox"><div class="summary-row"><span>Total estimado</span><strong>Seleciona datas</strong></div></div><button class="btn primary full" ${i.status!=='Ativo'?'disabled':''}>Confirmar pedido</button></form></aside>
    </div>
  `;
}
function calcDays(start,end){ const a=new Date(start), b=new Date(end); if(!start || !end || b<a) return 0; return Math.max(1, Math.round((b-a)/(1000*60*60*24))+1); }
function calcTotal(item, days){ return item.price*days + item.deposit + (item.price*days*0.02); }

function viewItems(){
  const u = user();
  const own = state.items.filter(i=>i.ownerId===u.id);
  const incoming = state.reservations.filter(r=>r.ownerId===u.id);
  return `
    <div class="section-title"><h2>Itens publicados</h2><button class="btn primary" data-view="add">+ Adicionar item</button></div>
    <div class="grid two">${own.map(i=>`<div class="card"><div class="item-card" style="box-shadow:none;border:none;padding:0"><div class="item-img">${itemMedia(i)}</div><div class="item-info"><h3>${i.title}</h3><p class="price">${money(i.price)}/dia</p><span class="badge ${i.status==='Ativo'?'success':i.status==='Alugado'?'warn':'gray'}">${i.status}</span></div></div><div class="status-line"><button class="btn ghost" data-toggle-status="${i.id}">Alternar estado</button><button class="btn ghost" data-edit-item="${i.id}">Editar</button></div></div>`).join('') || `<div class="card"><h3>Ainda não tens itens</h3><p>Publica o teu primeiro equipamento para começar.</p></div>`}</div>
    <div class="section-title"><h2>Pedidos recebidos</h2></div>
    <div class="item-list">${incoming.map(reservationCard).join('') || `<div class="card"><p>Sem pedidos recebidos.</p></div>`}</div>
  `;
}
function reservationCard(r){
  const item = state.items.find(i=>i.id===r.itemId);
  const other = state.users.find(u=>u.id === (r.ownerId===user().id ? r.locatarioId : r.ownerId));
  return `<div class="card"><div class="section-title"><h3>${r.itemTitle}</h3><span class="badge ${r.state==='Confirmada'?'success':r.state==='Pendente'?'warn':r.state==='Recusada'?'danger':'gray'}">${r.state}</span></div><p class="muted">${r.start} a ${r.end} · ${r.days} dia(s) · ${money(r.total)}</p><p class="muted">Interveniente: ${other?.name || 'Utilizador'}</p><div class="status-line">${r.ownerId===user().id && r.state==='Pendente'?`<button class="btn success" data-accept="${r.id}">Aceitar</button><button class="btn danger" data-reject="${r.id}">Recusar</button>`:''}${r.locatarioId===user().id && r.state==='Confirmada' && !r.paid?`<button class="btn primary" data-pay="${r.id}">Efetuar pagamento</button>`:''}${r.locatarioId===user().id && r.paid && !r.received?`<button class="btn success" data-received="${r.id}">Confirmar receção</button>`:''}<button class="btn ghost" data-open-chat="${other?.id || ''}">Mensagem</button></div></div>`;
}

function viewAddItem(){
  const editingItem = state.editItemId ? state.items.find(i => i.id === state.editItemId && i.ownerId === user()?.id) : null;
  const draft = editingItem || state.draftItem || {};
  return `
    <button class="btn ghost" data-cancel-edit>← Voltar</button>
    <div class="card wizard"><div class="section-title"><h2>${editingItem ? 'Editar item' : 'Adicionar item'}</h2><button class="btn ghost" id="saveDraft">${editingItem ? 'Cancelar edição' : 'Guardar rascunho'}</button></div><div class="progress"><span style="width:100%"></span></div><div class="steps"><span>1. Dados</span><span>2. Condições</span><span>3. Publicar</span></div><form id="itemForm" class="login-form"><div class="form-grid"><div class="field"><label>Nome do equipamento</label><input class="input" id="itemTitle" value="${draft.title||''}" placeholder="Ex: Berbequim Elétrico Bosch" required></div><div class="field"><label>Categoria</label><select id="itemCategory" required><option value="">Selecionar categoria</option>${categories.map(c=>`<option ${draft.category===c.id?'selected':''}>${c.id}</option>`).join('')}</select></div></div><div><label>Fotografias</label><div class="upload-box">Carregar fotografia, simulado no protótipo</div></div><div><label>Descrição</label><textarea id="itemDesc" required placeholder="Descreve o estado e características do equipamento">${draft.description||''}</textarea></div><div class="form-grid"><div><label>Preço por dia</label><input class="input" id="itemPrice" type="number" min="1" value="${draft.price||''}" required></div><div><label>Caução</label><input class="input" id="itemDeposit" type="number" min="0" value="${draft.deposit||''}" required></div></div><div><label>Condições</label><textarea id="itemConditions" required>${draft.conditions||''}</textarea></div><button class="btn primary full">${editingItem ? 'Guardar alterações' : 'Publicar anúncio'}</button></form></div>
  `;
}

function viewReservations(){
  const u = user();
  const mine = state.reservations.filter(r=>r.locatarioId===u.id || r.ownerId===u.id);
  return `<div class="section-title"><h2>Reservas</h2></div><div class="item-list">${mine.map(reservationCard).join('') || `<div class="card"><p>Ainda não tens reservas.</p></div>`}</div>`;
}

function viewPayment(){
  const u = user();
  const r = state.reservations.find(x => x.id === state.selectedPaymentReservationId && x.locatarioId === u.id);
  if(!r){
    return `
      <button class="btn ghost" data-view="reservations">← Voltar</button>
      <div class="card"><h3>Pagamento indisponível</h3><p class="muted">Não foi possível encontrar a reserva selecionada.</p></div>
    `;
  }
  const item = state.items.find(i => i.id === r.itemId);
  const owner = state.users.find(x => x.id === r.ownerId);
  const base = item ? item.price * r.days : Math.max(0, r.total);
  const deposit = item ? item.deposit : 0;
  const commission = item ? base * 0.02 : 0;
  const canPay = r.state === 'Confirmada' && !r.paid;
  return `
    <button class="btn ghost" data-view="reservations">← Voltar às reservas</button>
    <div class="grid two">
      <div class="card">
        <h3>Resumo do aluguer</h3>
        <div class="summary-box">
          <div class="summary-row"><span>Item</span><strong>${r.itemTitle}</strong></div>
          <div class="summary-row"><span>Proprietário</span><strong>${owner?.name || 'Utilizador'}</strong></div>
          <div class="summary-row"><span>Período</span><strong>${r.start} a ${r.end}</strong></div>
          <div class="summary-row"><span>Duração</span><strong>${r.days} dia(s)</strong></div>
          <div class="summary-row"><span>Estado</span><strong>${r.state}</strong></div>
        </div>
      </div>
      <div class="card">
        <h3>Efetuar pagamento</h3>
        <div class="summary-box">
          <div class="summary-row"><span>Preço do aluguer</span><strong>${money(base)}</strong></div>
          <div class="summary-row"><span>Caução</span><strong>${money(deposit)}</strong></div>
          <div class="summary-row"><span>Comissão Usit</span><strong>${money(commission)}</strong></div>
          <div class="summary-row"><span>Total</span><strong>${money(r.total)}</strong></div>
        </div>
        ${u.paymentMethod ? `
          <p class="muted">Método de pagamento: <strong>${u.paymentMethod}</strong></p>
          <form id="paymentCheckoutForm" class="login-form">
            <button class="btn primary full" ${canPay ? '' : 'disabled'}>Confirmar pagamento</button>
          </form>
          <button class="btn ghost full" data-payment-fail ${canPay ? '' : 'disabled'}>Simular pagamento recusado</button>
        ` : `
          <p class="muted">Para concluir o pagamento, adiciona primeiro um método de pagamento no perfil.</p>
          <button class="btn primary full" data-view="profile">Adicionar método de pagamento</button>
        `}
      </div>
    </div>
  `;
}

function viewMessages(){
  const u = user();
  const peers = state.users.filter(x => x.id!==u.id && (x.role==='user' || x.role==='partner'));
  const selected = state.selectedThreadUserId && peers.find(p=>p.id===state.selectedThreadUserId) ? state.selectedThreadUserId : peers[0]?.id;
  state.selectedThreadUserId = selected;
  const msgs = state.messages.filter(m => (m.from===u.id && m.to===selected) || (m.from===selected && m.to===u.id));
  return `
    <div class="chat-layout"><div class="card"><h3>Conversas</h3><div class="thread-list">${peers.map(p=>`<button class="thread ${p.id===selected?'active':''}" data-thread="${p.id}"><strong>${p.name}</strong><div class="tiny">${p.location||''}</div></button>`).join('')}</div></div><div class="card"><h3>${peers.find(p=>p.id===selected)?.name || 'Conversa'}</h3><div class="messages" id="messagesBox">${msgs.map(m=>`<div class="bubble ${m.from===u.id?'me':''}">${m.text}<div class="tiny">${m.date}</div></div>`).join('') || `<p class="muted">Sem mensagens.</p>`}</div><form id="sendForm" class="send-row"><input class="input" id="msgText" placeholder="Escrever mensagem..."><button class="btn primary">Enviar</button></form></div></div>
  `;
}
function viewProfile(){
  const u = user();
  return `
    <div class="grid two"><div class="card"><h3>Perfil</h3><form id="profileForm" class="login-form"><div><label>Nome</label><input class="input" id="profileName" value="${u.name}"></div><div><label>Email</label><input class="input" id="profileEmail" value="${u.email}"></div><div><label>Localização</label><input class="input" id="profileLocation" value="${u.location||''}"></div><button class="btn primary">Guardar perfil</button></form></div><div class="card"><h3>Pagamentos e recebimentos</h3><form id="paymentForm" class="login-form"><div><label>Método de pagamento</label><input class="input" id="paymentMethod" value="${u.paymentMethod||''}" placeholder="Ex: Cartão terminado em 4242"></div><div><label>Método de recebimento</label><input class="input" id="payoutMethod" value="${u.payoutMethod||''}" placeholder="Ex: IBAN terminado em 9031"></div><button class="btn primary">Guardar métodos</button></form></div></div>
    <div class="card"><h3>Histórico de transações</h3><div class="table-wrap"><table class="table"><thead><tr><th>Reserva</th><th>Estado</th><th>Valor</th><th>Pagamento</th></tr></thead><tbody>${state.reservations.filter(r=>r.locatarioId===u.id||r.ownerId===u.id).map(r=>`<tr><td>${r.itemTitle}</td><td>${r.state}</td><td>${money(r.total)}</td><td>${r.paid?'Pago':'Pendente'}</td></tr>`).join('') || `<tr><td colspan="4">Sem transações.</td></tr>`}</tbody></table></div></div>
  `;
}

function bindUserView(){
  if($('#searchText')){
    renderItemsList();
    $('#searchText').oninput = renderItemsList;
    $('#sortFilter').onchange = renderItemsList;
    document.querySelectorAll('.cat-btn').forEach(b=>b.onclick=()=>{document.querySelectorAll('.cat-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderItemsList();});
  }
  bindDetailButtons();
  document.querySelectorAll('[data-chat-owner]').forEach(b=>b.onclick=()=>openChatWithUser(b.dataset.chatOwner));
  const rf=$('#requestForm'); if(rf){ const update=()=>{ const item=state.items.find(i=>i.id===state.selectedItemId); const days=calcDays($('#startDate').value,$('#endDate').value); $('#costBox').innerHTML = days ? `<div class="summary-row"><span>${days} dia(s)</span><strong>${money(calcTotal(item,days))}</strong></div><div class="tiny">Inclui caução e comissão.</div>` : `<div class="summary-row"><span>Total estimado</span><strong>Seleciona datas</strong></div>`;}; $('#startDate').onchange=update; $('#endDate').onchange=update; rf.onsubmit=(e)=>{e.preventDefault(); const item=state.items.find(i=>i.id===state.selectedItemId); const days=calcDays($('#startDate').value,$('#endDate').value); if(!days){toast('Escolhe datas válidas.'); return;} const r={id:uid('r'), itemId:item.id, itemTitle:item.title, ownerId:item.ownerId, locatarioId:user().id, start:$('#startDate').value, end:$('#endDate').value, days, total:calcTotal(item,days), state:'Pendente', paid:false, received:false, createdAt:new Date().toISOString().slice(0,10)}; state.reservations.push(r); save(); toast('Pedido enviado ao proprietário.'); setView('reservations');}; }
  document.querySelectorAll('[data-accept]').forEach(b=>b.onclick=()=>{const r=state.reservations.find(x=>x.id===b.dataset.accept); r.state='Confirmada'; const item=state.items.find(i=>i.id===r.itemId); if(item) item.status='Alugado'; save(); toast('Pedido aceite.'); render();});
  document.querySelectorAll('[data-reject]').forEach(b=>b.onclick=()=>{const r=state.reservations.find(x=>x.id===b.dataset.reject); r.state='Recusada'; save(); toast('Pedido recusado.'); render();});
  document.querySelectorAll('[data-pay]').forEach(b=>b.onclick=()=>startPayment(b.dataset.pay));
  const checkout=$('#paymentCheckoutForm'); if(checkout){ checkout.onsubmit=(e)=>{e.preventDefault(); completePayment();}; }
  document.querySelectorAll('[data-payment-fail]').forEach(b=>b.onclick=()=>{toast('Pagamento recusado pelo serviço de pagamentos.'); setView('reservations');});
  document.querySelectorAll('[data-received]').forEach(b=>b.onclick=()=>{const r=state.reservations.find(x=>x.id===b.dataset.received); r.received=true; r.state='Concluída'; save(); toast('Receção confirmada.'); render();});
  document.querySelectorAll('[data-open-chat]').forEach(b=>b.onclick=()=>openChatWithUser(b.dataset.openChat));
  document.querySelectorAll('[data-toggle-status]').forEach(b=>b.onclick=()=>{const it=state.items.find(i=>i.id===b.dataset.toggleStatus); it.status = it.status==='Ativo' ? 'Não disponível' : 'Ativo'; save(); render();});
  document.querySelectorAll('[data-edit-item]').forEach(b=>b.onclick=()=>startEditItem(b.dataset.editItem));
  document.querySelectorAll('[data-cancel-edit]').forEach(b=>b.onclick=()=>{state.editItemId=null; save(); setView(user()?.role === 'partner' ? 'partner-items' : 'items');});
  const itemForm=$('#itemForm'); if(itemForm){ $('#saveDraft').onclick=()=>{ if(state.editItemId){ state.editItemId=null; save(); setView(user()?.role === 'partner' ? 'partner-items' : 'items'); return; } state.draftItem = readItemForm(); save(); toast('Rascunho guardado.');}; itemForm.onsubmit=(e)=>{e.preventDefault(); const data=readItemForm(); if(!data.title || !data.category || !data.description || data.price<=0){ toast('Preenche os dados obrigatórios.'); return; } if(state.editItemId){ const item = state.items.find(i=>i.id===state.editItemId && i.ownerId===user().id); if(!item){ toast('Não foi possível editar este item.'); state.editItemId=null; save(); setView('items'); return; } Object.assign(item,{title:data.title, category:data.category, description:data.description, price:data.price, deposit:data.deposit, conditions:data.conditions, emoji:iconFor(data.category)}); state.editItemId=null; save(); toast('Alterações guardadas.'); setView(user()?.role === 'partner' ? 'partner-items' : 'items'); return; } state.items.push({id:uid('i'), ownerId:user().id, ownerName:user().company || user().name, title:data.title, category:data.category, description:data.description, location:user().location||'Lisboa, Portugal', distance:0.5, price:data.price, deposit:data.deposit, status:'Ativo', verified:user().role === 'partner', emoji:iconFor(data.category), views:0, partner:user().role === 'partner', conditions:data.conditions, available:[]}); state.draftItem=null; save(); toast('Anúncio publicado.'); setView(user()?.role === 'partner' ? 'partner-items' : 'items');}; }
  const pf=$('#profileForm'); if(pf){ pf.onsubmit=(e)=>{e.preventDefault(); const u=user(); u.name=$('#profileName').value; u.email=$('#profileEmail').value; u.location=$('#profileLocation').value; save(); toast('Perfil guardado.'); render();}; }
  const payf=$('#paymentForm'); if(payf){ payf.onsubmit=(e)=>{e.preventDefault(); const u=user(); u.paymentMethod=$('#paymentMethod').value; u.payoutMethod=$('#payoutMethod').value; save(); toast('Métodos guardados.'); render();}; }
  document.querySelectorAll('[data-thread]').forEach(b=>b.onclick=()=>{state.selectedThreadUserId=b.dataset.thread; save(); render();});
  const sf=$('#sendForm'); if(sf){ sf.onsubmit=(e)=>{e.preventDefault(); const txt=$('#msgText').value.trim(); if(!txt) return; state.messages.push({id:uid('m'), from:user().id, to:state.selectedThreadUserId, text:txt, date:new Date().toLocaleString('pt-PT',{dateStyle:'short',timeStyle:'short'})}); save(); render();}; }
}


function startPayment(reservationId){
  const r = state.reservations.find(x => x.id === reservationId && x.locatarioId === user()?.id);
  if(!r){ toast('Não foi possível abrir o pagamento.'); return; }
  if(r.paid){ toast('Esta reserva já está paga.'); setView('reservations'); return; }
  if(r.state !== 'Confirmada'){ toast('O pagamento só fica disponível após aceitação do proprietário.'); setView('reservations'); return; }
  if(!user().paymentMethod){ toast('Adiciona um método de pagamento no perfil.'); setView('profile'); return; }
  state.selectedPaymentReservationId = reservationId;
  state.activeView = 'payment';
  save();
  render();
}

function completePayment(){
  const r = state.reservations.find(x => x.id === state.selectedPaymentReservationId && x.locatarioId === user()?.id);
  if(!r){ toast('Não foi possível concluir o pagamento.'); setView('reservations'); return; }
  if(r.paid){ toast('Esta reserva já está paga.'); setView('reservations'); return; }
  r.paid = true;
  r.state = 'Confirmada';
  r.paymentMethod = user().paymentMethod;
  r.paymentDate = new Date().toISOString().slice(0,10);
  const item = state.items.find(i => i.id === r.itemId);
  if(item) item.status = 'Alugado';
  save();
  toast('Pagamento registado. Reserva confirmada.');
  setView('reservations');
}

function openChatWithUser(userId){
  if(!userId){ toast('Não foi possível abrir a conversa.'); return; }
  if(userId === user()?.id){ toast('Não podes abrir conversa contigo próprio.'); return; }
  state.selectedThreadUserId = userId;
  state.activeView = 'messages';
  save();
  render();
}

function startEditItem(itemId){
  const item = state.items.find(i => i.id === itemId && i.ownerId === user()?.id);
  if(!item){ toast('Não foi possível editar este item.'); return; }
  state.editItemId = itemId;
  state.draftItem = null;
  state.activeView = user()?.role === 'partner' ? 'partner-add' : 'add';
  save();
  render();
}

function readItemForm(){return { title:$('#itemTitle').value.trim(), category:$('#itemCategory').value, description:$('#itemDesc').value.trim(), price:Number($('#itemPrice').value||0), deposit:Number($('#itemDeposit').value||0), conditions:$('#itemConditions').value.trim()};}
function iconFor(cat){ return categories.find(c=>c.id===cat)?.icon || '📦'; }

function renderAdmin(){
  const v = state.activeView;
  const users = state.users.filter(u=>u.role==='user');
  const partners = state.users.filter(u=>u.role==='partner');
  const paidReservations = state.reservations.filter(r=>r.paid);
  const totalPaid = paidReservations.reduce((s,r)=>s+r.total,0);
  const activeUsers = users.length;
  const revenue = totalPaid * 0.02;
  const totalDeposit = paidReservations.reduce((s,r)=>{
    const item = state.items.find(i=>i.id===r.itemId);
    return s + ((item && item.deposit) || 0);
  },0);
  const totalViews = state.items.reduce((s,i)=>s+(i.views||0),0);
  const owners = new Set(state.items.map(i=>i.ownerId)).size;
  const avgReservation = state.reservations.length ? state.reservations.reduce((s,r)=>s+r.total,0) / state.reservations.length : 0;
  const byCat = categories.map(c=>({cat:c.id, value:state.items.filter(i=>i.category===c.id).reduce((s,i)=>s+i.views,0)}));
  const byRevenue = categories.map(c=>({
    cat:c.id,
    value:state.reservations.filter(r=>{
      const item = state.items.find(i=>i.id===r.itemId);
      return r.paid && item && item.category===c.id;
    }).reduce((s,r)=>s+r.total,0)
  }));
  const userRows = users.map(u=>{
    const ownItems = state.items.filter(i=>i.ownerId===u.id).length;
    const rentals = state.reservations.filter(r=>r.locatarioId===u.id).length;
    const income = state.reservations.filter(r=>r.ownerId===u.id && r.paid).reduce((s,r)=>s+r.total,0);
    const spending = state.reservations.filter(r=>r.locatarioId===u.id && r.paid).reduce((s,r)=>s+r.total,0);
    return `<tr><td>${u.name}</td><td>${u.location || 'Sem localidade'}</td><td>${ownItems}</td><td>${rentals}</td><td>${money(income)}</td><td>${money(spending)}</td><td>${u.paymentMethod ? 'Sim' : 'Não'}</td></tr>`;
  }).join('');
  let body = '';
  if(v==='admin-users') body = `
    <div class="grid four">
      <div class="stat-card"><span>Utilizadores comuns</span><strong>${activeUsers}</strong></div>
      <div class="stat-card"><span>Parceiros</span><strong>${partners.length}</strong></div>
      <div class="stat-card"><span>Proprietários ativos</span><strong>${owners}</strong></div>
      <div class="stat-card"><span>Reservas totais</span><strong>${state.reservations.length}</strong></div>
    </div>
    <div class="grid two">
      <div class="card"><h3>Resumo agregado</h3><div class="table-wrap"><table class="table"><thead><tr><th>Indicador</th><th>Valor</th><th>Nota</th></tr></thead><tbody><tr><td>Utilizadores comuns</td><td>${activeUsers}</td><td>Contas com acesso à aplicação.</td></tr><tr><td>Proprietários ativos</td><td>${owners}</td><td>Baseado em itens publicados.</td></tr><tr><td>Reservas pagas</td><td>${paidReservations.length}</td><td>Reservas com pagamento validado.</td></tr><tr><td>Visualizações totais</td><td>${totalViews}</td><td>Soma de visualizações dos anúncios.</td></tr></tbody></table></div></div>
      <div class="card"><h3>Distribuição de reservas</h3><div class="chart">${barChart(['Pendente','Confirmada','Concluída','Recusada'].map(s=>({cat:s,value:state.reservations.filter(r=>r.state===s).length})))}</div></div>
    </div>
    <div class="card"><h3>Utilizadores da plataforma</h3><div class="table-wrap"><table class="table"><thead><tr><th>Nome</th><th>Localidade</th><th>Itens</th><th>Reservas</th><th>Ganhos</th><th>Pagamentos</th><th>Método pag.</th></tr></thead><tbody>${userRows || `<tr><td colspan="7">Sem utilizadores.</td></tr>`}</tbody></table></div></div>`;
  else body = `
    <div class="hero"><div><h2>Painel de controlo da Usit</h2><p>Visão global para acompanhar transações, utilizadores ativos, anúncios, pagamentos e receita por categoria.</p></div><div class="hero-panel"><strong>${money(revenue)}</strong><span>receita estimada da comissão</span></div></div>
    <div class="grid four"><div class="stat-card"><span>Transações</span><strong>${state.reservations.length}</strong></div><div class="stat-card"><span>Utilizadores ativos</span><strong>${activeUsers}</strong></div><div class="stat-card"><span>Receita Usit</span><strong>${money(revenue)}</strong></div><div class="stat-card"><span>Anúncios</span><strong>${state.items.length}</strong></div></div>
    <div class="grid four"><div class="stat-card"><span>Volume pago</span><strong>${money(totalPaid)}</strong></div><div class="stat-card"><span>Cauções associadas</span><strong>${money(totalDeposit)}</strong></div><div class="stat-card"><span>Visualizações</span><strong>${totalViews}</strong></div><div class="stat-card"><span>Valor médio</span><strong>${money(avgReservation)}</strong></div></div>
    <div class="grid two"><div class="card"><h3>Interesse por categoria</h3><div class="chart">${barChart(byCat)}</div></div><div class="card"><h3>Receita por categoria</h3><div class="chart">${barChart(byRevenue)}</div></div></div>
    <div class="grid two"><div class="card"><h3>Estado das reservas</h3><div class="chart">${barChart(['Pendente','Confirmada','Concluída','Recusada'].map(s=>({cat:s,value:state.reservations.filter(r=>r.state===s).length})))}</div></div><div class="card"><h3>Controlo de acesso e privacidade</h3><p>O acesso ao painel usa o mesmo formulário de login, sem botão público. A função do utilizador define a área apresentada.</p><p>Os dados de parceiros são agregados e separados por conta.</p><span class="badge success">Acesso reservado</span></div></div>`;
  app.innerHTML = layout(body, v.startsWith('admin')?v:'admin'); bindShell();
}
function renderPartner(){
  const v=state.activeView; const u=user(); const items=state.items.filter(i=>i.ownerId===u.id); const res=state.reservations.filter(r=>r.ownerId===u.id); const paid=res.filter(r=>r.paid).reduce((s,r)=>s+r.total,0); const views=items.reduce((s,i)=>s+(i.views||0),0); const pending=res.filter(r=>r.state==='Pendente').length; const confirmed=res.filter(r=>r.state==='Confirmada').length; const completed=res.filter(r=>r.state==='Concluída').length; const unpaid=res.filter(r=>!r.paid).reduce((s,r)=>s+r.total,0); let body='';
  if(v==='partner-add') body = viewAddItem();
  else if(v==='partner-items') body = `
    <div class="section-title"><h2>Inventário do parceiro</h2><button class="btn primary" data-view="partner-add">+ Adicionar item</button></div>
    <div class="grid two">${items.map(i=>{
      const itemRes = res.filter(r=>r.itemId===i.id);
      return `<div class="card"><div class="item-card" style="box-shadow:none;border:none;padding:0"><div class="item-img">${itemMedia(i)}</div><div class="item-info"><h3>${i.title}</h3><p>${i.views} visualizações · ${itemRes.length} reserva(s)</p><p class="price">${money(i.price)}/dia</p><span class="badge ${i.status==='Ativo'?'success':i.status==='Alugado'?'warn':'gray'}">${i.status}</span></div></div><div class="status-line"><button class="btn ghost" data-toggle-status="${i.id}">Alternar estado</button><button class="btn ghost" data-edit-item="${i.id}">Editar</button></div></div>`;
    }).join('') || `<div class="card"><h3>Sem itens publicados</h3><p>Adiciona o primeiro item para começar a acompanhar visualizações e reservas.</p></div>`}</div>`;
  else if(v==='partner-billing') body = `
    <div class="grid four"><div class="stat-card"><span>Valor pago</span><strong>${money(paid)}</strong></div><div class="stat-card"><span>Por receber</span><strong>${money(unpaid)}</strong></div><div class="stat-card"><span>Reservas</span><strong>${res.length}</strong></div><div class="stat-card"><span>Taxa de conversão</span><strong>${views ? Math.round((res.length/views)*100) : 0}%</strong></div></div>
    <div class="card"><h3>Faturação e reservas</h3><div class="table-wrap"><table class="table"><thead><tr><th>Reserva</th><th>Datas</th><th>Estado</th><th>Valor</th><th>Pago</th><th>Locatário</th></tr></thead><tbody>${res.map(r=>`<tr><td>${r.itemTitle}</td><td>${r.start} a ${r.end}</td><td>${r.state}</td><td>${money(r.total)}</td><td>${r.paid?'Sim':'Não'}</td><td>Utilizador #${String(r.locatarioId).replace(/\D/g,'') || '1'}</td></tr>`).join('') || `<tr><td colspan="6">Sem reservas.</td></tr>`}</tbody></table></div></div>
    <div class="grid two"><div class="card"><h3>Valor por item</h3><div class="chart">${barChart(items.map(i=>({cat:i.title,value:res.filter(r=>r.itemId===i.id && r.paid).reduce((s,r)=>s+r.total,0)})))}</div></div><div class="card"><h3>Estado das reservas</h3><div class="chart">${barChart(['Pendente','Confirmada','Concluída','Recusada'].map(s=>({cat:s,value:res.filter(r=>r.state===s).length})))}</div></div></div>`;
  else body = `
    <div class="hero"><div><h2>Área do parceiro</h2><p>Consulta desempenho dos anúncios, reservas, visualizações e ganhos associados ao teu inventário.</p></div><div class="hero-panel"><strong>${money(paid)}</strong><span>volume associado ao parceiro</span></div></div>
    <div class="grid four"><div class="stat-card"><span>Itens</span><strong>${items.length}</strong></div><div class="stat-card"><span>Visualizações</span><strong>${views}</strong></div><div class="stat-card"><span>Reservas</span><strong>${res.length}</strong></div><div class="stat-card"><span>Valor pago</span><strong>${money(paid)}</strong></div></div>
    <div class="grid four"><div class="stat-card"><span>Pendentes</span><strong>${pending}</strong></div><div class="stat-card"><span>Confirmadas</span><strong>${confirmed}</strong></div><div class="stat-card"><span>Concluídas</span><strong>${completed}</strong></div><div class="stat-card"><span>Por receber</span><strong>${money(unpaid)}</strong></div></div>
    <div class="grid two"><div class="card"><h3>Desempenho por item</h3><div class="chart">${barChart(items.map(i=>({cat:i.title,value:i.views})))}</div></div><div class="card"><h3>Reservas por item</h3><div class="chart">${barChart(items.map(i=>({cat:i.title,value:res.filter(r=>r.itemId===i.id).length})))}</div></div></div>`;
  app.innerHTML = layout(body, v==='partner-add' ? 'partner-items' : v.startsWith('partner')?v:'partner'); bindShell(); bindUserView();
}
function barChart(rows){ const max = Math.max(1,...rows.map(r=>r.value)); return rows.map(r=>`<div class="bar-row"><span class="tiny">${r.cat}</span><div class="bar"><span style="width:${Math.max(4,(r.value/max)*100)}%"></span></div><strong>${r.value}</strong></div>`).join(''); }

init();
