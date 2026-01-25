# Capítulo 4 Programas MySQL

**Sumário**

4.1 Visão Geral dos Programas MySQL

4.2 Usando Programas MySQL :   4.2.1 Invocando Programas MySQL

    4.2.2 Especificando Opções de Programa

    4.2.3 Opções de Comando para Conexão ao Server

    4.2.4 Conectando ao MySQL Server Usando Opções de Comando

    4.2.5 Protocolos de Transporte de Conexão

    4.2.6 Controle de Compressão de Conexão

    4.2.7 Configurando Variáveis de Ambiente

4.3 Programas de Server e de Inicialização do Server :   4.3.1 mysqld — O MySQL Server

    4.3.2 mysqld_safe — Script de Inicialização do MySQL Server

    4.3.3 mysql.server — Script de Inicialização do MySQL Server

    4.3.4 mysqld_multi — Gerenciar Múltiplos MySQL Servers

4.4 Programas Relacionados à Instalação :   4.4.1 comp_err — Compilar Arquivo de Mensagens de Erro MySQL

    4.4.2 mysql_install_db — Inicializar Diretório de Dados MySQL

    4.4.3 mysql_plugin — Configurar Plugins do MySQL Server

    4.4.4 mysql_secure_installation — Melhorar a Segurança da Instalação MySQL

    4.4.5 mysql_ssl_rsa_setup — Criar Arquivos SSL/RSA

    4.4.6 mysql_tzinfo_to_sql — Carregar as Tabelas de Fuso Horário

    4.4.7 mysql_upgrade — Checar e Fazer Upgrade de Tabelas MySQL

4.5 Programas Client :   4.5.1 mysql — O Client de Linha de Comando MySQL

    4.5.2 mysqladmin — Um Programa de Administração do MySQL Server

    4.5.3 mysqlcheck — Um Programa de Manutenção de Tabela

    4.5.4 mysqldump — Um Programa de Backup de Database

    4.5.5 mysqlimport — Um Programa de Importação de Dados

    4.5.6 mysqlpump — Um Programa de Backup de Database

    4.5.7 mysqlshow — Exibir Informações de Database, Tabela e Coluna

    4.5.8 mysqlslap — Um Client de Emulação de Carga (Load)

4.6 Programas Administrativos e de Utilidade :   4.6.1 innochecksum — Utilidade de Checksum de Arquivo InnoDB Offline

    4.6.2 myisam_ftdump — Exibir Informações de Full-Text Index

    4.6.3 myisamchk — Utilidade de Manutenção de Tabela MyISAM

    4.6.4 myisamlog — Exibir Conteúdo do Arquivo Log MyISAM

    4.6.5 myisampack — Gerar Tabelas MyISAM Comprimidas e Somente Leitura

    4.6.6 mysql_config_editor — Utilidade de Configuração MySQL

    4.6.7 mysqlbinlog — Utilidade para Processar Arquivos Binary Log

    4.6.8 mysqldumpslow — Resumir Arquivos Slow Query Log

4.7 Utilidades de Desenvolvimento de Programas :   4.7.1 mysql_config — Exibir Opções para Compilar Clients

    4.7.2 my_print_defaults — Exibir Opções de Arquivos de Opções

    4.7.3 resolve_stack_dump — Resolver Dump de Stack Trace Numérico para Símbolos

4.8 Programas Diversos :   4.8.1 lz4_decompress — Descomprimir Saída Comprimida LZ4 do mysqlpump

    4.8.2 perror — Exibir Informações de Mensagens de Erro MySQL

    4.8.3 replace — Uma Utilidade de Substituição de String

    4.8.4 resolveip — Resolver Nome de Host para Endereço IP ou Vice-Versa

    4.8.5 zlib_decompress — Descomprimir Saída Comprimida ZLIB do mysqlpump

4.9 Variáveis de Ambiente

4.10 Tratamento de Sinal Unix no MySQL

Este capítulo fornece uma breve visão geral dos programas de linha de comando MySQL fornecidos pela Oracle Corporation. Ele também discute a sintaxe geral para especificar opções ao executar esses programas. A maioria dos programas possui opções específicas para sua própria operação, mas a sintaxe de opção é semelhante para todos eles. Finalmente, o capítulo fornece descrições mais detalhadas de programas individuais, incluindo quais opções eles reconhecem.