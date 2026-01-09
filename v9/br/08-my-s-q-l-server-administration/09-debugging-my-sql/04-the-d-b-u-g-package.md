### 7.9.4 O Pacote DBUG

O servidor MySQL e a maioria dos clientes MySQL são compilados com o pacote `DBUG`, originalmente criado por Fred Fish. Quando você configura o MySQL para depuração, este pacote permite obter um arquivo de registro do que o programa está fazendo. Veja a Seção 7.9.1.2, “Criando Arquivos de Registro”.

Esta seção resume os valores de argumento que você pode especificar nas opções de depuração na linha de comando para programas MySQL que foram compilados com suporte a depuração.

O pacote `DBUG` pode ser usado invocando um programa com a opção `--debug[=debug_options]` ou `-# [debug_options]`. Se você especificar a opção `--debug` ou `-#` sem um valor de *`debug_options`*, a maioria dos programas MySQL usa um valor padrão. O padrão do servidor é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows. O efeito deste padrão é:

* `d`: Habilitar a saída para todos os macros de depuração
* `t`: Rastrear chamadas de função e saídas
* `i`: Adicionar o PID às linhas de saída
* `o,/tmp/mysqld.trace`, `O,\mysqld.trace`: Definir o arquivo de saída de depuração.

A maioria dos programas clientes usa um valor padrão de *`debug_options`* de `d:t:o,/tmp/program_name.trace`, independentemente da plataforma.

Aqui estão alguns exemplos de strings de controle de depuração como podem ser especificados em uma linha de comando do shell:

```
--debug=d:t
--debug=d:f,main,subr1:F:L:t,20
--debug=d,input,output,files:n
--debug=d:t:i:O,\\mysqld.trace
```

Para o **mysqld**, também é possível alterar as configurações DBUG em tempo de execução definindo a variável de sistema `debug`. Esta variável tem valores globais e de sessão:

```
mysql> SET GLOBAL debug = 'debug_options';
mysql> SET SESSION debug = 'debug_options';
```

Alterar o valor global de `debug` requer privilégios suficientes para definir variáveis de sistema globais. Alterar o valor de `debug` de sessão requer privilégios suficientes para definir variáveis de sistema de sessão restritas. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

O valor de *`debug_options`* é uma sequência de campos separados por vírgula:

```
field_1:field_2:...:field_N
```

Cada campo dentro do valor consiste em um caractere de bandeira obrigatório, opcionalmente precedido por um caractere `+` ou `-`, e opcionalmente seguido por uma lista de modificadores separados por vírgula:

```
[+|-]flag[,modifier,modifier,...,modifier]
```

A tabela a seguir descreve os caracteres de bandeira permitidos. Caracteres de bandeira não reconhecidos são ignorados silenciosamente.

<table frame="all" summary="Descrição das flags permitidas para as opções de depuração <code>debug_options</code>."><col style="width: 8%"/><col style="width: 92%"/><thead><tr> <th><p> Flag </p></th> <th><p> Descrição </p></th> </tr></thead><tbody><tr> <td><p> <code>d</code> </p></td> <td><p> Habilitar a saída das macros <code>DBUG_<em class="replaceable"><code>XXX</code></em></code> para o estado atual. Pode ser seguido por uma lista de palavras-chave, que habilita a saída apenas para as macros DBUG com essa palavra-chave. Uma lista vazia de palavras-chave habilita a saída para todas as macros. </p><p> No MySQL, as palavras-chave comuns de macros de depuração para habilitar são <code>enter</code>, <code>exit</code>, <code>error</code>, <code>warning</code>, <code>info</code> e <code>loop</code>. </p></td> </tr><tr> <td><p> <code>D</code> </p></td> <td><p> Aguardar após cada linha de saída do depurador. O argumento é o atraso, em décimos de segundo, sujeito às capacidades da máquina. Por exemplo, <code>D,20</code> especifica um atraso de dois segundos. </p></td> </tr><tr> <td><p> <code>f</code> </p></td> <td><p> Limitar a depuração, rastreamento e perfilagem para a lista de funções nomeadas. Uma lista vazia habilita todas as funções. As flags <code>d</code> ou <code>t</code> ainda devem ser dadas; essa flag limita apenas suas ações se estiverem habilitadas. </p></td> </tr><tr> <td><p> <code>F</code> </p></td> <td><p> Identificar o nome do arquivo fonte para cada linha de saída de depuração ou rastreamento. </p></td> </tr><tr> <td><p> <code>i</code> </p></td> <td><p> Identificar o processo com o PID ou ID de thread para cada linha de saída de depuração ou rastreamento. </p></td> </tr><tr> <td><p> <code>L</code> </p></td> <td><p> Identificar o número da linha do arquivo fonte para cada linha de saída de depuração ou rastreamento. </p></td> </tr><tr> <td><p> <code>n</code> </p></td> <td><p> Imprimir a profundidade de aninhamento atual da função para cada linha de saída de depuração ou rastreamento. </p></td> </tr><tr> <td><p> <code>N</code> </p></td> <td><p> Numerar cada linha de saída de depuração. </p></td> </tr><tr> <td><p> <code>o</code> </p></td> <td><p> Rediritar a saída do depurador para o arquivo especificado. A saída padrão é <code>stderr</code>. </p></td> </tr><tr> <td><p> <code>O</code> </p></td> <td><p> Como <code>o</code>, mas o arquivo é realmente descarregado entre cada escrita. Quando necessário, o arquivo é fechado e reaberto entre cada escrita. </p></td> </tr><tr> <td><p> <code>a</code> </p></td> <td><p> Como <code>o</code>, mas abre para adição. </p></td> </tr><tr> <td><p> <code>A</code> </p></td> <td><p> Como <code>O</code>, mas abre para adição. </p></td> </tr><tr> <td><p> <code>p</code> </p></td> <td><p> Limitar as ações do depurador a processos especificados. Um processo deve ser identificado com a macro <code>DBUG_PROCESS</code> e deve corresponder a um no list para que as ações de depuração ou rastreamento ocorram. </p></td> </tr><tr> <td><p> <code>P</code> </p></td> <td><p> Imprimir o nome atual do processo para cada linha de saída de depuração ou rastreamento. </p></td> </tr><tr> <td><p>

O caractere de sinalizador `+` ou `-` e a lista de modificadores finais são usados para caracteres de sinalizador, como `d` ou `f`, que podem habilitar uma operação de depuração para todos os modificadores aplicáveis ou apenas alguns deles:

* Sem o caractere de sinalizador `+` ou `-`, o valor do sinalizador é definido exatamente na lista de modificadores fornecida.

* Com o caractere de sinalizador `+` ou `-`, os modificadores na lista são adicionados ou subtraídos da lista de modificadores atual.

Os seguintes exemplos mostram como isso funciona para o sinalizador `d`. Uma lista `d` vazia habilitou a saída para todas as macros de depuração. Uma lista não vazia habilita a saída apenas para as palavras-chave de macro na lista.

Essas declarações definem o valor `d` na lista de modificadores fornecida:

```
mysql> SET debug = 'd';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
mysql> SET debug = 'd,error,warning';
mysql> SELECT @@debug;
+-----------------+
| @@debug         |
+-----------------+
| d,error,warning |
+-----------------+
```

Um `+` ou `-` no início adiciona ou subtrai do valor `d` atual:

```
mysql> SET debug = '+d,loop';
mysql> SELECT @@debug;
+----------------------+
| @@debug              |
+----------------------+
| d,error,warning,loop |
+----------------------+

mysql> SET debug = '-d,error,loop';
mysql> SELECT @@debug;
+-----------+
| @@debug   |
+-----------+
| d,warning |
+-----------+
```

Adicionar a “todas as macros habilitadas” não resulta em nenhuma mudança:

```
mysql> SET debug = 'd';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+

mysql> SET debug = '+d,loop';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
```

Desabilitar todas as macros habilitadas desabilita completamente o sinalizador `d`:

```
mysql> SET debug = 'd,error,loop';
mysql> SELECT @@debug;
+--------------+
| @@debug      |
+--------------+
| d,error,loop |
+--------------+

mysql> SET debug = '-d,error,loop';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
||
+---------+
```