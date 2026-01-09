### 13.7.5 Declarações SHOW

13.7.5.1 Declaração de LOGS BINÁRIOS DE EXIBIÇÃO

13.7.5.2 Mostrar eventos do BINLOG

13.7.5.3 Declaração de Conjunto de Caracteres

13.7.5.4 Declaração de COLAÇÃO DE MOSTRA

13.7.5.5 Declaração de COLUNAS A EXIBIR

13.7.5.6 Declaração SHOW CREATE DATABASE

13.7.5.7 Declaração de exibição de criação de evento

13.7.5.8 Declaração `SHOW CREATE FUNCTION`

13.7.5.9 Declaração de mostrar a criação de um procedimento

13.7.5.10 Mostrar a declaração CREATE TABLE

13.7.5.11 Declaração SHOW CREATE TRIGGER

13.7.5.12 Declaração SHOW CREATE USER

13.7.5.13 Declaração de exibição CREATE VIEW

13.7.5.14 Declaração de mostrador de bancos de dados

13.7.5.15 Declaração do MOTOR DE EXIBIÇÃO

13.7.5.16 Declaração sobre Motores de Exibição

13.7.5.17 Declaração de ERROS DE EXIBIÇÃO

13.7.5.18 Declaração sobre eventos de exibição

13.7.5.19 Código da função de exibição

13.7.5.20 Declaração de Status da Função de Exibição

13.7.5.21 Declaração de GRANTS SHOW

13.7.5.22 Declaração de índice de exibição

13.7.5.23 Declaração de Status do Mestre

13.7.5.24 Declaração de mostrador de mesas disponíveis

13.7.5.25 Declaração de PLUGINS

13.7.5.26 Declaração de PRIVILÉGIOS DE EXIBIÇÃO

13.7.5.27 Código do procedimento de exibição de declaração

13.7.5.28 Declaração de STATUS do PROCEDIMENTO DE EXIBIÇÃO

13.7.5.29 Declaração PROCESSLIST SHOW

13.7.5.30 Declaração de PROFILO DE EXIBIÇÃO

13.7.5.31 Declaração de PROFILES DE EXPOSIÇÃO

13.7.5.32 RELAYLOG EVENTS Statement

13.7.5.33 Declaração do SHOW SLAVE HOSTS

13.7.5.34 Declaração de ESTADO DE ESCRAVO

13.7.5.35 Declaração de ESTADO DO SHOW

13.7.5.36 Declaração de STATUS DA TÁBLIA

13.7.5.37 Declaração de mostrador de tabelas

13.7.5.38 Declaração de TRIGGERS de exibição

13.7.5.39 Declaração de VARIÁVEIS EXIBIR

13.7.5.40 Declaração de avisos

`SHOW` tem várias formas que fornecem informações sobre bancos de dados, tabelas, colunas ou informações de status sobre o servidor. Esta seção descreve as seguintes:

```sql
SHOW {BINARY | MASTER} LOGS
SHOW BINLOG EVENTS [IN 'log_name'] [FROM pos] [LIMIT [offset,] row_count]
SHOW {CHARACTER SET | CHARSET} [like_or_where]
SHOW COLLATION [like_or_where]
SHOW [FULL] COLUMNS FROM tbl_name [FROM db_name] [like_or_where]
SHOW CREATE DATABASE db_name
SHOW CREATE EVENT event_name
SHOW CREATE FUNCTION func_name
SHOW CREATE PROCEDURE proc_name
SHOW CREATE TABLE tbl_name
SHOW CREATE TRIGGER trigger_name
SHOW CREATE VIEW view_name
SHOW DATABASES [like_or_where]
SHOW ENGINE engine_name {STATUS | MUTEX}
SHOW [STORAGE] ENGINES
SHOW ERRORS [LIMIT [offset,] row_count]
SHOW EVENTS
SHOW FUNCTION CODE func_name
SHOW FUNCTION STATUS [like_or_where]
SHOW GRANTS FOR user
SHOW INDEX FROM tbl_name [FROM db_name]
SHOW MASTER STATUS
SHOW OPEN TABLES [FROM db_name] [like_or_where]
SHOW PLUGINS
SHOW PROCEDURE CODE proc_name
SHOW PROCEDURE STATUS [like_or_where]
SHOW PRIVILEGES
SHOW [FULL] PROCESSLIST
SHOW PROFILE [types] [FOR QUERY n] [OFFSET n] [LIMIT n]
SHOW PROFILES
SHOW RELAYLOG EVENTS [IN 'log_name'] [FROM pos] [LIMIT [offset,] row_count]
SHOW SLAVE HOSTS
SHOW SLAVE STATUS [FOR CHANNEL channel]
SHOW [GLOBAL | SESSION] STATUS [like_or_where]
SHOW TABLE STATUS [FROM db_name] [like_or_where]
SHOW [FULL] TABLES [FROM db_name] [like_or_where]
SHOW TRIGGERS [FROM db_name] [like_or_where]
SHOW [GLOBAL | SESSION] VARIABLES [like_or_where]
SHOW WARNINGS [LIMIT [offset,] row_count]

like_or_where: {
    LIKE 'pattern'
  | WHERE expr
}
```

Se a sintaxe de uma instrução `SHOW` (show\.html) específica incluir uma parte `LIKE 'pattern'` (string-comparison-functions.html#operator_like), `'pattern'` é uma string que pode conter os caracteres curinga `%` e `_` do SQL. O padrão é útil para restringir a saída da instrução a valores que correspondem.

Várias instruções `SHOW` também aceitam uma cláusula `WHERE` que oferece mais flexibilidade na especificação das linhas a serem exibidas. Veja Seção 24.8, “Extensões para Instruções SHOW”.

Muitas APIs do MySQL (como a PHP) permitem que você trate o resultado retornado por uma instrução `SHOW` como se fosse um conjunto de resultados de uma instrução `SELECT`; veja [Capítulo 27, *Conectores e APIs*] (connectors-apis.html), ou consulte a documentação da sua API para mais informações. Além disso, você pode trabalhar com SQL com resultados de consultas em tabelas no banco de dados `INFORMATION_SCHEMA`, o que não é fácil de fazer com resultados de instruções `SHOW`. Veja [Capítulo 24, *Tabelas do INFORMATION_SCHEMA*] (information-schema.html).
