## 2.9 Configuração e teste pós-instalação

2.9.1 Inicialização do Diretório de Dados

2.9.2 Iniciando o servidor

2.9.3 Testando o servidor

2.9.4 Protegendo a Conta Inicial do MySQL

2.9.5 Iniciar e parar o MySQL automaticamente

Esta seção discute as tarefas que você deve realizar após a instalação do MySQL:

- Se necessário, inicie o diretório de dados e crie as tabelas de concessão do MySQL. Para alguns métodos de instalação do MySQL, a inicialização do diretório de dados pode ser feita automaticamente:

  - Operações de instalação do Windows realizadas pelo Instalador do MySQL.

  - Instalação no Linux usando um RPM do servidor ou uma distribuição Debian da Oracle.

  - Instalação usando o sistema de embalagem nativo em muitas plataformas, incluindo Debian Linux, Ubuntu Linux, Gentoo Linux e outras.

  - Instalação no macOS usando uma distribuição DMG.

  Para outras plataformas e tipos de instalação, você deve inicializar o diretório de dados manualmente. Isso inclui a instalação a partir de distribuições binárias e de código-fonte genéricas em sistemas Unix e Unix-like, e a instalação a partir de um pacote de arquivo ZIP no Windows. Para obter instruções, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.

- Inicie o servidor e verifique se ele pode ser acessado. Para obter instruções, consulte a Seção 2.9.2, “Iniciar o Servidor”, e a Seção 2.9.3, “Testar o Servidor”.

- Atribua senhas à conta inicial `root` nas tabelas de concessão, se isso ainda não tiver sido feito durante a inicialização do diretório de dados. As senhas impedem o acesso não autorizado ao servidor MySQL. Para obter instruções, consulte a Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

- Opcionalmente, configure para que o servidor comece e pare automaticamente quando o sistema for iniciado e desligado. Para obter instruções, consulte a Seção 2.9.5, “Iniciar e Parar o MySQL automaticamente”.

- Opcionalmente, preencha as tabelas de fuso horário para permitir o reconhecimento de fusos horários nomeados. Para obter instruções, consulte a Seção 5.1.13, "Suporte de Fuso Horário do MySQL Server".

Quando estiver pronto para criar contas de usuário adicionais, você pode encontrar informações sobre o sistema de controle de acesso e gerenciamento de contas do MySQL na Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”.
