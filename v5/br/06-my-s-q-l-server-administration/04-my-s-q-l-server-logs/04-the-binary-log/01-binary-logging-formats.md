#### 5.4.4.1 Formatos de registro binários

O servidor utiliza vários formatos de registro para registrar informações no log binário. O formato exato utilizado depende da versão do MySQL que está sendo usada. Existem três formatos de registro:

- As capacidades de replicação no MySQL eram originalmente baseadas na propagação de instruções SQL da fonte para a réplica. Isso é chamado de *registro baseado em instruções*. Você pode fazer com que esse formato seja usado iniciando o servidor com [`--binlog-format=STATEMENT`](https://pt.wikipedia.org/wiki/Binlog#Op%C3%A7%C3%B5es_de_binlog).

- No registro baseado em linhas, a fonte escreve eventos no log binário que indicam como as linhas individuais da tabela são afetadas. Portanto, é importante que as tabelas sempre usem uma chave primária para garantir que as linhas possam ser identificadas de forma eficiente. Você pode fazer com que o servidor use o registro baseado em linhas iniciando-o com [`--binlog-format=ROW`](https://pt.wikipedia.org/wiki/Replicação_\(base_de_dados\)/Opções_de_log_bin%C3%A1rio#sysvar_binlog_format).

- Uma terceira opção também está disponível: *registros mistos*. Com registros mistos, o registro baseado em declarações é usado por padrão, mas o modo de registro muda automaticamente para baseado em linhas em certos casos, conforme descrito abaixo. Você pode fazer o MySQL usar registros mistos explicitamente ao iniciar o **mysqld** com a opção `--binlog-format=MIXED`.

O formato de registro também pode ser definido ou limitado pelo motor de armazenamento utilizado. Isso ajuda a eliminar problemas ao replicar determinadas declarações entre uma fonte e uma replica que estão usando motores de armazenamento diferentes.

Com a replicação baseada em declarações, podem ocorrer problemas ao replicar declarações não determinísticas. Ao decidir se uma determinada declaração é segura para a replicação baseada em declarações, o MySQL determina se pode garantir que a declaração possa ser replicada usando o registro baseada em declarações. Se o MySQL não puder fazer essa garantia, ele marca a declaração como potencialmente não confiável e emite o aviso: "A declaração pode não ser segura para ser registrada no formato de declaração".

Você pode evitar esses problemas usando a replicação baseada em linhas do MySQL.
