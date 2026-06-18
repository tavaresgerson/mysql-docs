### 15.7.7 Declarações SHOW

15.7.7.1 Declaração de registros binários de exibição

15.7.7.2 Mostrar eventos do BINLOG Statement

15.7.7.3 Declaração de Conjunto de Caracteres

15.7.7.4 Declaração de COLAÇÃO DE MOSTRA

15.7.7.5 Declaração de COLUNAS

15.7.7.6 Declaração SHOW CREATE DATABASE

15.7.7.7 Declaração de EXIBIR CRIAR EVENTO

15.7.7.8 Declaração SHOW CREATE FUNCTION

15.7.7.9 Declaração SHOW CREATE PROCEDURE

15.7.7.10 EXIBIR a declaração CREATE TABLE

15.7.7.11 Declaração SHOW CREATE TRIGGER

15.7.7.12 Declaração SHOW CREATE USER

15.7.7.13 Declaração SHOW CREATE VIEW

15.7.7.14 Mostrar bancos de dados Statement

15.7.7.15 DECLARAR O MOTOR

15.7.7.16 Declaração sobre motores de exibição

15.7.7.17 Declaração de ERROS DE EXIBIÇÃO

15.7.7.18 DECLARAÇÃO SOBRE OS EVENTOS DE EXPOSIÇÃO

15.7.7.19 CÓDIGO DA FUNÇÃO DE EXIBIÇÃO Declaração

15.7.7.22 Declaração de status da função de exibição

15.7.7.21 Declaração de GRANTS SHOW

15.7.7.22 Declaração de índice de exibição

15.7.7.23 Declaração de status do mestre

15.7.7.24 EXIBIR MESAS ABERTAS Declaração

15.7.7.25 Declaração de PLUGINS de exibição

15.7.7.26 Declaração de PRIVILÉGIOS DE EXIBIÇÃO

15.7.7.27 CÓDIGO DO PROCEDIMENTO DE MOSTRA Declaração

15.7.7.28 Declaração de status do procedimento de exibição

15.7.7.29 Declaração PROCESSLIST

15.7.7.30 EXIBIR PERFIL Declaração

15.7.7.31 Declaração de PROFILOS DE EXPOSIÇÃO

15.7.7.32 EXIBIR EVENTOS RELAYLOG Declaração

15.7.7.33 EXIBIR REPLICAS Declaração

15.7.7.34 MOSTRE ANTES DOS ANTES | MOSTRE REPLICAS Declaração

15.7.7.35 Mostrar status da réplica Declaração

15.7.7.36 MOSTRE ESCRAVO | ESTADO DE REPLICA Declaração

15.7.7.37 Declaração de ESTADO DO CONTEÚDO

15.7.7.38 Declaração de Status da Tabela

15.7.7.39 Declaração de mostrador de tabelas

15.7.7.40 DECLARAR TRIGGERS Statement

15.7.7.41 Declaração de VARIÁVEIS EXIBIR

15.7.7.42 EXIBIR ALARMAS Mensagem

`SHOW` tem várias formas que fornecem informações sobre bancos de dados, tabelas, colunas ou informações de status sobre o servidor. Esta seção descreve as seguintes:

```
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
SHOW {REPLICAS | SLAVE HOSTS}
SHOW {REPLICA | SLAVE} STATUS [FOR CHANNEL channel]
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

Se a sintaxe de uma declaração `SHOW` específica incluir uma parte `LIKE 'pattern'`, `'pattern'` é uma string que pode conter os caracteres de substituição de caracteres de consulta SQL `%` e `_`. O padrão é útil para restringir a saída da declaração a valores que correspondem.

Várias declarações `SHOW` também aceitam uma cláusula `WHERE` que oferece mais flexibilidade na especificação de quais linhas devem ser exibidas. Veja a Seção 28.8, “Extensões para Declarações SHOW”.

Nos resultados da declaração `SHOW`, os nomes de usuário e os nomes de host são citados usando aspas (\`).

Muitas APIs do MySQL (como o PHP) permitem que você trate o resultado retornado por uma instrução `SHOW` como se fosse um conjunto de resultados de uma instrução `SELECT`; consulte o Capítulo 31, *Conectores e APIs*, ou a documentação da sua API para mais informações. Além disso, você pode trabalhar com SQL com resultados de consultas em tabelas no banco de dados `INFORMATION_SCHEMA`, o que não é fácil de fazer com resultados de instruções `SHOW`. Consulte o Capítulo 28, *Tabelas do INFORMATION\_SCHEMA*.
