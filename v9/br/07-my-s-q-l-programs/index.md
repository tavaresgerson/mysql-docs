# Capítulo 6 Programas MySQL

**Índice**

6.1 Visão Geral dos Programas MySQL

6.2 Usando Programas MySQL:   6.2.1 Chamando Programas MySQL

    6.2.2 Especificando Opções do Programa

    6.2.3 Opções de Comando para Conectar ao Servidor

    6.2.4 Conectando ao Servidor MySQL Usando Opções de Comando

    6.2.5 Conectando ao Servidor Usando Strings Tipo URI ou Pares de Chave-Valor

    6.2.6 Conectando ao Servidor Usando Registros DNS SRV

    6.2.7 Protocolos de Transporte de Conexão

    6.2.8 Controle de Compressão de Conexão

    6.2.9 Definindo Variáveis Ambientais

6.3 Programas Relacionados à Instalação:   6.3.1 comp_err — Arquivo de Mensagem de Erro do MySQL

    6.3.2 mysql_secure_installation — Melhorar a Segurança da Instalação do MySQL

    6.3.3 mysql_tzinfo_to_sql — Carregar as Tabelas de Fuso Horário

6.4 Programas Relacionados à Instalação:   6.4.1 comp_err — Arquivo de Mensagem de Erro do MySQL

    6.4.2 mysql_secure_installation — Melhorar a Segurança da Instalação do MySQL

    6.4.3 mysql_tzinfo_to_sql — Carregar as Tabelas de Fuso Horário

6.5 Programas de Cliente:   6.5.1 mysql — O Cliente de Linha de Comando do MySQL

    6.5.2 mysqladmin — Um Programa de Administração do Servidor MySQL

    6.5.3 mysqlcheck — Um Programa de Manutenção de Tabelas

    6.5.4 mysqldump — Um Programa de Backup de Banco de Dados

    6.5.5 mysqlimport — Um Programa de Importação de Dados

    6.5.6 mysqlshow — Exibir Informações de Banco de Dados, Tabela e Coluna

    6.5.7 mysqlslap — Um Cliente de Emulação de Carregamento

    6.5.8 mysqldm — O Monitor de Diagnóstico do MySQL

6.6 Programas Administrativos e de Utilitário:   6.6.1 ibd2sdi — Ferramenta de Extração de Espaço de Tabelas InnoDB SDI

    6.6.2 innochecksum — Ferramenta de Verificação de Checksum de Arquivo InnoDB Offline

    6.6.3 myisam_ftdump — Exibir Informações de Índices de Texto Completo

    6.6.4 myisamchk — Ferramenta de Manutenção de Tabelas MyISAM

6.6.5 myisamlog — Exibir o conteúdo do arquivo de log MyISAM

    6.6.6 myisampack — Gerar tabelas MyISAM compactadas e somente leitura

    6.6.7 mysql_config_editor — Ferramenta de configuração do MySQL

    6.6.8 mysql_migrate_keyring — Ferramenta de migração de chaves do keyring

    6.6.9 mysqlbinlog — Ferramenta para processar arquivos de log binários

    6.6.10 mysqldumpslow — Resumir arquivos de log de consultas lentas

6.7 Ferramentas de desenvolvimento de programas:   6.7.1 mysql_config — Exibir opções para compilar clientes

    6.7.2 my_print_defaults — Exibir opções de arquivos de opções

6.8 Programas diversos:   6.8.1 perror — Exibir informações de mensagem de erro do MySQL

6.9 Variáveis de ambiente

6.10 Gerenciamento de sinais Unix no MySQL

Este capítulo fornece uma breve visão geral dos programas de linha de comando do MySQL fornecidos pela Oracle Corporation. Também discute a sintaxe geral para especificar opções ao executar esses programas. A maioria dos programas tem opções específicas para sua própria operação, mas a sintaxe das opções é semelhante para todos eles. Finalmente, o capítulo fornece descrições mais detalhadas de programas individuais, incluindo quais opções eles reconhecem.