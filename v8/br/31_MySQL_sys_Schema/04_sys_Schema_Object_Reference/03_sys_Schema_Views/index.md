### 30.4.3 Visões do esquema sys

30.4.3.1 As visualizações host\_summary e x$host\_summary

30.4.3.2 As visualizações host\_summary\_by\_file\_io e x$host\_summary\_by\_file\_io

30.4.3.3 As visualizações host\_summary\_by\_file\_io\_type e x$host\_summary\_by\_file\_io\_type

30.4.3.4 As visualizações host\_summary\_by\_stages e x$host\_summary\_by\_stages

30.4.3.5 As visualizações host\_summary\_by\_statement\_latency e x$host\_summary\_by\_statement\_latency

30.4.3.6 As visualizações host\_summary\_by\_statement\_type e x$host\_summary\_by\_statement\_type

30.4.3.7 As visualizações innodb\_buffer\_stats\_by\_schema e x$innodb\_buffer\_stats\_by\_schema

30.4.3.8 As visualizações innodb\_buffer\_stats\_by\_table e x$innodb\_buffer\_stats\_by\_table

30.4.3.9 As visualizações innodb\_lock\_waits e x$innodb\_lock\_waits

30.4.3.10 As visualizações io\_by\_thread\_by\_latency e x$io\_by\_thread\_by\_latency

30.4.3.11 As visualizações io\_global\_by\_file\_by\_bytes e x$io\_global\_by\_file\_by\_bytes

30.4.3.12 As visualizações io\_global\_by\_file\_by\_latency e x$io\_global\_by\_file\_by\_latency

30.4.3.13 As visualizações io\_global\_by\_wait\_by\_bytes e x$io\_global\_by\_wait\_by\_bytes

30.4.3.14 As visualizações io\_global\_by\_wait\_by\_latency e x$io\_global\_by\_wait\_by\_latency

30.4.3.15 As vistas latest\_file\_io e x$latest\_file\_io

30.4.3.16 As visualizações memory\_by\_host\_by\_current\_bytes e x$memory\_by\_host\_by\_current\_bytes

30.4.3.17 As visualizações memory\_by\_thread\_by\_current\_bytes e x$memory\_by\_thread\_by\_current\_bytes

30.4.3.18 As visualizações memory\_by\_user\_by\_current\_bytes e x$memory\_by\_user\_by\_current\_bytes

30.4.3.19 As visualizações memory\_global\_by\_current\_bytes e x$memory\_global\_by\_current\_bytes

30.4.3.20 Memória\_global\_total e visualizações x$Memória\_global\_total

30.4.3.21 A métrica Visualizar

30.4.3.22 A lista de processos e as visualizações x$processlist

30.4.3.23 A visualização ps\_check\_lost\_instrumentation

30.4.3.24 A visão schema\_auto\_increment\_columns

30.4.3.25 As visualizações schema\_index\_statistics e x$schema\_index\_statistics

30.4.3.26 A visualização schema\_object\_overview

30.4.3.27 As visualizações schema\_redundant\_indexes e x$schema\_flattened\_keys

30.4.3.28 As vistas schema\_table\_lock\_waits e x$schema\_table\_lock\_waits

30.4.3.29 As visualizações schema\_table\_statistics e x$schema\_table\_statistics

30.4.3.30 As vistas schema\_table\_statistics\_with\_buffer e x$schema\_table\_statistics\_with\_buffer

30.4.3.31 Os esquemas\_tabuas\_com\_análises\_de\_tabela\_inteira e as visualizações x$esquemas\_tabuas\_com\_análises\_de\_tabela\_inteira

30.4.3.32 A visão schema\_unused\_indexes

30.4.3.33 A sessão e as visualizações da sessão x$

30.4.3.34 Visualizar a sessão\_ssl\_status

30.4.3.35 A análise da declaração e as visualizações x$statement\_analysis

30.4.3.36 As declarações com erros ou avisos e as visualizações x$declarações com erros ou avisos

30.4.3.37 As declarações com varreduras completas da tabela e as vistas x$declarativas\_com\_varreduras\_completos\_da\_tabela

30.4.3.38 As declarações com tempos de execução no 95º percentil e as visualizações x$ declarações com tempos de execução no 95º percentil

30.4.3.39 As declarações\_com\_classificação e as visualizações x$declarativas\_com\_classificação

30.4.3.40 As declarações\_com\_tabelas\_temporárias e as visualizações x$declarações\_com\_tabelas\_temporárias

30.4.3.41 O resumo do usuário e as visualizações do x$user\_summary

30.4.3.42 As visualizações user\_summary\_by\_file\_io e x$user\_summary\_by\_file\_io do usuário

30.4.3.43 Os usuários\_resumo\_por\_tipo\_de\_IO\_arquivo e x$usuários\_resumo\_por\_tipo\_de\_IO\_arquivo Visualizações

30.4.3.44 Os usuários\_resumo\_por\_etapas e x$usuários\_resumo\_por\_etapas Visualizações

30.4.3.45 As visualizações user\_summary\_by\_statement\_latency e x$user\_summary\_by\_statement\_latency

30.4.3.46 Os usuários \_summary\_por\_tipo\_de\_declaração e x$user\_summary\_by\_statement\_type Visualizações

30.4.3.47 A versão Visualizar

30.4.3.48 As visualizações wait\_classes\_global\_by\_avg\_latency e x$wait\_classes\_global\_by\_avg\_latency

30.4.3.49 As visualizações wait\_classes\_global\_by\_latency e x$wait\_classes\_global\_by\_latency

30.4.3.50 As visualizações waits\_by\_host\_by\_latency e x$waits\_by\_host\_by\_latency

30.4.3.51 As visualizações waits\_by\_user\_by\_latency e x$waits\_by\_user\_by\_latency

30.4.3.52 As vistas waits\_global\_by\_latency e x$waits\_global\_by\_latency

As seções a seguir descrevem as visualizações do esquema `sys`.

O esquema `sys` contém muitas visualizações que resumem as tabelas do Gerenciador de Desempenho de várias maneiras. A maioria dessas visualizações vem em pares, de modo que um membro do par tem o mesmo nome do outro membro, além do prefixo `x$`. Por exemplo, a visualização `host_summary_by_file_io` resume o I/O de arquivos agrupados por host e exibe as latências convertidas de picosegundos para valores mais legíveis (com unidades);

```
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

A visualização `x$host_summary_by_file_io` resume os mesmos dados, mas exibe latências picosegundos não formatadas:

```
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

A vista sem o prefixo `x$` visa fornecer uma saída mais amigável ao usuário e mais fácil de ler. A vista com o prefixo `x$` que exibe os mesmos valores em formato bruto é mais adequada para uso com outras ferramentas que realizam seu próprio processamento dos dados.

As visualizações sem o prefixo `x$` diferem das visualizações correspondentes `x$` nesses aspectos:

- Os contos de bytes são formatados com unidades de tamanho usando a função `format_bytes()`").

- Os valores de tempo são formatados com unidades temporais usando a função `format_time()`").

- As instruções SQL são truncadas até uma largura máxima de exibição usando a função `format_statement()`").

- Os nomes dos caminhos são abreviados usando a função `format_path()`").
