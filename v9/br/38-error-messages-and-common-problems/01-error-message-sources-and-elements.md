## B.1 Fontes e Elementos de Mensagens de Erro

Esta seção discute como as mensagens de erro se originam dentro do MySQL e os elementos que elas contêm.

* Fontes de Mensagens de Erro
* Elementos de Mensagens de Erro
* Faixas de Códigos de Erro

### Fontes de Mensagens de Erro

As mensagens de erro podem se originar no lado do servidor ou no lado do cliente:

* No lado do servidor, as mensagens de erro podem ocorrer durante os processos de inicialização e desligamento, como resultado de problemas que ocorrem durante a execução de instruções SQL, e assim por diante.

  + O servidor MySQL escreve algumas mensagens de erro em seu log de erro. Essas indicam problemas de interesse para administradores de banco de dados ou que requerem ação do DBA.

  + O servidor envia outras mensagens de erro para programas clientes. Essas indicam problemas que pertencem apenas a um cliente específico. A biblioteca de clientes MySQL recebe erros recebidos do servidor e os torna disponíveis para o programa cliente hospedeiro.

* Mensagens de erro no lado do cliente são geradas dentro da biblioteca de clientes MySQL, geralmente envolvendo problemas de comunicação com o servidor.

Exemplo de mensagens de erro no lado do servidor escritas no log de erro:

* Esta mensagem produzida durante o processo de inicialização fornece um indicador de status ou progresso:

  ```
  2018-10-28T13:01:32.735983Z 0 [Note] [MY-010303] [Server] Skipping
  generation of SSL certificates as options related to SSL are specified.
  ```

* Esta mensagem indica um problema que requer ação do DBA:

  ```
  2018-10-02T03:20:39.410387Z 768 [ERROR] [MY-010045] [Server] Event Scheduler:
  [evtuser@localhost][myschema.e_daily] Unknown database 'mydb'
  ```

Exemplo de mensagem de erro no lado do servidor enviada para programas clientes, conforme exibida pelo cliente **mysql**:

```
mysql> SELECT * FROM no_such_table;
ERROR 1146 (42S02): Table 'test.no_such_table' doesn't exist
```

Exemplo de mensagem de erro no lado do cliente originada dentro da biblioteca de clientes, conforme exibida pelo cliente **mysql**:

```
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (-2)
```

Se um erro se origina dentro da biblioteca do cliente ou é recebido do servidor, um programa cliente MySQL pode responder de maneiras variadas. Como ilustrado, o cliente pode exibir a mensagem de erro para que o usuário possa tomar medidas corretivas. Em vez disso, o cliente pode tentar resolver internamente ou repetir uma operação falha, ou tomar outras ações.

### Elementos da Mensagem de Erro

Quando ocorre um erro, as informações de erro incluem vários elementos: um código de erro, o valor SQLSTATE e a string de mensagem. Esses elementos têm as seguintes características:

* Código de erro: Esse valor é numérico. É específico do MySQL e não é portátil para outros sistemas de banco de dados.

Cada número de erro tem um valor simbólico correspondente. Exemplos:

+ O símbolo para o número de erro do servidor `1146` é `ER_NO_SUCH_TABLE`.

+ O símbolo para o número de erro do cliente `2005` é `CR_UNKNOWN_HOST`.

O conjunto de códigos de erro usado em mensagens de erro é dividido em faixas distintas; veja Faixas de Códigos de Erro.

Os códigos de erro são estáveis em todas as versões de Disponibilidade Geral (GA) de uma série MySQL específica. Antes que uma série atinja o status GA, novos códigos ainda podem estar em desenvolvimento e estão sujeitos a mudanças.

* Valor SQLSTATE: Esse valor é uma string de cinco caracteres (por exemplo, `'42S02'`). Os valores SQLSTATE são tirados da ANSI SQL e ODBC e são mais padronizados do que os códigos de erro numéricos. Os dois primeiros caracteres de um valor SQLSTATE indicam a classe do erro:

  + Classe = `'00'` indica sucesso.
  + Classe = `'01'` indica um aviso.
  + Classe = `'02'` indica "não encontrado". Isso é relevante no contexto de cursors e é usado para controlar o que acontece quando um cursor atinge o final de um conjunto de dados. Essa condição também ocorre para instruções `SELECT ... INTO var_list` que recuperam nenhuma linha.

+ Classe > `'02'` indica uma exceção.

Para erros no lado do servidor, nem todos os números de erro do MySQL têm valores correspondentes de SQLSTATE. Nesses casos, `'HY000'` (erro geral) é usado.

Para erros no lado do cliente, o valor de SQLSTATE é sempre `'HY000'` (erro geral), então não é significativo para distinguir um erro do cliente de outro.

* String de mensagem: Esta string fornece uma descrição textual do erro.

### Faixas de Códigos de Erro

O conjunto de códigos de erro usado nos erros de mensagens é dividido em faixas distintas, cada uma com seu próprio propósito:

* 1 a 999: Códigos de erro globais. Este intervalo de códigos de erro é chamado “global” porque é um intervalo compartilhado que é usado pelo servidor, bem como pelos clientes.

Quando um erro neste intervalo ocorre no lado do servidor, o servidor o escreve no log de erro, preenchendo o código de erro com zeros à esquerda até seis dígitos e adicionando um prefixo de `MY-`.

Quando um erro neste intervalo ocorre no lado do cliente, a biblioteca do cliente a torna disponível para o programa do cliente sem preenchimento com zeros ou prefixo.

* 1.000 a 1.999: Códigos de erro do servidor reservados para mensagens enviadas aos clientes.

* 2.000 a 2.999: Códigos de erro do cliente reservados para uso pela biblioteca do cliente.

* 3.000 a 4.999: Códigos de erro do servidor reservados para mensagens enviadas aos clientes.

* 5.000 a 5.999: Códigos de erro reservados para uso pelo X Plugin para mensagens enviadas aos clientes.

* 10.000 a 49.999: Códigos de erro do servidor reservados para mensagens a serem escritas no log de erro (não enviadas aos clientes).

Quando ocorre um erro nesta faixa, o servidor o escreve no log de erro, preenchendo o código de erro com zeros à esquerda até seis dígitos e adicionando um prefixo de `MY-`.

* 50.000 a 51.999: Códigos de erro reservados para uso por terceiros.

O servidor trata as mensagens de erro escritas no log de erro de maneira diferente das mensagens de erro enviadas aos clientes:

* Quando o servidor escreve uma mensagem no log de erro, ele preenchendo o código de erro com zeros à esquerda até seis dígitos e adicionando um prefixo de `MY-` (exemplos: `MY-000022`, `MY-010048`).

* Quando o servidor envia uma mensagem para um programa cliente, ele não adiciona nenhum preenchimento com zeros ou prefixo ao código de erro (exemplos: `1036`, `3013`).