### 8.4.2 Plugins de Controle de Conexão

O MySQL Server inclui uma biblioteca de plugins que permite aos administradores introduzir um atraso crescente na resposta do servidor às tentativas de conexão após um número configurável de tentativas falhas consecutivas. Essa capacidade fornece um impedimento que desacelera os ataques de força bruta contra as contas de usuário do MySQL. A biblioteca de plugins contém dois plugins:

* O `CONNECTION_CONTROL` verifica as tentativas de conexão recebidas e adiciona um atraso às respostas do servidor conforme necessário. Este plugin também expõe variáveis de sistema que permitem que sua operação seja configurada e uma variável de status que fornece informações rudimentares de monitoramento.

  O plugin `CONNECTION_CONTROL` usa a interface do plugin de auditoria (veja Escrevendo Plugins de Auditoria). Para coletar informações, ele se inscreve na classe de eventos `MYSQL_AUDIT_CONNECTION_CLASSMASK` e processa os subeventos `MYSQL_AUDIT_CONNECTION_CONNECT` e `MYSQL_AUDIT_CONNECTION_CHANGE_USER` para verificar se o servidor deve introduzir um atraso antes de responder às tentativas de conexão.
* O `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` implementa uma tabela do `INFORMATION_SCHEMA` que expõe informações de monitoramento mais detalhadas para tentativas de conexão falhas. Para mais informações sobre essa tabela, consulte a Seção 28.6.2, “A Tabela `INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`”.

As seções a seguir fornecem informações sobre a instalação e configuração do plugin de controle de conexão.