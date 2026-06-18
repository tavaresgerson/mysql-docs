## 23.9 Restrições em Views

O número máximo de tabelas que podem ser referenciadas na definição de uma view é 61.

O processamento de View não é otimizado:

* Não é possível criar um Index em uma view.
* Indexes podem ser usados para views processadas usando o merge algorithm. No entanto, uma view que é processada com o temptable algorithm não consegue aproveitar os Indexes em suas tabelas subjacentes (embora os Indexes possam ser usados durante a geração das tabelas temporárias).

Antes do MySQL 5.7.7, subqueries não podem ser usadas na cláusula `FROM` de uma view.

Existe um princípio geral de que você não pode modificar uma table e selecionar dados da mesma table em uma subquery. Consulte a Seção 13.2.10.12, “Restrições em Subqueries”.

O mesmo princípio também se aplica se você selecionar dados de uma view que seleciona dados da table, caso a view selecione dados da table em uma subquery e a view seja avaliada usando o merge algorithm. Exemplo:

```sql
CREATE VIEW v1 AS
SELECT * FROM t2 WHERE EXISTS (SELECT 1 FROM t1 WHERE t1.a = t2.a);

UPDATE t1, v2 SET t1.a = 1 WHERE t1.b = v2.b;
```

Se a view for avaliada usando uma temporary table, você *pode* selecionar dados da table na subquery da view e ainda modificar essa table na Query externa. Neste caso, a view é armazenada em uma temporary table e, portanto, você não está realmente selecionando dados da table em uma subquery e modificando-a “ao mesmo tempo”. (Este é outro motivo pelo qual você pode querer forçar o MySQL a usar o temptable algorithm, especificando `ALGORITHM = TEMPTABLE` na definição da view.)

Você pode usar `DROP TABLE` ou `ALTER TABLE` para remover ou alterar uma table que é usada na definição de uma view. Nenhuma advertência é emitida pela operação `DROP` ou `ALTER`, mesmo que isso invalide a view. Em vez disso, um erro ocorre posteriormente, quando a view é utilizada. `CHECK TABLE` pode ser usado para verificar views que foram invalidadas por operações `DROP` ou `ALTER`.

Em relação à atualizabilidade da view, o objetivo geral para as views é que, se uma view for teoricamente atualizável, ela deve ser atualizável na prática. Muitas views teoricamente atualizáveis podem ser atualizadas agora, mas as limitações ainda existem. Para detalhes, consulte a Seção 23.5.3, “Updatable and Insertable Views”.

Existe uma deficiência na implementação atual de views. Se um usuário receber os privileges básicos necessários para criar uma view (os privileges `CREATE VIEW` e `SELECT`), esse usuário não pode chamar `SHOW CREATE VIEW` nesse objeto a menos que o privilege `SHOW VIEW` também seja concedido a ele.

Essa deficiência pode levar a problemas ao fazer backup de um Database com o **mysqldump**, que pode falhar devido a privileges insuficientes. Este problema está descrito no Bug #22062.

A solução alternativa para o problema é o administrador conceder manualmente o privilege `SHOW VIEW` aos usuários que receberam `CREATE VIEW`, já que o MySQL não o concede implicitamente quando as views são criadas.

Views não possuem Indexes, portanto, Index hints não se aplicam. O uso de Index hints ao selecionar dados de uma view não é permitido.

`SHOW CREATE VIEW` exibe definições de view usando uma cláusula `AS alias_name` para cada column. Se uma column for criada a partir de uma expressão, o alias padrão é o texto da expressão, que pode ser bastante longo. Os Aliases para nomes de column nas instruções `CREATE VIEW` são verificados em relação ao comprimento máximo de column de 64 caracteres (não o comprimento máximo de alias de 256 caracteres). Como resultado, views criadas a partir da saída de `SHOW CREATE VIEW` falham se qualquer alias de column exceder 64 caracteres. Isso pode causar problemas nas seguintes circunstâncias para views com aliases muito longos:

* Definições de View falham ao replicar para réplicas mais novas que impõem a restrição de comprimento de column.

* Arquivos de Dump criados com **mysqldump** não podem ser carregados em servidores que impõem a restrição de comprimento de column.

Uma solução alternativa para qualquer um dos problemas é modificar cada definição de view problemática para usar aliases que forneçam nomes de column mais curtos. Assim, a view replica corretamente e pode ser despejada ('dumped') e recarregada sem causar um erro. Para modificar a definição, remova e crie a view novamente com `DROP VIEW` e `CREATE VIEW`, ou substitua a definição com `CREATE OR REPLACE VIEW`.

Para problemas que ocorrem ao recarregar definições de view em arquivos de dump, outra solução alternativa é editar o arquivo de dump para modificar suas instruções `CREATE VIEW`. No entanto, isso não altera as definições de view originais, o que pode causar problemas em operações de dump subsequentes.