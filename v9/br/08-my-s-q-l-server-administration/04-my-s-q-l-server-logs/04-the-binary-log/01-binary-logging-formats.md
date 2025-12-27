#### 7.4.4.1 Formatos de Registro Binário

O servidor utiliza vários formatos de registro para registrar informações no log binário:

* As capacidades de replicação no MySQL originalmente eram baseadas na propagação de instruções SQL da fonte para a réplica. Isso é chamado de *registro baseado em instruções*. Você pode fazer com que este formato seja usado iniciando o servidor com `--binlog-format=STATEMENT`.

* No *registro baseado em linhas* (o padrão), a fonte escreve eventos no log binário que indicam como as linhas individuais das tabelas são afetadas. Você pode fazer com que o servidor use o registro baseado em linhas iniciando-o com `--binlog-format=ROW`.

* Uma terceira opção também está disponível: *registro misto*. Com o registro misto, o registro baseado em instruções é usado por padrão, mas o modo de registro muda automaticamente para o registro baseado em linhas em certos casos, conforme descrito abaixo. Você pode fazer com que o MySQL use o registro misto explicitamente iniciando o **mysqld** com a opção `--binlog-format=MIXED`.

O formato de registro também pode ser definido ou limitado pelo mecanismo de armazenamento sendo usado. Isso ajuda a eliminar problemas ao replicar certas instruções entre uma fonte e uma réplica que estão usando diferentes mecanismos de armazenamento.

Com a replicação baseada em instruções, pode haver problemas ao replicar instruções não determinísticas. Ao decidir se uma determinada instrução é segura para a replicação baseada em instruções, o MySQL determina se pode garantir que a instrução possa ser replicada usando o registro baseado em instruções. Se o MySQL não puder fazer essa garantia, ele marca a instrução como potencialmente não confiável e emite o aviso, A instrução pode não ser segura para ser registrada no formato de instrução.

Você pode evitar esses problemas usando a replicação baseada em linhas do MySQL.