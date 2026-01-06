### 23.5.4 A cláusula Opção de Visualização COM opção de verificação

A cláusula `WITH CHECK OPTION` pode ser usada em uma visão atualizável para impedir inserções em linhas para as quais a cláusula `WHERE` no *`select_statement`* não é verdadeira. Ela também impede atualizações em linhas para as quais a cláusula `WHERE` é verdadeira, mas a atualização faria com que ela se tornasse falsa (em outras palavras, ela impede que linhas visíveis sejam atualizadas para linhas não visíveis).

Em uma cláusula `WITH CHECK OPTION` para uma visualização atualizável, as palavras-chave `LOCAL` e `CASCADED` determinam o escopo da verificação quando a visualização é definida em termos de outra visualização. Quando nenhuma dessas palavras-chave é fornecida, o padrão é `CASCADED`.

Antes do MySQL 5.7.6, o teste da opção `WITH CHECK` funciona da seguinte maneira:

- Com `LOCAL`, a cláusula `WHERE` da vista é verificada, mas nenhuma vista subjacente é verificada.

- Com `CASCADED`, a cláusula `WHERE` da vista é verificada, e a verificação recursora é feita em vistas subjacentes, adicionando `WITH CASCADED CHECK OPTION` a elas (para fins de verificação; suas definições permanecem inalteradas) e aplicando as mesmas regras.

- Sem a opção de verificação, a cláusula `WHERE` da vista não é verificada, e nenhuma vista subjacente é verificada.

A partir do MySQL 5.7.6, o teste da opção `WITH CHECK` está em conformidade com o padrão (com a semântica alterada em relação ao `LOCAL` anterior e sem cláusula de verificação):

- Com `LOCAL`, a cláusula `WHERE` da vista é verificada, e a verificação recurssiva é aplicada às vistas subjacentes e aplica as mesmas regras.

- Com `CASCADED`, a cláusula `WHERE` da vista é verificada, e a verificação recursora é feita em vistas subjacentes, adicionando `WITH CASCADED CHECK OPTION` a elas (para fins de verificação; suas definições permanecem inalteradas) e aplicando as mesmas regras.

- Sem a opção de verificação, a cláusula `WHERE` da vista não é verificada, e a verificação recursora é feita em vistas subjacentes, aplicando as mesmas regras.

Considere as definições para a tabela e o conjunto de visualizações a seguir:

```sql
CREATE TABLE t1 (a INT);
CREATE VIEW v1 AS SELECT * FROM t1 WHERE a < 2
WITH CHECK OPTION;
CREATE VIEW v2 AS SELECT * FROM v1 WHERE a > 0
WITH LOCAL CHECK OPTION;
CREATE VIEW v3 AS SELECT * FROM v1 WHERE a > 0
WITH CASCADED CHECK OPTION;
```

Aqui, as visualizações `v2` e `v3` são definidas em termos de outra visualização, `v1`. Antes do MySQL 5.7.6, porque `v2` tem uma opção de verificação `LOCAL`, as inserções são testadas apenas contra a verificação `v2`. `v3` tem uma opção de verificação `CASCADED`, então as inserções são testadas não apenas contra a verificação `v3`, mas contra as de visualizações subjacentes. As seguintes declarações ilustram essas diferenças:

```sql
mysql> INSERT INTO v2 VALUES (2);
Query OK, 1 row affected (0.00 sec)
mysql> INSERT INTO v3 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v3'
```

A partir do MySQL 5.7.6, a semântica para `LOCAL` difere da anterior: as inserções para `v2` são verificadas contra sua opção de verificação `LOCAL`, e, diferentemente do que acontecia antes do 5.7.6, a verificação recursava para `v1` e as regras eram aplicadas novamente. As regras para `v1` causam um erro na verificação. A verificação para `v3` falha como antes:

```sql
mysql> INSERT INTO v2 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v2'
mysql> INSERT INTO v3 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v3'
```
