## 28.1 Visão geral do backup do MySQL Enterprise

O MySQL Enterprise Backup realiza operações de backup em tempo real para bancos de dados MySQL. O produto é projetado para backups eficientes e confiáveis de tabelas criadas pelo motor de armazenamento InnoDB. Para maior completude, ele também pode fazer backup de tabelas do MyISAM e outros motores de armazenamento.

A discussão a seguir resume brevemente o MySQL Enterprise Backup. Para obter mais informações, consulte o manual do MySQL Enterprise Backup, disponível em <https://dev.mysql.com/doc/mysql-enterprise-backup/pt/>.

Os backups quentes são realizados enquanto o banco de dados está em execução e as aplicações estão lendo e escrevendo nele. Esse tipo de backup não bloqueia as operações normais do banco de dados e captura até mesmo as alterações que ocorrem durante a realização do backup. Por essas razões, os backups quentes são desejáveis quando o seu banco de dados "cresce" -- quando os dados são grandes o suficiente para que o backup demore um tempo significativo e quando seus dados são importantes o suficiente para o seu negócio para que você capture cada última alteração, sem desligar sua aplicação, site ou serviço web.

O MySQL Enterprise Backup faz um backup quente de todas as tabelas que usam o mecanismo de armazenamento InnoDB. Para tabelas que usam MyISAM ou outros mecanismos de armazenamento não InnoDB, ele faz um backup "quente", onde o banco de dados continua em execução, mas essas tabelas não podem ser modificadas durante o backup. Para operações de backup eficientes, você pode designar o InnoDB como o mecanismo de armazenamento padrão para novas tabelas ou converter tabelas existentes para usar o mecanismo de armazenamento InnoDB.
