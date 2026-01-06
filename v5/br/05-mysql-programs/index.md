# Capítulo 4 Programas MySQL

**Índice**

4.1 Visão geral dos programas do MySQL

4.2 Usando programas MySQL:   4.2.1 Chamando programas MySQL

```
4.2.2 Specifying Program Options

4.2.3 Command Options for Connecting to the Server

4.2.4 Connecting to the MySQL Server Using Command Options

4.2.5 Connection Transport Protocols

4.2.6 Connection Compression Control

4.2.7 Setting Environment Variables
```

4.3 Servidor e programas de inicialização do servidor:   4.3.1 mysqld — O servidor MySQL

```
4.3.2 mysqld\_safe — MySQL Server Startup Script

4.3.3 mysql.server — MySQL Server Startup Script

4.3.4 mysqld\_multi — Manage Multiple MySQL Servers
```

4.4 Programas relacionados à instalação:   4.4.1 comp\_err — Arquivo de Mensagem de Erro do MySQL para Compilação

```
4.4.2 mysql\_install\_db — Initialize MySQL Data Directory

4.4.3 mysql\_plugin — Configure MySQL Server Plugins

4.4.4 mysql\_secure\_installation — Improve MySQL Installation Security

4.4.5 mysql\_ssl\_rsa\_setup — Create SSL/RSA Files

4.4.6 mysql\_tzinfo\_to\_sql — Load the Time Zone Tables

4.4.7 mysql\_upgrade — Check and Upgrade MySQL Tables
```

4.5 Programas para clientes:   4.5.1 mysql — O cliente de linha de comando MySQL

```
4.5.2 mysqladmin — A MySQL Server Administration Program

4.5.3 mysqlcheck — A Table Maintenance Program

4.5.4 mysqldump — A Database Backup Program

4.5.5 mysqlimport — A Data Import Program

4.5.6 mysqlpump — A Database Backup Program

4.5.7 mysqlshow — Display Database, Table, and Column Information

4.5.8 mysqlslap — A Load Emulation Client
```

4.6 Programas Administrativos e de Utilitários:   4.6.1 innochecksum — Ferramenta de verificação de checksum de arquivo InnoDB offline

```
4.6.2 myisam\_ftdump — Display Full-Text Index information

4.6.3 myisamchk — MyISAM Table-Maintenance Utility

4.6.4 myisamlog — Display MyISAM Log File Contents

4.6.5 myisampack — Generate Compressed, Read-Only MyISAM Tables

4.6.6 mysql\_config\_editor — MySQL Configuration Utility

4.6.7 mysqlbinlog — Utility for Processing Binary Log Files

4.6.8 mysqldumpslow — Summarize Slow Query Log Files
```

4.7 Ferramentas de Desenvolvimento de Programas:   4.7.1 mysql\_config — Exibir Opções para Compilar Clientes

```
4.7.2 my\_print\_defaults — Display Options from Option Files

4.7.3 resolve\_stack\_dump — Resolve Numeric Stack Trace Dump to Symbols
```

4.8 Programas diversos:   4.8.1 lz4\_decompress — Descomprima o resultado comprimido do mysqlpump com o formato LZ4

```
4.8.2 perror — Display MySQL Error Message Information

4.8.3 replace — A String-Replacement Utility

4.8.4 resolveip — Resolve Host name to IP Address or Vice Versa

4.8.5 zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output
```

4.9 Variáveis de ambiente

4.10 Gerenciamento de Sinais Unix no MySQL

Este capítulo oferece uma breve visão geral dos programas de linha de comando do MySQL fornecidos pela Oracle Corporation. Ele também discute a sintaxe geral para especificar opções ao executar esses programas. A maioria dos programas tem opções específicas para sua própria operação, mas a sintaxe da opção é semelhante para todos eles. Por fim, o capítulo fornece descrições mais detalhadas de programas individuais, incluindo quais opções eles reconhecem.
