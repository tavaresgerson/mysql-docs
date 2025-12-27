### 27.6.4 A cláusula de opção de verificação de visualização

A cláusula `WITH CHECK OPTION` pode ser aplicada a uma visualização atualizável para impedir inserções em linhas para as quais a cláusula `WHERE` no *`select_statement`* não for verdadeira. Ela também impede atualizações em linhas para as quais a cláusula `WHERE` é verdadeira, mas a atualização tornaria essa condição falsa (em outras palavras, impede que linhas visíveis sejam atualizadas para linhas não visíveis).

Em uma cláusula `WITH CHECK OPTION` para uma visualização atualizável, as palavras-chave `LOCAL` e `CASCADED` determinam o escopo da verificação de controle quando a visualização é definida em termos de outra visualização. Quando nenhuma das palavras-chave é fornecida, o padrão é `CASCADED`.

A verificação `WITH CHECK OPTION` é compatível com os padrões:

* Com `LOCAL`, a cláusula `WHERE` da visualização é verificada, e a verificação recursora para visualizações subjacentes e aplica as mesmas regras.

* Com `CASCADED`, a cláusula `WHERE` da visualização é verificada, e a verificação recursora para visualizações subjacentes, adiciona `WITH CASCADED CHECK OPTION` a elas (para fins de verificação; suas definições permanecem inalteradas), e aplica as mesmas regras.

* Sem opção de verificação, a cláusula `WHERE` da visualização não é verificada, e a verificação recursora para visualizações subjacentes e aplica as mesmas regras.

Considere as definições para a seguinte tabela e conjunto de visualizações:

```
CREATE TABLE t1 (a INT);
CREATE VIEW v1 AS SELECT * FROM t1 WHERE a < 2
WITH CHECK OPTION;
CREATE VIEW v2 AS SELECT * FROM v1 WHERE a > 0
WITH LOCAL CHECK OPTION;
CREATE VIEW v3 AS SELECT * FROM v1 WHERE a > 0
WITH CASCADED CHECK OPTION;
```

Aqui, as visualizações `v2` e `v3` são definidas em termos de outra visualização, `v1`.

Inserções para `v2` são verificadas em relação à sua opção de verificação `LOCAL`, e a verificação recursora para `v1` e as regras são aplicadas novamente. As regras para `v1` causam um falha na verificação. A verificação para `v3` também falha:

```
mysql> INSERT INTO v2 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v2'
mysql> INSERT INTO v3 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v3'
```