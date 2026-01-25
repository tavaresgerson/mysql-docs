## B.1 Fontes e Elementos de Mensagens de Erro

Esta seção discute como as mensagens de erro se originam no MySQL e os elementos que elas contêm.

* [Fontes de Mensagens de Erro](error-message-elements.html#error-sources "Fontes de Mensagens de Erro")
* [Elementos de Mensagens de Erro](error-message-elements.html#error-elements "Elementos de Mensagens de Erro")

### Fontes de Mensagens de Erro

Mensagens de erro podem se originar no lado do servidor (server side) ou no lado do cliente (client side):

* No lado do servidor, as mensagens de erro podem ocorrer durante os processos de startup e shutdown, como resultado de problemas que surgem durante a execução de instruções SQL, e assim por diante.

  + O servidor MySQL escreve algumas mensagens de erro no seu error log. Estas indicam problemas de interesse para administradores de Database ou que requerem ação do DBA.

  + O servidor envia outras mensagens de erro para programas cliente. Estas indicam problemas que pertencem apenas a um cliente específico. A client library do MySQL recebe os erros do servidor e os disponibiliza para o programa cliente hospedeiro.

* Mensagens de erro do lado do cliente são geradas a partir da client library do MySQL, geralmente envolvendo problemas de comunicação com o servidor.

Exemplos de mensagens de erro do lado do servidor gravadas no error log:

* Esta mensagem produzida durante o processo de startup fornece um indicador de status ou progresso:

  ```sql
  2018-09-26T14:46:06.326016Z 0 [Note] Skipping generation of SSL
  certificates as options related to SSL are specified.
  ```

* Esta mensagem indica um problema que requer ação do DBA:

  ```sql
  2018-10-02T03:20:39.410387Z 0 [ERROR] Plugin 'InnoDB'
  registration as a STORAGE ENGINE failed.
  ```

Exemplo de mensagem de erro do lado do servidor enviada a programas cliente, conforme exibida pelo cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"):

```sql
mysql> SELECT * FROM no_such_table;
ERROR 1146 (42S02): Table 'test.no_such_table' doesn't exist
```

Exemplo de mensagem de erro do lado do cliente originada na client library, conforme exibida pelo cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"):

```sql
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (0)
```

Se um erro se origina na client library ou é recebido do servidor, um programa cliente MySQL pode responder de várias maneiras. Como acabamos de ilustrar, o cliente pode exibir a mensagem de erro para que o usuário possa tomar medidas corretivas. O cliente pode, em vez disso, tentar internamente resolver ou retentar uma operação falha, ou tomar outra ação.

### Elementos de Mensagens de Erro

Quando um erro ocorre, as informações de erro incluem vários elementos: um error code, o valor SQLSTATE e a message string. Esses elementos têm as seguintes características:

* Error code (Código de erro): Este valor é numérico. É específico do MySQL e não é portável para outros sistemas de Database.

  Cada número de erro tem um valor simbólico correspondente. Exemplos:

  + O símbolo para o número de erro do servidor `1146` é [`ER_NO_SUCH_TABLE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_no_such_table).

  + O símbolo para o número de erro do cliente `2005` é [`CR_UNKNOWN_HOST`](/doc/mysql-errors/5.7/en/client-error-reference.html#error_cr_unknown_host).

  Os error codes são estáveis em todos os lançamentos General Availability (GA) de uma determinada série MySQL. Antes que uma série atinja o status GA, novos códigos ainda podem estar em desenvolvimento e estão sujeitos a alterações.

* Valor SQLSTATE: Este valor é uma string de cinco caracteres (por exemplo, `'42S02'`). Os valores SQLSTATE são extraídos dos padrões ANSI SQL e ODBC e são mais padronizados do que os códigos de erro numéricos. Os dois primeiros caracteres de um valor SQLSTATE indicam a classe de erro:

  + Classe = `'00'` indica sucesso.
  + Classe = `'01'` indica um warning (aviso).
  + Classe = `'02'` indica “não encontrado” (not found). Isso é relevante no contexto de cursors e é usado para controlar o que acontece quando um cursor atinge o final de um conjunto de dados. Essa condição também ocorre para instruções `SELECT ... INTO var_list` que não recuperam nenhuma linha.

  + Classe > `'02'` indica uma exception (exceção).

  Para erros do lado do servidor, nem todos os números de erro do MySQL têm valores SQLSTATE correspondentes. Nesses casos, `'HY000'` (general error) é usado.

  Para erros do lado do cliente, o valor SQLSTATE é sempre `'HY000'` (general error), portanto, não é significativo para distinguir um erro de cliente do outro.

* Message string (String da mensagem): Esta string fornece uma descrição textual do erro.
