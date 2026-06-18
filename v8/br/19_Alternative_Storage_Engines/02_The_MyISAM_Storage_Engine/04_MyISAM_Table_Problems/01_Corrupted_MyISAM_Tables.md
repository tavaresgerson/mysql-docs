#### 18.2.4.1 Tabelas Corrompidas do MyISAM

Embora o formato da tabela `MyISAM` seja muito confiável (todas as alterações em uma tabela feitas por uma instrução SQL são escritas antes de a instrução retornar), ainda é possível obter tabelas corrompidas se algum dos seguintes eventos ocorrer:

- O processo **mysqld** é interrompido durante uma escrita.

- Um desligamento inesperado do computador ocorre (por exemplo, o computador é desligado).

- Falhas de hardware.

- Você está usando um programa externo (como **myisamchk**) para modificar uma tabela que está sendo modificada pelo servidor ao mesmo tempo.

- Um erro de software no código MySQL ou no código `MyISAM`.

Os sintomas típicos de uma tabela corrupta são:

- Você recebe o seguinte erro ao selecionar dados da tabela:

  ```
  Incorrect key file for table: '...'. Try to repair it
  ```

- As consultas não encontram linhas na tabela ou retornam resultados incompletos.

Você pode verificar a saúde de uma tabela `MyISAM` usando a instrução `CHECK TABLE` e reparar uma tabela `MyISAM` corrompida com `REPAIR TABLE`. Quando o **mysqld** não estiver em execução, você também pode verificar ou reparar uma tabela com o comando **myisamchk**. Veja a Seção 15.7.3.2, “Instrução CHECK TABLE”, a Seção 15.7.3.5, “Instrução REPAIR TABLE” e a Seção 6.6.4, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”.

Se suas tabelas forem corrompidas com frequência, você deve tentar determinar por que isso está acontecendo. A coisa mais importante a saber é se a tabela foi corrompida como resultado de uma saída inesperada do servidor. Você pode verificar isso facilmente procurando por uma mensagem recente `restarted mysqld` no log de erros. Se houver tal mensagem, é provável que a corrupção da tabela seja resultado do servidor falhando. Caso contrário, a corrupção pode ter ocorrido durante a operação normal. Isso é um bug. Você deve tentar criar um caso de teste reproduzível que demonstre o problema. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”, e a Seção 7.9, “Depuração do MySQL”.
