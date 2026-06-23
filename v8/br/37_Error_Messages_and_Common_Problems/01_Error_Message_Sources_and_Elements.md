## B.1 Fontes e elementos dos erros de mensagem

Esta seção discute como as mensagens de erro se originam no MySQL e os elementos que elas contêm.

* Fontes de Mensagens de Erro
* Elementos de Mensagem de Erro
* Faixas de Códigos de Erro

### Fontes de Mensagem de Erro

Os erros podem ocorrer no lado do servidor ou no lado do cliente:

* Do lado do servidor, mensagens de erro podem ocorrer durante os processos de inicialização e desligamento, como resultado de problemas que ocorrem durante a execução de declarações SQL, e assim por diante.

+ O servidor MySQL escreve alguns erros em seu log de erro. Esses indicam problemas de interesse para administradores de banco de dados ou que requerem ação do DBA.

+ O servidor envia outros erros para os programas do cliente. Esses indicam problemas que pertencem apenas a um cliente específico. A biblioteca de clientes MySQL recebe os erros recebidos do servidor e os torna disponíveis para o programa de cliente do host.

* As mensagens de erro do lado do cliente são geradas dentro da biblioteca de clientes MySQL, geralmente envolvendo problemas de comunicação com o servidor.

Exemplos de mensagens de erro do lado do servidor escritas no log de erro:

* Essa mensagem produzida durante o processo de inicialização fornece um indicador de status ou progresso:

  ```
  2018-10-28T13:01:32.735983Z 0 [Note] [MY-010303] [Server] Skipping
  generation of SSL certificates as options related to SSL are specified.
  ```

* Esta mensagem indica um problema que requer ação do DBA:

  ```
  2018-10-02T03:20:39.410387Z 768 [ERROR] [MY-010045] [Server] Event Scheduler:
  [evtuser@localhost][myschema.e_daily] Unknown database 'mydb'
  ```

Exemplo de mensagem de erro do lado do servidor enviada aos programas do cliente, conforme exibida pelo cliente **mysql**:

```
mysql> SELECT * FROM no_such_table;
ERROR 1146 (42S02): Table 'test.no_such_table' doesn't exist
```

Exemplo de mensagem de erro do lado do cliente originada dentro da biblioteca do cliente, conforme exibida pelo cliente **mysql**:

```
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (-2)
```

Se o erro se origina dentro da biblioteca do cliente ou é recebido do servidor, um programa cliente MySQL pode responder de várias maneiras. Como ilustrado acima, o cliente pode exibir a mensagem de erro para que o usuário possa tomar medidas corretivas. Em vez disso, o cliente pode tentar resolver ou repetir uma operação falha internamente, ou tomar outras ações.

### Elementos de Mensagem de Erro

Quando ocorre um erro, as informações de erro incluem vários elementos: um código de erro, o valor SQLSTATE e uma string de mensagem. Esses elementos têm as seguintes características:

* Código de erro: Este valor é numérico. É específico do MySQL e não é portátil para outros sistemas de banco de dados.

Cada número de erro tem um valor simbólico correspondente. Exemplos:

+ O símbolo para o número de erro do servidor `1146` é `ER_NO_SUCH_TABLE`.

+ O símbolo para o número de erro do cliente `2005` é `CR_UNKNOWN_HOST`.

O conjunto de códigos de erro utilizado nas mensagens de erro é dividido em faixas distintas; veja Faixas de Códigos de Erro.

Os códigos de erro são estáveis em todas as versões de disponibilidade geral (GA) de uma série específica do MySQL. Antes de uma série atingir o status de GA, novos códigos ainda podem estar em desenvolvimento e estão sujeitos a alterações.

* Valor SQLSTATE: Esse valor é uma cadeia de cinco caracteres (por exemplo, `'42S02'`). Os valores SQLSTATE são retirados do ANSI SQL e ODBC e são mais padronizados do que os códigos de erro numéricos. Os dois primeiros caracteres de um valor SQLSTATE indicam a classe de erro:

+ Classe = `'00'` indica sucesso.
  + Classe = `'01'` indica um aviso.
  + Classe = `'02'` indica “não encontrado”. Isso é relevante no contexto de cursor e é usado para controlar o que acontece quando um cursor atinge o final de um conjunto de dados. Esta condição também ocorre para as declarações `SELECT ... INTO var_list` que não recuperam nenhuma linha.

+ Classe > `'02'` indica uma exceção.

Para erros do lado do servidor, nem todos os números de erro do MySQL têm valores correspondentes de SQLSTATE. Nesses casos, `'HY000'` (erro geral) é usado.

Para erros do lado do cliente, o valor SQLSTATE é sempre `'HY000'` (erro geral), portanto, não é significativo para distinguir um erro do cliente de outro.

* Mensagem de texto: Esta string fornece uma descrição textual do erro.

### Faixas de códigos de erro

O conjunto de códigos de erro utilizado nas mensagens de erro é dividido em faixas distintas, cada uma com seu próprio propósito:

* 1 a 999: Códigos de erro globais. Esta faixa de códigos de erro é chamada de "global" porque é uma faixa compartilhada que é usada pelo servidor, bem como pelos clientes.

Quando um erro nesse intervalo é gerado no lado do servidor, o servidor o escreve no log de erro, preenchendo o código de erro com zeros à frente, até seis dígitos, e adicionando um prefixo de `MY-`.

Quando um erro nesse intervalo é gerado no lado do cliente, a biblioteca do cliente o disponibiliza ao programa do cliente sem preenchimento ou prefixo nulo.

* 1.000 a 1.999: Códigos de erro do servidor reservados para mensagens enviadas aos clientes.

* 2.000 a 2.999: Códigos de erro do cliente reservados para uso pela biblioteca do cliente.

* 3.000 a 4.999: Códigos de erro do servidor reservados para mensagens enviadas aos clientes.

* 5.000 a 5.999: Códigos de erro reservados para uso pelo X Plugin para mensagens enviadas aos clientes.

* De 10.000 a 49.999: Códigos de erro do servidor reservados para mensagens que serão escritas no log de erro (não enviadas aos clientes).

Quando ocorre um erro nesse intervalo, o servidor o escreve no log de erro, preenchendo o código de erro com zeros à esquerda até seis dígitos e adicionando um prefixo de `MY-`.

* 50.000 a 51.999: Códigos de erro reservados para uso por terceiros.

O servidor lida com mensagens de erro escritas no log de erro de maneira diferente das mensagens de erro enviadas aos clientes:

* Quando o servidor escreve uma mensagem no log de erro, ele preenchendo o código de erro com zeros na frente até seis dígitos e adiciona um prefixo de `MY-` (exemplos: `MY-000022`, `MY-010048`).

* Quando o servidor envia uma mensagem para um programa cliente, ele não adiciona preenchimento ou prefixo ao código de erro (exemplos: `1036`, `3013`).