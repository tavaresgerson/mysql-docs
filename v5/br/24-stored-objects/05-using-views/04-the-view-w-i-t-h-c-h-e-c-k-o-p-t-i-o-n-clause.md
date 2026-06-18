### 23.5.4 A Cláusula WITH CHECK OPTION da View

A cláusula `WITH CHECK OPTION` pode ser fornecida para uma `VIEW` atualizável para prevenir `INSERTS` em linhas para as quais a `WHERE clause` no *`select_statement`* não é verdadeira. Ela também previne `UPDATES` em linhas para as quais a `WHERE clause` é verdadeira, mas o `UPDATE` faria com que ela se tornasse não verdadeira (em outras palavras, previne que linhas visíveis sejam atualizadas para linhas não visíveis).

Em uma cláusula `WITH CHECK OPTION` para uma `VIEW` atualizável, as palavras-chave `LOCAL` e `CASCADED` determinam o escopo do teste de verificação quando a `VIEW` é definida em termos de outra `VIEW`. Quando nenhuma das palavras-chave é fornecida, o padrão é `CASCADED`.

Antes do MySQL 5.7.6, o teste de `WITH CHECK OPTION` funcionava assim:

* Com `LOCAL`, a `WHERE clause` da `VIEW` é verificada, mas nenhuma `VIEW` subjacente é verificada.

* Com `CASCADED`, a `WHERE clause` da `VIEW` é verificada, e então a verificação recorre às `VIEWS` subjacentes, adiciona `WITH CASCADED CHECK OPTION` a elas (para fins da verificação; suas definições permanecem inalteradas) e aplica as mesmas regras.

* Sem uma opção de verificação, a `WHERE clause` da `VIEW` não é verificada, e nenhuma `VIEW` subjacente é verificada.

A partir do MySQL 5.7.6, o teste `WITH CHECK OPTION` está em conformidade com o padrão (com semânticas alteradas em relação a antes para `LOCAL` e para a ausência da cláusula de verificação):

* Com `LOCAL`, a `WHERE clause` da `VIEW` é verificada, e então a verificação recorre às `VIEWS` subjacentes e aplica as mesmas regras.

* Com `CASCADED`, a `WHERE clause` da `VIEW` é verificada, e então a verificação recorre às `VIEWS` subjacentes, adiciona `WITH CASCADED CHECK OPTION` a elas (para fins da verificação; suas definições permanecem inalteradas) e aplica as mesmas regras.

* Sem uma opção de verificação, a `WHERE clause` da `VIEW` não é verificada, e então a verificação recorre às `VIEWS` subjacentes e aplica as mesmas regras.

Considere as definições para a seguinte `TABLE` e conjunto de `VIEWS`:

```sql
CREATE TABLE t1 (a INT);
CREATE VIEW v1 AS SELECT * FROM t1 WHERE a < 2
WITH CHECK OPTION;
CREATE VIEW v2 AS SELECT * FROM v1 WHERE a > 0
WITH LOCAL CHECK OPTION;
CREATE VIEW v3 AS SELECT * FROM v1 WHERE a > 0
WITH CASCADED CHECK OPTION;
```

Aqui, as `VIEWS` `v2` e `v3` são definidas em termos de outra `VIEW`, `v1`. Antes do MySQL 5.7.6, como `v2` tem uma opção de verificação `LOCAL`, os `INSERTS` são testados apenas contra a verificação de `v2`. `v3` tem uma opção de verificação `CASCADED`, então os `INSERTS` são testados não apenas contra a verificação de `v3`, mas também contra as `VIEWS` subjacentes. As seguintes instruções ilustram essas diferenças:

```sql
mysql> INSERT INTO v2 VALUES (2);
Query OK, 1 row affected (0.00 sec)
mysql> INSERT INTO v3 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v3'
```

A partir do MySQL 5.7.6, a semântica para `LOCAL` difere da anterior: Os `INSERTS` para `v2` são verificados contra sua opção de verificação `LOCAL`, então (diferentemente de antes de 5.7.6), a verificação recorre a `v1` e as regras são aplicadas novamente. As regras para `v1` causam uma falha na verificação. A verificação para `v3` falha como antes:

```sql
mysql> INSERT INTO v2 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v2'
mysql> INSERT INTO v3 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v3'
```