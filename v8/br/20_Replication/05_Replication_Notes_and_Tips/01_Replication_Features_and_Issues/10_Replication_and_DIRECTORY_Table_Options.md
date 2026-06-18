#### 19.5.1.10 Opções de tabela de replicação e diretório

Se uma opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` for usada em uma declaração `CREATE TABLE` no servidor de origem, a opção de tabela também será usada no replica. Isso pode causar problemas se não houver um diretório correspondente no sistema de arquivos do host do replica ou se ele existir, mas não for acessível ao servidor MySQL do replica. Isso pode ser contornado usando o modo SQL do servidor `NO_DIR_IN_CREATE` no replica, o que faz com que o replica ignore as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` ao replicar declarações `CREATE TABLE`. O resultado é que os arquivos de dados e índice `MyISAM` são criados no diretório do banco de dados da tabela.

Para obter mais informações, consulte a Seção 7.1.11, “Modos SQL do servidor”.
