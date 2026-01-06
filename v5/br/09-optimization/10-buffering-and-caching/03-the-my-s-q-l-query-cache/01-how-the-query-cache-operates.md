#### 8.10.3.1 Como o Cache de Consultas Funciona

Nota

O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0.

Esta seção descreve como o cache de consultas funciona quando está operacional. A seção 8.10.3.3, "Configuração do Cache de Consultas", descreve como controlar se ele está operacional.

As consultas recebidas são comparadas às do cache de consultas antes da análise, portanto, as seguintes duas consultas são consideradas diferentes pelo cache de consultas:

```sql
SELECT * FROM tbl_name
Select * from tbl_name
```

As consultas devem ser *exatamente* iguais (byte por byte) para serem consideradas idênticas. Além disso, as cadeias de consulta que são idênticas podem ser tratadas como diferentes por outros motivos. Consultas que utilizam diferentes bancos de dados, diferentes versões de protocolo ou conjuntos de caracteres padrão diferentes são consideradas consultas diferentes e são armazenadas em cache separadamente.

O cache não é utilizado para consultas dos seguintes tipos:

- Consultas que são uma subconsulta de uma consulta externa
- Consultas executadas dentro do corpo de uma função armazenada, um gatilho ou um evento

Antes que o resultado de uma consulta seja recuperado do cache de consultas, o MySQL verifica se o usuário tem privilégio `SELECT` para todas as bases de dados e tabelas envolvidas. Se não for esse o caso, o resultado armazenado no cache não é utilizado.

Se um resultado de consulta for retornado do cache de consulta, o servidor incrementa a variável de status `Qcache_hits`, e não `Com_select`. Veja a Seção 8.10.3.4, “Status e Manutenção do Cache de Consulta”.

Se uma tabela for alterada, todas as consultas armazenadas em cache que a utilizam tornam-se inválidas e são removidas do cache. Isso inclui consultas que utilizam tabelas `MERGE` que mapeiam para a tabela alterada. Uma tabela pode ser alterada por vários tipos de instruções, como `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE TABLE`, `ALTER TABLE`, `DROP TABLE` ou `DROP DATABASE`.

O cache de consultas também funciona dentro de transações ao usar tabelas `InnoDB`.

O resultado de uma consulta `SELECT` em uma visualização é armazenado em cache.

O cache de consultas funciona para consultas `SELECT SQL_CALC_FOUND_ROWS ...` e armazena um valor que é retornado por uma consulta `SELECT FOUND_ROWS()` subsequente. `FOUND_ROWS()` retorna o valor correto mesmo que a consulta anterior tenha sido buscada no cache, porque o número de linhas encontradas também é armazenado no cache. A própria consulta `SELECT FOUND_ROWS()` não pode ser armazenada no cache.

As declarações preparadas que são emitidas usando o protocolo binário com `mysql_stmt_prepare()` e `mysql_stmt_execute()` (veja a interface de declaração preparada da API C), estão sujeitas a limitações de cache. A comparação com declarações no cache de consultas é baseada no texto da declaração após a expansão dos marcadores de parâmetros `?`. A declaração é comparada apenas com outras declarações armazenadas no cache que foram executadas usando o protocolo binário. Ou seja, para fins de cache de consultas, declarações preparadas emitidas usando o protocolo binário são distintas das declarações preparadas emitidas usando o protocolo de texto (veja a Seção 13.5, “Declarações Preparadas”).

Uma consulta não pode ser armazenada em cache se utilizar qualquer uma das seguintes funções:

- `AES_DECRYPT()`

- `AES_ENCRYPT()`

- `BENCHMARK()`

- `ID_CONEXÃO()`

- `CONVERT_TZ()`

- `CURDATE()`

- `DATA_ATUAL()`

- `CURRENT_TIME()`

- `CURRENT_TIMESTAMP()`

- `USUARIO_CORRENTE()`

- `CURTIME()`

- `DATABASE()`

- `ENCRYPT()` com um parâmetro

- `FOUND_ROWS()`

- `GET_LOCK()`

- `IS_FREE_LOCK()`

- `IS_USED_LOCK()`

- `LAST_INSERT_ID()`

- `LOAD_FILE()`

- `MASTER_POS_WAIT()`

- `Agora()`

- `SENHA()`

- `RAND()`

- `RANDOM_BYTES()`

- `RELEASE_ALL_LOCKS()`

- `RELEASE_LOCK()`

- `ODIAR()`

- `SYSDATE()`

- `UNIX_TIMESTAMP()` sem parâmetros

- `USUARIO()`

- `UUID()`

- `UUID_SHORT()`

Uma consulta também não é armazenada em cache nessas condições:

- Isso se refere a funções carregáveis ou armazenadas.

- Isso se refere a variáveis de usuário ou variáveis de programas armazenadas localmente.

- Isso se refere a tabelas no banco de dados `mysql`, `INFORMATION_SCHEMA` ou `performance_schema`.

- Isso se refere a quaisquer tabelas particionadas.

- É de qualquer uma das seguintes formas:

  ```sql
  SELECT ... LOCK IN SHARE MODE
  SELECT ... FOR UPDATE
  SELECT ... INTO OUTFILE ...
  SELECT ... INTO DUMPFILE ...
  SELECT * FROM ... WHERE autoincrement_col IS NULL
  ```

  A última forma não é armazenada em cache porque é usada como uma solução alternativa ODBC para obter o último valor do ID de inserção. Consulte a seção Conectivos/ODBC do Capítulo 27, *Conectivos e APIs*.

  As declarações dentro de transações que utilizam o nível de isolamento `SERIALIZABLE` também não podem ser armazenadas em cache porque utilizam o bloqueio `LOCK IN SHARE MODE`.

- Ele usa tabelas `TEMPORARY`.

- Não utiliza nenhuma tabela.

- Ele gera avisos.

- O usuário tem privilégios de nível de coluna para qualquer uma das tabelas envolvidas.
