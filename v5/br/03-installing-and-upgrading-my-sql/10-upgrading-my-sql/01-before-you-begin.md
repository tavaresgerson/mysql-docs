### 2.10.1 Antes de começar

Revise as informações nesta seção antes de fazer a atualização. Realize as ações recomendadas.

- Proteja seus dados criando um backup. O backup deve incluir o banco de dados do sistema `mysql`, que contém as tabelas do sistema MySQL. Veja a Seção 7.2, “Métodos de Backup de Banco de Dados”.

- Revise a Seção 2.10.2, “Caminhos de Atualização”, para garantir que o caminho de atualização pretendido seja suportado.

- Consulte a Seção 2.10.3, “Alterações no MySQL 5.7”, para as alterações que você deve estar ciente antes de fazer a atualização. Algumas alterações podem exigir ação.

- Consulte a seção 1.3, “O que há de novo no MySQL 5.7”, para obter informações sobre as funcionalidades descontinuadas e removidas. Uma atualização pode exigir alterações nesses recursos se você os usar.

- Revise a Seção 1.4, “Variáveis e Opções de Servidor e Status Adicionadas, Desatualizadas ou Removidas no MySQL 5.7”. Se você estiver usando variáveis desatualizadas ou removidas, uma atualização pode exigir alterações na configuração.

- Revise as Notas de Lançamento para obter informações sobre correções, alterações e novos recursos.

- Se você estiver usando replicação, revise a Seção 16.4.3, “Atualizando uma Topologia de Replicação”.

- Os procedimentos de atualização variam de acordo com a plataforma e com a forma como a instalação inicial foi realizada. Use o procedimento que se aplica à sua instalação MySQL atual:

  - Para instalações binárias e baseadas em pacotes em plataformas não Windows, consulte a Seção 2.10.4, “Atualizando instalações binárias ou baseadas em pacotes do MySQL em Unix/Linux”.

    ::: info Nota
    Para as distribuições Linux suportadas, o método preferido para atualizar instalações baseadas em pacotes é usar os repositórios de software MySQL (MySQL Yum Repository, MySQL APT Repository e MySQL SLES Repository).
    :::

  - Para instalações em uma plataforma Enterprise Linux ou Fedora usando o Repositório Yum do MySQL, consulte a Seção 2.10.5, “Atualizando o MySQL com o Repositório Yum do MySQL”.

  - Para instalações no Ubuntu usando o repositório MySQL APT, consulte a Seção 2.10.6, “Atualizando o MySQL com o repositório MySQL APT”.

  - Para instalações no SLES usando o repositório MySQL SLES, consulte a Seção 2.10.7, “Atualizando o MySQL com o repositório MySQL SLES”.

  - Para instalações realizadas usando o Docker, consulte a Seção 2.10.9, “Atualizando uma Instalação Docker do MySQL”.

  - Para instalações no Windows, consulte a Seção 2.10.8, “Atualizando o MySQL no Windows”.

- Se a sua instalação do MySQL contiver uma grande quantidade de dados que podem levar muito tempo para serem convertidos após uma atualização local, pode ser útil criar uma instância de teste para avaliar as conversões necessárias e o trabalho envolvido para realizá-las. Para criar uma instância de teste, faça uma cópia da sua instância do MySQL que contenha o banco de dados `mysql` e outros bancos de dados sem os dados. Execute o procedimento de atualização na instância de teste para avaliar o trabalho envolvido na realização da conversão real dos dados.

- Recomenda-se a reconstrução e reinstalação das interfaces de linguagem do MySQL ao instalar ou atualizar para uma nova versão do MySQL. Isso se aplica a interfaces do MySQL, como as extensões PHP `mysql` e o módulo Perl `DBD::mysql`.
