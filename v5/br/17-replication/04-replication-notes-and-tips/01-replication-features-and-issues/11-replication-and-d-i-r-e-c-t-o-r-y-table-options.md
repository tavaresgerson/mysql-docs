#### 16.4.1.11 Replicação e Opções de Tabela DIRECTORY

Se uma opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` for usada em uma instrução `CREATE TABLE` no servidor source, a opção de tabela também é usada no replica. Isso pode causar problemas se não houver um directory correspondente no file system do host replica ou se ele existir, mas não estiver acessível ao servidor replica.

Isso pode ser sobrescrito usando o SQL mode de servidor `NO_DIR_IN_CREATE` no replica, o que faz com que o replica ignore as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` ao replicar instruções `CREATE TABLE`. O resultado é que os arquivos de dados e Index do `MyISAM` são criados no database directory da tabela.

Para mais informações, consulte Seção 5.1.10, “Server SQL Modes”.