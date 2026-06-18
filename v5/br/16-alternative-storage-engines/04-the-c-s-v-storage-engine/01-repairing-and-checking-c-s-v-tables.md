### 15.4.1 Reparo e Verificação de Tabelas CSV

O storage engine `CSV` suporta as instruções `CHECK TABLE` e `REPAIR TABLE` para verificar e, se possível, reparar uma tabela `CSV` danificada.

Ao executar a instrução `CHECK TABLE`, a validade do arquivo `CSV` é verificada procurando pelos separadores de campo corretos, campos com escape (aspas correspondentes ou ausentes), o número correto de campos em comparação com a definição da tabela e a existência de um metafile `CSV` correspondente. A primeira linha inválida descoberta reporta um erro. A verificação de uma tabela válida produz uma saída semelhante à mostrada abaixo:

```sql
mysql> CHECK TABLE csvtest;
+--------------+-------+----------+----------+
| Table        | Op    | Msg_type | Msg_text |
+--------------+-------+----------+----------+
| test.csvtest | check | status   | OK       |
+--------------+-------+----------+----------+
```

Uma verificação em uma tabela corrompida retorna uma falha como

```sql
mysql> CHECK TABLE csvtest;
+--------------+-------+----------+----------+
| Table        | Op    | Msg_type | Msg_text |
+--------------+-------+----------+----------+
| test.csvtest | check | error    | Corrupt  |
+--------------+-------+----------+----------+
```

Para reparar uma tabela, use `REPAIR TABLE`, que copia o máximo de linhas válidas possível dos dados `CSV` existentes e, em seguida, substitui o arquivo `CSV` existente pelas linhas recuperadas. Quaisquer linhas além dos dados corrompidos são perdidas.

```sql
mysql> REPAIR TABLE csvtest;
+--------------+--------+----------+----------+
| Table        | Op     | Msg_type | Msg_text |
+--------------+--------+----------+----------+
| test.csvtest | repair | status   | OK       |
+--------------+--------+----------+----------+
```

Aviso

Durante o reparo, apenas as linhas do arquivo `CSV` até a primeira linha danificada são copiadas para a nova tabela. Todas as outras linhas, desde a primeira linha danificada até o final da tabela, são removidas, mesmo que sejam linhas válidas.