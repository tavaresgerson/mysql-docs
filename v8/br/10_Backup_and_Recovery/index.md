# Capítulo 9: Backup e Recuperação

É importante fazer backup dos seus bancos de dados para que você possa recuperar seus dados e estar funcionando novamente em caso de problemas, como falhas no sistema, falhas de hardware ou usuários apagando dados por engano. Os backups também são essenciais como uma proteção antes de atualizar uma instalação MySQL, e podem ser usados para transferir uma instalação MySQL para outro sistema ou para configurar servidores replicados.

O MySQL oferece uma variedade de estratégias de backup das quais você pode escolher os métodos que melhor se adequam às suas necessidades de instalação. Este capítulo discute vários tópicos de backup e recuperação com os quais você deve estar familiarizado:

* Tipos de backups: lógico versus físico, completo versus incremental, e assim por diante.

* Métodos para criar backups. * Métodos de recuperação, incluindo recuperação em ponto no tempo. * Cronometragem, compressão e criptografia de backups. * Manutenção de tabelas, para permitir a recuperação de tabelas corrompidas.

## Recursos adicionais

Os recursos relacionados ao backup ou à manutenção da disponibilidade dos dados incluem os seguintes:

* Os clientes da Edição Empresarial do MySQL podem usar o produto MySQL Enterprise Backup para fazer backups. Para uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 32.1, “MySQL Enterprise Backup Overview”.

* Um fórum dedicado a problemas de backup está disponível em <https://forums.mysql.com/list.php?28>.

* Detalhes para **mysqldump** podem ser encontrados no Capítulo 6, * Programas MySQL*.

* A sintaxe das declarações SQL descritas aqui é dada no Capítulo 15, * Declarações SQL*.

* Para informações adicionais sobre os procedimentos de backup do `InnoDB`, consulte a Seção 17.18.1, “Backup do InnoDB”.

* A replicação permite que você mantenha dados idênticos em vários servidores. Isso oferece vários benefícios, como a capacidade de distribuir a carga de consulta do cliente entre servidores, disponibilidade dos dados mesmo se um servidor específico for desconectado ou falhar, e a capacidade de fazer backups sem impacto na fonte, utilizando uma replica. Veja o Capítulo 19, *Replicação*.

* O MySQL InnoDB Cluster é uma coleção de produtos que trabalham juntos para fornecer uma solução de alta disponibilidade. Um grupo de servidores MySQL pode ser configurado para criar um clúster usando o MySQL Shell. O clúster de servidores tem uma única fonte, chamada de fonte primária, que atua como a fonte de leitura e escrita. Múltiplos servidores secundários são réplicas da fonte. É necessário um mínimo de três servidores para criar um clúster de alta disponibilidade. Um aplicativo cliente é conectado à fonte primária via MySQL Router. Se a fonte primária falhar, um secundário é automaticamente promovido ao papel de fonte primária, e o MySQL Router encaminha os pedidos para o novo primário.

* O NDB Cluster oferece uma versão de alta disponibilidade e alta redundância do MySQL adaptada para o ambiente de computação distribuída. Veja o Capítulo 25, *MySQL NDB Cluster 8.0*, que fornece informações sobre o MySQL NDB Cluster 8.0.