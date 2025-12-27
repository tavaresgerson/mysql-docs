## 3.1 Antes de Começar

Revise as informações nesta seção antes de fazer a atualização. Realize as ações recomendadas.

* Entenda o que pode ocorrer durante uma atualização. Consulte a Seção 3.4, “O que a Atualização do Processo do MySQL Atualiza”.

* Proteja seus dados criando um backup. O backup deve incluir o banco de dados do sistema `mysql`, que contém as tabelas do dicionário de dados do MySQL e as tabelas do sistema. Consulte a Seção 9.2, “Métodos de Backup de Banco de Dados”.

  Importante

  A desativação do MySQL 9.5 para o MySQL 9.4 ou de uma versão do MySQL 9.5 para uma versão anterior do MySQL 9.5 não é suportada. A única alternativa suportada é restaurar um backup feito *antes* da atualização. Portanto, é imperativo que você faça backup de seus dados antes de iniciar o processo de atualização.

* Revise a Seção 3.2, “Caminhos de Atualização” para garantir que o caminho de atualização pretendido seja suportado.

* Revise a Seção 3.5, “Alterações no MySQL 9.5” para alterações das quais você deve estar ciente antes de fazer a atualização. Algumas alterações podem exigir ação.

* Revise a Seção 1.4, “O que há de Novo no MySQL 9.5” para recursos desatualizados e removidos. Uma atualização pode exigir alterações em relação a esses recursos se você os usar.

* Revise a Seção 1.5, “Variáveis e Opções de Status e Servidor Adicionadas, Desatualizadas ou Removidas no MySQL 9.5”. Se você usar variáveis desatualizadas ou removidas, uma atualização pode exigir alterações na configuração.

* Revise as Notas de Lançamento para obter informações sobre correções, alterações e novos recursos.

* Se você usar replicação, revise a Seção 19.5.3, “Atualizando ou Desatualizando uma Topologia de Replicação”.

* Revise a Seção 3.3, “Melhores Práticas de Atualização” e planeje conforme necessário.

* Os procedimentos de atualização variam de acordo com a plataforma e como a instalação inicial foi realizada. Use o procedimento que se aplica à sua instalação atual do MySQL:

+ Para instalações binárias e baseadas em pacotes em plataformas não Windows, consulte a Seção 3.7, “Atualizando Instalações Binárias ou Baseadas em Pacotes do MySQL no Unix/Linux”.

    Nota

    Para as distribuições Linux suportadas, o método preferido para atualizar instalações baseadas em pacotes é usar os repositórios de software do MySQL (Repositório MySQL Yum, Repositório MySQL APT e Repositório MySQL SLES).

  + Para instalações em uma plataforma Enterprise Linux ou Fedora usando o Repositório MySQL Yum, consulte a Seção 3.8, “Atualizando o MySQL com o Repositório MySQL Yum”.

  + Para instalações em Ubuntu usando o repositório MySQL APT, consulte a Seção 3.9, “Atualizando o MySQL com o Repositório MySQL APT”.

  + Para instalações em SLES usando o repositório MySQL SLES, consulte a Seção 3.10, “Atualizando o MySQL com o Repositório MySQL SLES”.

  + Para instalações realizadas usando Docker, consulte a Seção 3.12, “Atualizando uma Instalação Docker do MySQL”.

  + Para instalações em Windows, consulte a Seção 3.11, “Atualizando o MySQL em Windows”.

* Se sua instalação do MySQL contiver uma grande quantidade de dados que podem levar muito tempo para serem convertidos após uma atualização in-place, pode ser útil criar uma instância de teste para avaliar as conversões necessárias e o trabalho envolvido para realizá-las. Para criar uma instância de teste, faça uma cópia da sua instância do MySQL que contém o banco de dados `mysql` e outros bancos de dados sem os dados. Execute o procedimento de atualização na instância de teste para avaliar o trabalho envolvido para realizar a conversão real dos dados.

* A reconstrução e a reinstalação das interfaces de linguagem do MySQL são recomendadas ao instalar ou atualizar para uma nova versão do MySQL. Isso se aplica a interfaces do MySQL como as extensões PHP `mysql` e o módulo Perl `DBD::mysql`.