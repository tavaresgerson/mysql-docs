## 2.9 Configuração e Teste Pós-instalação

2.9.1 Inicializando o Data Directory

2.9.2 Iniciando o Servidor

2.9.3 Testando o Servidor

2.9.4 Protegendo a Conta Inicial do MySQL

2.9.5 Iniciando e Parando o MySQL Automaticamente

Esta seção aborda tarefas que você deve realizar após instalar o MySQL:

* Se necessário, inicialize o data directory e crie as grant tables do MySQL. Para alguns métodos de instalação do MySQL, a inicialização do data directory pode ser feita automaticamente:

  + Operações de instalação no Windows realizadas pelo MySQL Installer.
  + Instalação no Linux usando um RPM de servidor ou distribuição Debian da Oracle.

  + Instalação usando o sistema de empacotamento nativo em muitas plataformas, incluindo Debian Linux, Ubuntu Linux, Gentoo Linux e outras.

  + Instalação no macOS usando uma distribuição DMG.

  Para outras plataformas e tipos de instalação, você deve inicializar o data directory manualmente. Isso inclui a instalação a partir de distribuições binárias genéricas e de código-fonte em sistemas Unix e semelhantes ao Unix, e a instalação a partir de um pacote ZIP Archive no Windows. Para instruções, consulte a Seção 2.9.1, “Inicializando o Data Directory”.

* Inicie o servidor e certifique-se de que ele possa ser acessado. Para instruções, consulte a Seção 2.9.2, “Iniciando o Servidor” e a Seção 2.9.3, “Testando o Servidor”.

* Atribua senhas à conta inicial `root` nas grant tables, caso isso ainda não tenha sido feito durante a inicialização do data directory. Senhas impedem o acesso não autorizado ao servidor MySQL. Para instruções, consulte a Seção 2.9.4, “Protegendo a Conta Inicial do MySQL”.

* Opcionalmente, configure para que o servidor inicie e pare automaticamente quando seu sistema iniciar e parar. Para instruções, consulte a Seção 2.9.5, “Iniciando e Parando o MySQL Automaticamente”.

* Opcionalmente, preencha as tabelas de time zone para permitir o reconhecimento de time zones nomeadas. Para instruções, consulte a Seção 5.1.13, “Suporte a Time Zone do Servidor MySQL”.

Quando estiver pronto para criar contas de usuário adicionais, você pode encontrar informações sobre o sistema de controle de acesso e gerenciamento de contas do MySQL na Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”.