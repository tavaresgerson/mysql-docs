## 2.9 Configuração e Teste Pós-Instalação

2.9.1 Inicialização do Diretório de Dados

2.9.2 Inicialização do Servidor

2.9.3 Teste do Servidor

2.9.4 Proteção da Conta Inicial do MySQL

2.9.5 Inicialização e Parada Automática do MySQL

Esta seção discute as tarefas que você deve realizar após a instalação do MySQL:

* Se necessário, inicie o diretório de dados e crie as tabelas de concessão do MySQL. Para alguns métodos de instalação do MySQL, a inicialização do diretório de dados pode ser feita automaticamente:

  + Operações de instalação do Windows realizadas pelo instalador MSI e pelo MySQL Configurator.

  + Instalação no Linux usando um RPM do servidor ou uma distribuição Debian da Oracle.

  + Instalação usando o sistema de embalagem nativo em muitas plataformas, incluindo Debian Linux, Ubuntu Linux, Gentoo Linux e outras.

  + Instalação no macOS usando uma distribuição DMG.

  Para outras plataformas e tipos de instalação, você deve inicializar o diretório de dados manualmente. Isso inclui a instalação a partir de distribuições binárias e de código-fonte genéricas em sistemas Unix e Unix-like, e a instalação a partir de um pacote ZIP no Windows. Para instruções, consulte a Seção 2.9.1, “Inicialização do Diretório de Dados”.

* Inicie o servidor e verifique se ele pode ser acessado. Para instruções, consulte a Seção 2.9.2, “Inicialização do Servidor”, e a Seção 2.9.3, “Teste do Servidor”.

* Atribua senhas à conta inicial `root` nas tabelas de concessão, se isso não tiver sido feito durante a inicialização do diretório de dados. As senhas impedem o acesso não autorizado ao servidor MySQL. Para instruções, consulte a Seção 2.9.4, “Proteção da Conta Inicial do MySQL”.

* Opcionalmente, configure o servidor para iniciar e parar automaticamente quando o sistema iniciar e parar. Para instruções, consulte a Seção 2.9.5, “Inicialização e Parada Automática do MySQL”.

* Opcionalmente, preencha as tabelas de fuso horário para permitir o reconhecimento de fusos horários nomeados. Para obter instruções, consulte a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL”.

Quando estiver pronto para criar contas de usuário adicionais, você pode encontrar informações sobre o sistema de controle de acesso e gerenciamento de contas na Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”.