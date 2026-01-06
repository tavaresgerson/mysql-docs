### 14.1.5 Desligando o InnoDB

A Oracle recomenda o `InnoDB` como o motor de armazenamento preferido para aplicações de banco de dados típicas, desde wikis e blogs de um único usuário que funcionam em um sistema local até aplicações de ponta que ultrapassam os limites de desempenho. No MySQL 5.7, o `InnoDB` é o motor de armazenamento padrão para novas tabelas.

Importante

O `InnoDB` não pode ser desativado. A opção `--skip-innodb` está desatualizada e não tem efeito, e seu uso resulta em um aviso. Espere que ele seja removido em uma futura versão do MySQL. Isso também se aplica a seus sinônimos (`--innodb=OFF`, `--disable-innodb`, e assim por diante).
