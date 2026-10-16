const processes = [
  {id:'PE 041/2026', title:'Equipamentos de informática', modality:'Pregão eletrônico', value:'R$ 284.500,00', stage:'Disputa', deadline:'Hoje, 14:00', description:'Aquisição demonstrativa de equipamentos para renovação de laboratórios. Dados inteiramente fictícios.'},
  {id:'PE 040/2026', title:'Materiais de expediente', modality:'Pregão eletrônico', value:'R$ 76.320,00', stage:'Propostas', deadline:'18 out, 09:00', description:'Exemplo de processo em fase de recebimento de propostas, com itens agrupados por lote.'},
  {id:'CE 039/2026', title:'Serviços de conectividade', modality:'Concorrência eletrônica', value:'R$ 1.120.000,00', stage:'Habilitação', deadline:'19 out, 10:30', description:'Exemplo de processo com fornecedor convocado para a etapa de habilitação.'},
  {id:'PE 038/2026', title:'Mobiliário escolar', modality:'Pregão eletrônico', value:'R$ 395.800,00', stage:'Publicado', deadline:'22 out, 08:30', description:'Exemplo de edital publicado aguardando a abertura da sessão.'},
  {id:'PE 036/2026', title:'Insumos para manutenção', modality:'Pregão eletrônico', value:'R$ 148.900,00', stage:'Habilitação', deadline:'23 out, 13:00', description:'Exemplo de processo em análise de documentos e habilitação de fornecedor.'}
];

const stageClass = {Disputa:'status-dispute',Propostas:'status-proposals',Habilitação:'status-qualification',Publicado:'status-published'};
const body = document.querySelector('#processRows');
let selectedFilter = 'all';

document.querySelector('#currentDate').textContent=new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date()).toLocaleUpperCase('pt-BR');

function renderRows(){
  const query = document.querySelector('#searchInput').value.trim().toLocaleLowerCase('pt-BR');
  const filtered = processes.filter(p => (selectedFilter === 'all' || p.stage === selectedFilter) && `${p.id} ${p.title} ${p.modality}`.toLocaleLowerCase('pt-BR').includes(query));
  body.innerHTML = filtered.map((p,i)=>`<tr><td><span class="process-id">${p.id}</span><span class="process-sub">${p.title}</span></td><td><span class="modality">${p.modality}</span></td><td><span class="value-cell">${p.value}</span></td><td><span class="status ${stageClass[p.stage]}">${p.stage}</span></td><td><span class="deadline">${p.deadline}</span></td><td><button class="row-action" data-detail="${processes.indexOf(p)}" aria-label="Detalhes de ${p.id}">↗</button></td></tr>`).join('');
  document.querySelector('#rowCount').textContent = filtered.length;
  if(!filtered.length) body.innerHTML='<tr><td colspan="6" class="empty-state">Nenhum processo de demonstração encontrado.</td></tr>';
}

const titles={overview:['Visão geral','Acompanhe os processos e as etapas da jornada de compras.'],processes:['Processos','Consulte processos fictícios e suas etapas.'],suppliers:['Fornecedores','Acompanhe propostas e habilitação em um só lugar.'],auctions:['Disputas ao vivo','Visualize sessões e eventos de disputa em tempo real.'],reports:['Relatórios','Uma visão consolidada das etapas e resultados.']};
function setView(view){
  document.querySelectorAll('.nav-item').forEach(item=>item.classList.toggle('active',item.dataset.view===view));
  const [title,subtitle]=titles[view]||titles.overview;
  document.querySelector('#pageTitle').textContent=title;
  document.querySelector('#pageSubtitle').textContent=subtitle;
  document.querySelector('#breadcrumbCurrent').textContent=title;
  if(view==='processes') document.querySelector('#searchInput').focus({preventScroll:true});
  if(view==='suppliers'||view==='reports') showToast(`${title}: seção ilustrativa com dados fictícios.`);
  if(view==='auctions') document.querySelector('.live-panel').scrollIntoView({behavior:'smooth',block:'center'});
  document.querySelector('#sidebar').classList.remove('open');
}

function showToast(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2600);}

document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>setView(el.dataset.view)));
document.querySelector('#searchInput').addEventListener('input',renderRows);
document.querySelector('#filterButton').addEventListener('click',()=>document.querySelector('#filterMenu').classList.toggle('open'));
document.querySelectorAll('#filterMenu button').forEach(btn=>btn.addEventListener('click',()=>{selectedFilter=btn.dataset.filter==='all'?'all':btn.dataset.filter;document.querySelector('#filterLabel').textContent=btn.dataset.filter==='all'?'Todos os status':btn.dataset.filter;document.querySelector('#filterMenu').classList.remove('open');renderRows()}));
document.addEventListener('click',e=>{if(!e.target.closest('.filter-wrap'))document.querySelector('#filterMenu').classList.remove('open')});
document.addEventListener('click',e=>{
  const trigger=e.target.closest('[data-detail]');
  if(!trigger)return;
  const item=processes[Number(trigger.dataset.detail)];
  document.querySelector('#dialogTitle').textContent=`${item.id} · ${item.title}`;
  document.querySelector('#dialogDescription').textContent=item.description;
  document.querySelector('#dialogMode').textContent=item.modality;
  document.querySelector('#dialogStage').textContent=item.stage;
  document.querySelector('#dialogValue').textContent=item.value;
  document.querySelector('#detailDialog').showModal();
});
document.querySelector('#newProcess').addEventListener('click',()=>showToast('A criação de processos não está ativa neste protótipo.'));
document.querySelector('#mobileMenu').addEventListener('click',()=>document.querySelector('#sidebar').classList.toggle('open'));
renderRows();
