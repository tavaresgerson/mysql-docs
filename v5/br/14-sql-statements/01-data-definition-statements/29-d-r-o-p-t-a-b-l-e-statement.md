### 13.1.29 Instrução DROP TABLE

```sql
DROP [TEMPORARY] TABLE [IF EXISTS]
    tbl_name [, tbl_name] ...
    [RESTRICT | CASCADE]
```

A instrução `DROP TABLE` remove uma ou mais tabelas. Você deve ter o privilégio `DROP` para cada tabela.

*Tenha cuidado* com esta instrução! Para cada tabela, ela remove a definição da tabela e todos os dados da tabela. Se a tabela for particionada, a instrução remove a definição da tabela, todas as suas partições, todos os dados armazenados nessas partições e todas as definições de partição associadas à tabela removida.

Remover uma tabela também remove quaisquer triggers associados a essa tabela.

A instrução `DROP TABLE` causa um implicit commit, exceto quando usada com a keyword `TEMPORARY`. Consulte [Seção 13.3.3, “Instruções que Causam um Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

Importante

Quando uma tabela é removida, os privilégios concedidos especificamente para essa tabela *não* são removidos automaticamente. Eles devem ser removidos manualmente. Consulte [Seção 13.7.1.4, “Instrução GRANT”](grant.html "13.7.1.4 GRANT Statement").

Se alguma tabela nomeada na lista de argumentos não existir, o comportamento de `DROP TABLE` depende se a cláusula `IF EXISTS` foi fornecida:

* Sem `IF EXISTS`, a instrução remove todas as tabelas nomeadas que existem e retorna um error indicando quais tabelas inexistentes não pôde remover.

* Com `IF EXISTS`, nenhum error ocorre para tabelas inexistentes. A instrução remove todas as tabelas nomeadas que existem e gera um diagnóstico `NOTE` para cada tabela inexistente. Essas notes podem ser exibidas com `SHOW WARNINGS`. Consulte [Seção 13.7.5.40, “Instrução SHOW WARNINGS”](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement").

O `IF EXISTS` também pode ser útil para remover tabelas em circunstâncias incomuns nas quais existe um arquivo `.frm`, mas nenhuma tabela é gerenciada pelo storage engine. (Por exemplo, se uma saída anormal do server ocorrer após a remoção da tabela do storage engine, mas antes da remoção do arquivo `.frm`.)

A keyword `TEMPORARY` tem os seguintes efeitos:

* A instrução remove apenas tabelas `TEMPORARY`.
* A instrução não causa um implicit commit.
* Nenhum direito de acesso é verificado. Uma tabela `TEMPORARY` é visível apenas na session que a criou, portanto, nenhuma verificação é necessária.

Incluir a keyword `TEMPORARY` é uma boa maneira de evitar a remoção acidental de tabelas não-`TEMPORARY`.

As keywords `RESTRICT` e `CASCADE` não fazem nada. Elas são permitidas para facilitar o porting de outros database systems.

A instrução `DROP TABLE` não é suportada com todas as configurações de `innodb_force_recovery`. Consulte [Seção 14.22.2, “Forçando a Recovery do InnoDB”](forcing-innodb-recovery.html "14.22.2 Forcing InnoDB Recovery").