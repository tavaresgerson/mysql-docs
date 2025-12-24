## 3.1 Antes de começar

Revise as informações nesta secção antes de atualizar.

- Entenda o que pode ocorrer durante uma atualização. Ver Seção 3.4, "O que o processo de atualização do MySQL atualiza".
- Proteja seus dados criando um backup. O backup deve incluir o banco de dados do sistema `mysql`, que contém as tabelas do dicionário de dados MySQL e as tabelas do sistema. Veja Seção 9.2, Métodos de backup de banco de dados.

  Importância

  O downgrade do MySQL 8.4 para o MySQL 8.3, ou de uma versão do MySQL 8.4 para uma versão anterior do MySQL 8.4, não é suportado. A única alternativa suportada é restaurar um backup feito antes da atualização. É, portanto, imperativo que você faça backup de seus dados antes de iniciar o processo de atualização.
- Revise a secção 3.2, "Caminhos de atualização", para se certificar de que o seu caminho de atualização pretendido é suportado.
- Revise a Seção 3.5, "Mudanças no MySQL 8.4", para ver quais mudanças você deve estar ciente antes de atualizar.
- Revise a Seção 1.4, "O que há de novo no MySQL 8.4 desde o MySQL 8.0" para recursos depreciados e removidos. Uma atualização pode exigir alterações em relação a esses recursos se você usar qualquer um deles.
- Revise a Seção 1.5, "Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 8.4 since 8.0". Se você usar variáveis deprecated ou removidas, uma atualização pode exigir alterações de configuração.
- Revise as Notas de Lançamento para obter informações sobre correções, alterações e novos recursos.
- Se utilizar a replicação, revise a secção 19.5.3, "Atualização ou degradação de uma topologia de replicação".
- Revisar a secção 3.3, "Atualizar as melhores práticas" e planear em conformidade.
- Os procedimentos de atualização variam de acordo com a plataforma e como a instalação inicial foi realizada. Use o procedimento que se aplica à sua instalação atual do MySQL:

  - Para instalações binárias e baseadas em pacotes em plataformas não Windows, consulte a Secção 3.7, "Atualização de instalações binárias ou baseadas em pacotes do MySQL em Unix/Linux".

    ::: info Note

    Para distribuições Linux suportadas, o método preferido para atualizar instalações baseadas em pacotes é usar os repositórios de software MySQL (MySQL Yum Repository, MySQL APT Repository e MySQL SLES Repository).

    :::

  - Para instalações em uma plataforma Enterprise Linux ou Fedora usando o MySQL Yum Repository, consulte a Seção 3.8, Upgrading MySQL with the MySQL Yum Repository.

  - Para instalações no Ubuntu usando o repositório MySQL APT, consulte a Seção 3.9, "Atualização do MySQL com o Repositório MySQL APT".

  - Para instalações em SLES que utilizem o repositório MySQL SLES, consultar a secção 3.10, "Atualização do MySQL com o repositório MySQL SLES".

  - Para instalações realizadas usando o Docker, consulte a Secção 3.12, Upgrading a Docker Installation of MySQL.

  - Para as instalações no Windows, consulte a Secção 3.11, "Atualização do MySQL no Windows".
- Se a sua instalação do MySQL contém uma grande quantidade de dados que podem levar muito tempo para converter após uma atualização no local, pode ser útil criar uma instância de teste para avaliar as conversões necessárias e o trabalho envolvido para realizá-las. Para criar uma instância de teste, faça uma cópia da sua instância do MySQL que contém o banco de dados `mysql` e outros bancos de dados sem os dados. Execute o procedimento de atualização na instância de teste para avaliar o trabalho envolvido para realizar a conversão de dados real.
- Reconstruir e reinstalar interfaces de linguagem MySQL é recomendado quando você instalar ou atualizar para uma nova versão do MySQL. Isso se aplica a interfaces MySQL, como extensões PHP `mysql` e o módulo Perl `DBD::mysql`.
