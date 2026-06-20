## 23.9 Restrições sobre visualizações

O número máximo de tabelas que podem ser referenciadas na definição de uma visão é de 61.

A visualização do processamento não está otimizada:

* Não é possível criar um índice em uma visão. * Os índices podem ser usados para vistas processadas usando o algoritmo de junção. No entanto, uma visão que é processada com o algoritmo temptable não pode aproveitar os índices em suas tabelas subjacentes (embora os índices possam ser usados durante a geração das tabelas temporárias).

Antes do MySQL 5.7.7, subconsultas não podem ser usadas na cláusula `FROM` de uma visão.

Existe um princípio geral de que não é possível modificar uma tabela e selecionar dados da mesma tabela em uma subconsulta. Veja a Seção 13.2.10.12, “Restrições em subconsultas”.

O mesmo princípio também se aplica se você selecionar de uma visão que seleciona a partir da tabela, se a visão selecionar a partir da tabela em uma subconsulta e a visão for avaliada usando o algoritmo de junção. Exemplo:

```sql
CREATE VIEW v1 AS
SELECT * FROM t2 WHERE EXISTS (SELECT 1 FROM t1 WHERE t1.a = t2.a);

UPDATE t1, v2 SET t1.a = 1 WHERE t1.b = v2.b;
```

Se a visão for avaliada usando uma tabela temporária, você *pode* selecionar a tabela na subconsulta da visão e ainda modificar essa tabela na consulta externa. Neste caso, a visão é armazenada em uma tabela temporária e, portanto, você não está realmente selecionando a tabela em uma subconsulta e modificando-a “ao mesmo tempo”. (Esta é mais uma razão pela qual você pode desejar forçar o MySQL a usar o algoritmo temptable, especificando `ALGORITHM = TEMPTABLE` na definição da visão.)

Você pode usar `DROP TABLE` ou `ALTER TABLE` para descartar ou alterar uma tabela que é usada em uma definição de visualização. Nenhum aviso resulta da operação `DROP` ou `ALTER`, mesmo que isso invalide a visualização. Em vez disso, um erro ocorre mais tarde, quando a visualização é usada. `CHECK TABLE` pode ser usado para verificar visualizações que foram invalidadas por operações `DROP` ou `ALTER`.

Em relação à atualizabilidade das visualizações, o objetivo geral para as visualizações é que, se qualquer visualização for teoricamente atualizável, ela deve ser atualizável na prática. Muitas visualizações teoricamente atualizáveis podem ser atualizadas agora, mas ainda existem limitações. Para detalhes, consulte a Seção 23.5.3, “Visualizações atualizáveis e inseríveis”.

Existe uma falha na implementação atual das visualizações. Se um usuário tiver os privilégios básicos necessários para criar uma visualização (os privilégios `CREATE VIEW` e `SELECT`), esse usuário não poderá chamar `SHOW CREATE VIEW` nesse objeto, a menos que o usuário também tenha o privilégio `SHOW VIEW`.

Essa falha pode levar a problemas ao fazer um backup de um banco de dados com **mysqldump**, que pode falhar devido a privilégios insuficientes. Esse problema é descrito no Bug #22062.

A solução para o problema é que o administrador conceda manualmente o privilégio `SHOW VIEW` aos usuários que receberam `CREATE VIEW`, pois o MySQL não o concede implicitamente quando as visualizações são criadas.

As vistas não possuem índices, portanto, os índices de dicas não se aplicam. O uso de dicas de índice ao selecionar de uma vista não é permitido.

`SHOW CREATE VIEW` exibe definições de visão usando uma cláusula `AS alias_name` para cada coluna. Se uma coluna for criada a partir de uma expressão, o alias padrão é o texto da expressão, que pode ser bastante longo. Os aliases para os nomes das colunas nas declarações `CREATE VIEW` são verificados contra o comprimento máximo da coluna de 64 caracteres (não o comprimento máximo do alias de 256 caracteres). Como resultado, as visualizações criadas a partir da saída de `SHOW CREATE VIEW` falham se qualquer alias de coluna exceder 64 caracteres. Isso pode causar problemas nas seguintes circunstâncias para visualizações com aliases muito longos:

* As definições de visualização não são replicadas para réplicas mais recentes que importam a restrição de comprimento da coluna.

* Arquivos de descarte criados com **mysqldump** não podem ser carregados em servidores que importam a restrição de comprimento de coluna.

Uma solução para qualquer um desses problemas é modificar cada definição de visualização problemática para usar aliases que forneçam nomes de colunas mais curtos. Em seguida, a visualização se replica corretamente e pode ser descarregada e carregada novamente sem causar um erro. Para modificar a definição, arraste e crie a visualização novamente com `DROP VIEW` e `CREATE VIEW`, ou substitua a definição com `CREATE OR REPLACE VIEW`.

Para problemas que ocorrem ao recarregar definições de visualização em arquivos de depuração, outra solução é editar o arquivo de depuração para modificar suas declarações `CREATE VIEW`. No entanto, isso não altera as definições originais de visualização, o que pode causar problemas em operações de depuração subsequentes.