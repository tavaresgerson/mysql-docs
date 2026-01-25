## 2.3 Instalando o MySQL no Microsoft Windows

2.3.1 Layout de Instalação do MySQL no Microsoft Windows

2.3.2 Escolhendo um Pacote de Instalação

2.3.3 MySQL Installer para Windows

2.3.4 Instalando o MySQL no Microsoft Windows Usando um Arquivo ZIP `noinstall`

2.3.5 Solução de Problemas em uma Instalação do MySQL Server no Microsoft Windows

2.3.6 Procedimentos de Pós-Instalação no Windows

2.3.7 Restrições da Plataforma Windows

Importante

O MySQL Community 5.7 Server exige o Pacote Redistribuível Microsoft Visual C++ 2019 para ser executado em plataformas Windows. Os usuários devem garantir que o pacote tenha sido instalado no sistema antes de instalar o Server. O pacote está disponível no Microsoft Download Center.

Este requisito mudou ao longo do tempo: o MySQL 5.7.37 e versões anteriores requerem o Pacote Redistribuível Microsoft Visual C++ 2013, o MySQL 5.7.38 e 5.7.39 requerem ambos, e apenas o Pacote Redistribuível Microsoft Visual C++ 2019 é exigido a partir do MySQL 5.7.40.

O MySQL está disponível para Microsoft Windows, tanto para versões de 32 bits quanto de 64 bits. Para informações sobre plataformas Windows suportadas, consulte <https://www.mysql.com/support/supportedplatforms/database.html>.

Importante

Se o seu sistema operacional for Windows 2008 R2 ou Windows 7 e você não tiver o Service Pack 1 (SP1) instalado, o MySQL 5.7 reinicia regularmente com a seguinte mensagem no arquivo de log de erro do MySQL Server:

```sql
mysqld got exception 0xc000001d
```

Esta mensagem de erro ocorre porque você também está usando uma CPU que não suporta a instrução VPSRLQ, indicando que a instrução da CPU que foi tentada não é suportada.

Para corrigir este erro, você *deve* instalar o SP1. Isso adiciona o suporte necessário do sistema operacional para detecção de capacidade da CPU e desabilita esse suporte quando a CPU não possui as instruções necessárias.

Alternativamente, instale uma versão mais antiga do MySQL, como a 5.6.

Existem diferentes métodos para instalar o MySQL no Microsoft Windows.

### Método MySQL Installer

O método mais simples e recomendado é fazer o download do MySQL Installer (para Windows) e permitir que ele instale e configure todos os produtos MySQL no seu sistema. Veja como:

1. Faça o download do MySQL Installer em <https://dev.mysql.com/downloads/installer/> e execute-o.

   Note

   Ao contrário do MySQL Installer padrão, a versão "web-community", que é menor, não empacota nenhuma aplicação MySQL, mas sim baixa os produtos MySQL que você escolhe instalar.

2. Escolha o Tipo de Configuração (Setup Type) apropriado para o seu sistema. Normalmente, você deve escolher Developer Default para instalar o MySQL Server e outras ferramentas MySQL relacionadas ao desenvolvimento MySQL, como o MySQL Workbench. Escolha o tipo de configuração Custom (Personalizada) para selecionar manualmente os produtos MySQL desejados.

   Note

   Múltiplas versões do MySQL Server podem coexistir em um único sistema. Você pode escolher uma ou múltiplas versões.

3. Conclua o processo de instalação seguindo as instruções. Esta instalação instala vários produtos MySQL e inicia o MySQL Server.

O MySQL está agora instalado. Se você configurou o MySQL como um Service, o Windows inicia automaticamente o MySQL Server sempre que você reinicia o sistema.

Note

Você provavelmente também instalou outros produtos MySQL úteis, como o MySQL Workbench, no seu sistema. Considere consultar o Capítulo 29, *MySQL Workbench* para verificar sua nova conexão com o MySQL Server. Por padrão, este programa inicia automaticamente após a instalação do MySQL.

Este processo também instala a aplicação MySQL Installer no seu sistema e, posteriormente, você pode usar o MySQL Installer para atualizar ou reconfigurar seus produtos MySQL.

### Informações Adicionais de Instalação

É possível executar o MySQL como uma aplicação padrão ou como um Service do Windows. Ao usar um Service, você pode monitorar e controlar a operação do Server por meio das ferramentas padrão de gerenciamento de Service do Windows. Para mais informações, consulte Seção 2.3.4.8, “Iniciando o MySQL como um Service do Windows”.

Geralmente, você deve instalar o MySQL no Windows usando uma conta que tenha direitos de Administrador. Caso contrário, você poderá encontrar problemas com certas operações, como editar a variável de ambiente `PATH` ou acessar o **Service Control Manager**. Após a instalação, o MySQL não precisa ser executado usando um usuário com privilégios de Administrador.

Para obter uma lista de limitações no uso do MySQL na plataforma Windows, consulte Seção 2.3.7, “Restrições da Plataforma Windows”.

Além do pacote MySQL Server, você pode precisar ou querer componentes adicionais para usar o MySQL com sua aplicação ou ambiente de desenvolvimento. Estes incluem, mas não se limitam a:

* Para se conectar ao MySQL Server usando ODBC, você deve ter um driver Connector/ODBC. Para mais informações, incluindo instruções de instalação e configuração, consulte o Guia do Desenvolvedor MySQL Connector/ODBC.

  Note

  O MySQL Installer instala e configura o Connector/ODBC para você.

* Para usar o MySQL Server com aplicações .NET, você deve ter o driver Connector/NET. Para mais informações, incluindo instruções de instalação e configuração, consulte o Guia do Desenvolvedor MySQL Connector/NET.

  Note

  O MySQL Installer instala e configura o MySQL Connector/NET para você.

As distribuições MySQL para Windows podem ser baixadas em <https://dev.mysql.com/downloads/>. Consulte Seção 2.1.3, “Como Obter o MySQL”.

O MySQL para Windows está disponível em vários formatos de distribuição, detalhados aqui. De modo geral, você deve usar o MySQL Installer. Ele contém mais recursos e produtos MySQL do que o MSI mais antigo, é mais simples de usar do que o arquivo compactado e você não precisa de ferramentas adicionais para fazer o MySQL funcionar. O MySQL Installer instala automaticamente o MySQL Server e produtos MySQL adicionais, cria um arquivo de opções, inicia o Server e permite que você crie contas de usuário padrão. Para mais informações sobre como escolher um pacote, consulte Seção 2.3.2, “Escolhendo um Pacote de Instalação”.

* Uma distribuição MySQL Installer inclui o MySQL Server e produtos MySQL adicionais, incluindo o MySQL Workbench. O MySQL Installer também pode ser usado para atualizar esses produtos no futuro.

  Para instruções sobre como instalar o MySQL usando o MySQL Installer, consulte Seção 2.3.3, “MySQL Installer para Windows”.

* A distribuição binária padrão (empacotada como um arquivo compactado) contém todos os arquivos necessários que você descompacta no local escolhido. Este pacote contém todos os arquivos do pacote completo MSI Installer do Windows, mas não inclui um programa de instalação.

  Para instruções sobre como instalar o MySQL usando o arquivo compactado, consulte Seção 2.3.4, “Instalando o MySQL no Microsoft Windows Usando um Arquivo ZIP `noinstall`”.

* O formato de distribuição de código-fonte contém todo o código e arquivos de suporte para construir os executáveis usando o sistema de compilação Visual Studio.

  Para obter instruções sobre como construir o MySQL a partir do código-fonte no Windows, consulte Seção 2.8, “Instalando o MySQL a partir do Código-Fonte”.

### Considerações sobre o MySQL no Windows

* **Suporte a Tabelas Grandes**

  Se você precisar de tabelas com tamanho superior a 4 GB, instale o MySQL em um File System NTFS ou mais recente. Não se esqueça de usar `MAX_ROWS` e `AVG_ROW_LENGTH` ao criar tabelas. Consulte Seção 13.1.18, “Instrução CREATE TABLE”.

  Note

  Os arquivos de tablespace do InnoDB não podem exceder 4 GB em sistemas Windows de 32 bits.

* **MySQL e Software de Verificação de Vírus**

  Software de verificação de vírus, como o Norton/Symantec Anti-Virus, em diretórios que contêm dados MySQL e Temporary Tables pode causar problemas, tanto em termos de performance do MySQL quanto na identificação incorreta, por parte do software antivírus, do conteúdo dos arquivos como contendo spam. Isso se deve ao mecanismo de impressão digital (fingerprinting) usado pelo software de verificação de vírus e à maneira como o MySQL atualiza rapidamente diferentes arquivos, o que pode ser identificado como um risco potencial de segurança.

  Após instalar o MySQL Server, é recomendável que você desative a verificação de vírus no diretório principal (`datadir`) usado para armazenar os dados de suas tabelas MySQL. Geralmente, há um sistema embutido no software de verificação de vírus que permite ignorar diretórios específicos.

  Além disso, por padrão, o MySQL cria arquivos temporários no diretório temporário padrão do Windows. Para evitar que os arquivos temporários também sejam verificados, configure um diretório temporário separado para os arquivos temporários do MySQL e adicione este diretório à lista de exclusão da verificação de vírus. Para fazer isso, adicione uma opção de configuração para o parâmetro `tmpdir` ao seu arquivo de configuração `my.ini`. Para mais informações, consulte Seção 2.3.4.2, “Criando um Arquivo de Opção”.

* **Executando o MySQL em um Disco Rígido com Setor de 4K**

  A execução do MySQL Server em um disco rígido com setor de 4K no Windows não é suportada com `innodb_flush_method=async_unbuffered`, que é a configuração padrão. A solução alternativa é usar `innodb_flush_method=normal`.