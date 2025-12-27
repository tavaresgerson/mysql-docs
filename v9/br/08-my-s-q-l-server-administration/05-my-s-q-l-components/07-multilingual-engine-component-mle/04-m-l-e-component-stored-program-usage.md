#### 7.5.7.4 Uso de Programas Armazenados MLE

Várias variáveis de status do sistema fornecem informações sobre o uso dos programas armazenados MLE. As variáveis de status `mle_stored_procedures`, `mle_stored_functions` e `mle_stored_programs` mostram, respectivamente, o número de procedimentos armazenados MLE, funções armazenadas MLE e programas armazenados MLE que estão atualmente em cache, em todas as sessões do usuário.

Outras métricas de programas armazenados MLE podem ser obtidas a partir de duas variáveis de status `mle_stored_program_bytes_max`, que fornece o tamanho, em bytes, do maior programa armazenado MLE atual, e `mle_stored_program_sql_max` mostra o número máximo de instruções SQL executadas por qualquer programa armazenado MLE.

Outras informações sobre programas armazenados MLE podem ser encontradas na tabela do esquema de informações `ROUTINES`.

Programas armazenados MLE no MySQL Enterprise Edition 9.5 suportam bibliotecas de JavaScript importadas. Informações sobre bibliotecas MLE de JavaScript estão disponíveis nas duas tabelas do esquema de informações `LIBRARIES` e `ROUTINE_LIBRARIES`. Para mais informações e exemplos de uso, consulte as descrições dessas tabelas, bem como a Seção 27.3.8, “Usando Bibliotecas de JavaScript”.

`SHOW LIBRARY STATUS` também pode fornecer informações úteis sobre uma ou mais bibliotecas de JavaScript; consulte a Seção 27.3.8, “Usando Bibliotecas de JavaScript”.