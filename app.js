const prayer=[["Pai nosso, que estais nos céus,","A oração começa dirigindo-se a Deus como Pai.","Família reunida em oração diante de Deus."],["santificado seja o vosso Nome;","Pedido para que o nome de Deus seja reconhecido com reverência.","Pessoa busca a santidade de Deus em meio ao conflito."],["venha a nós o vosso Reino;","Desejo de justiça, paz e acolhimento.","Reconciliação e acolhimento como sinais do Reino de Deus."],["seja feita a vossa vontade,","Pedido para seguir a vontade de Deus.","Pessoa escolhe a vontade de Deus diante da tentação."],["assim na terra como no céu.","Pedido para viver a vontade de Deus no mundo.","Pessoas deixam as trevas e caminham para a luz de Deus."],["O pão nosso de cada dia nos dai hoje;","Pedido de sustento e cuidado cotidiano.","Pessoas em oração diante de Deus, fonte do pão cotidiano."],["perdoai-nos as nossas ofensas,","Pedido de perdão por nossas faltas.","Jesus ensina seus discípulos a buscar o perdão."],["assim como nós perdoamos a quem nos tem ofendido;","Compromisso com o perdão.","Pessoa oferece perdão e reconciliação."],["e não nos deixeis cair em tentação,","Pedido de força para escolher o bem.","Pessoa pede a ajuda de Deus diante da tentação."],["mas livrai-nos do Mal.","Pedido de proteção e libertação do mal.","Pessoas são conduzidas para fora do mal em direção à luz de Deus."],["Amém.","Conclusão da oração.","Pessoas em oração confiam a Deus tudo o que pediram."]];
let step=0;
const img=document.getElementById('prayerImage'),title=document.getElementById('prayerText'),sense=document.getElementById('prayerSense'),progress=document.getElementById('progressText'),fill=document.getElementById('progressFill'),prev=document.getElementById('prev'),next=document.getElementById('next');
function render(focus=false){title.textContent=prayer[step][0];sense.textContent=prayer[step][1];img.src='https://raw.githubusercontent.com/aeduardasantana/oracaovisual/main/assets/oracoes-ilustradas/pai-nosso/'+String(step+1).padStart(2,'0')+'.webp';img.alt=prayer[step][2];img.draggable=false;document.getElementById('imageDescription').textContent=prayer[step][2];progress.textContent='Trecho '+(step+1)+' de '+prayer.length;fill.style.width=((step+1)/prayer.length*100)+'%';prev.disabled=step===0;next.disabled=step===prayer.length-1;next.textContent=next.disabled?'Concluído ✓':'Próximo →';if(focus)title.focus();}
prev.addEventListener('click',()=>{if(step>0){step--;render(true)}});next.addEventListener('click',()=>{if(step<prayer.length-1){step++;render(true)}});document.getElementById('restart').addEventListener('click',()=>{step=0;render(true)});render();
const EVALUATION_ENDPOINT="https://script.google.com/macros/s/AKfycbwilI7GdTWX_O5gM9Xx7R-uX_Ttb7MNCq5e8BgN4KMlM9sETi-0Pp7vStK5_JG_xKUmng/exec";
document.getElementById('feedbackForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget,button=document.getElementById('submitFeedback'),status=document.getElementById('feedbackStatus');
  if(!form.reportValidity())return;
  if(!EVALUATION_ENDPOINT.startsWith('https://script.google.com/macros/s/'))return;
  const data=new URLSearchParams(new FormData(form));
  // Uma tentativa pode ser reenviada com o mesmo protocolo para evitar duplicidade.
  if(!form.dataset.protocolo)form.dataset.protocolo='oa_'+(crypto.randomUUID?crypto.randomUUID().replace(/-/g,''):String(Date.now())+Math.random().toString(36).slice(2));
  data.set('protocolo',form.dataset.protocolo);data.set('versao','1.0');
  button.disabled=true;status.textContent='Enviando sua avaliação...';
  try {
    await fetch(EVALUATION_ENDPOINT,{method:'POST',mode:'no-cors',body:data});
    status.textContent='Solicitação enviada ao serviço. A confirmação do registro na planilha ainda não está disponível automaticamente. Se necessário, contate a equipe.';
    // Não limpar o formulário, pois não houve confirmação verificável da gravação.
  } catch(err) {
    status.textContent='Não foi possível enviar. Verifique sua conexão e tente novamente.';
  } finally {button.disabled=false;}
});
const share=document.getElementById('shareWhatsapp');if(share)share.href='https://wa.me/?text='+encodeURIComponent('Conheça o Oração Acessível, protótipo acadêmico do IFTO de Eduarda Ferreira Santana Bispo e Leila Régia de Paiva Freitas. Uma experiência do Pai-Nosso com imagens, Libras e leitura por áudio. https://oracaoacessivel.compassrosesystems.com.br/');
document.querySelectorAll('img').forEach(element=>{element.draggable=false;element.addEventListener('dragstart',event=>event.preventDefault());element.addEventListener('contextmenu',event=>event.preventDefault());});
document.addEventListener('copy',event=>{if(event.target.closest('input,textarea'))return;event.preventDefault();});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
let installEvent;const installButton=document.getElementById('installApp');window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;installButton.hidden=false});installButton?.addEventListener('click',async()=>{if(!installEvent)return;installEvent.prompt();await installEvent.userChoice;installEvent=null;installButton.hidden=true});window.addEventListener('appinstalled',()=>{if(installButton)installButton.hidden=true});
