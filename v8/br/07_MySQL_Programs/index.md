# Capítulo 6 Programas MySQL

**Índice**

6.1 Visão geral dos programas do MySQL

6.2 Usando programas MySQL:   6.2.1 Chamando programas MySQL

```
6.2.2 Specifying Program Options

6.2.3 Command Options for Connecting to the Server

6.2.4 Connecting to the MySQL Server Using Command Options

6.2.5 Connecting to the Server Using URI-Like Strings or Key-Value Pairs

6.2.6 Connecting to the Server Using DNS SRV Records

6.2.7 Connection Transport Protocols

6.2.8 Connection Compression Control

6.2.9 Setting Environment Variables
```

6.3 Servidor e programas de inicialização do servidor:   6.3.1 mysqld — O servidor MySQL

```
6.3.2 mysqld_safe — MySQL Server Startup Script

6.3.3 mysql.server — MySQL Server Startup Script

6.3.4 mysqld_multi — Manage Multiple MySQL Servers
```

6.4 Programas relacionados à instalação:   6.4.1 comp\_err — Arquivo de Mensagem de Erro do MySQL para Compilação

```
6.4.2 mysql_secure_installation — Improve MySQL Installation Security

6.4.3 mysql_ssl_rsa_setup — Create SSL/RSA Files

6.4.4 mysql_tzinfo_to_sql — Load the Time Zone Tables

6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables
```

6.5 Programas para clientes:   6.5.1 mysql — O cliente de linha de comando MySQL

```
6.5.2 mysqladmin — A MySQL Server Administration Program

6.5.3 mysqlcheck — A Table Maintenance Program

6.5.4 mysqldump — A Database Backup Program

6.5.5 mysqlimport — A Data Import Program

6.5.6 mysqlpump — A Database Backup Program

6.5.7 mysqlshow — Display Database, Table, and Column Information

6.5.8 mysqlslap — A Load Emulation Client
```

6.6 Programas Administrativos e de Utilidade:   6.6.1 ibd2sdi — Ferramenta de Extração de Espaço de Tabela InnoDB SDI

```
6.6.2 innochecksum — Offline InnoDB File Checksum Utility

6.6.3 myisam_ftdump — Display Full-Text Index information

6.6.4 myisamchk — MyISAM Table-Maintenance Utility

6.6.5 myisamlog — Display MyISAM Log File Contents

6.6.6 myisampack — Generate Compressed, Read-Only MyISAM Tables

6.6.7 mysql_config_editor — MySQL Configuration Utility

6.6.8 mysql_migrate_keyring — Keyring Key Migration Utility

6.6.9 mysqlbinlog — Utility for Processing Binary Log Files

6.6.10 mysqldumpslow — Summarize Slow Query Log Files
```

6.7 Ferramentas de Desenvolvimento de Programas:   6.7.1 mysql\_config — Exibir Opções para Compilar Clientes

```
6.7.2 my_print_defaults — Display Options from Option Files
```

6.8 Programas diversos:   6.8.1 lz4\_decompress — Descomprima o resultado comprimido do mysqlpump com o formato LZ4

```
6.8.2 perror — Display MySQL Error Message Information

6.8.3 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output
```

6.9 Variáveis de ambiente

6.10 Gerenciamento de Sinais Unix no MySQL

Este capítulo oferece uma breve visão geral dos programas de linha de comando do MySQL fornecidos pela Oracle Corporation. Ele também discute a sintaxe geral para especificar opções ao executar esses programas. A maioria dos programas tem opções específicas para sua própria operação, mas a sintaxe da opção é semelhante para todos eles. Por fim, o capítulo fornece descrições mais detalhadas de programas individuais, incluindo quais opções eles reconhecem.
