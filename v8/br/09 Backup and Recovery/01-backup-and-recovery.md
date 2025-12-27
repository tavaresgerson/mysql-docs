# Capítulo 9: Backup e Recuperação

É importante fazer backup dos seus bancos de dados para que você possa recuperar seus dados e estar de volta ao funcionamento normal em caso de problemas, como falhas no sistema, falhas de hardware ou usuários apagando dados por engano. Os backups também são essenciais como uma medida de segurança antes de atualizar uma instalação do MySQL, e podem ser usados para transferir uma instalação do MySQL para outro sistema ou para configurar servidores replicados.

O MySQL oferece uma variedade de estratégias de backup das quais você pode escolher os métodos que melhor se adequam às necessidades da sua instalação. Este capítulo discute vários tópicos de backup e recuperação com os quais você deve estar familiarizado:

* Tipos de backups: Lógico versus físico, completo versus incremental, e assim por diante.
* Métodos para criar backups.
* Métodos de recuperação, incluindo a recuperação em um ponto específico no tempo.
* Agendamento de backups, compressão e criptografia.
* Manutenção de tabelas, para permitir a recuperação de tabelas corrompidas.

## Recursos Adicionais

Recursos relacionados ao backup ou à manutenção da disponibilidade de dados incluem os seguintes:

* Os clientes da Edição Empresarial do MySQL podem usar o produto MySQL Enterprise Backup para fazer backups. Para obter uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 32.1, “MySQL Enterprise Backup Overview”.
* Um fórum dedicado a problemas de backup está disponível em <https://forums.mysql.com/list.php?28>.
* Detalhes sobre o `mysqldump` podem ser encontrados no Capítulo 6, *MySQL Programs*.
* A sintaxe das instruções SQL descritas aqui está fornecida no Capítulo 15, *SQL Statements*.
* Para informações adicionais sobre os procedimentos de backup do `InnoDB`, consulte a Seção 17.18.1, “InnoDB Backup”.
* A replicação permite manter dados idênticos em vários servidores. Isso oferece vários benefícios, como a distribuição da carga de consultas do cliente entre servidores, disponibilidade dos dados mesmo se um servidor específico for desconectado ou falhar, e a capacidade de fazer backups sem impacto na fonte usando uma replica. Consulte o Capítulo 19, *Replication*.
* O MySQL InnoDB Cluster é uma coleção de produtos que trabalham juntos para fornecer uma solução de alta disponibilidade. Um grupo de servidores MySQL pode ser configurado para criar um cluster usando o MySQL Shell. O cluster de servidores tem uma única fonte, chamada de primária, que atua como a fonte de leitura e escrita. Vários servidores secundários são réplicas da fonte. Um mínimo de três servidores é necessário para criar um cluster de alta disponibilidade. Um aplicativo cliente é conectado à primária via MySQL Router. Se a primária falhar, um secundário é automaticamente promovido ao papel de primário, e o MySQL Router encaminha solicitações para o novo primário.
* O NDB Cluster oferece uma versão de alta disponibilidade e alta redundância do MySQL adaptada para o ambiente de computação distribuída. Consulte o Capítulo 25, *MySQL NDB Cluster 8.4*, que fornece informações sobre o MySQL NDB Cluster 8.4.7.