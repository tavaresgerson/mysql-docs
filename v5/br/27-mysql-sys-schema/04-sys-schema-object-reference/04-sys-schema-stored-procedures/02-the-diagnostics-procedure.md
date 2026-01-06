#### 26.4.4.2 O procedimento diagnostics()

Cria um relatório do status atual do servidor para fins de diagnóstico.

Esse procedimento desabilita o registro binário durante sua execução, manipulando o valor da sessão da variável de sistema `sql_log_bin`. Essa é uma operação restrita, portanto, o procedimento requer privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

Os dados coletados para o procedimento `diagnostics()` incluem essas informações:

- Informações da visualização de métricas (consulte a Seção 26.4.3.21, “A visualização de métricas”)

- Informações de outras visualizações relevantes do esquema `sys`, como a que determina consultas no 95º percentil

- Informações do esquema `ndbinfo`, se o servidor MySQL faz parte do NDB Cluster

- Status de replicação (tanto da fonte quanto da replica)

Alguns dos pontos de vista do esquema sys são calculados como valores iniciais (opcionais), gerais e delta:

- A visão inicial é o conteúdo da visão no início do procedimento `diagnostics()`). Esse resultado é o mesmo dos valores iniciais usados para a visão delta. A visão inicial é incluída se a opção de configuração `diagnostics.include_raw` estiver ativada.

- A visão geral é o conteúdo da visão no final do procedimento `diagnostics()`). Esse resultado é o mesmo dos valores finais usados para a visão delta. A visão geral é sempre incluída.

- A visualização do delta é a diferença entre o início e o fim da execução do procedimento. Os valores mínimo e máximo são os valores mínimo e máximo da visualização final, respectivamente. Eles não refletem necessariamente os valores mínimo e máximo no período monitorado. Exceto pela visualização de `metrics`, o delta é calculado apenas entre as primeiras e as últimas saídas.

##### Parâmetros

- `in_max_runtime INT UNSIGNED`: O tempo máximo de coleta de dados em segundos. Use `NULL` para coletar dados pelo valor padrão de 60 segundos. Caso contrário, use um valor maior que 0.

- `in_interval INT UNSIGNED`: O tempo de sono entre as coleções de dados em segundos. Use `NULL` para dormir por 30 segundos, que é o valor padrão. Caso contrário, use um valor maior que 0.

- `in_auto_config ENUM('current', 'medium', 'full')`: A configuração do Schema de Desempenho a ser usada. Os valores permitidos são:

  - `current`: Use o instrumento e as configurações atuais do consumidor.

  - `medium`: Habilitar alguns instrumentos e consumidores.

  - `full`: Ative todos os instrumentos e consumidores.

  Nota

  Quanto mais instrumentos e consumidores habilitados, maior o impacto no desempenho do servidor MySQL. Tenha cuidado com o ajuste `medium` e, especialmente, o ajuste `full`, que tem um grande impacto no desempenho.

  O uso da configuração `medium` ou `full` requer o privilégio `SUPER`.

  Se uma configuração diferente de `current` for escolhida, as configurações atuais serão restauradas no final do procedimento.

##### Opções de configuração

A operação `diagnostics()` ("diagnósticos") pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 26.4.2.1, "A Tabela sys\_config"):

- `debug`, `@sys.debug`

  Se esta opção estiver ativada, será gerado o output de depuração. O padrão é `OFF`.

- `diagnostics.allow_i_s_tables`, `@sys.diagnostics.allow_i_s_tables`

  Se esta opção estiver ativada, o procedimento `diagnostics()` pode realizar varreduras de tabelas na tabela do esquema de informações `TABLES`. Isso pode ser caro se houver muitas tabelas. O padrão é `OFF`.

- `diagnostics.include_raw`, `@sys.diagnostics.include_raw`

  Se esta opção estiver ativada, a saída do procedimento `diagnostics()` inclui a saída bruta da consulta à vista `metrics`. O padrão é `OFF`.

- `statement_truncate_len`, `@sys.statement_truncate_len`

  O comprimento máximo das declarações retornadas pela função `format_statement()`") é o comprimento máximo das declarações. Declarações mais longas são truncadas para esse comprimento. O padrão é 64.

##### Exemplo

Crie um relatório de diagnóstico que inicie uma iteração a cada 30 segundos e execute por no máximo 120 segundos, usando as configurações atuais do Schema de Desempenho:

```sql
mysql> CALL sys.diagnostics(120, 30, 'current');
```

Para capturar a saída do procedimento `diagnostics()` em um arquivo enquanto ele está sendo executado, use os comandos do cliente `mysql` `tee nome_do_arquivo` e `notee` (consulte a Seção 4.5.1.2, “Comandos do Cliente `mysql`):

```sql
mysql> tee diag.out;
mysql> CALL sys.diagnostics(120, 30, 'current');
mysql> notee;
```
