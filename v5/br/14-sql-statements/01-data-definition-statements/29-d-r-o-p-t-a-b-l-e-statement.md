### 13.1.29 Declaração DROP TABLE

```sql
DROP [TEMPORARY] TABLE [IF EXISTS]
    tbl_name [, tbl_name] ...
    [RESTRICT | CASCADE]
```

`DROP TABLE` remove uma ou mais tabelas. Você deve ter o privilégio `DROP` para cada tabela.

*Tenha cuidado* com essa declaração! Para cada tabela, ela remove a definição da tabela e todos os dados da tabela. Se a tabela estiver particionada, a declaração remove a definição da tabela, todas as suas partições, todos os dados armazenados nessas partições e todas as definições de partição associadas à tabela excluída.

Ao excluir uma tabela, você também exclui todos os gatilhos da tabela.

`DROP TABLE` causa um commit implícito, exceto quando usado com a palavra-chave `TEMPORARY`. Veja Seção 13.3.3, “Instruções que causam um commit implícito”.

Importante

Quando uma tabela é removida, os privilégios concedidos especificamente para a tabela não são *automaticamente* removidos. Eles devem ser removidos manualmente. Consulte Seção 13.7.1.4, "Instrução GRANT".

Se alguma tabela mencionada na lista de argumentos não existir, o comportamento do comando `DROP TABLE` depende se a cláusula `IF EXISTS` é fornecida:

- Sem `IF EXISTS`, a instrução exclui todas as tabelas nomeadas que realmente existem e retorna um erro indicando quais tabelas não existentes não puderam ser excluídas.

- Com `IF EXISTS`, não ocorre nenhum erro para tabelas não existentes. A instrução exclui todas as tabelas nomeadas que realmente existem e gera um diagnóstico `NOTA` para cada tabela inexistente. Essas notas podem ser exibidas com `SHOW WARNINGS`. Veja Seção 13.7.5.40, “Instrução SHOW WARNINGS.

`IF EXISTS` também pode ser útil para descartar tabelas em circunstâncias incomuns em que existe um arquivo `.frm`, mas nenhuma tabela gerenciada pelo motor de armazenamento. (Por exemplo, se uma saída anormal do servidor ocorrer após a remoção da tabela do motor de armazenamento, mas antes da remoção do arquivo `.frm`.)

A palavra-chave `TEMPORARY` tem os seguintes efeitos:

- A declaração exclui apenas as tabelas `TEMPORARY`.
- A declaração não causa um compromisso implícito.
- Nenhum direito de acesso é verificado. Uma tabela `TEMPORARY` é visível apenas com a sessão que a criou, portanto, não é necessário fazer a verificação.

Incluir a palavra-chave `TEMPORARY` é uma boa maneira de evitar a queda acidental de tabelas que não são `TEMPORARY`.

As palavras-chave `RESTRICT` e `CASCADE` não fazem nada. Elas são permitidas para facilitar a migração de outros sistemas de banco de dados.

`DROP TABLE` não é suportado com todas as configurações de `innodb_force_recovery`. Veja Seção 14.22.2, “Forçando a Recuperação do InnoDB”.
