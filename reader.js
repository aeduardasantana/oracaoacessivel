/* Leitor de conteúdo — síntese de voz nativa, sem coleta ou serviços pagos. */
(() => {
  'use strict';
  const panel=document.getElementById('readerPanel'),status=document.getElementById('readerStatus');
  const play=document.getElementById('readerPlay'),pause=document.getElementById('readerPause'),stop=document.getElementById('readerStop');
  const mode=document.getElementById('readerMode'),rate=document.getElementById('readerRate');
  const synth=window.speechSynthesis, supported=!!(synth && window.SpeechSynthesisUtterance);
  let current=null, session=0;
  const state=(message)=>{status.textContent=message;};
  if(!supported){play.disabled=pause.disabled=stop.disabled=true;state('Leitura por voz indisponível neste navegador. Utilize um leitor de tela do dispositivo.');return;}
  function halt(message='Leitura interrompida.'){
    session++;synth.cancel();current=null;pause.disabled=true;stop.disabled=true;pause.textContent='Pausar';if(message)state(message);
  }
  function chooseVoice(){
    const voices=synth.getVoices();
    return voices.find(v=>v.lang.toLowerCase()==='pt-br'&&v.localService)||
           voices.find(v=>v.lang.toLowerCase()==='pt-br')||
           voices.find(v=>v.lang.toLowerCase().startsWith('pt'))||null;
  }
  function makeText(){
    const selected=window.getSelection()?.toString().trim();
    if(mode.value==='selecao'){return selected||null;}
    if(mode.value==='imagem'){return document.getElementById('imageDescription')?.textContent?.trim() || null;}
    if(mode.value==='apresentacao'){return 'Bem-vindo ao Oração Acessível, um protótipo acadêmico do Projeto Integrador I do IFTO. Navegue pelos trechos do Pai-Nosso usando os botões de avançar e voltar. Cada trecho tem uma imagem com descrição acessível. Você pode ouvir a oração e a descrição das imagens. Para apoio em Libras, utilize o VLibras, ou assista ao vídeo do Pai-Nosso em Libras. Ao final, você pode enviar uma avaliação voluntária pelo WhatsApp.';}
    if(mode.value==='trecho'){
      return [document.getElementById('prayerText')?.textContent,document.getElementById('prayerSense')?.textContent].filter(Boolean).join('. ');
    }
    const blocks=document.querySelectorAll('main h1, main h2, main h3, main p, main .eyebrow');
    return [...blocks].filter(el=>!el.closest('form') && !el.closest('#readerPanel') && !el.closest('.tips')).map(el=>el.textContent.trim()).filter(Boolean).join('. ');
  }
  function startReading(){
    if(synth.paused && current){synth.resume();pause.textContent='Pausar';state('Leitura em andamento.');return;}
    const text=makeText();
    if(!text){state('Selecione um texto da página antes de escolher ouvir a seleção.');return;}
    halt('');
    const turn=++session, utterance=new SpeechSynthesisUtterance(text);
    utterance.lang='pt-BR';utterance.rate=Number(rate.value)||1;
    const voice=chooseVoice();if(voice)utterance.voice=voice;
    utterance.onend=()=>{if(turn!==session)return;current=null;pause.disabled=true;stop.disabled=true;state('Leitura concluída.');};
    utterance.onerror=(e)=>{if(turn!==session)return;current=null;pause.disabled=true;stop.disabled=true;state('Não foi possível reproduzir o áudio neste navegador.');};
    current=utterance;pause.disabled=false;stop.disabled=false;pause.textContent='Pausar';
    try{synth.speak(utterance);state('Leitura em andamento.');}catch{halt('Não foi possível iniciar o áudio.');}
  }
  play.addEventListener('click',startReading);
  document.getElementById('describeImage')?.addEventListener('click',()=>{mode.value='imagem';startReading()});
  document.getElementById('hearSite')?.addEventListener('click',()=>{mode.value='apresentacao';startReading()});
  pause.addEventListener('click',()=>{
    if(!current)return;
    if(synth.paused){synth.resume();pause.textContent='Pausar';state('Leitura em andamento.');}
    else if(synth.speaking){synth.pause();pause.textContent='Continuar';state('Leitura pausada.');}
  });
  stop.addEventListener('click',()=>halt());
  mode.addEventListener('change',()=>halt('Modo de leitura alterado.'));
  rate.addEventListener('change',()=>halt('Velocidade ajustada. Inicie a leitura novamente.'));
  // Ao trocar de trecho, encerrar a fala anterior para evitar descompasso entre texto e imagem.
  document.getElementById('next')?.addEventListener('click',()=>halt('Trecho alterado. Pronto para ouvir.'));
  document.getElementById('prev')?.addEventListener('click',()=>halt('Trecho alterado. Pronto para ouvir.'));
  document.getElementById('restart')?.addEventListener('click',()=>halt('Oração reiniciada. Pronto para ouvir.'));
  document.addEventListener('visibilitychange',()=>{if(document.hidden && current)halt('Leitura interrompida ao sair da página.');});
  window.addEventListener('pagehide',()=>halt(''));
  // Atualiza a disponibilidade de vozes fornecidas pelo sistema.
  if('onvoiceschanged' in synth)synth.addEventListener('voiceschanged',chooseVoice);
  state('Escolha o conteúdo e clique em Ouvir.');
})();
