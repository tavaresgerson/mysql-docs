### 30.4.3 Visões do esquema sys

30.4.3.1 Visões host\_summary e x$host\_summary

30.4.3.2 Visões host\_summary\_by\_file\_io e x$host\_summary\_by\_file\_io

30.4.3.3 Visões host\_summary\_by\_file\_io\_type e x$host\_summary\_by\_file\_io\_type

30.4.3.4 Visões host\_summary\_by\_stages e x$host\_summary\_by\_stages

30.4.3.5 Visões host\_summary\_by\_statement\_latency e x$host\_summary\_by\_statement\_latency

30.4.3.6 Visões host\_summary\_by\_statement\_type e x$host\_summary\_by\_statement\_type

30.4.3.7 Visões innodb\_buffer\_stats\_by\_schema e x$innodb\_buffer\_stats\_by\_schema

30.4.3.8 Visões innodb\_buffer\_stats\_by\_table e x$innodb\_buffer\_stats\_by\_table

30.4.3.9 Visões innodb\_lock\_waits e x$innodb\_lock\_waits

30.4.3.10 Visões io\_by\_thread\_by\_latency e x$io\_by\_thread\_by\_latency

30.4.3.11 Visões io\_global\_by\_file\_by\_bytes e x$io\_global\_by\_file\_by\_bytes

30.4.3.12 Visões io\_global\_by\_file\_by\_latency e x$io\_global\_by\_file\_by\_latency

30.4.3.13 Visões io\_global\_by\_wait\_by\_bytes e x$io\_global\_by\_wait\_by\_bytes

30.4.3.14 Visões io\_global\_by\_wait\_by\_latency e x$io\_global\_by\_wait\_by\_latency

30.4.3.15 Visões latest\_file\_io e x$latest\_file\_io

30.4.3.16 Visões memory\_by\_host\_by\_current\_bytes e x$memory\_by\_host\_by\_current\_bytes

30.4.3.17 Visões memory\_by\_thread\_by\_current\_bytes e x$memory\_by\_thread\_by\_current\_bytes

30.4.3.18 Visões memory\_by\_user\_by\_current\_bytes e x$memory\_by\_user\_by\_current\_bytes

30.4.3.19 Visões memory\_global\_by\_current\_bytes e x$memory\_global\_by\_current\_bytes

30.4.3.20 Visões memory\_global\_total e x$memory\_global\_total

30.4.3.21 A métrica Visualizar

30.4.3.22 As visualizações processlist e x$processlist

30.4.3.23 A visualização ps\_check\_lost\_instrumentation

30.4.3.24 A visualização schema\_auto\_increment\_columns

30.4.3.25 As visualizações schema\_index\_statistics e x$schema\_index\_statistics

30.4.3.26 A visualização schema\_object\_overview

30.4.3.27 As visualizações schema\_redundant\_indexes e x$schema\_flattened\_keys

30.4.3.28 As visualizações schema\_table\_lock\_waits e x$schema\_table\_lock\_waits

30.4.3.29 As visualizações schema\_table\_statistics e x$schema\_table\_statistics

30.4.3.30 As visualizações schema\_table\_statistics\_with\_buffer e x$schema\_table\_statistics\_with\_buffer

30.4.3.31 As visualizações schema\_tables\_with\_full\_table\_scans e x$schema\_tables\_with\_full\_table\_scans

30.4.3.32 A visualização schema\_unused\_indexes

30.4.3.33 As visualizações session e x$session

30.4.3.34 A visualização session\_ssl\_status

30.4.3.35 As visualizações statement\_analysis e x$statement\_analysis

30.4.3.36 As visualizações statements\_with\_errors\_or\_warnings e x$statements\_with\_errors\_or\_warnings

30.4.3.37 As visualizações statements\_with\_full\_table\_scans e x$statements\_with\_full\_table\_scans

30.4.3.38 As visualizações statements\_with\_runtimes\_in\_95th\_percentile e x$statements\_with\_runtimes\_in\_95th\_percentile

30.4.3.39 As visualizações statements\_with\_sorting e x$statements\_with\_sorting

30.4.3.40 As visualizações statements\_with\_temp\_tables e x$statements\_with\_temp\_tables

30.4.3.41 As visualizações user\_summary e x$user\_summary

30.4.3.42 As visualizações user\_summary\_by\_file\_io e x$user\_summary\_by\_file\_io

30.4.3.43 As visualizações user\_summary\_by\_file\_io\_type e x$user\_summary\_by\_file\_io\_type

30.4.3.44 As visualizações user\_summary\_by\_stages e x$user\_summary\_by\_stages

30.4.3.45 A visualização `user_summary_by_statement_latency` e `x$user_summary_by_statement_latency`

30.4.3.46 A visualização `user_summary_by_statement_type` e `x$user_summary_by_statement_type`

30.4.3.47 A visualização `version`

30.4.3.48 As visualizações `wait_classes_global_by_avg_latency` e `x$wait_classes_global_by_avg_latency`

30.4.3.49 As visualizações `wait_classes_global_by_latency` e `x$wait_classes_global_by_latency`

30.4.3.50 As visualizações `waits_by_host_by_latency` e `x$waits_by_host_by_latency`

30.4.3.51 As visualizações `waits_by_user_by_latency` e `x$waits_by_user_by_latency`

30.4.3.52 As visualizações `waits_global_by_latency` e `x$waits_global_by_latency`

As seções a seguir descrevem as visualizações do esquema `sys`.

O esquema `sys` contém muitas visualizações que resumem as tabelas do Performance Schema de várias maneiras. A maioria dessas visualizações vem em pares, de modo que um membro do par tem o mesmo nome que o outro membro, mais o prefixo `x$`. Por exemplo, a visualização `host_summary_by_file_io` resume o I/O de arquivos agrupado por host e exibe latências convertidas de picosegundos para valores mais legíveis (com unidades);

```
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

A visualização `x$host_summary_by_file_io` resume os mesmos dados, mas exibe latências em picosegundos não formatadas:

```
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

A visualização sem o prefixo `x$` é destinada a fornecer uma saída mais amigável ao usuário e mais fácil de ler. A visualização com o prefixo `x$` que exibe os mesmos valores em forma bruta é mais destinada para uso com outras ferramentas que realizam seu próprio processamento nos dados.

As visualizações sem o prefixo `x$` diferem das visualizações `x$` correspondentes das seguintes maneiras:

* Os contos de bytes são formatados com unidades de tamanho usando a função `format_bytes()`.

* Os valores de tempo são formatados com unidades temporais usando a função `format_time()`.

* As instruções SQL são truncadas a uma largura máxima de exibição usando a função `format_statement()"`).

* Os nomes de caminho são abreviados usando a função `format_path()"`).