#### 15.2.4.1 Tabelas MyISAM Corrompidas

Embora o formato de tabela `MyISAM` seja muito confiável (todas as alterações em uma tabela feitas por uma instrução SQL são gravadas antes que a instrução retorne), você ainda pode ter tabelas corrompidas se algum dos seguintes eventos ocorrer:

* O processo **mysqld** é encerrado (killed) no meio de uma operação de escrita (write).

* Ocorre um desligamento inesperado do computador (por exemplo, o computador é desligado).

* Falhas de Hardware.
* Você está usando um programa externo (como o **myisamchk**) para modificar uma tabela que está sendo modificada pelo server ao mesmo tempo.

* Um bug de software no código MySQL ou `MyISAM`.

Sintomas típicos de uma tabela corrompida são:

* Você recebe o seguinte erro ao selecionar dados da tabela:

  ```sql
  Incorrect key file for table: '...'. Try to repair it
  ```

* Queries não encontram rows na tabela ou retornam resultados incompletos.

Você pode verificar a integridade de uma tabela `MyISAM` usando a instrução `CHECK TABLE` e reparar uma tabela `MyISAM` corrompida com `REPAIR TABLE`. Quando o **mysqld** não estiver em execução, você também pode verificar ou reparar uma tabela com o comando **myisamchk**. Consulte a Seção 13.7.2.2, “Instrução CHECK TABLE”, Seção 13.7.2.5, “Instrução REPAIR TABLE” e Seção 4.6.3, “myisamchk — Utilitário de Manutenção de Tabela MyISAM”.

Se suas tabelas forem corrompidas com frequência, você deve tentar determinar por que isso está acontecendo. A coisa mais importante a saber é se a tabela foi corrompida como resultado de uma saída inesperada do server. Você pode verificar isso facilmente procurando por uma mensagem recente de `restarted mysqld` no error log. Se houver tal mensagem, é provável que a corrupção da tabela seja resultado da falha do server (server dying). Caso contrário, a corrupção pode ter ocorrido durante a operação normal. Isso é um bug. Você deve tentar criar um caso de teste reproduzível que demonstre o problema. Consulte a Seção B.3.3.3, “O que Fazer se o MySQL Continuar a Falhar (Crashing)”, e a Seção 5.8, “Debugging MySQL”.