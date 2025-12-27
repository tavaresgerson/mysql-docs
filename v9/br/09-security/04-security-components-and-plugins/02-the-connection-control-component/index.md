### 8.4.2 O Componente de Controle de Conexão

8.4.2.1 Instalação do Componente de Controle de Conexão

8.4.2.2 Configuração do Componente de Controle de Conexão

8.4.2.3 Migração para o Componente de Controle de Conexão

O componente de controle de conexão para MySQL (`component_connection_control`) permite introduzir um atraso crescente na resposta do servidor MySQL às tentativas de conexão após um número arbitrário de tentativas consecutivas de falha. Essa capacidade fornece um impedimento que desacelera os ataques de força bruta contra as contas de usuários do MySQL.

* Propósito: Monitorar tentativas de conexão falhas; adicionar um atraso na resposta a uma conta com um número excessivo de tentativas.

* URN: `file://component_connection_control`

O `component_connection_control` foi introduzido no MySQL 9.2.0 como uma substituição única para ambos os plugins de controle de conexão, que agora estão desatualizados (consulte a Seção 8.4.3, “Plugins de Controle de Conexão”, para mais informações sobre esses plugins).

Este componente também expõe variáveis de sistema que permitem que sua operação seja configurada e uma variável de status que fornece informações básicas de monitoramento; essas são descritas na Seção 8.4.2.2, “Configuração do Componente de Controle de Conexão”, e em outros lugares. Além disso, o `component_connection_control` implementa uma tabela do Schema de Desempenho `connection_control_failed_login_attempts` que fornece informações detalhadas de monitoramento para tentativas de conexão falhas. Para mais informações sobre essa tabela, consulte a Seção 29.12.22.2, “A tabela connection\_control\_failed\_login\_attempts”.

O componente também suporta o componente MySQL Option Tracker (parte da MySQL Enterprise Edition, uma oferta comercial). Consulte a Seção 7.5.8.2, “Componentes suportados pelo Option Tracker”, para mais informações.

As duas primeiras seções a seguir fornecem informações sobre a instalação e configuração do componente. Uma seção adicional, Seção 8.4.2.3, “Migração para o Componente de Controle de Conexão”, fornece orientações sobre a migração dos plugins de Controle de Conexão para o componente de Controle de Conexão.