## 2.9 Configuração e Teste Pós-Instalação

Esta seção discute as tarefas que você deve realizar após a instalação do MySQL:

* Se necessário, inicie o diretório de dados e crie as tabelas de concessão do MySQL. Para alguns métodos de instalação do MySQL, a inicialização do diretório de dados pode ser feita automaticamente:

  + Operações de instalação do Windows realizadas pelo instalador MSI e pelo MySQL Configurator.
  + Instalação no Linux usando um RPM de servidor ou uma distribuição Debian da Oracle.
  + Instalação usando o sistema de embalagem nativo em muitas plataformas, incluindo Debian Linux, Ubuntu Linux, Gentoo Linux e outras.
  + Instalação no macOS usando uma distribuição DMG.

Para outras plataformas e tipos de instalação, você deve inicializar o diretório de dados manualmente. Isso inclui a instalação a partir de distribuições binárias e de código-fonte genéricas em sistemas Unix e Unix-like, e a instalação a partir de um pacote de arquivo ZIP no Windows. Para instruções, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.
* Inicie o servidor e certifique-se de que ele possa ser acessado. Para instruções, consulte  a Seção 2.9.2, “Iniciando o Servidor”, e a Seção 2.9.3, “Testando o Servidor”.
* Atribua senhas à conta inicial `root` nas tabelas de concessão, se isso não tiver sido feito durante a inicialização do diretório de dados. As senhas impedem o acesso não autorizado ao servidor MySQL. Para instruções, consulte a Seção 2.9.4, “Segurando a Conta Inicial MySQL”.
* Opcionalmente, configure o servidor para iniciar e parar automaticamente quando seu sistema iniciar e parar. Para instruções, consulte  a Seção 2.9.5, “Iniciando e Parando o MySQL Automaticamente”.
* Opcionalmente, preencha as tabelas de fuso horário para habilitar o reconhecimento de fusos horários nomeados.

Quando estiver pronto para criar contas de usuário adicionais, você pode encontrar informações sobre o sistema de controle de acesso do MySQL e a gestão de contas na  Seção 8.2, “Controle de Acesso e Gestão de Contas”.