## B.1 Fontes e elementos dos erros de mensagem

Esta seção discute como as mensagens de erro surgem dentro do MySQL e os elementos que elas contêm.

- [Fontes de Mensagens de Erro](error-message-elements.html#error-sources)
- [Elementos de Mensagem de Erro](error-message-elements.html#error-elements)

### Fontes de mensagens de erro

Os erros podem ocorrer no lado do servidor ou no lado do cliente:

- No lado do servidor, mensagens de erro podem ocorrer durante os processos de inicialização e desligamento, como resultado de problemas que ocorrem durante a execução de instruções SQL, e assim por diante.

  - O servidor MySQL escreve algumas mensagens de erro em seu log de erro. Essas mensagens indicam problemas de interesse para administradores de banco de dados ou que exigem ação do DBA.

  - O servidor envia outras mensagens de erro para os programas cliente. Essas indicam problemas que pertencem apenas a um cliente específico. A biblioteca de clientes MySQL recebe os erros recebidos do servidor e os torna disponíveis para o programa cliente do host.

- As mensagens de erro do lado do cliente são geradas dentro da biblioteca do cliente MySQL, geralmente envolvendo problemas de comunicação com o servidor.

Exemplos de mensagens de erro do lado do servidor escritas no log de erro:

- Essa mensagem gerada durante o processo de inicialização fornece um indicador de status ou progresso:

  ```sql
  2018-09-26T14:46:06.326016Z 0 [Note] Skipping generation of SSL
  certificates as options related to SSL are specified.
  ```

- Esta mensagem indica um problema que requer ação do DBA:

  ```sql
  2018-10-02T03:20:39.410387Z 0 [ERROR] Plugin 'InnoDB'
  registration as a STORAGE ENGINE failed.
  ```

Exemplo de mensagem de erro do lado do servidor enviada aos programas do cliente, conforme exibido pelo cliente [**mysql**](mysql.html):

```sql
mysql> SELECT * FROM no_such_table;
ERROR 1146 (42S02): Table 'test.no_such_table' doesn't exist
```

Exemplo de mensagem de erro do lado do cliente proveniente da biblioteca do cliente, conforme exibida pelo cliente [**mysql**](mysql.html):

```sql
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (0)
```

Se o erro for gerado pela biblioteca do cliente ou recebido do servidor, um programa cliente MySQL pode responder de maneiras variadas. Como ilustrado, o cliente pode exibir a mensagem de erro para que o usuário possa tomar medidas corretivas. Em vez disso, o cliente pode tentar resolver ou repetir uma operação falha internamente ou tomar outras ações.

### Elementos da mensagem de erro

Quando ocorre um erro, as informações de erro incluem vários elementos: um código de erro, o valor SQLSTATE e uma string de mensagem. Esses elementos têm as seguintes características:

- Código de erro: Este valor é numérico. É específico do MySQL e não é portável para outros sistemas de banco de dados.

  Cada número de erro tem um valor simbólico correspondente. Exemplos:

  - O símbolo para o número de erro do servidor `1146` é [`ER_NO_SUCH_TABLE`](/doc/mysql-errors/5.7/pt-BR/referência-de-erro-do-servidor.html#erro_er_no_such_table).

  - O símbolo para o número de erro do cliente `2005` é [`CR_UNKNOWN_HOST`](/doc/mysql-errors/5.7/pt-BR/referência-de-erros-do-cliente.html#erro_cr_unknown_host).

  Os códigos de erro são estáveis em todas as versões de disponibilidade geral (GA) de uma determinada série do MySQL. Antes que uma série atinja o status de GA, novos códigos ainda podem estar em desenvolvimento e estão sujeitos a alterações.

- Valor SQLSTATE: Este valor é uma string de cinco caracteres (por exemplo, `'42S02'`). Os valores SQLSTATE são derivados da ANSI SQL e ODBC e são mais padronizados do que os códigos de erro numéricos. Os dois primeiros caracteres de um valor SQLSTATE indicam a classe do erro:

  - A classe = `'00'` indica sucesso.

  - A classe = `'01'` indica um aviso.

  - A classe `'02'` indica "não encontrado". Isso é relevante no contexto de cursors e é usado para controlar o que acontece quando um cursor atinge o final de um conjunto de dados. Essa condição também ocorre para as instruções `SELECT ... INTO var_list` que recuperam nenhuma linha.

  - A classe > `'02'` indica uma exceção.

  Para erros no lado do servidor, nem todos os números de erro do MySQL têm valores correspondentes de SQLSTATE. Nesses casos, `'HY000'` (erro geral) é usado.

  Para erros do lado do cliente, o valor SQLSTATE é sempre `'HY000'` (erro geral), portanto, não é significativo para distinguir um erro do cliente de outro.

- String de mensagem: Esta string fornece uma descrição textual do erro.
