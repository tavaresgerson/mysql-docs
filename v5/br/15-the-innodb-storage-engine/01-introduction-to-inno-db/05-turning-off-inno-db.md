### 14.1.5 Desativando o InnoDB

A Oracle recomenda o `InnoDB` como o `storage engine` preferido para aplicações de `database` típicas, desde wikis e blogs de usuário único rodando em um sistema local, até aplicações de alto desempenho que levam os limites da performance ao máximo. No MySQL 5.7, o `InnoDB` é o `storage engine` padrão para novas tabelas.

Importante

O `InnoDB` não pode ser desativado. A opção `--skip-innodb` está obsoleta (deprecated) e não tem efeito, e seu uso resulta em um aviso (warning). Espera-se que ela seja removida em um futuro lançamento (release) do MySQL. Isso também se aplica aos seus sinônimos (`--innodb=OFF`, `--disable-innodb`, e assim por diante).