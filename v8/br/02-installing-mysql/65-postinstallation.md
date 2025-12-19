## 2.9 Instalação e ensaio pós-instalação

Esta seção discute as tarefas que você deve executar após a instalação do MySQL:

- Se necessário, inicie o diretório de dados e crie as tabelas de concessão do MySQL. Para alguns métodos de instalação do MySQL, a inicialização do diretório de dados pode ser feita automaticamente:

  - Operações de instalação do Windows executadas pelo instalador MSI e pelo configurador MySQL.
  - Instalação no Linux usando um servidor RPM ou distribuição Debian da Oracle.
  - Instalação usando o sistema de empacotamento nativo em muitas plataformas, incluindo Debian Linux, Ubuntu Linux, Gentoo Linux e outros.
  - Instalação no macOS usando uma distribuição DMG.

  Para outras plataformas e tipos de instalação, você deve inicializar o diretório de dados manualmente.
- Iniciar o servidor e certificar-se de que ele pode ser acessado.
- Assinar senhas para a conta inicial `root` nas tabelas de concessão, se isso não foi feito durante a inicialização do diretório de dados. Senhas impedem o acesso não autorizado ao servidor MySQL. Para instruções, consulte a Seção 2.9.4, Securing the Initial MySQL Account.
- Opcionalmente, configure o servidor para iniciar e parar automaticamente quando o seu sistema iniciar e parar.
- Opcionalmente, preencha as tabelas de fusos horários para permitir o reconhecimento de fusos horários nomeados.

Quando estiver pronto para criar contas de utilizador adicionais, poderá encontrar informações sobre o sistema de controlo de acesso MySQL e gestão de contas na Secção 8.2, "Controle de acesso e gestão de contas".
