## 3.1 Antes de Começar

Revise as informações nesta seção antes de fazer a atualização. Realize as ações recomendadas.

* Entenda o que pode ocorrer durante uma atualização. Veja a Seção 3.4, “O que o processo de atualização do MySQL atualiza”.

* Proteja seus dados ao criar um backup. O backup deve incluir o banco de dados do sistema `mysql`, que contém as tabelas do dicionário de dados MySQL e as tabelas do sistema. Veja a Seção 9.2, “Métodos de backup de banco de dados”.

Importante

A desativação do MySQL 8.0 para o MySQL 5.7 ou de uma versão do MySQL 8.0 para uma versão anterior do MySQL 8.0 não é suportada. A única alternativa suportada é restaurar um backup feito *antes* da atualização. Portanto, é imperativo que você faça um backup de seus dados antes de iniciar o processo de atualização.

* Revise a Seção 3.2, “Caminhos de Atualização”, para garantir que o caminho de atualização pretendido seja suportado.

* Revise a Seção 3.5, “Alterações no MySQL 8.0”, para as alterações que você deve estar ciente antes de fazer a atualização. Algumas alterações podem exigir ação.

* Revise a Seção 1.3, “O que há de novo no MySQL 8.0”, para obter informações sobre as funcionalidades obsoletas e removidas. Um upgrade pode exigir alterações em relação a essas funcionalidades, se você as utilizar.

* Revisão [Seção 1.4, "Variáveis e opções de servidor e status adicionadas, descontinuadas ou removidas no MySQL 8.0"] (added-deprecated-removed.html "1.4 Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 8.0"). Se você usar variáveis descontinuadas ou removidas, uma atualização pode exigir alterações na configuração.

* Revise as Notas de Lançamento (/doc/relnotes/mysql/8.0/en/) para obter informações sobre correções, alterações e novos recursos.

* Se você usa replicação, revise a Seção 19.5.3, “Atualizando uma topologia de replicação”.

* Revise a Seção 3.3, “Melhores Práticas de Atualização” e planeje conforme necessário.

* Os procedimentos de atualização variam de acordo com a plataforma e com a forma como a instalação inicial foi realizada. Use o procedimento que se aplica à sua instalação MySQL atual:

+ Para instalações binárias e baseadas em pacotes em plataformas que não são do Windows, consulte a Seção 3.7, “Atualizando instalações binárias ou baseadas em pacotes do MySQL em Unix/Linux”.

Nota

Para as distribuições Linux suportadas, o método preferido para atualizar instalações baseadas em pacotes é usar os repositórios de software MySQL (MySQL Yum Repository, MySQL APT Repository e MySQL SLES Repository).

+ Para instalações em uma plataforma Enterprise Linux ou Fedora usando o Repositório MySQL Yum, consulte a Seção 3.8, “Atualizando o MySQL com o Repositório MySQL Yum”.

+ Para instalações no Ubuntu usando o repositório MySQL APT, consulte a Seção 3.9, “Atualizando o MySQL com o repositório MySQL APT”.

+ Para instalações em SLES usando o repositório MySQL SLES, consulte a Seção 3.10, “Atualizando o MySQL com o repositório MySQL SLES”.

+ Para instalações realizadas usando Docker, consulte a Seção 3.12, “Atualizando uma Instalação Docker do MySQL”.

+ Para instalações no Windows, consulte a Seção 3.11, “Atualizando o MySQL no Windows”.

* Se a sua instalação do MySQL contiver uma grande quantidade de dados que podem levar um longo tempo para serem convertidos após uma atualização in-place, pode ser útil criar uma instância de teste para avaliar as conversões necessárias e o trabalho envolvido para as realizar. Para criar uma instância de teste, faça uma cópia da sua instância do MySQL que contém o banco de dados `mysql` e outros bancos de dados sem os dados. Execute o procedimento de atualização na instância de teste para avaliar o trabalho envolvido para realizar a conversão real dos dados.

* Recomenda-se a reconstrução e reinstalação das interfaces de linguagem do MySQL quando você instala ou atualiza para uma nova versão do MySQL. Isso se aplica a interfaces do MySQL, como as extensões PHP `mysql` e o módulo Perl `DBD::mysql`.