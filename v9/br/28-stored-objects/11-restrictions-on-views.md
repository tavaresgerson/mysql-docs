## 27.11 Restrições sobre visualizações

O número máximo de tabelas que podem ser referenciadas na definição de uma visualização é de 61.

O processamento de visualizações não é otimizado:

* Não é possível criar um índice em uma visualização.
* Índices podem ser usados para visualizações processadas usando o algoritmo de junção. No entanto, uma visualização processada com o algoritmo temptable não pode aproveitar os índices em suas tabelas subjacentes (embora os índices possam ser usados durante a geração das tabelas temporárias).

Existe um princípio geral de que não é possível modificar uma tabela e selecionar dela em uma subconsulta. Consulte a Seção 15.2.15.12, “Restrições sobre subconsultas”.

O mesmo princípio também se aplica se você selecionar de uma visualização que seleciona da tabela, se a visualização selecionar da tabela em uma subconsulta e a visualização for avaliada usando o algoritmo de junção. Exemplo:

```
CREATE VIEW v1 AS
SELECT * FROM t2 WHERE EXISTS (SELECT 1 FROM t1 WHERE t1.a = t2.a);

UPDATE t1, v2 SET t1.a = 1 WHERE t1.b = v2.b;
```

Se a visualização for avaliada usando uma tabela temporária, você *pode* selecionar da tabela na subconsulta da visualização e ainda modificar essa tabela na consulta externa. Neste caso, a visualização é armazenada em uma tabela temporária e, portanto, você não está realmente selecionando da tabela em uma subconsulta e modificando-a ao mesmo tempo. (Esta é outra razão pela qual você pode querer forçar o MySQL a usar o algoritmo temptable, especificando `ALGORITHM = TEMPTABLE` na definição da visualização.)

Você pode usar `DROP TABLE` ou `ALTER TABLE` para descartar ou alterar uma tabela que é usada na definição de uma visualização. Nenhum aviso resulta da operação `DROP` ou `ALTER`, mesmo que isso invalide a visualização. Em vez disso, um erro ocorre mais tarde, quando a visualização é usada. `CHECK TABLE` pode ser usado para verificar visualizações que foram invalidadas por operações `DROP` ou `ALTER`.

Em relação à atualizabilidade das visualizações, o objetivo geral para as visualizações é que, se qualquer visualização for teoricamente atualizável, ela deve ser atualizável na prática. Muitas visualizações teoricamente atualizáveis podem ser atualizadas agora, mas ainda existem limitações. Para detalhes, consulte a Seção 27.6.3, “Visualizações Atualizáveis e Inseríveis”.

Existe uma falha na implementação atual das visualizações. Se um usuário tiver os privilégios básicos necessários para criar uma visualização (os privilégios `CREATE VIEW` e `SELECT`), esse usuário não poderá chamar `SHOW CREATE VIEW` nesse objeto, a menos que o usuário também tenha o privilégio `SHOW VIEW`.

Essa falha pode levar a problemas ao fazer backup de um banco de dados com **mysqldump**, que pode falhar devido a privilégios insuficientes. Esse problema é descrito no Bug #22062.

A solução para o problema é que o administrador conceda manualmente o privilégio `SHOW VIEW` aos usuários que têm os privilégios `CREATE VIEW`, pois o MySQL não o concede implicitamente quando as visualizações são criadas.

As visualizações não têm índices, portanto, as dicas de índice não se aplicam. O uso de dicas de índice ao selecionar de uma visualização não é permitido.

`SHOW CREATE VIEW` exibe as definições das visualizações usando uma cláusula `AS alias_name` para cada coluna. Se uma coluna for criada a partir de uma expressão, o alias padrão é o texto da expressão, que pode ser bastante longo. Os aliases para os nomes das colunas nas declarações `CREATE VIEW` são verificados contra o comprimento máximo da coluna de 64 caracteres (não o comprimento máximo do alias de 256 caracteres). Como resultado, visualizações criadas a partir da saída de `SHOW CREATE VIEW` falham se qualquer alias de coluna exceder 64 caracteres. Isso pode causar problemas nas seguintes circunstâncias para visualizações com aliases muito longos:

* As definições das visualizações não conseguem se replicar para réplicas mais recentes que importam a restrição de comprimento da coluna.

* Arquivos de dump criados com **mysqldump** não podem ser carregados em servidores que aplicam a restrição de comprimento de coluna.

Uma solução para qualquer um dos problemas é modificar cada definição de visualização problemática para usar aliases que forneçam nomes de colunas mais curtos. Em seguida, a visualização se replica corretamente e pode ser descarregada e recarregada sem causar um erro. Para modificar a definição, armazene e crie a visualização novamente com `DROP VIEW` e `CREATE VIEW`, ou substitua a definição por `CREATE OR REPLACE VIEW`.

Para problemas que ocorrem ao recarregar definições de visualizações em arquivos de dump, outra solução é editar o arquivo de dump para modificar suas instruções `CREATE VIEW`. No entanto, isso não altera as definições originais da visualização, o que pode causar problemas para operações de dump subsequentes.