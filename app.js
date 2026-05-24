const STORAGE_KEY = 'usit_final_plain_v1';
const $ = (sel) => document.querySelector(sel);
const app = $('#app');
const toastEl = $('#toast');

const categories = [
  { id:'Ferramentas', icon:'🔧' },
  { id:'Eletrónicos', icon:'📱' },
  { id:'Casa', icon:'🏠' },
  { id:'Eventos', icon:'🎉' },
  { id:'Fotografia', icon:'📷' },
  { id:'Desporto', icon:'🚲' }
];

const demo = {
  users: [
    { id:'u1', role:'user', name:'Rui Santos', email:'rui@usit.pt', password:'usit123', paymentMethod:'Cartão terminado em 4242', payoutMethod:'', location:'Lisboa, Portugal' },
    { id:'u2', role:'user', name:'Carla Costa', email:'carla@usit.pt', password:'usit123', paymentMethod:'', payoutMethod:'IBAN terminado em 9031', location:'Lisboa, Benfica' },
    { id:'admin1', role:'admin', name:'Administrador Usit', email:'admin@usit.pt', password:'admin123', location:'Backoffice' },
    { id:'partner1', role:'partner', name:'Parceiro Comercial', email:'parceiro@usit.pt', password:'parceiro123', company:'ToolHub Lisboa', location:'Lisboa, Alvalade' }
  ],
  items: [
    { id:'i1', ownerId:'u2', ownerName:'Carla Costa', title:'Berbequim Elétrico Bosch', category:'Ferramentas', description:'Berbequim compacto para pequenas reparações domésticas. Inclui mala e brocas básicas.', location:'Lisboa, Benfica', distance:0.8, price:5, deposit:25, status:'Ativo', verified:true, emoji:'🔩', views:46, partner:false, conditions:'Entregar limpo e sem danos visíveis.', available:['2026-05-22','2026-05-23','2026-05-24','2026-05-25','2026-05-28'] },
    { id:'i2', ownerId:'partner1', ownerName:'ToolHub Lisboa', title:'Máquina de Lavar Roupa', category:'Casa', description:'Máquina para aluguer pontual em mudanças, eventos ou situações temporárias.', location:'Lisboa, Alvalade', distance:1.2, price:15, deposit:80, status:'Alugado', verified:false, emoji:'🧺', views:68, partner:true, conditions:'Recolha em loja. Transporte a cargo do locatário.', available:['2026-05-26','2026-05-27','2026-05-29'] },
    { id:'i3', ownerId:'u2', ownerName:'Carla Costa', title:'Escada Extensível', category:'Ferramentas', description:'Escada extensível para trabalhos de pintura e pequenas reparações.', location:'Lisboa, Benfica', distance:0.9, price:7, deposit:30, status:'Não disponível', verified:false, emoji:'🪜', views:21, partner:false, conditions:'Usar em piso estável.', available:['2026-05-30'] },
    { id:'i4', ownerId:'u2', ownerName:'Carla Costa', title:'Bicicleta de Montanha', category:'Desporto', description:'Bicicleta para trilhos leves e passeios urbanos.', location:'Lisboa, Parque das Nações', distance:2.5, price:8, deposit:45, status:'Ativo', verified:true, emoji:'🚲', views:39, partner:false, conditions:'Devolver com pneus cheios.', available:['2026-05-22','2026-05-23','2026-05-24','2026-05-26'] },
    { id:'i5', ownerId:'partner1', ownerName:'ToolHub Lisboa', title:'Projetor Full HD', category:'Eletrónicos', description:'Projetor Full HD para apresentações, aulas e eventos pequenos.', location:'Lisboa, Saldanha', distance:1.8, price:12, deposit:60, status:'Ativo', verified:false, emoji:'📽️', views:88, partner:true, conditions:'Inclui cabo HDMI. Não usar no exterior com chuva.', available:['2026-05-22','2026-05-25','2026-05-28','2026-05-29'] }
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
    if(raw) return JSON.parse(raw);
  }catch(e){ console.warn(e); }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  return structuredClone(demo);
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
        <div class="brand"><div class="logo">U</div><div>Usit</div></div>
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
              <button class="btn ghost full" id="googleBtn">G Entrar com Google</button>
              <button class="btn ghost full" id="appleBtn"> Entrar com Apple ID</button>
            </div>
          </div>
        ` : ''}
        <div class="login-form">
          <p class="muted" style="text-align:center;margin:0">
            ${createMode ? 'Já tem conta?' : 'Não tem conta?'}
            <button class="link-btn" id="switchMode">${createMode ? 'Entrar' : 'Criar conta'}</button>
          </p>
          <div class="login-hint">
            Acesso normal: rui@usit.pt ou carla@usit.pt, palavra-passe usit123.<br>
            O acesso reservado não tem botão público. Usa as credenciais próprias no mesmo formulário de login.
          </div>
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
        <div><div class="brand"><div class="logo">U</div><div>Usit</div></div><div class="slogan">use it. share it.</div></div>
        <nav class="nav">${navHtml}</nav>
        <div class="sidebar-footer">
          <div class="profile-chip"><div class="avatar">${u.name.slice(0,1).toUpperCase()}</div><div style="min-width:0"><strong>${u.name}</strong><div class="tiny">${roleLabel(u.role)}</div></div></div>
          <button class="btn ghost full" id="logoutA">Sair</button>
        </div>
      </aside>
      <main class="content">
        <div class="topbar"><div class="mobile-brand"><div class="logo">U</div><strong>Usit</strong></div><h1>${pageTitle(active)}</h1><button class="btn ghost" id="logoutB">Sair</button></div>
        <section class="view">${content}</section>
      </main>
      <nav class="mobile-nav"><div class="nav">${navHtml}</div></nav>
    </div>
  `;
}
function navItems(role){
  if(role==='admin') return [
    {id:'admin', label:'Dashboard', icon:'📊'}, {id:'admin-users', label:'Utilizadores', icon:'👥'}, {id:'admin-risk', label:'Risco', icon:'🛡️'}
  ];
  if(role==='partner') return [
    {id:'partner', label:'Dashboard', icon:'📊'}, {id:'partner-items', label:'Itens', icon:'📦'}, {id:'partner-billing', label:'Faturação', icon:'🧾'}
  ];
  return [
    {id:'explore', label:'Explorar', icon:'🏠'}, {id:'items', label:'Os meus itens', icon:'📦'}, {id:'messages', label:'Mensagens', icon:'💬'}, {id:'reservations', label:'Reservas', icon:'📅'}, {id:'profile', label:'Perfil', icon:'👤'}
  ];
}
function roleLabel(role){ return role==='admin'?'Administrador':role==='partner'?'Parceiro comercial':'Utilizador comum'; }
function pageTitle(view){
  const map = {explore:'Explorar', items:'Os meus itens', messages:'Mensagens', reservations:'Reservas', profile:'Perfil', admin:'Dashboard administrador', 'admin-users':'Gestão e dados agregados', 'admin-risk':'Privacidade e acesso', partner:'Dashboard parceiro', 'partner-items':'Itens do parceiro', 'partner-billing':'Faturação', detail:'Detalhe do item', add:'Adicionar item'};
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
  else body = viewExplore();
  app.innerHTML = layout(body, v === 'detail' ? 'explore' : v === 'add' ? 'items' : v);
  bindShell();
  bindUserView();
}

function viewExplore(){
  return `
    <div class="hero"><div><h2>Encontra o que precisas sem comprar.</h2><p>Pesquisa ferramentas, eletrónicos e equipamentos perto de ti. A Usit liga quem precisa de usar a quem tem objetos parados.</p></div><div class="hero-panel"><strong>${state.items.filter(i=>i.status==='Ativo').length}</strong><span>itens disponíveis agora</span></div></div>
    <div class="search-panel">
      <div class="search-row"><input class="input" id="searchText" placeholder="Procurar equipamentos..."><select id="categoryFilter"><option value="">Todas as categorias</option>${categories.map(c=>`<option>${c.id}</option>`).join('')}</select><select id="sortFilter"><option value="near">Mais perto</option><option value="price">Preço mais baixo</option><option value="views">Mais vistos</option></select></div>
      <div class="cat-row"><button class="cat-btn active" data-cat=""><span>✨</span><span>Todas</span></button>${categories.map(c=>`<button class="cat-btn" data-cat="${c.id}"><span>${c.icon}</span><span>${c.id}</span></button>`).join('')}</div>
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
}
function itemCard(i){
  return `<article class="item-card"><div class="item-img">${i.emoji}</div><div class="item-info"><h3>${i.title}</h3><p>📍 ${i.location} · ${i.distance} km</p><p class="price">${money(i.price)}/dia</p><div class="status-line"><span class="badge ${i.verified?'success':'gray'}">${i.verified?'Verificado':'Por verificar'}</span><span class="badge ${i.status==='Ativo'?'success':'warn'}">${i.status}</span></div></div><div class="item-actions"><button class="btn secondary" data-detail="${i.id}">Ver detalhes</button></div></article>`;
}

function viewDetail(){
  const i = state.items.find(x=>x.id===state.selectedItemId) || state.items[0];
  state.selectedItemId = i.id;
  const min = new Date().toISOString().slice(0,10);
  return `
    <button class="btn ghost" data-view="explore">← Voltar</button>
    <div class="detail-layout">
      <div class="card"><div class="big-visual">${i.emoji}</div><h2>${i.title}</h2><p>${i.description}</p><div class="status-line"><span class="badge">${i.category}</span><span class="badge ${i.verified?'success':'gray'}">${i.verified?'Verificado':'Por verificar'}</span><span class="badge ${i.status==='Ativo'?'success':'warn'}">${i.status}</span></div><div class="section-title"><h2>Condições</h2></div><p>${i.conditions}</p><p class="muted">Proprietário: ${i.ownerName} · ${i.location}</p></div>
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
    <div class="grid two">${own.map(i=>`<div class="card"><div class="item-card" style="box-shadow:none;border:none;padding:0"><div class="item-img">${i.emoji}</div><div class="item-info"><h3>${i.title}</h3><p class="price">${money(i.price)}/dia</p><span class="badge ${i.status==='Ativo'?'success':i.status==='Alugado'?'warn':'gray'}">${i.status}</span></div></div><div class="status-line"><button class="btn ghost" data-toggle-status="${i.id}">Alternar estado</button><button class="btn ghost" data-edit-item="${i.id}">Editar</button></div></div>`).join('') || `<div class="card"><h3>Ainda não tens itens</h3><p>Publica o teu primeiro equipamento para começar.</p></div>`}</div>
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
  const draft = state.draftItem || {};
  return `
    <button class="btn ghost" data-view="items">← Voltar</button>
    <div class="card wizard"><div class="section-title"><h2>Adicionar item</h2><button class="btn ghost" id="saveDraft">Guardar rascunho</button></div><div class="progress"><span style="width:100%"></span></div><div class="steps"><span>1. Dados</span><span>2. Condições</span><span>3. Publicar</span></div><form id="itemForm" class="login-form"><div class="form-grid"><div class="field"><label>Nome do equipamento</label><input class="input" id="itemTitle" value="${draft.title||''}" placeholder="Ex: Berbequim Elétrico Bosch" required></div><div class="field"><label>Categoria</label><select id="itemCategory" required><option value="">Selecionar categoria</option>${categories.map(c=>`<option ${draft.category===c.id?'selected':''}>${c.id}</option>`).join('')}</select></div></div><div><label>Fotografias</label><div class="upload-box">Carregar fotografia, simulado no protótipo</div></div><div><label>Descrição</label><textarea id="itemDesc" required placeholder="Descreve o estado e características do equipamento">${draft.description||''}</textarea></div><div class="form-grid"><div><label>Preço por dia</label><input class="input" id="itemPrice" type="number" min="1" value="${draft.price||''}" required></div><div><label>Caução</label><input class="input" id="itemDeposit" type="number" min="0" value="${draft.deposit||''}" required></div></div><div><label>Condições</label><textarea id="itemConditions" required>${draft.conditions||''}</textarea></div><button class="btn primary full">Publicar anúncio</button></form></div>
  `;
}

function viewReservations(){
  const u = user();
  const mine = state.reservations.filter(r=>r.locatarioId===u.id || r.ownerId===u.id);
  return `<div class="section-title"><h2>Reservas</h2></div><div class="item-list">${mine.map(reservationCard).join('') || `<div class="card"><p>Ainda não tens reservas.</p></div>`}</div>`;
}
function viewMessages(){
  const u = user();
  const peers = state.users.filter(x => x.id!==u.id && x.role==='user');
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
  if($('#searchText')){ renderItemsList(); $('#searchText').oninput=renderItemsList; $('#categoryFilter').onchange=renderItemsList; $('#sortFilter').onchange=renderItemsList; document.querySelectorAll('.cat-btn').forEach(b=>b.onclick=()=>{document.querySelectorAll('.cat-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); $('#categoryFilter').value=b.dataset.cat; renderItemsList();}); }
  document.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>{state.selectedItemId=b.dataset.detail; state.items.find(i=>i.id===b.dataset.detail).views++; state.activeView='detail'; save(); render();});
  const rf=$('#requestForm'); if(rf){ const update=()=>{ const item=state.items.find(i=>i.id===state.selectedItemId); const days=calcDays($('#startDate').value,$('#endDate').value); $('#costBox').innerHTML = days ? `<div class="summary-row"><span>${days} dia(s)</span><strong>${money(calcTotal(item,days))}</strong></div><div class="tiny">Inclui caução e comissão.</div>` : `<div class="summary-row"><span>Total estimado</span><strong>Seleciona datas</strong></div>`;}; $('#startDate').onchange=update; $('#endDate').onchange=update; rf.onsubmit=(e)=>{e.preventDefault(); const item=state.items.find(i=>i.id===state.selectedItemId); const days=calcDays($('#startDate').value,$('#endDate').value); if(!days){toast('Escolhe datas válidas.'); return;} const r={id:uid('r'), itemId:item.id, itemTitle:item.title, ownerId:item.ownerId, locatarioId:user().id, start:$('#startDate').value, end:$('#endDate').value, days, total:calcTotal(item,days), state:'Pendente', paid:false, received:false, createdAt:new Date().toISOString().slice(0,10)}; state.reservations.push(r); save(); toast('Pedido enviado ao proprietário.'); setView('reservations');}; }
  document.querySelectorAll('[data-accept]').forEach(b=>b.onclick=()=>{const r=state.reservations.find(x=>x.id===b.dataset.accept); r.state='Confirmada'; const item=state.items.find(i=>i.id===r.itemId); if(item) item.status='Alugado'; save(); toast('Pedido aceite.'); render();});
  document.querySelectorAll('[data-reject]').forEach(b=>b.onclick=()=>{const r=state.reservations.find(x=>x.id===b.dataset.reject); r.state='Recusada'; save(); toast('Pedido recusado.'); render();});
  document.querySelectorAll('[data-pay]').forEach(b=>b.onclick=()=>{const u=user(); if(!u.paymentMethod){toast('Adiciona um método de pagamento no perfil.'); setView('profile'); return;} const r=state.reservations.find(x=>x.id===b.dataset.pay); r.paid=true; r.state='Confirmada'; save(); toast('Pagamento registado.'); render();});
  document.querySelectorAll('[data-received]').forEach(b=>b.onclick=()=>{const r=state.reservations.find(x=>x.id===b.dataset.received); r.received=true; r.state='Concluída'; save(); toast('Receção confirmada.'); render();});
  document.querySelectorAll('[data-open-chat]').forEach(b=>b.onclick=()=>{state.selectedThreadUserId=b.dataset.openChat; state.activeView='messages'; save(); render();});
  document.querySelectorAll('[data-toggle-status]').forEach(b=>b.onclick=()=>{const it=state.items.find(i=>i.id===b.dataset.toggleStatus); it.status = it.status==='Ativo' ? 'Não disponível' : 'Ativo'; save(); render();});
  const itemForm=$('#itemForm'); if(itemForm){ $('#saveDraft').onclick=()=>{state.draftItem = readItemForm(); save(); toast('Rascunho guardado.');}; itemForm.onsubmit=(e)=>{e.preventDefault(); const data=readItemForm(); if(!data.title || !data.category || !data.description || data.price<=0){ toast('Preenche os dados obrigatórios.'); return; } state.items.push({id:uid('i'), ownerId:user().id, ownerName:user().name, title:data.title, category:data.category, description:data.description, location:user().location||'Lisboa, Portugal', distance:0.5, price:data.price, deposit:data.deposit, status:'Ativo', verified:false, emoji:iconFor(data.category), views:0, partner:false, conditions:data.conditions, available:[]}); state.draftItem=null; save(); toast('Anúncio publicado.'); setView('items');}; }
  const pf=$('#profileForm'); if(pf){ pf.onsubmit=(e)=>{e.preventDefault(); const u=user(); u.name=$('#profileName').value; u.email=$('#profileEmail').value; u.location=$('#profileLocation').value; save(); toast('Perfil guardado.'); render();}; }
  const payf=$('#paymentForm'); if(payf){ payf.onsubmit=(e)=>{e.preventDefault(); const u=user(); u.paymentMethod=$('#paymentMethod').value; u.payoutMethod=$('#payoutMethod').value; save(); toast('Métodos guardados.'); render();}; }
  document.querySelectorAll('[data-thread]').forEach(b=>b.onclick=()=>{state.selectedThreadUserId=b.dataset.thread; save(); render();});
  const sf=$('#sendForm'); if(sf){ sf.onsubmit=(e)=>{e.preventDefault(); const txt=$('#msgText').value.trim(); if(!txt) return; state.messages.push({id:uid('m'), from:user().id, to:state.selectedThreadUserId, text:txt, date:new Date().toLocaleString('pt-PT',{dateStyle:'short',timeStyle:'short'})}); save(); render();}; }
}
function readItemForm(){return { title:$('#itemTitle').value.trim(), category:$('#itemCategory').value, description:$('#itemDesc').value.trim(), price:Number($('#itemPrice').value||0), deposit:Number($('#itemDeposit').value||0), conditions:$('#itemConditions').value.trim()};}
function iconFor(cat){ return categories.find(c=>c.id===cat)?.icon || '📦'; }

function renderAdmin(){
  const v = state.activeView;
  const totalPaid = state.reservations.filter(r=>r.paid).reduce((s,r)=>s+r.total,0);
  const activeUsers = state.users.filter(u=>u.role==='user').length;
  const revenue = totalPaid * 0.02;
  const byCat = categories.map(c=>({cat:c.id, value:state.items.filter(i=>i.category===c.id).reduce((s,i)=>s+i.views,0)}));
  let body = '';
  if(v==='admin-users') body = `<div class="card"><h3>Dados agregados de utilizadores</h3><div class="table-wrap"><table class="table"><thead><tr><th>Indicador</th><th>Valor</th><th>Nota</th></tr></thead><tbody><tr><td>Utilizadores comuns</td><td>${activeUsers}</td><td>Sem detalhe individual no painel de parceiros.</td></tr><tr><td>Proprietários ativos</td><td>${new Set(state.items.map(i=>i.ownerId)).size}</td><td>Baseado em itens publicados.</td></tr><tr><td>Reservas totais</td><td>${state.reservations.length}</td><td>Inclui pendentes, confirmadas e concluídas.</td></tr></tbody></table></div></div>`;
  else if(v==='admin-risk') body = `<div class="grid two"><div class="card"><h3>Controlo de acesso</h3><p>O acesso ao painel usa o mesmo formulário de login, sem botão público. A função do utilizador define a área apresentada.</p><span class="badge success">Acesso reservado</span></div><div class="card"><h3>Privacidade</h3><p>O painel de parceiros mostra dados agregados do próprio parceiro e não apresenta dados identificáveis de outros parceiros ou utilizadores.</p><span class="badge success">Dados agregados</span></div></div>`;
  else body = `<div class="hero"><div><h2>Painel de controlo da Usit</h2><p>Visão global para acompanhar transações, utilizadores ativos e receita por categoria.</p></div><div class="hero-panel"><strong>${money(revenue)}</strong><span>receita estimada da comissão</span></div></div><div class="grid four"><div class="stat-card"><span>Transações</span><strong>${state.reservations.length}</strong></div><div class="stat-card"><span>Utilizadores ativos</span><strong>${activeUsers}</strong></div><div class="stat-card"><span>Receita total</span><strong>${money(revenue)}</strong></div><div class="stat-card"><span>Anúncios</span><strong>${state.items.length}</strong></div></div><div class="grid two"><div class="card"><h3>Interesse por categoria</h3><div class="chart">${barChart(byCat)}</div></div><div class="card"><h3>Estado das reservas</h3><div class="chart">${barChart(['Pendente','Confirmada','Concluída','Recusada'].map(s=>({cat:s,value:state.reservations.filter(r=>r.state===s).length})))}</div></div></div>`;
  app.innerHTML = layout(body, v.startsWith('admin')?v:'admin'); bindShell();
}
function renderPartner(){
  const v=state.activeView; const u=user(); const items=state.items.filter(i=>i.ownerId===u.id); const res=state.reservations.filter(r=>r.ownerId===u.id); const paid=res.filter(r=>r.paid).reduce((s,r)=>s+r.total,0); let body='';
  if(v==='partner-items') body = `<div class="section-title"><h2>Inventário do parceiro</h2></div><div class="grid two">${items.map(i=>`<div class="card"><div class="item-card" style="box-shadow:none;border:none;padding:0"><div class="item-img">${i.emoji}</div><div class="item-info"><h3>${i.title}</h3><p>${i.views} visualizações</p><p class="price">${money(i.price)}/dia</p></div></div></div>`).join('') || `<div class="card"><p>Sem itens.</p></div>`}</div>`;
  else if(v==='partner-billing') body = `<div class="card"><h3>Faturação e reservas</h3><div class="table-wrap"><table class="table"><thead><tr><th>Reserva</th><th>Estado</th><th>Valor</th><th>Pago</th></tr></thead><tbody>${res.map(r=>`<tr><td>${r.itemTitle}</td><td>${r.state}</td><td>${money(r.total)}</td><td>${r.paid?'Sim':'Não'}</td></tr>`).join('') || `<tr><td colspan="4">Sem reservas.</td></tr>`}</tbody></table></div></div>`;
  else body = `<div class="hero"><div><h2>Área do parceiro</h2><p>Consulta desempenho dos anúncios, reservas e ganhos associados ao teu inventário.</p></div><div class="hero-panel"><strong>${money(paid)}</strong><span>volume associado ao parceiro</span></div></div><div class="grid four"><div class="stat-card"><span>Itens</span><strong>${items.length}</strong></div><div class="stat-card"><span>Visualizações</span><strong>${items.reduce((s,i)=>s+i.views,0)}</strong></div><div class="stat-card"><span>Reservas</span><strong>${res.length}</strong></div><div class="stat-card"><span>Valor pago</span><strong>${money(paid)}</strong></div></div><div class="card"><h3>Desempenho por item</h3><div class="chart">${barChart(items.map(i=>({cat:i.title,value:i.views})))}</div></div>`;
  app.innerHTML = layout(body, v.startsWith('partner')?v:'partner'); bindShell();
}
function barChart(rows){ const max = Math.max(1,...rows.map(r=>r.value)); return rows.map(r=>`<div class="bar-row"><span class="tiny">${r.cat}</span><div class="bar"><span style="width:${Math.max(4,(r.value/max)*100)}%"></span></div><strong>${r.value}</strong></div>`).join(''); }

init();
