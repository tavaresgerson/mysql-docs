#### 15.2.4.1 Tabelas Corrompidas do MyISAM

Embora o formato de tabela `MyISAM` seja muito confiável (todas as alterações em uma tabela feitas por uma instrução SQL são escritas antes de a instrução retornar), ainda é possível que as tabelas sejam corrompidas se algum dos seguintes eventos ocorrer:

- O processo **mysqld** é interrompido durante uma escrita.

- Um desligamento inesperado do computador ocorre (por exemplo, o computador é desligado).

- Falhas de hardware.

- Você está usando um programa externo (como **myisamchk**) para modificar uma tabela que está sendo modificada pelo servidor ao mesmo tempo.

- Um erro de software no código MySQL ou `MyISAM`.

Os sintomas típicos de uma tabela corrupta são:

- Você recebe o seguinte erro ao selecionar dados da tabela:

  ```sql
  Incorrect key file for table: '...'. Try to repair it
  ```

- As consultas não encontram linhas na tabela ou retornam resultados incompletos.

Você pode verificar a saúde de uma tabela `MyISAM` usando a instrução `CHECK TABLE` e reparar uma tabela `MyISAM` corrompida com a instrução `REPAIR TABLE`. Quando o **mysqld** não está em execução, você também pode verificar ou reparar uma tabela com o comando **myisamchk**. Veja a Seção 13.7.2.2, “Instrução CHECK TABLE”, a Seção 13.7.2.5, “Instrução REPAIR TABLE” e a Seção 4.6.3, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”.

Se suas tabelas forem corrompidas com frequência, você deve tentar determinar por que isso está acontecendo. A coisa mais importante a saber é se a tabela foi corrompida como resultado de uma saída inesperada do servidor. Você pode verificar isso facilmente procurando uma mensagem recente de `restarted mysqld` no log de erro. Se houver tal mensagem, é provável que a corrupção da tabela seja resultado do servidor falhando. Caso contrário, a corrupção pode ter ocorrido durante a operação normal. Isso é um bug. Você deve tentar criar um caso de teste reproduzível que demonstre o problema. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”, e a Seção 5.8, “Depuração do MySQL”.
