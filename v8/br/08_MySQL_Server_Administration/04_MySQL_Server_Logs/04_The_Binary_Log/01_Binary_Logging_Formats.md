#### 7.4.4.1 Formatos de registro binários

O servidor utiliza vários formatos de registro para registrar informações no log binário:

- As capacidades de replicação no MySQL eram originalmente baseadas na propagação de instruções SQL da fonte para a réplica. Isso é chamado de *registro baseado em instruções*. Você pode fazer com que esse formato seja usado iniciando o servidor com `--binlog-format=STATEMENT`.

- No registro baseado em linhas (padrão), a fonte escreve eventos no log binário que indicam como as linhas individuais da tabela são afetadas. Você pode fazer o servidor usar o registro baseado em linhas iniciando-o com `--binlog-format=ROW`.

- Uma terceira opção também está disponível: *registros mistos*. Com registros mistos, o registro baseado em declarações é usado por padrão, mas o modo de registro muda automaticamente para baseado em linhas em certos casos, conforme descrito abaixo. Você pode fazer o MySQL usar registros mistos explicitamente ao iniciar o **mysqld** com a opção `--binlog-format=MIXED`.

O formato de registro também pode ser definido ou limitado pelo motor de armazenamento utilizado. Isso ajuda a eliminar problemas ao replicar determinadas declarações entre uma fonte e uma replica que estão usando motores de armazenamento diferentes.

Com a replicação baseada em declarações, podem ocorrer problemas ao replicar declarações não determinísticas. Ao decidir se uma determinada declaração é segura para a replicação baseada em declarações, o MySQL determina se pode garantir que a declaração possa ser replicada usando o registro baseada em declarações. Se o MySQL não puder fazer essa garantia, ele marca a declaração como potencialmente não confiável e emite o aviso: "A declaração pode não ser segura para ser registrada no formato de declaração".

Você pode evitar esses problemas usando a replicação baseada em linhas do MySQL.
