### 8.4.3 Plugins de Controle de Conexão

8.4.3.1 Instalação do Plugin de Controle de Conexão

8.4.3.2 Variáveis de Sistema e Status do Plugin de Controle de Conexão

Observação

Os plugins de Controle de Conexão estão desatualizados e estão sujeitos à remoção em uma versão futura do MySQL. Eles são substituídos pelo Componente de Controle de Conexão. Para mais informações, consulte a Seção 8.4.2.3, “Migrando para o Componente de Controle de Conexão”.

O MySQL Server inclui uma biblioteca de plugins que permite que os administradores introduzam um atraso crescente na resposta do servidor às tentativas de conexão após um número configurável de tentativas falhadas consecutivas. Essa capacidade fornece um impedimento que desacelera os ataques de força bruta contra as contas de usuário do MySQL. A biblioteca de plugins contém dois plugins:

* O `CONNECTION_CONTROL` verifica as tentativas de conexão recebidas e adiciona um atraso às respostas do servidor conforme necessário. Este plugin também expõe variáveis de sistema que permitem que sua operação seja configurada e uma variável de status que fornece informações rudimentares de monitoramento.

  O plugin `CONNECTION_CONTROL` usa a interface do plugin de auditoria (veja Escrevendo Plugins de Auditoria). Para coletar informações, ele se inscreve na classe de eventos `MYSQL_AUDIT_CONNECTION_CLASSMASK` e processa os subeventos `MYSQL_AUDIT_CONNECTION_CONNECT` e `MYSQL_AUDIT_CONNECTION_CHANGE_USER` para verificar se o servidor deve introduzir um atraso antes de responder às tentativas de conexão.

* `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` implementa uma tabela do `INFORMATION_SCHEMA` que expõe informações de monitoramento mais detalhadas para tentativas de conexão falhas. Para mais informações sobre essa tabela, consulte a Seção 28.6.2, “A Tabela de MONITORAMENTO DE TENTATIVAS DE CONEXÃO COM SUCESSO DO `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`”.

As seções a seguir fornecem informações sobre a instalação e configuração do plugin de controle de conexão.