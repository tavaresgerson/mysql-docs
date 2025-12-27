### 27.3.2 Obter Informações Sobre Programas Armazenados em JavaScript

Você pode obter metadados sobre programas armazenados em JavaScript da mesma maneira que pode fazer com programas armazenados em SQL; veja a Seção 27.2.3, “Metadados de Rotinas Armazenadas”.

Informações adicionais relacionadas ao componente MLE, que fornece a funcionalidade de programas armazenados em JavaScript, podem ser obtidas verificando os valores das variáveis de sistema do servidor e status que este componente disponibiliza. Consulte a Seção 7.5.7.2, “Status do Componente MLE e Informações de Sessão”, para obter informações sobre isso.

Para obter informações sobre o uso de memória por programas armazenados em JavaScript, consulte a Seção 7.5.7.3, “Memória e Uso de Fios do Componente MLE”

Você pode recuperar a instrução usada para criar uma rotina armazenada MLE usando `SHOW CREATE FUNCTION` ou `SHOW CREATE PROCEDURE`, como com qualquer outra rotina armazenada MySQL. Os metadados da rotina armazenada podem ser recuperados consultando a tabela do Schema de Informações `ROUTINES`, ou emitindo `SHOW FUNCTION STATUS` ou `SHOW PROCEDURE STATUS` conforme apropriado. Esses metadados são armazenados no dicionário de dados MySQL e são persistentes.

Você pode recuperar a instrução usada para criar uma biblioteca JavaScript MLE usando `SHOW CREATE LIBRARY`. Informações sobre as bibliotecas usadas por rotinas podem ser encontradas na tabela do Schema de Informações `ROUTINE_LIBRARIES`, bem como na tabela `mysql_option.option_usage` (consulte a Seção 7.5.8.1, “Tabelas de Rastreador de Opções”). Esses metadados também são armazenados no dicionário de dados MySQL.

Informações sobre o estado do componente na sessão atual do usuário podem ser adquiridas usando a função carregável `mle_session_state()`, que é descrita em outro lugar nesta seção.