#### 7.4.4.1 Formatos de registo binário

O servidor utiliza vários formatos de registo para registar informações no registo binário:

- As capacidades de replicação no MySQL foram originalmente baseadas na propagação de instruções SQL da fonte para a réplica. Isso é chamado de registo baseado em instruções. Você pode fazer com que este formato seja usado iniciando o servidor com `--binlog-format=STATEMENT`.
- No *logging baseado em linhas* (o padrão), a fonte escreve eventos para o log binário que indicam como as linhas individuais da tabela são afetadas. Você pode fazer com que o servidor use o logging baseado em linhas iniciando-o com `--binlog-format=ROW`.
- Uma terceira opção também está disponível: \* registro misto\*. Com registro misto, o registro baseado em instruções é usado por padrão, mas o modo de registro muda automaticamente para baseado em linhas em certos casos, como descrito abaixo. Você pode fazer com que o MySQL use registro misto explicitamente iniciando `mysqld` com a opção `--binlog-format=MIXED`.

O formato de registro também pode ser definido ou limitado pelo mecanismo de armazenamento usado. Isso ajuda a eliminar problemas ao replicar certas instruções entre uma fonte e uma réplica que estão usando diferentes mecanismos de armazenamento.

Com a replicação baseada em instruções, pode haver problemas com a replicação de instruções não-deterministas. Ao decidir se uma determinada instrução é segura para a replicação baseada em instruções, o MySQL determina se pode garantir que a instrução pode ser replicada usando o registro baseado em instruções. Se o MySQL não puder fazer essa garantia, ele marca a instrução como potencialmente não confiável e emite o aviso, a instrução pode não ser segura para entrar em formato de instrução.

Você pode evitar esses problemas usando a replicação baseada em linhas do MySQL.
