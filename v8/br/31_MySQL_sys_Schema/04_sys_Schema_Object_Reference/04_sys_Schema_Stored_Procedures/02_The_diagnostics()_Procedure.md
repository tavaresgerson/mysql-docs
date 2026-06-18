#### 30.4.4.2 O procedimento diagnostics()

Cria um relatório do status atual do servidor para fins de diagnóstico.

Esse procedimento desabilita o registro binário durante sua execução, manipulando o valor da sessão da variável de sistema `sql_log_bin`. Essa é uma operação restrita, portanto, o procedimento requer privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Os dados coletados para o procedimento `diagnostics()`") incluem essas informações:

- Informações da visualização `metrics` (consulte a Seção 30.4.3.21, “A visualização de métricas”)

- Informações de outras visualizações relevantes do esquema `sys`, como a que determina consultas no 95º percentil

- Informações do esquema `ndbinfo`, se o servidor MySQL faz parte do NDB Cluster

- Status de replicação (tanto da fonte quanto da replica)

Alguns dos pontos de vista do esquema sys são calculados como valores iniciais (opcionais), gerais e delta:

- A visão inicial é o conteúdo da visão no início do procedimento `diagnostics()`")". Esse resultado é o mesmo dos valores iniciais usados para a visão delta. A visão inicial é incluída se a opção de configuração `diagnostics.include_raw` for `ON`.

- A visão geral é o conteúdo da visão no final do procedimento `diagnostics()`")". Esse resultado é o mesmo dos valores finais usados para a visão delta. A visão geral é sempre incluída.

- A visualização do delta é a diferença entre o início e o fim da execução do procedimento. Os valores mínimo e máximo são os valores mínimo e máximo da visualização final, respectivamente. Eles não refletem necessariamente os valores mínimo e máximo no período monitorado. Exceto para a visualização `metrics`, o delta é calculado apenas entre as primeiras e as últimas saídas.

##### Parâmetros

- `in_max_runtime INT UNSIGNED`: O tempo máximo de coleta de dados em segundos. Use `NULL` para coletar dados pelo padrão de 60 segundos. Caso contrário, use um valor maior que 0.

- `in_interval INT UNSIGNED`: O tempo de espera entre as coleções de dados em segundos. Use `NULL` para esperar o valor padrão de 30 segundos. Caso contrário, use um valor maior que 0.

- `in_auto_config ENUM('current', 'medium', 'full')`: A configuração do Schema de Desempenho a ser usada. Os valores permitidos são:

  - `current`: Use o instrumento e os ajustes do consumidor atuais.

  - `medium`: Habilitar alguns instrumentos e consumidores.

  - `full`: Ative todos os instrumentos e consumidores.

  Nota

  Quanto mais instrumentos e consumidores habilitados, maior o impacto no desempenho do servidor MySQL. Tenha cuidado com o ajuste `medium` e, especialmente, o ajuste `full`, que tem um grande impacto no desempenho.

  O uso do ajuste `medium` ou `full` requer o privilégio `SUPER`.

  Se uma configuração diferente de `current` for escolhida, as configurações atuais serão restauradas no final do procedimento.

##### Opções de configuração

A operação `diagnostics()` "Procedimento") pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 30.4.2.1, "A Tabela sys\_config"):

- `debug`, `@sys.debug`

  Se esta opção for `ON`, produza a saída de depuração. O padrão é `OFF`.

- `diagnostics.allow_i_s_tables`, `@sys.diagnostics.allow_i_s_tables`

  Se esta opção for `ON`, o procedimento `diagnostics()` é permitido para realizar varreduras de tabela na tabela do Schema de Informações `TABLES`. Isso pode ser caro se houver muitas tabelas. O padrão é `OFF`.

- `diagnostics.include_raw`, `@sys.diagnostics.include_raw`

  Se esta opção for `ON`, o `diagnostics()` Procedure") procedimento de saída inclui a saída bruta da consulta à vista `metrics`. O padrão é `OFF`.

- `statement_truncate_len`, `@sys.statement_truncate_len`

  O comprimento máximo das declarações retornadas pela função `format_statement()`") é este comprimento. Declarações mais longas são truncadas para este comprimento. O padrão é 64.

##### Exemplo

Crie um relatório de diagnóstico que inicie uma iteração a cada 30 segundos e execute por no máximo 120 segundos, usando as configurações atuais do Schema de Desempenho:

```
mysql> CALL sys.diagnostics(120, 30, 'current');
```

Para capturar a saída do procedimento `diagnostics()` em um arquivo enquanto ele está sendo executado, use os comandos do cliente **mysql** `tee filename` e `notee` (consulte a Seção 6.5.1.2, “Comandos do Cliente mysql”):

```
mysql> tee diag.out;
mysql> CALL sys.diagnostics(120, 30, 'current');
mysql> notee;
```
