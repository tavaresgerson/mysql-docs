# Capítulo 7: Backup e Recuperação

**Índice**

7.1 Tipos de backup e recuperação

7.2 Métodos de backup de banco de dados

7.3 Estratégia de Backup e Recuperação Exemplo:   7.3.1 Estabelecimento de uma Política de Backup

```
7.3.2 Using Backups for Recovery

7.3.3 Backup Strategy Summary
```

7.4 Usando mysqldump para backups:   7.4.1 Exportação de dados no formato SQL com mysqldump

```
7.4.2 Reloading SQL-Format Backups

7.4.3 Dumping Data in Delimited-Text Format with mysqldump

7.4.4 Reloading Delimited-Text Format Backups

7.4.5 mysqldump Tips
```

7.5 Recuperação Ponto no Tempo (Incremental):   7.5.1 Recuperação Ponto no Tempo Usando Registro Binário

```
7.5.2 Point-in-Time Recovery Using Event Positions
```

7.6 Manutenção e recuperação de falhas de tabelas MyISAM:   7.6.1 Uso do myisamchk para recuperação de falhas

```
7.6.2 How to Check MyISAM Tables for Errors

7.6.3 How to Repair MyISAM Tables

7.6.4 MyISAM Table Optimization

7.6.5 Setting Up a MyISAM Table Maintenance Schedule
```

É importante fazer backup dos seus bancos de dados para que você possa recuperar seus dados e voltar a funcionar novamente em caso de problemas, como falhas no sistema, falhas de hardware ou usuários apagando dados por engano. Os backups também são essenciais como uma medida de segurança antes de atualizar uma instalação do MySQL e podem ser usados para transferir uma instalação do MySQL para outro sistema ou configurar servidores replicados.

O MySQL oferece uma variedade de estratégias de backup das quais você pode escolher os métodos que melhor se adequam às necessidades da sua instalação. Este capítulo discute vários tópicos de backup e recuperação com os quais você deve estar familiarizado:

- Tipos de backups: lógico versus físico, completo versus incremental, e assim por diante.

- Métodos para criar backups.

- Métodos de recuperação, incluindo a recuperação em ponto no tempo.

- Agendamento, compressão e criptografia de backup.

- Manutenção da tabela, para permitir a recuperação de tabelas corrompidas.

## Recursos adicionais

Os recursos relacionados ao backup ou à manutenção da disponibilidade dos dados incluem os seguintes:

- Os clientes da MySQL Enterprise Edition podem usar o produto MySQL Enterprise Backup para fazer backups. Para obter uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 28.1, “MySQL Enterprise Backup Overview”.

- Um fórum dedicado a problemas de backup está disponível em <https://forums.mysql.com/list.php?28>.

- Detalhes sobre o **mysqldump** podem ser encontrados no Capítulo 4, *Programas MySQL*.

- A sintaxe das instruções SQL descritas aqui está apresentada no Capítulo 13, *Instruções SQL*.

- Para obter informações adicionais sobre os procedimentos de backup do `InnoDB`, consulte a Seção 14.19.1, “Backup do InnoDB”.

- A replicação permite manter dados idênticos em vários servidores. Isso oferece vários benefícios, como a capacidade de distribuir a carga de consultas do cliente entre servidores, a disponibilidade dos dados mesmo se um servidor específico for desconectado ou falhar, e a capacidade de fazer backups sem impacto na fonte usando um servidor replica. Veja o Capítulo 16, *Replicação*.

- O MySQL InnoDB Cluster é uma coleção de produtos que trabalham juntos para fornecer uma solução de alta disponibilidade. Um grupo de servidores MySQL pode ser configurado para criar um clúster usando o MySQL Shell. O clúster de servidores tem uma única fonte, chamada de primária, que atua como a fonte de leitura e escrita. Vários servidores secundários são réplicas da fonte. É necessário um mínimo de três servidores para criar um clúster de alta disponibilidade. Um aplicativo cliente é conectado ao primário via MySQL Router. Se o primário falhar, um secundário é automaticamente promovido ao papel de primário, e o MySQL Router encaminha os pedidos para o novo primário.

- O NDB Cluster oferece uma versão de alta disponibilidade e alta redundância do MySQL adaptada para o ambiente de computação distribuída. Veja o Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*, que fornece informações sobre o MySQL NDB Cluster 7.5 (baseado no MySQL 5.7, mas contendo as últimas melhorias e correções para o motor de armazenamento `NDB`).
