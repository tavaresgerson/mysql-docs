### 6.4.2 Plugins de controle de conexão

6.4.2.1 Instalação do Plugin de Controle de Conexão

Sistema de Plugin de Controle de Conexão e Variáveis de Status

A partir do MySQL 5.7.17, o MySQL Server inclui uma biblioteca de plugins que permite que os administradores introduzam um atraso crescente na resposta do servidor às tentativas de conexão após um número configurável de tentativas consecutivas falhas. Essa capacidade oferece uma dissuasão que desacelera os ataques de força bruta contra as contas de usuários do MySQL. A biblioteca de plugins contém dois plugins:

- `CONNECTION_CONTROL` verifica as tentativas de conexão recebidas e adiciona um atraso nas respostas do servidor conforme necessário. Este plugin também exibe variáveis do sistema que permitem a configuração de sua operação e uma variável de status que fornece informações de monitoramento rudimentares.

  O plugin `CONNECTION_CONTROL` usa a interface do plugin de auditoria (veja Escrevendo Plugins de Auditoria). Para coletar informações, ele se inscreve na classe de eventos `MYSQL_AUDIT_CONNECTION_CLASSMASK` e processa os subeventos `MYSQL_AUDIT_CONNECTION_CONNECT` e `MYSQL_AUDIT_CONNECTION_CHANGE_USER` para verificar se o servidor deve introduzir um atraso antes de responder às tentativas de conexão.

- `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` implementa uma tabela `INFORMATION_SCHEMA` que expõe informações de monitoramento mais detalhadas para tentativas de login malsucedidas. Para obter mais informações sobre essa tabela, consulte Seção 24.6.2, “A Tabela INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS”.

As seções a seguir fornecem informações sobre a instalação e configuração do plugin de controle de conexão.
