### 2.10.1 Antes de Começar

Revise as informações nesta seção antes de realizar o upgrade (atualização). Execute quaisquer ações recomendadas.

* Proteja seus dados criando um backup. O backup deve incluir a `mysql` system **database**, que contém as tabelas de sistema do MySQL. Consulte a Seção 7.2, “Database Backup Methods”.

* Revise a Seção 2.10.2, “Upgrade Paths” para garantir que o caminho de **upgrade** pretendido seja suportado.

* Revise a Seção 2.10.3, “Changes in MySQL 5.7” para alterações das quais você deve estar ciente antes de realizar o **upgrade**. Algumas alterações podem exigir ação.

* Revise a Seção 1.3, “What Is New in MySQL 5.7” para recursos descontinuados e removidos. Um **upgrade** pode exigir alterações em relação a esses recursos se você utilizar algum deles.

* Revise a Seção 1.4, “Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 5.7”. Se você usar variáveis descontinuadas ou removidas, um **upgrade** pode exigir alterações de configuração.

* Revise as Notas de Lançamento (**Release Notes**) para obter informações sobre correções, alterações e novos recursos.

* Se você usa **replication**, revise a Seção 16.4.3, “Upgrading a Replication Topology”.

* Os procedimentos de **upgrade** variam conforme a plataforma e a forma como a instalação inicial foi realizada. Use o procedimento que se aplica à sua instalação atual do MySQL:

  + Para instalações baseadas em binário e pacote em plataformas que não são Windows, consulte a Seção 2.10.4, “Upgrading MySQL Binary or Package-based Installations on Unix/Linux”.

    > **Note**
    > Para distribuições Linux suportadas, o método preferido para fazer **upgrade** de instalações baseadas em pacote é usar os repositórios de software MySQL (MySQL Yum Repository, MySQL APT Repository e MySQL SLES Repository).

  + Para instalações em uma plataforma Enterprise Linux ou Fedora usando o MySQL Yum Repository, consulte a Seção 2.10.5, “Upgrading MySQL with the MySQL Yum Repository”.

  + Para instalações no Ubuntu usando o MySQL APT Repository, consulte a Seção 2.10.6, “Upgrading MySQL with the MySQL APT Repository”.

  + Para instalações no SLES usando o MySQL SLES Repository, consulte a Seção 2.10.7, “Upgrading MySQL with the MySQL SLES Repository”.

  + Para instalações realizadas usando o Docker, consulte a Seção 2.10.9, “Upgrading a Docker Installation of MySQL”.

  + Para instalações no Windows, consulte a Seção 2.10.8, “Upgrading MySQL on Windows”.

* Se sua instalação MySQL contiver uma grande quantidade de dados que possa levar muito tempo para ser convertida após um **upgrade** *in-place*, pode ser útil criar uma instância de teste para avaliar as conversões necessárias e o trabalho envolvido para realizá-las. Para criar uma instância de teste, faça uma cópia de sua instância MySQL que contenha a **database** `mysql` e outras **databases** sem os dados. Execute o procedimento de **upgrade** na instância de teste para avaliar o trabalho envolvido na realização da conversão de dados real.

* Reconstruir e reinstalar as interfaces de linguagem MySQL é recomendado ao instalar ou fazer **upgrade** para um novo lançamento do MySQL. Isso se aplica a interfaces MySQL como extensões PHP `mysql` e o módulo Perl `DBD::mysql`.
