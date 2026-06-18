### 15.1.32 Declaração DROP TABLE

```
DROP [TEMPORARY] TABLE [IF EXISTS]
    tbl_name [, tbl_name] ...
    [RESTRICT | CASCADE]
```

`DROP TABLE` remove uma ou mais tabelas. Você deve ter o privilégio `DROP` para cada tabela.

*Tenha cuidado* com essa declaração! Para cada tabela, ela remove a definição da tabela e todos os dados da tabela. Se a tabela estiver particionada, a declaração remove a definição da tabela, todas as suas partições, todos os dados armazenados nessas partições e todas as definições de partição associadas à tabela excluída.

Ao excluir uma tabela, você também exclui todos os gatilhos da tabela.

`DROP TABLE` causa um commit implícito, exceto quando usado com a palavra-chave `TEMPORARY`. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

Importante

Quando uma tabela é removida, os privilégios concedidos especificamente para a tabela não são *automaticamente* removidos. Eles devem ser removidos manualmente. Veja a Seção 15.7.1.6, “Instrução GRANT”.

Se alguma tabela mencionada na lista de argumentos não existir, o comportamento do `DROP TABLE` depende se a cláusula `IF EXISTS` é fornecida:

- Sem `IF EXISTS`, a declaração falha com um erro indicando quais tabelas não existentes não conseguiu excluir e nenhuma alteração é feita.

- Com `IF EXISTS`, não ocorre nenhum erro para tabelas inexistentes. A instrução exclui todas as tabelas nomeadas que existem e gera um diagnóstico `NOTE` para cada tabela inexistente. Essas notas podem ser exibidas com `SHOW WARNINGS`. Veja a Seção 15.7.7.42, “Instrução SHOW WARNINGS”.

`IF EXISTS` também pode ser útil para descartar tabelas em circunstâncias incomuns em que há uma entrada no dicionário de dados, mas nenhuma tabela gerenciada pelo motor de armazenamento. (Por exemplo, se uma saída anormal do servidor ocorrer após a remoção da tabela do motor de armazenamento, mas antes da remoção da entrada do dicionário de dados.)

A palavra-chave `TEMPORARY` tem os seguintes efeitos:

- A declaração exclui apenas as tabelas `TEMPORARY`.
- A declaração não causa um compromisso implícito.
- Nenhum direito de acesso é verificado. Uma tabela `TEMPORARY` é visível apenas com a sessão que a criou, portanto, não é necessário fazer nenhuma verificação.

Incluir a palavra-chave `TEMPORARY` é uma boa maneira de evitar a queda acidental de tabelas que não são `TEMPORARY`.

As palavras-chave `RESTRICT` e `CASCADE` não fazem nada. Elas são permitidas para facilitar a migração de outros sistemas de banco de dados.

`DROP TABLE` não é suportado com todas as configurações de `innodb_force_recovery`. Consulte a Seção 17.21.3, “Forçando a Recuperação do InnoDB”.
