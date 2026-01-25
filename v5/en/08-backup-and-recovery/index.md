# Capítulo 7 Backup e Recovery

**Sumário**

7.1 Tipos de Backup e Recovery

7.2 Métodos de Backup de Database

7.3 Exemplo de Estratégia de Backup e Recovery :
    7.3.1 Estabelecendo uma Política de Backup
    7.3.2 Usando Backups para Recovery
    7.3.3 Resumo da Estratégia de Backup

7.4 Usando mysqldump para Backups :
    7.4.1 Fazendo Dump de Dados no Formato SQL com mysqldump
    7.4.2 Recarregando Backups no Formato SQL
    7.4.3 Fazendo Dump de Dados no Formato de Texto Delimitado com mysqldump
    7.4.4 Recarregando Backups no Formato de Texto Delimitado
    7.4.5 Dicas sobre mysqldump

7.5 Recovery Point-in-Time (Incremental) :
    7.5.1 Recovery Point-in-Time Usando Binary Log
    7.5.2 Recovery Point-in-Time Usando Posições de Eventos

7.6 Manutenção de Tabela MyISAM e Crash Recovery :
    7.6.1 Usando myisamchk para Crash Recovery
    7.6.2 Como Verificar Tabelas MyISAM em Busca de Erros
    7.6.3 Como Reparar Tabelas MyISAM
    7.6.4 Otimização de Tabela MyISAM
    7.6.5 Configurando um Cronograma de Manutenção de Tabela MyISAM

É importante fazer o Backup das suas Databases para que você possa recuperar seus dados e voltar a operar rapidamente caso ocorram problemas, como *system crashes*, falhas de hardware ou exclusão acidental de dados por usuários. Backups também são essenciais como salvaguarda antes de fazer o *upgrade* de uma instalação MySQL, e podem ser usados para transferir uma instalação MySQL para outro sistema ou para configurar servidores *replica*.

O MySQL oferece uma variedade de estratégias de Backup, a partir das quais você pode escolher os métodos que melhor se adaptam aos requisitos da sua instalação. Este capítulo aborda vários tópicos de Backup e Recovery com os quais você deve estar familiarizado:

* Tipos de Backup: Lógico versus físico, *full* versus incremental, e assim por diante.
* Métodos para criação de Backups.
* Métodos de Recovery, incluindo *point-in-time recovery*.
* Agendamento, compressão e criptografia de Backup.
* Manutenção de Table, para permitir o *recovery* de tabelas corrompidas.

## Recursos Adicionais

Os recursos relacionados a Backup ou à manutenção da disponibilidade de dados incluem o seguinte:

* Clientes do MySQL Enterprise Edition podem usar o produto MySQL Enterprise Backup para Backups. Para uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 28.1, “Visão Geral do MySQL Enterprise Backup”.

* Um fórum dedicado a questões de Backup está disponível em <https://forums.mysql.com/list.php?28>.

* Detalhes sobre o **mysqldump** podem ser encontrados no Capítulo 4, *Programas MySQL*.

* A sintaxe das instruções SQL descritas aqui é fornecida no Capítulo 13, *Instruções SQL*.

* Para informações adicionais sobre procedimentos de Backup `InnoDB`, consulte a Seção 14.19.1, “Backup InnoDB”.

* A Replication permite manter dados idênticos em múltiplos servidores. Isso traz diversos benefícios, como a distribuição da carga de Querys do cliente entre os servidores, a disponibilidade de dados mesmo que um determinado servidor fique *offline* ou falhe, e a capacidade de realizar Backups sem impacto na origem usando um servidor *replica*. Consulte o Capítulo 16, *Replication*.

* O MySQL InnoDB Cluster é uma coleção de produtos que trabalham em conjunto para fornecer uma solução de alta disponibilidade. Um grupo de servidores MySQL pode ser configurado para criar um Cluster usando o MySQL Shell. O Cluster de servidores possui uma única fonte, chamada *primary*, que atua como a fonte de leitura e escrita (*read-write*). Múltiplos servidores *secondary* são *replicas* da fonte. Um mínimo de três servidores é necessário para criar um Cluster de alta disponibilidade. Uma aplicação cliente é conectada ao *primary* via MySQL Router. Se o *primary* falhar, um *secondary* é promovido automaticamente à função de *primary*, e o MySQL Router roteia as requisições para o novo *primary*.

* O NDB Cluster fornece uma versão do MySQL de alta disponibilidade e alta redundância, adaptada para o ambiente de computação distribuída. Consulte o Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*, que fornece informações sobre o MySQL NDB Cluster 7.5 (baseado no MySQL 5.7, mas contendo as melhorias e correções mais recentes para o *storage engine* NDB).