#### 5.4.4.1 Formatos de Binary Logging

O servidor utiliza vários formatos de logging para registrar informações no binary log. O formato exato empregado depende da versão do MySQL que está sendo usada. Existem três formatos de logging:

* As capacidades de Replication no MySQL foram originalmente baseadas na propagação de SQL statements do source para a replica. Isso é chamado de *statement-based logging* (logging baseado em statement). Você pode fazer com que este formato seja usado iniciando o servidor com [`--binlog-format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format).

* No *row-based logging* (logging baseado em linha), o source escreve eventos no binary log que indicam como as linhas individuais da tabela são afetadas. É importante, portanto, que as tabelas sempre usem uma Primary Key para garantir que as rows possam ser identificadas de forma eficiente. Você pode fazer com que o servidor use row-based logging iniciando-o com [`--binlog-format=ROW`](replication-options-binary-log.html#sysvar_binlog_format).

* Uma terceira opção também está disponível: *mixed logging* (logging misto). Com mixed logging, o statement-based logging é usado por padrão, mas o modo de logging muda automaticamente para row-based em certos casos, conforme descrito abaixo. Você pode fazer com que o MySQL use mixed logging explicitamente iniciando o [ **mysqld** ](mysqld.html "4.3.1 mysqld — The MySQL Server") com a opção [`--binlog-format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format).

O formato de logging também pode ser definido ou limitado pela storage engine que está sendo usada. Isso ajuda a eliminar problemas ao replicar certos statements entre um source e uma replica que estão usando diferentes storage engines.

Com statement-based replication, pode haver problemas ao replicar statements não determinísticos. Ao decidir se um dado statement é seguro para statement-based replication, o MySQL determina se pode garantir que o statement pode ser replicado usando statement-based logging. Se o MySQL não puder dar essa garantia, ele marca o statement como potencialmente não confiável e emite o aviso, Statement may not be safe to log in statement format.

Você pode evitar esses problemas usando o row-based replication do MySQL.