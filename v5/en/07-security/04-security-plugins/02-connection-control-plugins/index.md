### 6.4.2 Plugins de Controle de Conexão

[6.4.2.1 Instalação do Plugin de Controle de Conexão](connection-control-plugin-installation.html)

[6.4.2.2 Variáveis de Sistema e de Status do Plugin de Controle de Conexão](connection-control-plugin-variables.html)

A partir do MySQL 5.7.17, o MySQL Server inclui uma biblioteca de *plugins* que permite aos administradores introduzir um atraso crescente na resposta do *server* a tentativas de *connection* após um número configurável de tentativas consecutivas falhas. Essa capacidade fornece um impedimento que retarda os ataques de força bruta contra contas de usuários MySQL. A biblioteca de *plugins* contém dois *plugins*:

* `CONNECTION_CONTROL` verifica as tentativas de *connection* de entrada e adiciona um atraso às respostas do *server* conforme necessário. Este *plugin* também expõe variáveis de sistema que permitem que sua operação seja configurada e uma variável de *status* que fornece informações rudimentares de monitoramento.

  O *plugin* `CONNECTION_CONTROL` usa a interface do *audit plugin* (veja [Escrevendo Audit Plugins](/doc/extending-mysql/5.7/en/writing-audit-plugins.html)). Para coletar informações, ele se inscreve na classe de evento `MYSQL_AUDIT_CONNECTION_CLASSMASK` e processa os subeventos `MYSQL_AUDIT_CONNECTION_CONNECT` e `MYSQL_AUDIT_CONNECTION_CHANGE_USER` para verificar se o *server* deve introduzir um atraso antes de responder às tentativas de *connection*.

* `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` implementa uma tabela do `INFORMATION_SCHEMA` que expõe informações de monitoramento mais detalhadas para tentativas de *connection* falhas. Para mais informações sobre esta tabela, veja [Seção 24.6.2, “A Tabela INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS”](information-schema-connection-control-failed-login-attempts-table.html "24.6.2 A Tabela INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS").

As seções a seguir fornecem informações sobre a instalação e a configuração do *plugin* de controle de *connection*.
