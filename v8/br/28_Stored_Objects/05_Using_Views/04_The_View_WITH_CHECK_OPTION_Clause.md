### 27.5.4 A cláusula Opção de Visualização COM VERIFICAÇÃO

A cláusula `WITH CHECK OPTION` pode ser aplicada a uma visualização atualizável para impedir inserções em linhas para as quais a cláusula `WHERE` no `select_statement` não for verdadeira. Ela também impede atualizações em linhas para as quais a cláusula `WHERE` for verdadeira, mas a atualização a tornaria falsa (em outras palavras, impede que linhas visíveis sejam atualizadas para linhas não visíveis).

Em uma cláusula `WITH CHECK OPTION` para uma visualização atualizável, as palavras-chave `LOCAL` e `CASCADED` determinam o escopo da verificação de teste quando a visualização é definida em termos de outra visualização. Quando nenhuma dessas palavras-chave é fornecida, o padrão é `CASCADED`.

O teste `WITH CHECK OPTION` é compatível com os padrões:

- Com `LOCAL`, a cláusula de visualização `WHERE` é verificada, e a verificação recursora é aplicada a visualizações subjacentes, aplicando as mesmas regras.

- Com `CASCADED`, a cláusula de visualização `WHERE` é verificada, e a verificação recursora para visualizações subjacentes adiciona `WITH CASCADED CHECK OPTION` a elas (para fins de verificação; suas definições permanecem inalteradas) e aplica as mesmas regras.

- Sem a opção de verificação, a cláusula de visualização `WHERE` não é verificada, então a verificação recursora é feita em visualizações subjacentes e aplica as mesmas regras.

Considere as definições para a tabela e o conjunto de visualizações a seguir:

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

Os registros para `v2` são verificados contra a opção de verificação `LOCAL`, depois a verificação recursará para `v1` e as regras serão aplicadas novamente. As regras para `v1` causam um erro na verificação. A verificação para `v3` também falha:

```
mysql> INSERT INTO v2 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v2'
mysql> INSERT INTO v3 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v3'
```
