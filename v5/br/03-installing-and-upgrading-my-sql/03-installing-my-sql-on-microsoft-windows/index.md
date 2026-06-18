## 2.3 Instalação do MySQL no Microsoft Windows

Importante

O MySQL Community 5.7 Server requer o Pacote de Redistribuição do Microsoft Visual C++ 2019 para funcionar em plataformas Windows. Os usuários devem garantir que o pacote tenha sido instalado no sistema antes de instalar o servidor. O pacote está disponível no Centro de Baixadas da Microsoft.

Essa exigência mudou ao longo do tempo: o MySQL 5.7.37 e versões anteriores exigem o Pacote de Redistribuição do Microsoft Visual C++ 2013, o MySQL 5.7.38 e 5.7.39 exigem ambos, e apenas o Pacote de Redistribuição do Microsoft Visual C++ 2019 é necessário a partir do MySQL 5.7.40.

O MySQL está disponível para o Microsoft Windows, tanto nas versões de 32 bits quanto nas de 64 bits. Para informações sobre a plataforma Windows suportada, consulte <https://www.mysql.com/support/supportedplatforms/database.html>.

Importante

Se o seu sistema operacional for o Windows 2008 R2 ou o Windows 7 e você não tiver o Service Pack 1 (SP1) instalado, o MySQL 5.7 reinicia regularmente com a seguinte mensagem no arquivo de log de erro do servidor MySQL:

```sql
mysqld got exception 0xc000001d
```

Esta mensagem de erro ocorre porque você também está usando uma CPU que não suporta a instrução VPSRLQ, indicando que a instrução da CPU que foi tentada não é suportada.

Para corrigir esse erro, você *deve* instalar o SP1. Isso adiciona o suporte necessário ao sistema operacional para a detecção da capacidade da CPU e desabilita esse suporte quando a CPU não tiver as instruções necessárias.

Alternativamente, instale uma versão mais antiga do MySQL, como 5.6.

Existem diferentes métodos para instalar o MySQL no Microsoft Windows.

### Método de Instalação do MySQL

O método mais simples e recomendado é baixar o Instalador do MySQL (para Windows) e deixá-lo instalar e configurar todos os produtos do MySQL no seu sistema. Veja como fazer:

1. Baixe o instalador do MySQL em <https://dev.mysql.com/downloads/installer/> e execute-o.

  ::: info Nota

  Ao contrário do instalador padrão do MySQL, a versão menor "web-community" não inclui aplicativos do MySQL, mas sim baixa os produtos do MySQL que você escolheu para instalar.

  :::

2. Escolha o tipo de configuração apropriado para o seu sistema. Normalmente, você deve escolher o tipo de configuração padrão do desenvolvedor para instalar o servidor MySQL e outras ferramentas relacionadas ao desenvolvimento do MySQL, ferramentas úteis como o MySQL Workbench. Em vez disso, escolha o tipo de configuração personalizada para selecionar manualmente os produtos MySQL desejados.

  ::: info Nota

  Múltiplas versões do servidor MySQL podem existir em um único sistema. Você pode escolher uma ou várias versões.
  
  :::

3. Complete o processo de instalação seguindo as instruções. Isso instala vários produtos do MySQL e inicia o servidor MySQL.

O MySQL está agora instalado. Se você configurou o MySQL como um serviço, o Windows iniciará automaticamente o servidor MySQL toda vez que você reiniciar o sistema.

Nota

Você provavelmente também instalou outros produtos úteis do MySQL, como o MySQL Workbench, no seu sistema. Considere carregar o Capítulo 29, *MySQL Workbench*, para verificar a conexão do seu novo servidor MySQL. Por padrão, este programa é iniciado automaticamente após a instalação do MySQL.

Esse processo também instala o aplicativo Instalador do MySQL no seu sistema, e, mais tarde, você pode usar o Instalador do MySQL para atualizar ou reconfigurar seus produtos MySQL.

### Informações adicionais sobre a instalação

É possível executar o MySQL como uma aplicação padrão ou como um serviço do Windows. Ao usar um serviço, você pode monitorar e controlar o funcionamento do servidor por meio das ferramentas padrão de gerenciamento de serviços do Windows. Para obter mais informações, consulte a Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

Geralmente, você deve instalar o MySQL no Windows usando uma conta com direitos de administrador. Caso contrário, você pode encontrar problemas com certas operações, como editar a variável de ambiente `PATH` ou acessar o **Gerenciador de Controle de Serviços**. Após a instalação, o MySQL não precisa ser executado usando um usuário com privilégios de administrador.

Para uma lista de limitações sobre o uso do MySQL na plataforma Windows, consulte a Seção 2.3.7, “Restrições da Plataforma Windows”.

Além do pacote do MySQL Server, você pode precisar ou querer componentes adicionais para usar o MySQL com seu aplicativo ou ambiente de desenvolvimento. Estes incluem, mas não estão limitados a:

- Para se conectar ao servidor MySQL usando ODBC, você deve ter um driver Connector/ODBC. Para obter mais informações, incluindo instruções de instalação e configuração, consulte o Guia do Desenvolvedor do MySQL Connector/ODBC.

  ::: info Nota

  O Instalador do MySQL instala e configura o Connector/ODBC para você.

  :::

- Para usar o servidor MySQL com aplicativos .NET, você deve ter o driver Connector/NET. Para obter mais informações, incluindo instruções de instalação e configuração, consulte o Guia do Desenvolvedor MySQL Connector/NET.

  ::: info Nota

  O Instalador do MySQL instala e configura o MySQL Connector/NET para você.

  :::

As distribuições do MySQL para Windows podem ser baixadas em <https://dev.mysql.com/downloads/>. Veja a Seção 2.1.3, “Como obter o MySQL”.

O MySQL para Windows está disponível em vários formatos de distribuição, detalhados aqui. De modo geral, você deve usar o Instalador do MySQL. Ele contém mais recursos e produtos do MySQL do que o MSI mais antigo, é mais simples de usar do que o arquivo compactado e você não precisa de ferramentas adicionais para fazer o MySQL funcionar. O Instalador do MySQL instala automaticamente o MySQL Server e outros produtos do MySQL, cria um arquivo de opções, inicia o servidor e permite que você crie contas de usuário padrão. Para mais informações sobre a escolha de um pacote, consulte a Seção 2.3.2, “Escolhendo um Pacote de Instalação”.

- Uma distribuição do Instalador do MySQL inclui o Servidor MySQL e outros produtos do MySQL, incluindo o MySQL Workbench. O Instalador do MySQL também pode ser usado para atualizar esses produtos no futuro.

  Para obter instruções sobre como instalar o MySQL usando o Instalador do MySQL, consulte a Seção 2.3.3, “Instalador do MySQL para Windows”.

- A distribuição binária padrão (empacotada como um arquivo compactado) contém todos os arquivos necessários que você descompacta na localização escolhida. Este pacote contém todos os arquivos do pacote completo do instalador MSI do Windows, mas não inclui um programa de instalação.

  Para obter instruções sobre como instalar o MySQL usando o arquivo compactado, consulte a Seção 2.3.4, “Instalando o MySQL no Microsoft Windows usando um arquivo ZIP `noinstall`”.

- O formato de distribuição da fonte contém todo o código e os arquivos de suporte para a construção dos executáveis usando o sistema de compilador do Visual Studio.

  Para obter instruções sobre como construir o MySQL a partir do código-fonte no Windows, consulte a Seção 2.8, “Instalando o MySQL a partir do código-fonte”.

### Considerações sobre o MySQL no Windows

- **Suporte para mesa grande**

  Se você precisar de tabelas com um tamanho maior que 4 GB, instale o MySQL em um sistema de arquivos NTFS ou mais recente. Não se esqueça de usar `MAX_ROWS` e `AVG_ROW_LENGTH` ao criar tabelas. Veja a Seção 13.1.18, “Instrução CREATE TABLE”.

  ::: info Nota

  Os arquivos de espaço de tabela InnoDB não podem exceder 4 GB em sistemas de 32 bits do Windows.

  :::

- **MySQL e Software de Verificação de Vírus**

  O software de varredura de vírus, como o Norton/Symantec Anti-Virus, em diretórios que contêm dados do MySQL e tabelas temporárias, pode causar problemas, tanto em termos do desempenho do MySQL quanto da identificação incorreta do conteúdo dos arquivos como spam pelo software de varredura de vírus. Isso ocorre devido ao mecanismo de impressão digital usado pelo software de varredura de vírus e à maneira como o MySQL atualiza rapidamente diferentes arquivos, o que pode ser identificado como um risco potencial de segurança.

  Após instalar o MySQL Server, recomenda-se desativar a varredura de vírus no diretório principal (`datadir`) usado para armazenar os dados da sua tabela MySQL. Geralmente, o software de varredura de vírus inclui um sistema para ignorar diretórios específicos.

  Além disso, por padrão, o MySQL cria arquivos temporários no diretório temporário padrão do Windows. Para evitar que os arquivos temporários também sejam verificados, configure um diretório temporário separado para os arquivos temporários do MySQL e adicione esse diretório à lista de exclusão da verificação de vírus. Para fazer isso, adicione uma opção de configuração para o parâmetro `tmpdir` ao seu arquivo de configuração `my.ini`. Para mais informações, consulte a Seção 2.3.4.2, “Criando um arquivo de opção”.

- **Executando o MySQL em um disco rígido de setor de 4K**

  Executar o servidor MySQL em um disco rígido de setor de 4K no Windows não é suportado com `innodb_flush_method=async_unbuffered`, que é o ajuste padrão. A solução é usar `innodb_flush_method=normal`.
