#### 16.4.1.11 Opções de tabela de replicação e diretório

Se uma opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` for usada em uma declaração `CREATE TABLE` no servidor de origem, a opção de tabela também será usada na replica. Isso pode causar problemas se não houver um diretório correspondente no sistema de arquivos do host da replica ou se ele existir, mas não for acessível ao servidor de replica. Isso pode ser contornado usando o modo SQL do servidor `NO_DIR_IN_CREATE` (sql-mode.html#sqlmode_no_dir_in_create) na replica, o que faz com que a replica ignore as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` ao replicar declarações `CREATE TABLE`. O resultado é que os arquivos de dados e índices `MyISAM` são criados no diretório da base de dados da tabela.

Para mais informações, consulte Seção 5.1.10, "Modos SQL do Servidor".
