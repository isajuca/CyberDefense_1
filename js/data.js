/* ============================================================================
   Cyber Defense: Proteja sua Smart Home — Game Data & Educational Content
   3 Progressive Levels | 23 Device Scenarios | 8 Achievements | Knowledge Base
   ============================================================================ */

(function () {
  window.CyberDefense = window.CyberDefense || {};

  // Icon SVGs used across devices, badges, and UI
  const ICONS = {
    camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3.5"/></svg>`,
    router: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="14" width="20" height="6" rx="2"/><path d="M6 17h.01M10 17h.01M17 14v-3"/><path d="M13.5 8.5a5 5 0 0 1 7 0"/><path d="M15.3 10.7a2.5 2.5 0 0 1 3.4 0"/><path d="M7 14v-4"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.2"/></svg>`,
    sensor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="8" height="18" rx="1.5"/><rect x="15" y="7" width="5" height="10" rx="1.5"/><path d="M9 12h.01"/><path d="M12 12h3" stroke-dasharray="1.5 1.5"/></svg>`,
    lamp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>`,
    assistant: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3" width="10" height="18" rx="4"/><ellipse cx="12" cy="6.5" rx="3.2" ry="1.2"/><path d="M10 14h4M10 17h4"/></svg>`,
    tv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg>`,
    thermostat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><circle cx="12" cy="12" r="1.3"/></svg>`,
    nas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="7" rx="1.5"/><path d="M7 6.5h.01M10 6.5h.01M7 17.5h.01M10 17.5h.01"/></svg>`,
    webcam: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="6"/><circle cx="12" cy="10" r="2.2"/><path d="M7 20h10M12 16v4"/></svg>`,
    fridge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 10h14M15 6v2M15 13v4"/><rect x="8" y="13" width="4" height="4" rx="0.6"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
  };

  // Room definitions
  const ROOMS = {
    fachada: {
      id: 'fachada',
      name: 'Entrada & Fachada',
      shortName: 'Entrada',
      description: 'Perímetro externo, porta principal e monitoramento de acesso.'
    },
    sala: {
      id: 'sala',
      name: 'Sala de Estar',
      shortName: 'Sala de Estar',
      description: 'Núcleo da rede Wi-Fi, iluminação conectada e entretenimento.'
    },
    escritorio: {
      id: 'escritorio',
      name: 'Escritório & Cozinha',
      shortName: 'Escritório',
      description: 'Automação residencial, armazenamento de dados e eletrodomésticos IoT.'
    }
  };

  // Hero callouts for the Landing Screen (matching the mockup!)
  const HERO_CALLOUTS = [
    {
      id: 'camera',
      label: 'Câmera',
      icon: 'camera',
      x: 41,
      y: 35,
      tip: 'Câmeras IP com senha padrão ou porta exposta são um dos alvos favoritos de invasores e botnets.'
    },
    {
      id: 'router',
      label: 'Roteador Wi-Fi',
      icon: 'router',
      x: 68,
      y: 16,
      tip: 'O roteador é a porta de entrada da casa: exige WPA3/WPA2-AES, senha forte no painel e rede IoT separada.'
    },
    {
      id: 'lamp',
      label: 'Lâmpadas inteligentes',
      icon: 'lamp',
      x: 86,
      y: 36,
      tip: 'Até dispositivos simples precisam de firmware atualizado e isolamento para não servirem de ponte na rede.'
    },
    {
      id: 'assistant',
      label: 'Assistente virtual',
      icon: 'assistant',
      x: 74,
      y: 55,
      tip: 'Configure PIN para comandos sensíveis, revise o histórico de voz e controle permissões de skills.'
    },
    {
      id: 'lock',
      label: 'Fechadura inteligente',
      icon: 'lock',
      x: 45,
      y: 66,
      tip: 'Use senhas fortes, revogue códigos temporários de visitantes e mantenha o pareamento Bluetooth protegido.'
    },
    {
      id: 'sensor',
      label: 'Sensor de porta',
      icon: 'sensor',
      x: 86,
      y: 72,
      tip: 'Sensores desatualizados ou com alertas desativados podem ser burlados sem avisar os moradores.'
    }
  ];

  // 3 Progressive Levels
  const LEVELS = [
    /* ========================================================================
       NÍVEL 1: CASA BÁSICA — PRIMEIRAS DEFESAS
       ======================================================================== */
    {
      id: 1,
      title: 'Nível 1: Casa Básica',
      subtitle: 'Primeiras Defesas da Smart Home',
      difficulty: 'Iniciante',
      description:
        'A família acabou de instalar seus primeiros dispositivos inteligentes. Explore a Entrada e a Sala de Estar, analise os registros técnicos e identifique quais aparelhos estão vulneráveis e quais já estão protegidos.',
      rooms: ['fachada', 'sala'],
      alerts: [
        {
          id: 'l1-a1',
          severity: 'high',
          roomId: 'fachada',
          deviceId: 'l1-camera',
          title: 'Tentativas de login suspeitas',
          message: 'A Câmera IP Externa registrou 47 tentativas de acesso externo na última hora.'
        },
        {
          id: 'l1-a2',
          severity: 'medium',
          roomId: 'fachada',
          deviceId: 'l1-sensor',
          title: 'Atualização crítica pendente',
          message: 'Um sensor de perímetro opera com firmware antigo e apresentou desconexão sem alerta.'
        },
        {
          id: 'l1-a3',
          severity: 'high',
          roomId: 'sala',
          deviceId: 'l1-router',
          title: 'Protocolo Wi-Fi inseguro detectado',
          message: 'O Roteador Wi-Fi utiliza criptografia obsoleta e mantém credenciais padrão.'
        },
        {
          id: 'l1-a4',
          severity: 'medium',
          roomId: 'sala',
          deviceId: 'l1-assistant',
          title: 'Comando de voz sem autenticação',
          message: 'Atividade incomum detectada nas permissões de voz da Sala de Estar.'
        }
      ],
      devices: [
        {
          id: 'l1-camera',
          name: 'Câmera IP Externa',
          roomId: 'fachada',
          icon: 'camera',
          sceneSlot: 'camera',
          x: 14,
          y: 74,
          ip: '192.168.1.24',
          mac: 'A4:C1:38:9F:10:2B',
          protocol: 'Wi-Fi / RTSP (Porta 554)',
          firmware: 'v2.1.4 (Atual)',
          isVulnerable: true,
          category: 'password',
          hasAlert: true,
          telemetry: [
            { label: 'Credenciais Admin', value: 'admin / admin (Padrão de fábrica)', flag: 'danger' },
            { label: 'Acesso Remoto (RTSP)', value: 'Porta 554 aberta para a Internet', flag: 'danger' },
            { label: 'Autenticação 2FA', value: 'Desativada', flag: 'warn' },
            { label: 'Criptografia de Vídeo', value: 'Ativa localmente', flag: 'ok' }
          ],
          logs: [
            '[02:14:09] WARN  Tentativa de login falha (IP: 185.220.101.4) - user: root',
            '[02:14:15] WARN  47 tentativas consecutivas detectadas na porta 554',
            '[02:15:02] ALERT Sessão RTSP acessada com credencial padrão "admin"'
          ],
          vulnerability: {
            question: 'Após analisar o painel técnico da Câmera IP, qual é o diagnóstico?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Uso de senha padrão de fábrica ("admin/admin") com porta de acesso remoto exposta',
                correct: true
              },
              { id: 'v2', text: 'Falta de cartão SD para armazenamento físico das filmagens' },
              { id: 'v3', text: 'Endereço IP local na faixa 192.168.x.x incompatível com Wi-Fi' }
            ],
            explanation:
              'Manter usuário e senha padrão de fábrica (admin/admin) com a porta RTSP exposta permite que invasores acessem a câmera em segundos usando listas automatizadas.'
          },
          threat: {
            question: 'Qual ameaça cibernética essa vulnerabilidade possibilita?',
            options: [
              {
                id: 't1',
                text: 'Invasão por força bruta/credenciais padrão e espionagem em vídeo ao vivo',
                correct: true
              },
              { id: 't2', text: 'Superaquecimento físico da lente por excesso de brilho' },
              { id: 't3', text: 'Cancelamento automático do plano de internet pela operadora' }
            ],
            explanation:
              'Com credenciais padrão expostas, atacantes podem visualizar as câmeras em tempo real, gravar a rotina da família ou sequestrar o dispositivo.'
          },
          measure: {
            question: 'Qual medida de proteção corrige o problema de forma completa?',
            options: [
              {
                id: 'm1',
                text: 'Trocar para senha forte única, fechar a porta 554 externa e ativar 2FA',
                quality: 'ideal',
                feedback:
                  'Excelente! Senha forte + remoção da exposição direta na internet + 2FA eliminam o acesso indevido.'
              },
              {
                id: 'm2',
                text: 'Apenas trocar a senha para "casa1234" mantendo a porta 554 aberta',
                quality: 'partial',
                feedback:
                  'Parcial: trocar a senha padrão ajuda, mas "casa1234" ainda é fraca e manter a porta aberta continua expondo o serviço.'
              },
              {
                id: 'm3',
                text: 'Apenas desligar o LED indicador da câmera para não chamar atenção',
                quality: 'wrong',
                feedback:
                  'Inadequado: desligar o LED não impede nenhum acesso remoto pela rede; a falha continua totalmente explorável.'
              }
            ]
          }
        },
        {
          id: 'l1-lock',
          name: 'Fechadura Inteligente',
          roomId: 'fachada',
          icon: 'lock',
          sceneSlot: 'lock',
          x: 31,
          y: 67,
          ip: '192.168.1.30',
          mac: '7C:2F:80:41:AA:19',
          protocol: 'BLE 5.2 (AES-256) / Hub Seguro',
          firmware: 'v3.4.1 (Atualizado há 3 dias)',
          isVulnerable: false,
          category: 'safe',
          hasAlert: false,
          telemetry: [
            { label: 'Autenticação', value: 'PIN de 8 dígitos + Biometria + 2FA no App', flag: 'ok' },
            { label: 'Proteção Força Bruta', value: 'Bloqueio automático após 3 erros', flag: 'ok' },
            { label: 'Firmware', value: 'v3.4.1 (Assinado e atualizado)', flag: 'ok' },
            { label: 'Pareamento Bluetooth', value: 'Desativado (somente via botão físico)', flag: 'ok' }
          ],
          logs: [
            '[07:45:12] INFO  Porta destravada via Biometria (Morador: Ana)',
            '[18:20:04] INFO  Porta travada automaticamente após 30 segundos',
            '[22:00:00] INFO  Verificação de integridade concluída: 0 anomalias'
          ],
          vulnerability: {
            question: 'Após analisar o painel técnico da Fechadura Inteligente, qual é o diagnóstico?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)', correct: true },
              { id: 'v1', text: 'Firmware desatualizado com falha crítica de Bluetooth' },
              { id: 'v2', text: 'Senha padrão de fábrica sem bloqueio de tentativas' },
              { id: 'v3', text: 'Porta administrativa aberta diretamente na internet' }
            ],
            explanation:
              'A fechadura usa biometria + PIN longo, trava após 3 tentativas, está atualizada e tem comunicação criptografada com AES-256. Ela já está devidamente protegida!'
          }
        },
        {
          id: 'l1-sensor',
          name: 'Sensor de Porta',
          roomId: 'fachada',
          icon: 'sensor',
          sceneSlot: 'sensor',
          x: 46,
          y: 72,
          ip: '192.168.1.33',
          mac: '58:D5:6E:12:4C:08',
          protocol: 'Wi-Fi 2.4GHz',
          firmware: 'v1.0.2 (2022 — CVE-2023-2941)',
          isVulnerable: true,
          category: 'firmware',
          hasAlert: true,
          telemetry: [
            { label: 'Versão de Firmware', value: 'v1.0.2 (Desatualizado há 2 anos)', flag: 'danger' },
            { label: 'Boletim de Segurança', value: 'CVE-2023-2941: Falha de bypass de sinal', flag: 'danger' },
            { label: 'Alerta de Desconexão', value: 'Desativado nas configurações', flag: 'warn' },
            { label: 'Bateria', value: '86% (Normal)', flag: 'ok' }
          ],
          logs: [
            '[01:58:10] INFO  Sensor online — Porta fechada',
            '[02:11:44] WARN  Conexão interrompida por 14 minutos (nenhum alerta enviado)',
            '[02:26:01] INFO  Sensor reconectado após reinício forçado'
          ],
          vulnerability: {
            question: 'Após analisar o Sensor de Porta, qual é a vulnerabilidade presente?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Firmware desatualizado com falha conhecida (CVE) e alertas de desconexão desativados',
                correct: true
              },
              { id: 'v2', text: 'Bateria em 86% causando falha no magnetismo' },
              { id: 'v3', text: 'Uso de rede Wi-Fi 2.4GHz em vez de cabo de fibra óptica' }
            ],
            explanation:
              'O firmware antigo possui uma vulnerabilidade pública (CVE-2023-2941) que permite silenciar o sensor, agravada pela falta de alertas de desconexão.'
          },
          threat: {
            question: 'Qual ameaça cibernética/física essa falha permite?',
            options: [
              {
                id: 't1',
                text: 'Desativação silenciosa (bypass) do sensor para invasão física sem disparar alarmes',
                correct: true
              },
              { id: 't2', text: 'Instalação de vírus nos arquivos do computador da sala' },
              { id: 't3', text: 'Aumento na conta de energia elétrica por consumo excessivo' }
            ],
            explanation:
              'Um invasor pode explorar a falha do firmware para derrubar ou congelar o status do sensor como "fechado" enquanto abre a porta sem disparar notificações.'
          },
          measure: {
            question: 'Qual é a melhor medida de proteção para este sensor?',
            options: [
              {
                id: 'm1',
                text: 'Atualizar o firmware para a versão corrigida e ativar alertas de violação/desconexão',
                quality: 'ideal',
                feedback:
                  'Perfeito! A atualização corrige a CVE-2023-2941 e os alertas garantem aviso imediato caso o sensor fique offline.'
              },
              {
                id: 'm2',
                text: 'Apenas ativar o alerta no celular, mantendo o firmware antigo',
                quality: 'partial',
                feedback:
                  'Parcial: ajuda a notar desconexões, mas mantém a brecha de firmware explorável.'
              },
              {
                id: 'm3',
                text: 'Reiniciar o sensor uma vez por semana sem alterar configurações',
                quality: 'wrong',
                feedback:
                  'Inadequado: reiniciar não corrige vulnerabilidades de software nem ativa os alertas necessários.'
              }
            ]
          }
        },
        {
          id: 'l1-router',
          name: 'Roteador Wi-Fi',
          roomId: 'sala',
          icon: 'router',
          sceneSlot: 'router',
          x: 15,
          y: 28,
          ip: '192.168.1.1',
          mac: '00:1A:2B:3C:4D:5E',
          protocol: 'Wi-Fi 802.11ac',
          firmware: 'v4.0.1 (Atual)',
          isVulnerable: true,
          category: 'network',
          hasAlert: true,
          telemetry: [
            { label: 'Criptografia Wi-Fi', value: 'WEP (Obsoleta) + WPS Ativo', flag: 'danger' },
            { label: 'Painel Admin (192.168.1.1)', value: 'admin / 1234 (Padrão)', flag: 'danger' },
            { label: 'Segmentação de Rede', value: 'Rede única para PCs, celulares e IoTs', flag: 'warn' },
            { label: 'Firewall Básico', value: 'Ativo', flag: 'ok' }
          ],
          logs: [
            '[14:10:02] WARN  Múltiplos pacotes de captura de handshake WEP detectados',
            '[14:12:41] WARN  Tentativa de conexão via PIN WPS oriunda de dispositivo externo',
            '[14:15:00] INFO  11 dispositivos compartilhando a mesma sub-rede'
          ],
          vulnerability: {
            question: 'Qual é o problema principal identificado no Roteador Wi-Fi?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Criptografia obsoleta (WEP), WPS ativo e painel administrativo com senha padrão',
                correct: true
              },
              { id: 'v2', text: 'Firewall básico ativado bloqueando pacotes legítimos' },
              { id: 'v3', text: 'IP gateway configurado como 192.168.1.1' }
            ],
            explanation:
              'O protocolo WEP pode ser quebrado em minutos, o WPS tem falhas conhecidas de força bruta no PIN e a senha padrão do painel dá controle total da rede.'
          },
          threat: {
            question: 'Qual ameaça essa configuração insegura viabiliza?',
            options: [
              {
                id: 't1',
                text: 'Quebra rápida da senha Wi-Fi, invasão da rede doméstica e interceptação (Man-in-the-Middle)',
                correct: true
              },
              { id: 't2', text: 'Perda de sinal apenas em dias chuvosos' },
              { id: 't3', text: 'Queima física das antenas externas do roteador' }
            ],
            explanation:
              'Ao quebrar o WEP/WPS, o invasor entra na mesma rede dos computadores e dispositivos IoT, podendo espionar tráfego ou alterar configurações do roteador.'
          },
          measure: {
            question: 'Qual medida de proteção deve ser aplicada ao roteador?',
            options: [
              {
                id: 'm1',
                text: 'Ativar WPA3 (ou WPA2-AES), desativar WPS, trocar a senha admin e criar rede separada para IoT',
                quality: 'ideal',
                feedback:
                  'Excelente escolha! Criptografia moderna + sem WPS + senha admin forte + segmentação IoT blindam o coração da casa.'
              },
              {
                id: 'm2',
                text: 'Apenas ocultar o nome da rede (SSID) mantendo o protocolo WEP',
                quality: 'wrong',
                feedback:
                  'Inadequado: ocultar o SSID não impede a descoberta da rede por scanners simples e o WEP continua facilmente quebrável.'
              },
              {
                id: 'm3',
                text: 'Trocar para WPA2, mas manter a senha do painel como "admin/1234"',
                quality: 'partial',
                feedback:
                  'Parcial: melhorar o Wi-Fi é bom, mas manter a senha padrão do painel administrativo continua sendo um risco alto.'
              }
            ]
          }
        },
        {
          id: 'l1-lamp',
          name: 'Lâmpadas Inteligentes',
          roomId: 'sala',
          icon: 'lamp',
          sceneSlot: 'lamp',
          x: 34,
          y: 20,
          ip: '192.168.20.12',
          mac: 'B8:27:EB:66:21:9A',
          protocol: 'Wi-Fi (VLAN IoT) / TLS 1.3',
          firmware: 'v2.9.0 (Atualização automática)',
          isVulnerable: false,
          category: 'safe',
          hasAlert: false,
          telemetry: [
            { label: 'Rede', value: 'Isolada na VLAN IoT (sem acesso aos PCs)', flag: 'ok' },
            { label: 'Criptografia', value: 'TLS 1.3 com certificado válido', flag: 'ok' },
            { label: 'Firmware', value: 'v2.9.0 (Última versão instalada)', flag: 'ok' },
            { label: 'Permissões', value: 'Somente controle de brilho e cor', flag: 'ok' }
          ],
          logs: [
            '[18:30:00] INFO  Automação executada: Modo Aconchego (60%)',
            '[21:00:12] INFO  Verificação de firmware: Sistema atualizado',
            '[23:15:00] INFO  Nenhuma conexão externa anômala registrada'
          ],
          vulnerability: {
            question: 'Após analisar as Lâmpadas Inteligentes, qual é o diagnóstico?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)', correct: true },
              { id: 'v1', text: 'Comunicação sem criptografia expondo senhas na rede' },
              { id: 'v2', text: 'Firmware obsoleto sem suporte desde 2019' },
              { id: 'v3', text: 'Microfone oculto gravando conversas sem permissão' }
            ],
            explanation:
              'As lâmpadas estão atualizadas, usam TLS 1.3, têm permissões mínimas e operam isoladas na VLAN IoT. Nenhuma correção é necessária!'
          }
        },
        {
          id: 'l1-assistant',
          name: 'Assistente Virtual',
          roomId: 'sala',
          icon: 'assistant',
          sceneSlot: 'assistant',
          x: 29,
          y: 47,
          ip: '192.168.1.41',
          mac: 'F0:9F:C2:77:8A:31',
          protocol: 'Wi-Fi / HTTPS',
          firmware: 'v6.3.2 (Atual)',
          isVulnerable: true,
          category: 'privacy',
          hasAlert: true,
          telemetry: [
            { label: 'Compras e Rotinas por Voz', value: 'Ativadas SEM código PIN', flag: 'danger' },
            { label: 'Integração com Fechadura', value: 'Destravamento por voz liberado para qualquer voz', flag: 'danger' },
            { label: 'Gravações de Áudio', value: 'Retenção permanente na nuvem', flag: 'warn' },
            { label: 'Firmware', value: 'v6.3.2 (Atualizado)', flag: 'ok' }
          ],
          logs: [
            '[15:42:18] WARN  Comando captado próximo à janela: "Assistente, destravar porta"',
            '[15:42:20] ALERT Ação sensível executada sem validação de voz ou PIN',
            '[16:00:05] INFO  214 clipes de áudio armazenados sem exclusão automática'
          ],
          vulnerability: {
            question: 'Qual vulnerabilidade foi encontrada no Assistente Virtual?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Ações sensíveis por voz sem PIN/reconhecimento e retenção excessiva de áudio',
                correct: true
              },
              { id: 'v2', text: 'Uso do protocolo HTTPS para falar com o servidor' },
              { id: 'v3', text: 'Firmware atualizado para a versão 6.3.2' }
            ],
            explanation:
              'Permitir comandos críticos (como compras ou abrir portas) sem PIN ou perfil de voz, somado ao armazenamento ilimitado de gravações, cria riscos físicos e de privacidade.'
          },
          threat: {
            question: 'Qual ameaça pode explorar essa configuração?',
            options: [
              {
                id: 't1',
                text: 'Execução não autorizada de comandos (ex.: abrir porta pela janela) e vazamento de conversas privadas',
                correct: true
              },
              { id: 't2', text: 'Sobrecarga na caixa de som queimando o alto-falante' },
              { id: 't3', text: 'Apagamento automático do sistema operacional da Smart TV' }
            ],
            explanation:
              'Qualquer pessoa próxima à janela — ou até áudios reproduzidos — pode acionar comandos críticos, e gravações antigas na nuvem ampliam danos em caso de vazamento.'
          },
          measure: {
            question: 'Qual medida protege melhor o Assistente Virtual?',
            options: [
              {
                id: 'm1',
                text: 'Desativar destravamento sem autenticação, exigir PIN para compras e ativar exclusão automática de áudios',
                quality: 'ideal',
                feedback:
                  'Perfeito! Exigir PIN/desativar ações críticas por voz aberta e limpar o histórico protege sua segurança física e privacidade.'
              },
              {
                id: 'm2',
                text: 'Apenas abaixar o volume do alto-falante do assistente',
                quality: 'wrong',
                feedback:
                  'Inadequado: o volume de saída não reduz a captação do microfone nem impede a execução de comandos sem PIN.'
              },
              {
                id: 'm3',
                text: 'Limpar o histórico de áudio hoje, mas manter o destravamento por voz livre',
                quality: 'partial',
                feedback:
                  'Parcial: ajuda na privacidade, mas deixa o maior risco (comandos críticos sem PIN) ainda aberto.'
              }
            ]
          }
        }
      ]
    },

    /* ========================================================================
       NÍVEL 2: CASA CONECTADA — AMEAÇAS DE REDE & PROTOCOLOS
       ======================================================================== */
    {
      id: 2,
      title: 'Nível 2: Casa Conectada',
      subtitle: 'Protocolos, Rede e Privacidade Avançada',
      difficulty: 'Intermediário',
      description:
        'A Smart Home agora inclui Escritório & Cozinha, Smart TV, Termostato MQTT e NAS doméstico. Investigue protocolos sem criptografia, UPnP, acessos de terceiros e aplicativos suspeitos.',
      rooms: ['fachada', 'sala', 'escritorio'],
      alerts: [
        {
          id: 'l2-a1',
          severity: 'high',
          roomId: 'fachada',
          deviceId: 'l2-camera',
          title: 'Tráfego de vídeo sem criptografia',
          message: 'Câmera transmitindo em HTTP claro e abrindo portas via UPnP.'
        },
        {
          id: 'l2-a2',
          severity: 'high',
          roomId: 'fachada',
          deviceId: 'l2-lock',
          title: 'Acesso físico fora do padrão',
          message: 'Um código de prestador antigo foi utilizado na porta principal.'
        },
        {
          id: 'l2-a3',
          severity: 'high',
          roomId: 'sala',
          deviceId: 'l2-router',
          title: 'Alteração suspeita de DNS',
          message: 'O Roteador aponta para um servidor DNS desconhecido e tem WAN aberta.'
        },
        {
          id: 'l2-a4',
          severity: 'medium',
          roomId: 'sala',
          deviceId: 'l2-tv',
          title: 'Conexões externas suspeitas na TV',
          message: 'Aplicativo instalado fora da loja oficial envia dados constantemente.'
        },
        {
          id: 'l2-a5',
          severity: 'high',
          roomId: 'escritorio',
          deviceId: 'l2-thermostat',
          title: 'Broker MQTT aberto',
          message: 'Alteração remota inesperada no Termostato Inteligente durante a madrugada.'
        },
        {
          id: 'l2-a6',
          severity: 'high',
          roomId: 'escritorio',
          deviceId: 'l2-nas',
          title: 'Varredura de portas no NAS',
          message: 'Serviços legados (Telnet/SMBv1) detectados no servidor de arquivos.'
        }
      ],
      devices: [
        {
          id: 'l2-camera',
          name: 'Câmera IP Externa',
          roomId: 'fachada',
          icon: 'camera',
          sceneSlot: 'camera',
          x: 14,
          y: 74,
          ip: '192.168.10.24',
          mac: 'A4:C1:38:9F:10:2B',
          protocol: 'HTTP (Texto Claro) + UPnP',
          firmware: 'v2.4.0 (Atual)',
          isVulnerable: true,
          category: 'network',
          hasAlert: true,
          telemetry: [
            { label: 'Protocolo de Vídeo', value: 'HTTP porta 80 (Sem criptografia TLS)', flag: 'danger' },
            { label: 'UPnP (Plug & Play)', value: 'Habilitado — abriu porta externa 8081', flag: 'danger' },
            { label: 'Senha Admin', value: 'Forte (14 caracteres)', flag: 'ok' }
          ],
          logs: [
            '[19:12:03] WARN  UPnP mapeou automaticamente porta WAN 8081 -> 192.168.10.24:80',
            '[19:18:45] ALERT Fluxo de vídeo e token de sessão trafegando em texto puro (HTTP)'
          ],
          vulnerability: {
            question: 'Qual vulnerabilidade foi detectada na Câmera IP?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Transmissão sem criptografia (HTTP) e UPnP expondo portas automaticamente na internet',
                correct: true
              },
              { id: 'v2', text: 'Senha de 14 caracteres sendo longa demais para a câmera' },
              { id: 'v3', text: 'Resolução Full HD consumindo banda local' }
            ],
            explanation:
              'HTTP transmite dados sem criptografia, permitindo leitura do tráfego na rede, e o UPnP abre portas no roteador sem autorização explícita do usuário.'
          },
          threat: {
            question: 'Qual ameaça pode explorar essa falha?',
            options: [
              {
                id: 't1',
                text: 'Interceptação de vídeo/credenciais (Sniffing / Man-in-the-Middle) e acesso externo via porta exposta',
                correct: true
              },
              { id: 't2', text: 'Desalinhamento do suporte metálico da câmera' },
              { id: 't3', text: 'Corrupção da bateria do celular do morador' }
            ],
            explanation:
              'Qualquer agente na rede ou na rota de tráfego pode capturar sessões HTTP em texto claro, e portas abertas por UPnP expõem a câmera a scanners globais.'
          },
          measure: {
            question: 'Qual medida corrige adequadamente o problema?',
            options: [
              {
                id: 'm1',
                text: 'Habilitar HTTPS/TLS para criptografia e desativar o UPnP na câmera e no roteador',
                quality: 'ideal',
                feedback:
                  'Perfeito! HTTPS protege os dados em trânsito e desativar o UPnP impede aberturas automáticas de portas.'
              },
              {
                id: 'm2',
                text: 'Desativar o UPnP, mas manter a câmera transmitindo em HTTP',
                quality: 'partial',
                feedback:
                  'Parcial: reduz a exposição externa, mas o tráfego interno ainda fica sem criptografia.'
              },
              {
                id: 'm3',
                text: 'Reduzir a qualidade do vídeo para 480p mantendo HTTP e UPnP ativos',
                quality: 'wrong',
                feedback:
                  'Inadequado: reduzir resolução não adiciona nenhuma camada de criptografia nem fecha portas.'
              }
            ]
          }
        },
        {
          id: 'l2-lock',
          name: 'Fechadura Inteligente',
          roomId: 'fachada',
          icon: 'lock',
          sceneSlot: 'lock',
          x: 31,
          y: 67,
          ip: '192.168.10.30',
          mac: '7C:2F:80:41:AA:19',
          protocol: 'BLE 5.2 / App Nuvem',
          firmware: 'v3.5.0 (Atual)',
          isVulnerable: true,
          category: 'password',
          hasAlert: true,
          telemetry: [
            { label: 'Códigos Ativos', value: '6 PINs de visitantes/prestadores SEM expiração', flag: 'danger' },
            { label: '2FA no App da Fechadura', value: 'Desativado', flag: 'warn' },
            { label: 'Criptografia BLE', value: 'AES-256 Ativa', flag: 'ok' }
          ],
          logs: [
            '[19:40:11] ALERT Porta aberta pelo Código #04 ("Técnico Ar-Condicionado - instalado há 7 meses")',
            '[19:41:02] WARN  6 códigos temporários continuam válidos indefinidamente'
          ],
          vulnerability: {
            question: 'Qual é a vulnerabilidade identificada na Fechadura Inteligente?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Códigos de acesso de terceiros sem expiração/revogação e falta de 2FA no aplicativo',
                correct: true
              },
              { id: 'v2', text: 'Criptografia AES-256 no Bluetooth' },
              { id: 'v3', text: 'Firmware v3.5.0 atualizado' }
            ],
            explanation:
              'Manter senhas de visitantes ou prestadores ativas indefinidamente quebra o princípio do menor privilégio e cria risco real de invasão.'
          },
          threat: {
            question: 'Qual ameaça decorre dessa vulnerabilidade?',
            options: [
              {
                id: 't1',
                text: 'Acesso físico não autorizado à residência usando credenciais antigas de terceiros',
                correct: true
              },
              { id: 't2', text: 'Ataque de negação de serviço (DDoS) no roteador Wi-Fi' },
              { id: 't3', text: 'Bloqueio do Wi-Fi dos vizinhos' }
            ],
            explanation:
              'Qualquer ex-prestador ou pessoa que tenha anotado um código antigo pode destravar a residência livremente.'
          },
          measure: {
            question: 'Qual medida de proteção você deve escolher?',
            options: [
              {
                id: 'm1',
                text: 'Revogar todos os códigos antigos, usar PINs temporários com validade e ativar 2FA no app',
                quality: 'ideal',
                feedback:
                  'Excelente! Gestão de ciclo de vida de credenciais + 2FA garantem controle rigoroso de quem entra na casa.'
              },
              {
                id: 'm2',
                text: 'Apenas ativar notificações de abertura sem apagar os códigos antigos',
                quality: 'partial',
                feedback:
                  'Parcial: você será avisado depois que a porta abrir, mas o acesso indevido continuará liberado.'
              },
              {
                id: 'm3',
                text: 'Usar um único código simples para todos os moradores e visitantes',
                quality: 'wrong',
                feedback:
                  'Inadequado: compartilhar um código único impede rastreabilidade e amplia drasticamente o risco.'
              }
            ]
          }
        },
        {
          id: 'l2-sensor',
          name: 'Sensor de Porta',
          roomId: 'fachada',
          icon: 'sensor',
          sceneSlot: 'sensor',
          x: 46,
          y: 72,
          ip: 'Zigbee Node #04',
          mac: '00:15:8D:00:04:A1',
          protocol: 'Zigbee 3.0 (AES-128)',
          firmware: 'v2.4.0 (Atualizado)',
          isVulnerable: false,
          category: 'safe',
          hasAlert: false,
          telemetry: [
            { label: 'Criptografia Zigbee', value: 'AES-128 com chave rotacionada', flag: 'ok' },
            { label: 'Chave Anti-Tamper', value: 'Ativa (alerta se removido da porta)', flag: 'ok' },
            { label: 'Firmware', value: 'v2.4.0 (Sem CVEs conhecidas)', flag: 'ok' }
          ],
          logs: [
            '[08:02:10] INFO  Heartbeat normal — Bateria 94%',
            '[18:45:22] INFO  Abertura/Fechamento validados com chave de sessão'
          ],
          vulnerability: {
            question: 'Após inspecionar o Sensor de Porta Zigbee, qual é o diagnóstico?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)', correct: true },
              { id: 'v1', text: 'Protocolo Zigbee 3.0 aberto sem criptografia' },
              { id: 'v2', text: 'Sensor sem proteção contra remoção física' },
              { id: 'v3', text: 'Porta Telnet exposta na internet' }
            ],
            explanation:
              'O sensor opera em Zigbee 3.0 criptografado, está atualizado e possui detecção física anti-tamper ativa. Está totalmente seguro!'
          }
        },
        {
          id: 'l2-router',
          name: 'Roteador Wi-Fi',
          roomId: 'sala',
          icon: 'router',
          sceneSlot: 'router',
          x: 15,
          y: 28,
          ip: '192.168.10.1',
          mac: '00:1A:2B:3C:4D:5E',
          protocol: 'Wi-Fi 6 / WPA3',
          firmware: 'v5.1.2 (Atual)',
          isVulnerable: true,
          category: 'network',
          hasAlert: true,
          telemetry: [
            { label: 'Gerenciamento Remoto (WAN)', value: 'Habilitado na porta 8080', flag: 'danger' },
            { label: 'Servidor DNS Primário', value: '45.142.99.21 (Não reconhecido)', flag: 'danger' },
            { label: 'Criptografia Wi-Fi', value: 'WPA3-Personal', flag: 'ok' }
          ],
          logs: [
            '[11:04:19] ALERT Acesso administrativo externo via WAN (IP: 91.204.x.x)',
            '[11:04:38] ALERT Configuração DNS alterada para 45.142.99.21',
            '[11:20:10] WARN  Consultas de bancos redirecionadas para IPs desconhecidos'
          ],
          vulnerability: {
            question: 'Qual vulnerabilidade crítica foi encontrada no Roteador Wi-Fi?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Gerenciamento remoto via WAN habilitado e servidor DNS alterado para endereço malicioso',
                correct: true
              },
              { id: 'v2', text: 'Uso de criptografia WPA3-Personal na rede Wi-Fi' },
              { id: 'v3', text: 'Ausência de cabo coaxial na entrada LAN' }
            ],
            explanation:
              'Expor o painel de administração pela internet (WAN) permitiu que um invasor alterasse o DNS do roteador para um servidor malicioso.'
          },
          threat: {
            question: 'Qual ataque está acontecendo a partir dessa falha?',
            options: [
              {
                id: 't1',
                text: 'Sequestro de DNS (Pharming), redirecionando os moradores para sites falsos de phishing',
                correct: true
              },
              { id: 't2', text: 'Desgaste precoce das lâmpadas da sala' },
              { id: 't3', text: 'Clonagem do cartão físico da fechadura' }
            ],
            explanation:
              'No sequestro de DNS, mesmo digitando o endereço certo no navegador, o roteador leva todos os dispositivos da casa para páginas falsas que roubam senhas.'
          },
          measure: {
            question: 'Qual é a medida de proteção ideal?',
            options: [
              {
                id: 'm1',
                text: 'Desativar gerenciamento remoto (WAN), restaurar DNS confiável (ex.: 1.1.1.1 / ISP) e trocar a senha do roteador',
                quality: 'ideal',
                feedback:
                  'Excelente! Fecha a porta de entrada externa, remove o DNS malicioso e invalida credenciais comprometidas.'
              },
              {
                id: 'm2',
                text: 'Apenas trocar o DNS de volta sem desativar o acesso remoto WAN nem mudar a senha',
                quality: 'partial',
                feedback:
                  'Parcial: sem fechar o acesso WAN e trocar a senha, o invasor pode alterar o DNS novamente em minutos.'
              },
              {
                id: 'm3',
                text: 'Apenas mudar o nome da rede Wi-Fi (SSID)',
                quality: 'wrong',
                feedback:
                  'Inadequado: mudar o SSID não remove o DNS malicioso nem bloqueia o acesso administrativo via WAN.'
              }
            ]
          }
        },
        {
          id: 'l2-tv',
          name: 'Smart TV',
          roomId: 'sala',
          icon: 'tv',
          sceneSlot: 'tv',
          x: 47,
          y: 34,
          ip: '192.168.10.52',
          mac: 'C8:3A:35:29:EF:10',
          protocol: 'Wi-Fi / Android TV',
          firmware: 'Patch 2024-02 (Pendente)',
          isVulnerable: true,
          category: 'privacy',
          hasAlert: true,
          telemetry: [
            { label: 'Fontes Desconhecidas', value: 'Habilitado (Instalação de APKs externos)', flag: 'danger' },
            { label: 'App Suspeito', value: 'FreeStream_HD.apk (Permissão: Microfone + Rede)', flag: 'danger' },
            { label: 'Sistema Operacional', value: 'Atualização de segurança pendente', flag: 'warn' }
          ],
          logs: [
            '[20:15:01] WARN  App "FreeStream_HD.apk" executando serviço em segundo plano com a TV em standby',
            '[20:17:44] ALERT Envio de pacotes de varredura interna + dados para 103.45.x.x'
          ],
          vulnerability: {
            question: 'Qual vulnerabilidade está presente na Smart TV?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Instalação de app não oficial ("fontes desconhecidas") com permissões abusivas',
                correct: true
              },
              { id: 'v2', text: 'Conexão da Smart TV via Wi-Fi 5GHz' },
              { id: 'v3', text: 'Uso do modo standby ao desligar pelo controle remoto' }
            ],
            explanation:
              'Habilitar fontes desconhecidas e instalar aplicativos piratas de streaming é uma das principais portas de entrada de malware e spyware em Smart TVs.'
          },
          threat: {
            question: 'Qual ameaça esse aplicativo representa para a casa?',
            options: [
              {
                id: 't1',
                text: 'Infecção por spyware/malware capaz de espionar o ambiente e mapear a rede doméstica',
                correct: true
              },
              { id: 't2', text: 'Queima dos pixels da tela por excesso de contraste' },
              { id: 't3', text: 'Desconfiguração do termostato por ondas infravermelhas' }
            ],
            explanation:
              'Apps maliciosos em Smart TVs frequentemente atuam como proxy residencial, roubam credenciais ou escutam o microfone do controle remoto.'
          },
          measure: {
            question: 'Qual medida corrige o problema da Smart TV?',
            options: [
              {
                id: 'm1',
                text: 'Desinstalar o APK suspeito, desativar fontes desconhecidas, atualizar o sistema e revisar permissões',
                quality: 'ideal',
                feedback:
                  'Perfeito! Remove o malware, impede novas instalações não oficiais e fecha brechas do sistema.'
              },
              {
                id: 'm2',
                text: 'Apenas negar a permissão de microfone e continuar usando o aplicativo pirata',
                quality: 'partial',
                feedback:
                  'Parcial: o app malicioso continua instalado podendo explorar a rede local.'
              },
              {
                id: 'm3',
                text: 'Deixar o app instalado e só desconectar a TV da tomada à noite',
                quality: 'wrong',
                feedback:
                  'Inadequado: enquanto a TV estiver ligada, o malware continua operando na rede.'
              }
            ]
          }
        },
        {
          id: 'l2-assistant',
          name: 'Assistente Virtual',
          roomId: 'sala',
          icon: 'assistant',
          sceneSlot: 'assistant',
          x: 29,
          y: 47,
          ip: '192.168.20.41',
          mac: 'F0:9F:C2:77:8A:31',
          protocol: 'Wi-Fi (VLAN IoT) / TLS 1.3',
          firmware: 'v7.0.1 (Atualizado)',
          isVulnerable: false,
          category: 'safe',
          hasAlert: false,
          telemetry: [
            { label: 'Ações Críticas / Compras', value: 'Bloqueadas por PIN + Perfil de Voz', flag: 'ok' },
            { label: 'Skills Instaladas', value: 'Somente oficiais verificadas', flag: 'ok' },
            { label: 'Histórico de Áudio', value: 'Exclusão automática a cada 30 dias', flag: 'ok' }
          ],
          logs: [
            '[07:30:00] INFO  Previsão do tempo solicitada (Perfil: Carlos)',
            '[22:10:00] INFO  Sem anomalias de rede ou comandos não autorizados'
          ],
          vulnerability: {
            question: 'Qual é o diagnóstico do Assistente Virtual neste nível?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)', correct: true },
              { id: 'v1', text: 'Compras por voz liberadas sem autenticação' },
              { id: 'v2', text: 'Execução de app malicioso de fonte desconhecida' },
              { id: 'v3', text: 'Comunicação sem criptografia em HTTP' }
            ],
            explanation:
              'Desta vez, o Assistente Virtual está corretamente configurado: isolado em VLAN IoT, atualizado, com PIN para ações críticas e exclusão automática de áudio!'
          }
        },
        {
          id: 'l2-thermostat',
          name: 'Termostato Inteligente',
          roomId: 'escritorio',
          icon: 'thermostat',
          sceneSlot: 'thermostat',
          x: 61,
          y: 23,
          ip: '192.168.10.60',
          mac: 'DC:A6:32:18:90:4F',
          protocol: 'MQTT (Porta 1883 — Aberta)',
          firmware: 'v1.9.4 (Atual)',
          isVulnerable: true,
          category: 'network',
          hasAlert: true,
          telemetry: [
            { label: 'Broker MQTT', value: 'Porta 1883 — Acesso anônimo (sem usuário/senha)', flag: 'danger' },
            { label: 'Criptografia TLS (MQTTS)', value: 'Desativada', flag: 'danger' },
            { label: 'Tópicos Expostos', value: 'home/hvac/# (leitura e escrita liberadas)', flag: 'warn' }
          ],
          logs: [
            '[03:18:22] WARN  Cliente anônimo publicou em "home/hvac/setpoint": 32°C',
            '[03:18:24] ALERT Sistema de aquecimento acionado sem comando dos moradores'
          ],
          vulnerability: {
            question: 'Qual vulnerabilidade de IoT existe no Termostato Inteligente?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Broker MQTT sem autenticação (acesso anônimo) e sem criptografia TLS',
                correct: true
              },
              { id: 'v2', text: 'Temperatura exibida em graus Celsius em vez de Fahrenheit' },
              { id: 'v3', text: 'Tela circular consumindo memória RAM demais' }
            ],
            explanation:
              'O protocolo MQTT é muito usado em IoT, mas deixá-lo na porta 1883 sem autenticação e sem TLS permite que qualquer cliente publique comandos nos tópicos da casa.'
          },
          threat: {
            question: 'Qual ameaça essa brecha no MQTT possibilita?',
            options: [
              {
                id: 't1',
                text: 'Manipulação remota não autorizada de dispositivos IoT e movimentação lateral na automação',
                correct: true
              },
              { id: 't2', text: 'Vazamento do fluido refrigerante por software' },
              { id: 't3', text: 'Exclusão dos contatos do celular' }
            ],
            explanation:
              'Com publicação livre no broker MQTT, invasores podem alterar climatização, ler sensores de presença (descobrindo se a casa está vazia) ou acionar outros atuadores.'
          },
          measure: {
            question: 'Qual medida corrige a segurança do Termostato MQTT?',
            options: [
              {
                id: 'm1',
                text: 'Exigir autenticação forte (usuário/senha ou certificado), aplicar ACL nos tópicos e ativar MQTTS (TLS porta 8883)',
                quality: 'ideal',
                feedback:
                  'Brilhante! Autenticação + controle de tópicos (ACL) + MQTTS com TLS são o padrão ouro de segurança MQTT em IoT.'
              },
              {
                id: 'm2',
                text: 'Apenas renomear o tópico de "home/hvac" para "casa/clima" sem senha',
                quality: 'partial',
                feedback:
                  'Parcial/Fraco: segurança por obscuridade falha facilmente porque um invasor pode assinar o curinga "#" e listar todos os tópicos.'
              },
              {
                id: 'm3',
                text: 'Limitar a temperatura máxima a 28°C mantendo o broker anônimo',
                quality: 'wrong',
                feedback:
                  'Inadequado: invasores ainda terão acesso livre de leitura e escrita ao broker da casa.'
              }
            ]
          }
        },
        {
          id: 'l2-nas',
          name: 'NAS / Hub IoT Doméstico',
          roomId: 'escritorio',
          icon: 'nas',
          sceneSlot: 'nas',
          x: 64,
          y: 43,
          ip: '192.168.10.10',
          mac: '00:11:32:AB:CD:01',
          protocol: 'Ethernet / Telnet / SMBv1',
          firmware: 'v4.2.0 (Atual)',
          isVulnerable: true,
          category: 'network',
          hasAlert: true,
          telemetry: [
            { label: 'Serviços Legados', value: 'Telnet (Porta 23) e SMBv1 habilitados', flag: 'danger' },
            { label: 'Pasta /backups-familia', value: 'Acesso anônimo (Convidado: Leitura/Escrita)', flag: 'danger' },
            { label: 'RAID de Discos', value: 'Saudável (2x 4TB)', flag: 'ok' }
          ],
          logs: [
            '[21:05:10] WARN  Varredura detectada nas portas 23 (Telnet) e 445 (SMBv1)',
            '[21:06:02] ALERT Leitura anônima iniciada em /backups-familia/documentos'
          ],
          vulnerability: {
            question: 'Qual vulnerabilidade crítica o NAS / Hub IoT apresenta?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Protocolos inseguros ativos (Telnet e SMBv1) e compartilhamento de arquivos anônimo',
                correct: true
              },
              { id: 'v2', text: 'Conexão via cabo Ethernet em vez de Bluetooth' },
              { id: 'v3', text: 'Uso de discos em configuração RAID' }
            ],
            explanation:
              'Telnet transmite senhas em texto claro, SMBv1 tem falhas históricas exploradas por ransomware (como WannaCry) e pastas anônimas expõem arquivos sensíveis.'
          },
          threat: {
            question: 'Qual ameaça pode atingir os arquivos do NAS?',
            options: [
              {
                id: 't1',
                text: 'Roubo de arquivos pessoais e criptografia maliciosa por Ransomware/Worm de rede',
                correct: true
              },
              { id: 't2', text: 'Diminuição da capacidade física dos HDs de 4TB para 1TB' },
              { id: 't3', text: 'Interferência no sinal de rádio FM da cozinha' }
            ],
            explanation:
              'Com SMBv1 e acesso anônimo com escrita, qualquer dispositivo comprometido na rede pode roubar ou criptografar todos os backups da família.'
          },
          measure: {
            question: 'Qual medida protege o NAS doméstico?',
            options: [
              {
                id: 'm1',
                text: 'Desativar Telnet e SMBv1, exigir SSH/SMBv3 criptografado e restringir pastas com usuários autenticados',
                quality: 'ideal',
                feedback:
                  'Excelente! Eliminar protocolos legados e aplicar controle de acesso por usuário protege tanto o servidor quanto os backups.'
              },
              {
                id: 'm2',
                text: 'Apenas renomear a pasta "/backups-familia" mantendo o acesso anônimo',
                quality: 'wrong',
                feedback:
                  'Inadequado: pastas compartilhadas continuam listáveis na rede e SMBv1/Telnet permanecem vulneráveis.'
              },
              {
                id: 'm3',
                text: 'Desativar o Telnet, mas manter SMBv1 e acesso convidado para facilitar o uso',
                quality: 'partial',
                feedback:
                  'Parcial: remove o Telnet, mas mantém o SMBv1 e o compartilhamento anônimo expostos a ransomware.'
              }
            ]
          }
        }
      ]
    },

    /* ========================================================================
       NÍVEL 3: SMART HOME SOB ATAQUE — DEFESA AVANÇADA
       ======================================================================== */
    {
      id: 3,
      title: 'Nível 3: Smart Home Sob Ataque',
      subtitle: 'Resposta a Incidentes & Defesa Avançada',
      difficulty: 'Avançado',
      description:
        'Alerta vermelho! Indicadores de ataque ativo foram detectados em toda a residência: comportamento de Botnet, pareamento intruso, dispositivo End-of-Life, credential stuffing e tentativa de ransomware. Contenha todas as ameaças sem gerar falsos positivos!',
      rooms: ['fachada', 'sala', 'escritorio'],
      alerts: [
        {
          id: 'l3-a1',
          severity: 'high',
          roomId: 'fachada',
          deviceId: 'l3-camera',
          title: 'Tráfego de saída massivo (Botnet)',
          message: 'Câmera IP saturando o upload com 420 Mbps para IPs externos.'
        },
        {
          id: 'l3-a2',
          severity: 'high',
          roomId: 'fachada',
          deviceId: 'l3-lock',
          title: 'Novo smartphone pareado sem permissão',
          message: 'Dispositivo desconhecido "Galaxy-X9" vinculado à fechadura.'
        },
        {
          id: 'l3-a3',
          severity: 'high',
          roomId: 'sala',
          deviceId: 'l3-router',
          title: 'Host intruso detectado na LAN',
          message: 'Equipamento "kali-host" conectado na rede principal com firewall desativado.'
        },
        {
          id: 'l3-a4',
          severity: 'medium',
          roomId: 'sala',
          deviceId: 'l3-lamp',
          title: 'Tentativa de pivoting via lâmpada',
          message: 'Lâmpada sem suporte (End-of-Life) enviando requisições suspeitas ao gateway.'
        },
        {
          id: 'l3-a5',
          severity: 'high',
          roomId: 'escritorio',
          deviceId: 'l3-webcam',
          title: 'Webcam transmitindo fora de uso',
          message: 'LED de gravação ativo sem nenhuma reunião aberta no computador.'
        },
        {
          id: 'l3-a6',
          severity: 'high',
          roomId: 'escritorio',
          deviceId: 'l3-nas',
          title: 'Atividade suspeita de criptografia',
          message: 'Múltiplos arquivos sendo renomeados rapidamente no diretório /docs.'
        },
        {
          id: 'l3-a7',
          severity: 'medium',
          roomId: 'escritorio',
          deviceId: 'l3-fridge',
          title: 'Disparo de spam pela Geladeira',
          message: '310 e-mails enviados automaticamente pela conta conectada no painel.'
        }
      ],
      devices: [
        {
          id: 'l3-camera',
          name: 'Câmera IP Externa',
          roomId: 'fachada',
          icon: 'camera',
          sceneSlot: 'camera',
          x: 14,
          y: 74,
          ip: '192.168.1.24',
          mac: 'A4:C1:38:9F:10:2B',
          protocol: 'Wi-Fi / SSH & Telnet Abertos',
          firmware: 'v1.1.0 (2021 — Crítico)',
          isVulnerable: true,
          category: 'firmware',
          hasAlert: true,
          telemetry: [
            { label: 'Uso de CPU / Upload', value: 'CPU 98% | Upload constante: 420 Mbps', flag: 'danger' },
            { label: 'Firmware & Portas', value: 'Firmware 2021 + Telnet/SSH expostos', flag: 'danger' },
            { label: 'Destino do Tráfego', value: 'Milhares de requisições SYN flood externas', flag: 'danger' }
          ],
          logs: [
            '[04:01:12] ALERT Processo desconhecido "/tmp/.mirai" consumindo 98% da CPU',
            '[04:01:15] ALERT Ataque SYN flood de saída detectado contra múltiplos alvos externos'
          ],
          vulnerability: {
            question: 'Qual vulnerabilidade permitiu o comprometimento da Câmera IP?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Firmware obsoleto com serviços de terminal (Telnet/SSH) expostos permitindo execução remota',
                correct: true
              },
              { id: 'v2', text: 'Velocidade de internet muito rápida contratada pela família' },
              { id: 'v3', text: 'Instalação da câmera sob o telhado da fachada' }
            ],
            explanation:
              'Câmeras com firmware antigo e Telnet/SSH expostos são alvos clássicos de malware IoT que se instala na memória do aparelho.'
          },
          threat: {
            question: 'Qual ameaça está em curso na câmera?',
            options: [
              {
                id: 't1',
                text: 'Sequestro do dispositivo para integrar uma Botnet IoT (tipo Mirai) lançando ataques DDoS',
                correct: true
              },
              { id: 't2', text: 'Descalibragem do sensor infravermelho noturno' },
              { id: 't3', text: 'Apenas backup automático das gravações na nuvem' }
            ],
            explanation:
              'CPU em 98%, processo oculto e flood de saída para IPs externos são sinais clássicos de dispositivo zumbi em uma Botnet DDoS.'
          },
          measure: {
            question: 'Qual é a resposta a incidente correta?',
            options: [
              {
                id: 'm1',
                text: 'Isolar da rede, realizar reset de fábrica, atualizar o firmware, fechar Telnet/SSH e trocar todas as senhas',
                quality: 'ideal',
                feedback:
                  'Resposta exemplar! Isolamento + reset limpa o malware; atualização, fechamento de portas e novas credenciais impedem a reinfecção.'
              },
              {
                id: 'm2',
                text: 'Apenas reiniciar a câmera na tomada sem atualizar o firmware',
                quality: 'partial',
                feedback:
                  'Parcial: embora alguns malwares IoT fiquem só na RAM, sem atualizar e fechar as portas a câmera será reinfectada em minutos.'
              },
              {
                id: 'm3',
                text: 'Aumentar o plano de internet para parar a lentidão',
                quality: 'wrong',
                feedback:
                  'Inadequado: isso apenas daria ainda mais largura de banda para o ataque DDoS da botnet!'
              }
            ]
          }
        },
        {
          id: 'l3-lock',
          name: 'Fechadura Inteligente',
          roomId: 'fachada',
          icon: 'lock',
          sceneSlot: 'lock',
          x: 31,
          y: 67,
          ip: '192.168.1.30',
          mac: '7C:2F:80:41:AA:19',
          protocol: 'Bluetooth BLE (Modo Aberto)',
          firmware: 'v3.6.0 (Atual)',
          isVulnerable: true,
          category: 'network',
          hasAlert: true,
          telemetry: [
            { label: 'Pareamento Bluetooth', value: 'Sempre visível — SEM PIN de pareamento', flag: 'danger' },
            { label: 'Dispositivos Pareados', value: '3 (incluindo "Galaxy-X9" desconhecido)', flag: 'danger' },
            { label: 'Logs de Proximidade', value: 'Conexão estabelecida da calçada às 22:48', flag: 'warn' }
          ],
          logs: [
            '[22:48:03] ALERT Novo dispositivo pareado via BLE sem confirmação física: "Galaxy-X9"',
            '[22:49:10] WARN  Tentativa de leitura de chaves virtuais via aplicativo externo'
          ],
          vulnerability: {
            question: 'Qual vulnerabilidade foi explorada na Fechadura Inteligente?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Modo de pareamento Bluetooth permanentemente aberto e sem autenticação física/PIN',
                correct: true
              },
              { id: 'v2', text: 'Firmware atualizado para a versão 3.6.0' },
              { id: 'v3', text: 'A fechadura estar instalada em porta de madeira' }
            ],
            explanation:
              'Deixar o pareamento Bluetooth sempre aberto permite que qualquer pessoa próxima à fachada vincule seu celular à fechadura.'
          },
          threat: {
            question: 'Qual ameaça resulta desse pareamento indevido?',
            options: [
              {
                id: 't1',
                text: 'Sequestro de acesso físico por invasor próximo (pareamento não autorizado / Bluejacking)',
                correct: true
              },
              { id: 't2', text: 'Envio de spam pelo e-mail da geladeira' },
              { id: 't3', text: 'Alteração do DNS do roteador da sala' }
            ],
            explanation:
              'Com o celular pareado sem autorização, o atacante pode destravar a residência silenciosamente quando os moradores saírem.'
          },
          measure: {
            question: 'Como conter e corrigir essa vulnerabilidade?',
            options: [
              {
                id: 'm1',
                text: 'Remover o dispositivo desconhecido, desativar o modo de pareamento contínuo e exigir botão físico/PIN para novos vínculos',
                quality: 'ideal',
                feedback:
                  'Excelente! Remove o acesso intruso imediatamente e garante que nenhum novo aparelho se conecte sem presença interna.'
              },
              {
                id: 'm2',
                text: 'Apenas remover "Galaxy-X9" mantendo o pareamento sempre aberto',
                quality: 'partial',
                feedback:
                  'Parcial: o invasor pode simplesmente parear o celular de novo ao passar na calçada.'
              },
              {
                id: 'm3',
                text: 'Deixar o dispositivo pareado para monitorar se ele volta',
                quality: 'wrong',
                feedback:
                  'Perigoso! Manter um aparelho intruso autorizado na fechadura coloca a segurança física da casa em risco imediato.'
              }
            ]
          }
        },
        {
          id: 'l3-garden-lamp',
          name: 'Lâmpadas da Fachada',
          roomId: 'fachada',
          icon: 'lamp',
          sceneSlot: 'gardenLamp',
          x: 26,
          y: 86,
          ip: 'Zigbee Node #09',
          mac: '00:15:8D:00:09:F2',
          protocol: 'Zigbee Local (Sem Internet)',
          firmware: 'v5.1.0 (Assinado e Atual)',
          isVulnerable: false,
          category: 'safe',
          hasAlert: false,
          telemetry: [
            { label: 'Exposição à Internet', value: 'Nenhuma — Controle 100% local via Hub', flag: 'ok' },
            { label: 'Integridade do Firmware', value: 'Assinatura digital validada (v5.1.0)', flag: 'ok' },
            { label: 'Criptografia', value: 'Zigbee 3.0 AES-128', flag: 'ok' }
          ],
          logs: [
            '[18:05:00] INFO  Acendimento automático ao pôr do sol',
            '[23:00:00] INFO  Nenhuma comunicação externa ou anomalia detectada'
          ],
          vulnerability: {
            question: 'Após inspecionar as Lâmpadas da Fachada, qual é o diagnóstico?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)', correct: true },
              { id: 'v1', text: 'Dispositivo comprometido enviando spam externo' },
              { id: 'v2', text: 'Firmware corrompido sem assinatura digital' },
              { id: 'v3', text: 'Porta Telnet exposta na rede WAN' }
            ],
            explanation:
              'As lâmpadas externas funcionam localmente em Zigbee 3.0 criptografado, sem exposição direta à internet e com firmware assinado. Totalmente seguras!'
          }
        },
        {
          id: 'l3-router',
          name: 'Roteador Wi-Fi',
          roomId: 'sala',
          icon: 'router',
          sceneSlot: 'router',
          x: 15,
          y: 28,
          ip: '192.168.1.1',
          mac: '00:1A:2B:3C:4D:5E',
          protocol: 'Wi-Fi 6',
          firmware: 'v5.2.0 (Atual)',
          isVulnerable: true,
          category: 'network',
          hasAlert: true,
          telemetry: [
            { label: 'Dispositivos Conectados', value: '14 — Intruso "kali-host" na rede principal', flag: 'danger' },
            { label: 'Firewall SPI', value: 'Desativado', flag: 'danger' },
            { label: 'Segmentação IoT / Visitantes', value: 'Desativada (tudo na mesma rede)', flag: 'warn' }
          ],
          logs: [
            '[22:30:11] ALERT Novo cliente "kali-host" (MAC alterado) entrou usando senha antiga de visitante',
            '[22:31:04] ALERT ARP Spoofing e varredura lateral detectados contra o NAS e PCs'
          ],
          vulnerability: {
            question: 'Qual vulnerabilidade crítica foi detectada no Roteador Wi-Fi?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Firewall SPI desativado, ausência de segmentação de rede e dispositivo intruso ativo',
                correct: true
              },
              { id: 'v2', text: 'Roteador compatível com Wi-Fi 6' },
              { id: 'v3', text: 'Uso de endereço IP privado 192.168.1.1' }
            ],
            explanation:
              'Sem segmentação de rede e com o Firewall SPI desativado, um intruso que obteve a senha antiga consegue atacar diretamente todos os dispositivos internos.'
          },
          threat: {
            question: 'Qual ameaça está acontecendo na rede local?',
            options: [
              {
                id: 't1',
                text: 'Invasão ativa da rede doméstica com ARP Spoofing, captura de tráfego e ataque lateral',
                correct: true
              },
              { id: 't2', text: 'Apenas atualização normal dos dispositivos da casa' },
              { id: 't3', text: 'Interrupção da energia elétrica da residência' }
            ],
            explanation:
              'ARP Spoofing permite interceptar comunicações internas (MitM) e escalar o ataque para servidores, câmeras e computadores pessoais.'
          },
          measure: {
            question: 'Qual medida contém o intruso e fortalece a rede?',
            options: [
              {
                id: 'm1',
                text: 'Desconectar/bloquear o intruso, ativar Firewall SPI, trocar a senha WPA3 e separar redes Principal, Visitantes e IoT',
                quality: 'ideal',
                feedback:
                  'Excelente contenção! Expulsa o invasor, reativa a inspeção de pacotes e impede futuros movimentos laterais.'
              },
              {
                id: 'm2',
                text: 'Apenas bloquear o MAC do "kali-host" sem trocar a senha nem ativar o firewall',
                quality: 'partial',
                feedback:
                  'Parcial: como o log já mostrou uso de MAC spoofing, o invasor pode trocar de MAC e reconectar com a mesma senha.'
              },
              {
                id: 'm3',
                text: 'Desativar o Wi-Fi 5GHz deixando o 2.4GHz com a mesma senha',
                quality: 'wrong',
                feedback:
                  'Inadequado: o intruso continuará conectado normalmente pela faixa de 2.4GHz.'
              }
            ]
          }
        },
        {
          id: 'l3-lamp',
          name: 'Lâmpadas Inteligentes',
          roomId: 'sala',
          icon: 'lamp',
          sceneSlot: 'lamp',
          x: 34,
          y: 20,
          ip: '192.168.1.45',
          mac: '34:AB:95:11:08:CC',
          protocol: 'Wi-Fi / API REST Local',
          firmware: 'v1.0.4 (2020 — End-of-Life)',
          isVulnerable: true,
          category: 'firmware',
          hasAlert: true,
          telemetry: [
            { label: 'Suporte do Fabricante', value: 'Descontinuado desde 2020 (End-of-Life)', flag: 'danger' },
            { label: 'API REST Local', value: 'Sem token de autenticação — aceita comandos arbitrários', flag: 'danger' },
            { label: 'Segmentação', value: 'Conectada na rede principal junto aos PCs', flag: 'warn' }
          ],
          logs: [
            '[22:34:10] WARN  Requisições POST anômalas na API local da lâmpada',
            '[22:34:42] ALERT Lâmpada usada como ponte enviando pacotes para o gateway 192.168.1.1'
          ],
          vulnerability: {
            question: 'Qual vulnerabilidade as Lâmpadas Inteligentes da sala possuem?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Dispositivo em fim de suporte (End-of-Life) com API local sem autenticação na rede principal',
                correct: true
              },
              { id: 'v2', text: 'Temperatura de cor ajustada para branco quente' },
              { id: 'v3', text: 'Uso de lâmpadas LED econômicas' }
            ],
            explanation:
              'Equipamentos IoT sem atualizações (End-of-Life) e com API aberta não recebem mais correções de segurança e viram elos fracos na rede.'
          },
          threat: {
            question: 'Qual ameaça esse dispositivo aparentemente inofensivo representa?',
            options: [
              {
                id: 't1',
                text: 'Uso do IoT vulnerável como ponto de pivô (pivoting) para atacar outros dispositivos da casa',
                correct: true
              },
              { id: 't2', text: 'Cegueira temporária dos sensores externos' },
              { id: 't3', text: 'Perda de garantia da instalação elétrica' }
            ],
            explanation:
              'Mesmo uma lâmpada comprometida pode armazenar scripts maliciosos e servir de ponto de apoio (pivoting) dentro da rede interna.'
          },
          measure: {
            question: 'Como lidar com um dispositivo IoT em fim de suporte (End-of-Life)?',
            options: [
              {
                id: 'm1',
                text: 'Isolá-lo em uma VLAN restrita sem acesso à rede principal/internet ou substituí-lo por modelo com suporte ativo',
                quality: 'ideal',
                feedback:
                  'Perfeito! Quando não há mais atualizações oficiais, o isolamento rígido em VLAN ou a substituição são as únicas soluções seguras.'
              },
              {
                id: 'm2',
                text: 'Aguardar o fabricante lançar uma nova atualização no próximo mês',
                quality: 'wrong',
                feedback:
                  'Inadequado: produtos End-of-Life não recebem mais atualizações de segurança do fabricante.'
              },
              {
                id: 'm3',
                text: 'Apenas trocar o nome da lâmpada no aplicativo',
                quality: 'wrong',
                feedback:
                  'Inadequado: renomear o dispositivo não altera a API desprotegida nem corrige falhas de firmware.'
              }
            ]
          }
        },
        {
          id: 'l3-tv',
          name: 'Smart TV',
          roomId: 'sala',
          icon: 'tv',
          sceneSlot: 'tv',
          x: 47,
          y: 34,
          ip: '192.168.30.52',
          mac: 'C8:3A:35:29:EF:10',
          protocol: 'Wi-Fi (VLAN Mídia) / DoH',
          firmware: 'Atualizado (Último patch)',
          isVulnerable: false,
          category: 'safe',
          hasAlert: false,
          telemetry: [
            { label: 'Câmera e Microfone', value: 'Desativados via chave física de privacidade', flag: 'ok' },
            { label: 'Apps & Sistema', value: 'Somente loja oficial + Patch de segurança atual', flag: 'ok' },
            { label: 'Rede & DNS', value: 'VLAN de mídia isolada + DNS criptografado (DoH)', flag: 'ok' }
          ],
          logs: [
            '[20:00:12] INFO  Streaming oficial iniciado (HTTPS TLS 1.3)',
            '[22:35:00] INFO  Tentativa de varredura externa bloqueada pelo isolamento de VLAN'
          ],
          vulnerability: {
            question: 'Após auditar a Smart TV neste cenário, qual é o diagnóstico?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)', correct: true },
              { id: 'v1', text: 'App pirata enviando dados para servidor externo' },
              { id: 'v2', text: 'Microfone gravando sem autorização' },
              { id: 'v3', text: 'Smart TV conectada na mesma rede do intruso sem isolamento' }
            ],
            explanation:
              'A Smart TV está atualizada, isolada em VLAN de mídia, com DNS seguro e chave física de microfone/câmera desligada. Excelente análise!'
          }
        },
        {
          id: 'l3-webcam',
          name: 'Webcam do Escritório',
          roomId: 'escritorio',
          icon: 'webcam',
          sceneSlot: 'webcam',
          x: 82,
          y: 22,
          ip: '192.168.1.72',
          mac: '98:5F:D3:44:2E:11',
          protocol: 'Wi-Fi / Nuvem P2P',
          firmware: 'v2.2.1 (Atual)',
          isVulnerable: true,
          category: 'password',
          hasAlert: true,
          telemetry: [
            { label: 'Status da Câmera', value: 'TRANSMITINDO AGORA (sem chamada ativa)', flag: 'danger' },
            { label: 'Conta em Nuvem', value: 'Mesma senha vazada em data breach de 2024', flag: 'danger' },
            { label: '2FA & Tampa Física', value: '2FA desativado | Sem tampa de lente', flag: 'warn' }
          ],
          logs: [
            '[22:40:01] ALERT Login bem-sucedido na conta da nuvem vindo de país desconhecido',
            '[22:40:14] ALERT Stream ao vivo iniciado remotamente (usuário fora do PC)'
          ],
          vulnerability: {
            question: 'Qual vulnerabilidade permitiu o acesso remoto à Webcam?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Reutilização de senha vazada em outro serviço sem autenticação em dois fatores (2FA)',
                correct: true
              },
              { id: 'v2', text: 'Webcam posicionada em cima do monitor' },
              { id: 'v3', text: 'Firmware na versão v2.2.1' }
            ],
            explanation:
              'Usar a mesma senha em vários sites sem 2FA permite que invasores reutilizem credenciais vazadas automaticamente.'
          },
          threat: {
            question: 'Qual é o nome e impacto dessa ameaça?',
            options: [
              {
                id: 't1',
                text: 'Ataque de Credential Stuffing resultando em espionagem ao vivo e invasão grave de privacidade',
                correct: true
              },
              { id: 't2', text: 'Ataque físico ao cabo USB da webcam' },
              { id: 't3', text: 'Descalibragem de cores do monitor' }
            ],
            explanation:
              'No Credential Stuffing, robôs testam combinações de e-mail e senha vazadas em outros sites para invadir contas sem 2FA.'
          },
          measure: {
            question: 'Qual medida corrige o problema imediatamente?',
            options: [
              {
                id: 'm1',
                text: 'Revogar todas as sessões ativas, definir senha forte exclusiva, ativar 2FA e usar tampa física de privacidade',
                quality: 'ideal',
                feedback:
                  'Perfeito! Revogar sessões corta o espião na hora; senha única + 2FA + tampa física garantem defesa em profundidade.'
              },
              {
                id: 'm2',
                text: 'Apenas colocar um adesivo na lente sem trocar a senha nem encerrar a sessão',
                quality: 'partial',
                feedback:
                  'Parcial: bloqueia a imagem, mas o invasor continua logado na conta podendo captar áudio ou gravações anteriores.'
              },
              {
                id: 'm3',
                text: 'Apenas minimizar o navegador do computador',
                quality: 'wrong',
                feedback:
                  'Inadequado: o acesso invasor ocorre diretamente pela conta na nuvem da câmera.'
              }
            ]
          }
        },
        {
          id: 'l3-nas',
          name: 'NAS / Hub IoT Doméstico',
          roomId: 'escritorio',
          icon: 'nas',
          sceneSlot: 'nas',
          x: 64,
          y: 43,
          ip: '192.168.1.10',
          mac: '00:11:32:AB:CD:01',
          protocol: 'Ethernet / API Admin',
          firmware: 'v4.5.1',
          isVulnerable: true,
          category: 'network',
          hasAlert: true,
          telemetry: [
            { label: 'Chave de API Root', value: 'Chave fixa (hardcoded) sem rotação', flag: 'danger' },
            { label: 'Backup Offline (3-2-1)', value: 'Inexistente (apenas cópia online no próprio NAS)', flag: 'danger' },
            { label: 'Atividade de Disco', value: '420 arquivos renomeados para .locked em 30s', flag: 'danger' }
          ],
          logs: [
            '[22:43:02] ALERT Chave de API root usada por host intruso 192.168.1.99',
            '[22:43:18] ALERT Criptografia em massa em andamento em /docs — arquivo LEIA_RESGATE.txt criado'
          ],
          vulnerability: {
            question: 'Qual falha de segurança agravou esse incidente no NAS?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Chave administrativa fixa (hardcoded) exposta e ausência de backups offline/imutáveis',
                correct: true
              },
              { id: 'v2', text: 'Armazenamento de documentos em uma pasta chamada /docs' },
              { id: 'v3', text: 'Uso de conexão Ethernet cabeada' }
            ],
            explanation:
              'Chaves root sem rotação permitem controle total se vazadas, e não ter backup offline (regra 3-2-1) impede a recuperação segura após um ataque.'
          },
          threat: {
            question: 'Qual ameaça ativa está destruindo os dados do NAS?',
            options: [
              {
                id: 't1',
                text: 'Ataque de Ransomware sequestrando arquivos pessoais e exigindo resgate',
                correct: true
              },
              { id: 't2', text: 'Compressão automática do sistema para economizar espaço' },
              { id: 't3', text: 'Atualização de drivers de impressora' }
            ],
            explanation:
              'Renomeação rápida de arquivos para .locked e criação de nota de resgate são assinaturas inequívocas de Ransomware.'
          },
          measure: {
            question: 'Qual é a medida correta de contenção e proteção futura?',
            options: [
              {
                id: 'm1',
                text: 'Desconectar o NAS da rede imediatamente, revogar/rotacionar chaves, restaurar sistema limpo e implementar backup offline 3-2-1',
                quality: 'ideal',
                feedback:
                  'Excelente resposta a incidentes! Isolar contém a criptografia, rotacionar chaves remove o acesso e o backup offline 3-2-1 garante resiliência.'
              },
              {
                id: 'm2',
                text: 'Pagar o resgate pedido no arquivo LEIA_RESGATE.txt mantendo as mesmas chaves',
                quality: 'wrong',
                feedback:
                  'Inadequado e perigoso: pagar resgate não garante devolução dos arquivos, financia o crime e mantém a brecha aberta.'
              },
              {
                id: 'm3',
                text: 'Apenas deletar o arquivo LEIA_RESGATE.txt sem desconectar o NAS',
                quality: 'wrong',
                feedback:
                  'Inadequado: o ransomware continua ativo criptografando os demais arquivos da rede.'
              }
            ]
          }
        },
        {
          id: 'l3-fridge',
          name: 'Geladeira Inteligente',
          roomId: 'escritorio',
          icon: 'fridge',
          sceneSlot: 'fridge',
          x: 84,
          y: 70,
          ip: '192.168.1.88',
          mac: 'E4:5F:01:7B:22:90',
          protocol: 'Wi-Fi / Painel Touchscreen',
          firmware: 'OS v1.4 (Navegador de 2021)',
          isVulnerable: true,
          category: 'privacy',
          hasAlert: true,
          telemetry: [
            { label: 'Conta Pessoal Sincronizada', value: 'E-mail principal logado SEM bloqueio de tela', flag: 'danger' },
            { label: 'Navegador Embutido', value: 'Versão 2021 com falha XSS crítica', flag: 'danger' },
            { label: 'Tráfego SMTP', value: '310 e-mails enviados nas últimas 2 horas', flag: 'danger' }
          ],
          logs: [
            '[21:10:04] WARN  Script malicioso executado via página de receitas no navegador da porta',
            '[21:12:30] ALERT Token de sessão do e-mail capturado — disparo de 310 spams de phishing'
          ],
          vulnerability: {
            question: 'Qual vulnerabilidade foi explorada na Geladeira Inteligente?',
            options: [
              { id: 'safe', text: 'Dispositivo Seguro (Nenhuma vulnerabilidade encontrada)' },
              {
                id: 'v1',
                text: 'Conta pessoal principal vinculada sem restrição e software/navegador embutido desatualizado',
                correct: true
              },
              { id: 'v2', text: 'Temperatura do freezer regulada para -18°C' },
              { id: 'v3', text: 'Tela touchscreen exibindo lista de compras' }
            ],
            explanation:
              'Conectar contas pessoais sensíveis em eletrodomésticos com navegadores antigos e sem bloqueio transforma a geladeira em vetor de roubo de conta.'
          },
          threat: {
            question: 'Qual ameaça está ocorrendo a partir da geladeira?',
            options: [
              {
                id: 't1',
                text: 'Comprometimento da conta de e-mail pessoal e uso do aparelho para disparar spam/phishing',
                correct: true
              },
              { id: 't2', text: 'Descongelamento remoto proposital por protocolo SMTP' },
              { id: 't3', text: 'Clonagem do sinal Zigbee das lâmpadas externas' }
            ],
            explanation:
              'Com o token de e-mail roubado via falha no navegador embutido, atacantes disparam phishing para todos os contatos da vítima.'
          },
          measure: {
            question: 'Qual medida corrige o risco na Geladeira Inteligente?',
            options: [
              {
                id: 'm1',
                text: 'Desvincular a conta pessoal, revogar sessões/trocar senha do e-mail, atualizar o software e isolar o aparelho na rede IoT',
                quality: 'ideal',
                feedback:
                  'Perfeito! Eletrodomésticos não precisam da sua conta principal de e-mail; revogar a sessão, atualizar e isolar resolve completamente.'
              },
              {
                id: 'm2',
                text: 'Apenas apagar os e-mails da caixa "Enviados" no painel da geladeira',
                quality: 'wrong',
                feedback:
                  'Inadequado: apagar o histórico não revoga o acesso do atacante nem atualiza o navegador vulnerável.'
              },
              {
                id: 'm3',
                text: 'Manter a conta logada, mas diminuir o brilho da tela',
                quality: 'wrong',
                feedback:
                  'Inadequado: o brilho da tela não tem nenhuma relação com a segurança da conta ou do software.'
              }
            ]
          }
        }
      ]
    }
  ];

  // Achievements / Badges
  const ACHIEVEMENTS = [
    {
      id: 'first-shield',
      title: 'Primeiro Escudo',
      description: 'Corrija sua primeira vulnerabilidade escolhendo a medida de proteção ideal.',
      icon: '🛡️',
      conditionText: 'Aplicar 1 medida ideal'
    },
    {
      id: 'eagle-eye',
      title: 'Olho de Águia',
      description: 'Complete um nível sem nenhum falso positivo em dispositivos que já estavam seguros.',
      icon: '🦅',
      conditionText: '100% de acerto nos dispositivos seguros em um nível'
    },
    {
      id: 'password-hunter',
      title: 'Caçador de Senhas Padrão',
      description: 'Elimine falhas de credenciais padrão, códigos antigos ou senhas vazadas.',
      icon: '🔑',
      conditionText: 'Proteger 3 dispositivos com falha de autenticação'
    },
    {
      id: 'network-defender',
      title: 'Defensor de Rede',
      description: 'Blinde roteadores, protocolos MQTT, HTTP/UPnP e serviços legados de rede.',
      icon: '📡',
      conditionText: 'Proteger 4 dispositivos com falha de rede'
    },
    {
      id: 'firmware-master',
      title: 'Mestre do Firmware',
      description: 'Identifique e neutralize vulnerabilidades de firmware desatualizado e End-of-Life.',
      icon: '⚙️',
      conditionText: 'Proteger 2 dispositivos com falha de firmware'
    },
    {
      id: 'perfect-home',
      title: 'Casa 100% Blindada',
      description: 'Alcance pontuação máxima (100% de segurança) ao concluir qualquer nível.',
      icon: '🏆',
      conditionText: 'Fechar um nível com 100% de segurança'
    },
    {
      id: 'incident-responder',
      title: 'Resposta a Incidentes',
      description: 'Conclua o Nível 3 (Smart Home Sob Ataque) com pelo menos 80% de segurança.',
      icon: '🚨',
      conditionText: 'Concluir Nível 3 com ≥ 80%'
    },
    {
      id: 'iot-guardian',
      title: 'Guardião IoT Supremo',
      description: 'Conclua todos os 3 níveis do simulador protegendo toda a Smart Home.',
      icon: '👑',
      conditionText: 'Concluir os Níveis 1, 2 e 3'
    }
  ];

  // Educational Knowledge Base ("Conteúdos")
  const CONTENTS = [
    {
      id: 'c-passwords',
      tag: 'Autenticação',
      title: 'Senhas Padrão, Reutilização e 2FA',
      summary: 'Por que "admin/admin" é a porta aberta mais explorada em dispositivos IoT.',
      bullets: [
        'Muitos roteadores e câmeras saem de fábrica com credenciais públicas documentadas em manuais online.',
        'Atacantes usam robôs (Credential Stuffing e Força Bruta) para testar senhas padrão e vazadas automaticamente.',
        'Boa prática: use senhas longas e exclusivas para cada aparelho, ative Autenticação em Dois Fatores (2FA) e revogue códigos temporários de terceiros.'
      ]
    },
    {
      id: 'c-firmware',
      tag: 'Atualizações',
      title: 'Firmware Desatualizado, CVEs e End-of-Life',
      summary: 'Como brechas conhecidas transformam dispositivos simples em armas de ataque.',
      bullets: [
        'Firmware é o sistema interno do dispositivo IoT. Falhas descobertas recebem códigos CVE e correções (patches).',
        'Dispositivos sem atualização podem sofrer bypass de segurança ou serem recrutados por Botnets (como a Mirai) para ataques DDoS.',
        'Boa prática: ative atualizações automáticas assinadas e isole (ou substitua) aparelhos em fim de suporte (End-of-Life).'
      ]
    },
    {
      id: 'c-network',
      tag: 'Redes IoT',
      title: 'Wi-Fi Seguro, Segmentação (VLAN) e UPnP',
      summary: 'Protegendo o roteador para evitar movimentação lateral dentro da residência.',
      bullets: [
        'Evite protocolos obsoletos como WEP e desative WPS, gerenciamento remoto via WAN e UPnP.',
        'Separe os aparelhos inteligentes em uma rede/VLAN exclusiva para IoT: se uma lâmpada for invadida, ela não alcança seus computadores ou NAS.',
        'Prefira WPA3 (ou WPA2-AES), DNS confiável e mantenha o Firewall SPI ativado.'
      ]
    },
    {
      id: 'c-protocols',
      tag: 'Protocolos',
      title: 'Criptografia em Trânsito: HTTPS, MQTTS e SMBv3',
      summary: 'Impedindo que dados e comandos sejam lidos ou alterados na rede.',
      bullets: [
        'Protocolos em texto claro (HTTP, Telnet, MQTT na porta 1883 sem TLS) permitem interceptação (Sniffing / Man-in-the-Middle).',
        'Serviços legados como SMBv1 são explorados por worms e ransomware em servidores NAS domésticos.',
        'Boa prática: exija TLS (HTTPS, MQTTS na porta 8883, SSH) e autenticação por usuário com privilégio mínimo.'
      ]
    },
    {
      id: 'c-privacy',
      tag: 'Privacidade',
      title: 'Câmeras, Assistentes Virtuais e Smart TVs',
      summary: 'Equilibrando conveniência doméstica com proteção de áudio, vídeo e dados.',
      bullets: [
        'Nunca permita que comandos abertos de voz destravem portas ou realizem compras sem PIN.',
        'Evite instalar aplicativos fora das lojas oficiais ("fontes desconhecidas") em Smart TVs e revise permissões de microfone.',
        'Desvincule contas pessoais sensíveis de eletrodomésticos e use tampas físicas de privacidade em webcams.'
      ]
    },
    {
      id: 'c-backup',
      tag: 'Resiliência',
      title: 'Resposta a Incidentes e Regra de Backup 3-2-1',
      summary: 'O que fazer quando um ataque (como Ransomware ou Botnet) já está em andamento.',
      bullets: [
        'Primeiro passo em incidentes ativos: conter/isolar o dispositivo comprometido da rede para frear a propagação.',
        'Em seguida: revogar sessões e chaves de API, restaurar firmware íntegro e trocar credenciais.',
        'Regra 3-2-1: mantenha 3 cópias dos dados importantes, em 2 mídias diferentes, sendo 1 cópia offline/externa imune a ransomware.'
      ]
    }
  ];

  window.CyberDefense.DATA = {
    ICONS,
    ROOMS,
    HERO_CALLOUTS,
    LEVELS,
    ACHIEVEMENTS,
    CONTENTS
  };
})();
