## 2.3 Instalação do MySQL no Microsoft Windows

2.3.1 Configuração da Instalação do MySQL no Microsoft Windows

2.3.2 Escolhendo um pacote de instalação

2.3.3 Instalador do MySQL para Windows

2.3.4 Instalando o MySQL no Microsoft Windows usando um arquivo ZIP `noinstall`

2.3.5 Solução de problemas de instalação do Microsoft Windows MySQL Server

2.3.6 Procedimentos pós-instalação do Windows

2.3.7 Restrições da Plataforma Windows

Importante

O MySQL 8.0 Server requer o Pacote de Redistribuição do Microsoft Visual C++ 2019 para funcionar em plataformas Windows. Os usuários devem garantir que o pacote tenha sido instalado no sistema antes de instalar o servidor. O pacote está disponível no Centro de Download da Microsoft. Além disso, os binários de depuração do MySQL requerem que o Visual Studio 2019 esteja instalado.

O MySQL está disponível apenas para sistemas operacionais Microsoft Windows de 64 bits. Para informações sobre a plataforma Windows suportada, consulte <https://www.mysql.com/support/supportedplatforms/database.html>.

Existem diferentes métodos para instalar o MySQL no Microsoft Windows.

### Método de Instalação do MySQL

O método mais simples e recomendado é baixar o Instalador do MySQL (para Windows) e deixá-lo instalar e configurar uma versão específica do Servidor MySQL da seguinte forma:

1. Baixe o instalador do MySQL em <https://dev.mysql.com/downloads/installer/> e execute-o.

   Nota

   Ao contrário do instalador padrão do MySQL, a versão menor `web-community` não inclui nenhum aplicativo do MySQL, mas apenas baixa os produtos do MySQL que você escolheu para instalar.

2. Determine o tipo de configuração a ser usado para a instalação inicial dos produtos MySQL. Por exemplo:

   - Desenvolvedor Padrão: Fornece um tipo de configuração que inclui a versão selecionada do MySQL Server e outras ferramentas MySQL relacionadas ao desenvolvimento do MySQL, como o MySQL Workbench.

   - Servidor apenas: Fornece uma configuração para a versão selecionada do MySQL Server sem outros produtos.

   - Personalizado: Permite que você selecione qualquer versão do MySQL Server e outros produtos MySQL.

3. Instale a instância do servidor (e os produtos) e, em seguida, comece a configuração do servidor seguindo as instruções na tela. Para obter mais informações sobre cada etapa individual, consulte a Seção 2.3.3.3.1, “Configuração do Servidor MySQL com o Instalador MySQL”.

O MySQL está agora instalado. Se você configurou o MySQL como um serviço, o Windows iniciará automaticamente o servidor MySQL toda vez que você reiniciar o sistema. Além disso, este processo instala o aplicativo Instalador do MySQL no host local, que você pode usar mais tarde para atualizar ou reconfigurar o servidor MySQL.

Nota

Se você instalou o MySQL Workbench no seu sistema, considere usá-lo para verificar a conexão do seu novo servidor MySQL. Por padrão, o programa é iniciado automaticamente após a instalação do MySQL.

### Informações adicionais sobre a instalação

É possível executar o MySQL como uma aplicação padrão ou como um serviço do Windows. Ao usar um serviço, você pode monitorar e controlar o funcionamento do servidor por meio das ferramentas padrão de gerenciamento de serviços do Windows. Para obter mais informações, consulte a Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

Para acomodar a declaração `RESTART`, o servidor MySQL se divide quando executado como serviço ou de forma independente, para permitir que um processo de monitoramento supervisione o processo do servidor. Neste caso, existem dois processos **mysqld**. Se a capacidade `RESTART` não for necessária, o servidor pode ser iniciado com a opção `--no-monitor`. Veja a Seção 15.7.8.8, “Declaração RESTART”.

Geralmente, você deve instalar o MySQL no Windows usando uma conta com direitos de administrador. Caso contrário, você pode encontrar problemas com certas operações, como editar a variável de ambiente `PATH` ou acessar o **Service Control Manager**. Após a instalação, o MySQL não precisa ser executado usando um usuário com privilégios de administrador.

Para uma lista de limitações sobre o uso do MySQL na plataforma Windows, consulte a Seção 2.3.7, “Restrições da Plataforma Windows”.

Além do pacote do MySQL Server, você pode precisar ou querer componentes adicionais para usar o MySQL com seu aplicativo ou ambiente de desenvolvimento. Estes incluem, mas não estão limitados a:

- Para se conectar ao servidor MySQL usando ODBC, você deve ter um driver Connector/ODBC. Para obter mais informações, incluindo instruções de instalação e configuração, consulte o Guia do Desenvolvedor do MySQL Connector/ODBC.

  Nota

  O Instalador do MySQL instala e configura o Connector/ODBC para você.

- Para usar o servidor MySQL com aplicativos .NET, você deve ter o driver Connector/NET. Para obter mais informações, incluindo instruções de instalação e configuração, consulte o Guia do Desenvolvedor MySQL Connector/NET.

  Nota

  O Instalador do MySQL instala e configura o MySQL Connector/NET para você.

As distribuições do MySQL para Windows podem ser baixadas em <https://dev.mysql.com/downloads/>. Veja a Seção 2.1.3, “Como obter o MySQL”.

O MySQL para Windows está disponível em vários formatos de distribuição, detalhados aqui. De modo geral, você deve usar o Instalador do MySQL. Ele contém mais recursos e produtos do MySQL do que o MSI mais antigo, é mais simples de usar do que o arquivo compactado e você não precisa de ferramentas adicionais para fazer o MySQL funcionar. O Instalador do MySQL instala automaticamente o MySQL Server e outros produtos do MySQL, cria um arquivo de opções, inicia o servidor e permite que você crie contas de usuário padrão. Para mais informações sobre a escolha de um pacote, consulte a Seção 2.3.2, “Escolhendo um Pacote de Instalação”.

- Uma distribuição do Instalador do MySQL inclui o Servidor MySQL e outros produtos do MySQL, como o MySQL Workbench e o MySQL para o Visual Studio. O Instalador do MySQL também pode ser usado para atualizar esses produtos no futuro (consulte <https://dev.mysql.com/doc/mysql-compat-matrix/pt/>).

  Para obter instruções sobre como instalar o MySQL usando o Instalador do MySQL, consulte a Seção 2.3.3, “Instalador do MySQL para Windows”.

- A distribuição binária padrão (empacotada como um arquivo compactado) contém todos os arquivos necessários que você descompacta na localização escolhida. Este pacote contém todos os arquivos do pacote completo do instalador MSI do Windows, mas não inclui um programa de instalação.

  Para obter instruções sobre como instalar o MySQL usando o arquivo compactado, consulte a Seção 2.3.4, “Instalando o MySQL no Microsoft Windows usando um arquivo ZIP `noinstall`”.

- O formato de distribuição da fonte contém todo o código e os arquivos de suporte para a construção dos executáveis usando o sistema de compilador do Visual Studio.

  Para obter instruções sobre como construir o MySQL a partir do código-fonte no Windows, consulte a Seção 2.8, “Instalando o MySQL a partir do código-fonte”.

### Considerações sobre o MySQL no Windows

- **Suporte para mesa grande**

  Se você precisar de tabelas com um tamanho maior que 4 GB, instale o MySQL em um sistema de arquivos NTFS ou mais recente. Não se esqueça de usar `MAX_ROWS` e `AVG_ROW_LENGTH` ao criar tabelas. Veja a Seção 15.1.20, “Instrução CREATE TABLE”.

- **MySQL e Software de Verificação de Vírus**

  O software de varredura de vírus, como o Norton/Symantec Anti-Virus, em diretórios que contêm dados do MySQL e tabelas temporárias, pode causar problemas, tanto em termos do desempenho do MySQL quanto da identificação incorreta do conteúdo dos arquivos como spam pelo software de varredura de vírus. Isso ocorre devido ao mecanismo de impressão digital usado pelo software de varredura de vírus e à maneira como o MySQL atualiza rapidamente diferentes arquivos, o que pode ser identificado como um risco potencial de segurança.

  Após instalar o MySQL Server, recomenda-se desativar a varredura de vírus no diretório principal (`datadir`) usado para armazenar os dados da sua tabela MySQL. Geralmente, o software de varredura de vírus inclui um sistema para ignorar diretórios específicos.

  Além disso, por padrão, o MySQL cria arquivos temporários no diretório temporário padrão do Windows. Para evitar que os arquivos temporários também sejam verificados, configure um diretório temporário separado para os arquivos temporários do MySQL e adicione esse diretório à lista de exclusão da verificação de vírus. Para fazer isso, adicione uma opção de configuração para o parâmetro `tmpdir` ao seu arquivo de configuração `my.ini`. Para obter mais informações, consulte a Seção 2.3.4.2, “Criando um arquivo de opção”.
