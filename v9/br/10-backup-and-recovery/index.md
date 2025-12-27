# Capítulo 9 Backup e Recuperação

**Índice**

9.1 Tipos de Backup e Recuperação

9.2 Métodos de Backup de Banco de Dados

9.3 Estratégia de Backup e Recuperação Exemplo:   9.3.1 Estabelecimento de uma Política de Backup

    9.3.2 Uso de Backups para Recuperação

    9.3.3 Resumo da Estratégia de Backup

9.4 Uso do mysqldump para Backups:   9.4.1 Dump de Dados no Formato SQL com o mysqldump

    9.4.2 Recarregar Backups no Formato SQL

    9.4.3 Dump de Dados no Formato de Texto Comentado com o mysqldump

    9.4.4 Recarregar Backups no Formato de Texto Comentado

    9.4.5 Dicas do mysqldump

9.5 Recuperação Ponto no Tempo (Incremental):   9.5.1 Recuperação Ponto no Tempo Usando o Log Binário

    9.5.2 Recuperação Ponto no Tempo Usando Posições de Evento

9.6 Manutenção de Tabelas MyISAM e Recuperação em Caso de Falha:   9.6.1 Uso do myisamchk para Recuperação em Caso de Falha

    9.6.2 Como Verificar Tabelas MyISAM em Busca de Erros

    9.6.3 Como Reparar Tabelas MyISAM

    9.6.4 Otimização de Tabelas MyISAM

    9.6.5 Configuração de um Cronograma de Manutenção de Tabelas MyISAM

É importante fazer backup dos seus bancos de dados para que você possa recuperar seus dados e estar de volta ao funcionamento normal em caso de problemas, como falhas do sistema, falhas de hardware ou usuários excluindo dados por engano. Os backups também são essenciais como uma medida de segurança antes de atualizar uma instalação do MySQL, e podem ser usados para transferir uma instalação do MySQL para outro sistema ou para configurar servidores replicados.

O MySQL oferece uma variedade de estratégias de backup das quais você pode escolher os métodos que melhor se adequam às necessidades da sua instalação. Este capítulo discute vários tópicos de backup e recuperação com os quais você deve estar familiarizado:

* Tipos de backups: Lógico versus físico, completo versus incremental, e assim por diante.

* Métodos para criar backups.
* Métodos de recuperação, incluindo a recuperação em ponto no tempo.
* Agendamento, compressão e criptografia de backups.
* Manutenção de tabelas, para permitir a recuperação de tabelas corrompidas.

## Recursos Adicionais

Recursos relacionados a backups ou à manutenção da disponibilidade de dados incluem os seguintes:

* Clientes da Edição Empresarial do MySQL podem usar o produto MySQL Enterprise Backup para backups. Para uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 32.1, “MySQL Enterprise Backup Overview”.

* Um fórum dedicado a problemas de backup está disponível em <https://forums.mysql.com/list.php?28>.

* Detalhes para **mysqldump** podem ser encontrados no Capítulo 6, *Programas MySQL*.

* A sintaxe das instruções SQL descritas aqui está fornecida no Capítulo 15, *Instruções SQL*.

* Para informações adicionais sobre os procedimentos de backup do **InnoDB**, consulte a Seção 17.18.1, “Backup do InnoDB”.

* A replicação permite manter dados idênticos em vários servidores. Isso oferece vários benefícios, como a distribuição da carga de consultas do cliente entre servidores, disponibilidade dos dados mesmo se um servidor específico for desconectado ou falhar, e a capacidade de fazer backups sem impacto na fonte usando uma replica. Consulte o Capítulo 19, *Replicação*.

* O MySQL InnoDB Cluster é uma coleção de produtos que trabalham juntos para fornecer uma solução de alta disponibilidade. Um grupo de servidores MySQL pode ser configurado para criar um clúster usando o MySQL Shell. O clúster de servidores tem uma única fonte, chamada de primária, que atua como a fonte de leitura e escrita. Vários servidores secundários são réplicas da fonte. É necessário um mínimo de três servidores para criar um clúster de alta disponibilidade. Um aplicativo cliente é conectado à primária via MySQL Router. Se a primária falhar, um secundário é automaticamente promovido ao papel de primário, e o MySQL Router encaminha os pedidos para o novo primário.

* O NDB Cluster fornece uma versão de alta disponibilidade e alta redundância do MySQL adaptada para o ambiente de computação distribuída. Consulte o Capítulo 25, *MySQL NDB Cluster 9.5*, que fornece informações sobre o MySQL NDB Cluster 9.4.0.