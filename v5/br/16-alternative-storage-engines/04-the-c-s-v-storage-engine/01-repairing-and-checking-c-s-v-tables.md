### 15.4.1 Reparo e verificação de tabelas CSV

O mecanismo de armazenamento `CSV` suporta as instruções `CHECK TABLE` e `REPAIR TABLE` para verificar e, se possível, reparar uma tabela `CSV` danificada.

Ao executar a instrução `CHECK TABLE`, o arquivo `CSV` é verificado quanto à validade, procurando os separadores de campo corretos, campos escavados (com aspas correspondentes ou ausentes), o número correto de campos em comparação com a definição da tabela e a existência de um metaarquivo `CSV` correspondente. A primeira linha inválida descoberta gera um erro. A verificação de uma tabela válida produz uma saída como a mostrada abaixo:

```sql
mysql> CHECK TABLE csvtest;
+--------------+-------+----------+----------+
| Table        | Op    | Msg_type | Msg_text |
+--------------+-------+----------+----------+
| test.csvtest | check | status   | OK       |
+--------------+-------+----------+----------+
```

Uma verificação em uma tabela corrompida retorna um erro como

```sql
mysql> CHECK TABLE csvtest;
+--------------+-------+----------+----------+
| Table        | Op    | Msg_type | Msg_text |
+--------------+-------+----------+----------+
| test.csvtest | check | error    | Corrupt  |
+--------------+-------+----------+----------+
```

Para reparar uma tabela, use `REPAIR TABLE`, que copia o maior número possível de linhas válidas dos dados existentes do `CSV` e, em seguida, substitui o arquivo `CSV` existente pelas linhas recuperadas. Quaisquer linhas além dos dados corrompidos são perdidas.

```sql
mysql> REPAIR TABLE csvtest;
+--------------+--------+----------+----------+
| Table        | Op     | Msg_type | Msg_text |
+--------------+--------+----------+----------+
| test.csvtest | repair | status   | OK       |
+--------------+--------+----------+----------+
```

Aviso

Durante a reparação, apenas as linhas do arquivo `CSV` até a primeira linha danificada são copiadas para a nova tabela. Todas as outras linhas, desde a primeira linha danificada até o final da tabela, são removidas, mesmo as linhas válidas.
