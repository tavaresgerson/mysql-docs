## 2.3 Instalando o MySQL no Microsoft Windows

O MySQL está disponível apenas para sistemas operacionais Microsoft Windows de 64 bits. Para informações sobre a plataforma Windows suportada, consulte <https://www.mysql.com/support/supportedplatforms/database.html>.

Existem diferentes métodos para instalar o MySQL no Microsoft Windows: o MSI, a distribuição binária padrão (empacotada como um arquivo compactado) que contém todos os arquivos necessários que você descompacta, e os arquivos de código-fonte para compilar o MySQL você mesmo. Para informações relacionadas, consulte a Seção 2.3.1, “Escolhendo um Pacote de Instalação”.

::: info Nota

O MySQL 8.4 Server requer o Pacote de Redistribuição Microsoft Visual C++ 2019 para funcionar em plataformas Windows. Os usuários devem garantir que o pacote tenha sido instalado no sistema antes de instalar o servidor. O pacote está disponível no Microsoft Download Center. Além disso, os binários de depuração do MySQL requerem o Visual Studio 2019.

:::

### Método de Instalação MSI Recomendado

O método mais simples e recomendado é baixar o MSI e deixá-lo instalar o MySQL Server, e depois usar o MySQL Configurator que ele instala para configurar o MySQL:

1. Baixe o MSI de <https://dev.mysql.com/downloads/> e execute-o. Isso instala o servidor MySQL, um aplicativo associado MySQL Configurator e adiciona itens relacionados do MySQL ao menu Iniciar do Microsoft Windows sob o grupo `MySQL`.
2. Após a conclusão, o assistente de instalação solicitará que você execute o MySQL Configurator. Execute-o agora (recomendado) ou mais tarde, ou escolha configurar manualmente o MySQL.

   ::: info Nota

   O servidor MySQL não será iniciado até que seja configurado; é recomendável executar o MySQL Configurator incluído imediatamente após o MSI.

   :::

O MySQL está agora instalado. Se você usou o Configurável MySQL para configurar o MySQL como um serviço do Windows, o Windows iniciará automaticamente o servidor MySQL toda vez que você reiniciar o sistema. Além disso, o MSI instala o aplicativo Configurável MySQL no host local, que você pode usar mais tarde para reconfigurar o servidor MySQL. Ele e outros itens do menu de inicialização do MySQL foram adicionados pelo MSI.

### Layout da Instalação do MySQL no Microsoft Windows

Para o MySQL 8.4 no Windows, o diretório de instalação padrão é `C:\Program Files\MySQL\MySQL Server 8.4` para instalações usando o MSI, embora o tipo de configuração personalizada do MSI permita usar um local diferente. Se você usar o método de instalação de arquivo ZIP para instalar o MySQL, instale-o em outro local, como `C:\mysql`. Independentemente disso, o layout dos subdiretórios permanece o mesmo.

Todos os arquivos estão localizados dentro deste diretório pai usando a estrutura mostrada na tabela a seguir.

**Tabela 2.4 Layout de Instalação Padrão do MySQL para Microsoft Windows**

<table><thead><tr> <th>Diretório</th> <th>Conteúdo do Diretório</th> <th>Notas</th> </tr></thead><tbody><tr> <th><code>bin</code></th> <td>Programas do servidor, cliente e utilitários mysqld</td> <td></td> </tr><tr> <th><code>%PROGRAMDATA%\MySQL\MySQL Server 8.4\</code></th> <td>Arquivos de log, bancos de dados</td> <td>A variável do sistema do Windows <code>%PROGRAMDATA%</code> tem como padrão <code>C:\ProgramData</code>.</td> </tr><tr> <th><code>docs</code></th> <td>Documentação de lançamento</td> <td>Com o MSI, use o tipo <code>Custom</code> para incluir este componente opcional.</td> </tr><tr> <th><code>include</code></th> <td>Arquivos de inclusão (cabeçalho)</td> <td></td> </tr><tr> <th><code>lib</code></th> <td>Bibliotecas</td> <td></td> </tr><tr> <th><code>share</code></th> <td>Arquivos de suporte diversos, incluindo mensagens de erro, arquivos de conjunto de caracteres, arquivos de configuração de amostra, SQL para instalação de banco de dados</td> <td></td> </tr></tbody></table>

### Métodos de Instalação Silenciosa
English:
### Silent Installation Methods
Portuguese (Brazil):
### Métodos de Instalação Silenciosa

Use as opções padrão do msiexec para uma instalação silenciosa. Este exemplo inclui `/i` para uma instalação normal, `/qn` para não exibir uma GUI e evitar a interação do usuário, e `/lv` para gravar a saída da instalação detalhada em um novo arquivo de log. Execute a instalação como Administrador a partir da linha de comando, por exemplo:

```
$> msiexec /i "C:\mysql\mysql-8.4.6-winx64.msi" /qn /lv "C:\mysql\install.log"
```

O MSI também suporta `INSTALLDIR` para substituir opcionalmente o caminho do diretório de instalação padrão por um local não padrão. O exemplo seguinte instala o MySQL em `C:\mysql\` em vez de `C:\Program Files\MySQL\MySQL Server 8.4`:

```
$> msiexec  /i "C:\mysql\mysql-8.4-winx64.msi" /qn /lv "C:\mysql\install.log" INSTALLDIR="C:\mysql"
```

### Informações Adicionais sobre a Instalação

Por padrão, o MySQL Configurator configura o servidor MySQL como um serviço do Windows. Ao usar um serviço, você pode monitorar e controlar o funcionamento do servidor através das ferramentas padrão de gerenciamento de serviços do Windows. Para informações relacionadas sobre a configuração manual do serviço do Windows, consulte a Seção 2.3.3.8, “Iniciar o MySQL como um Serviço do Windows”.

Para acomodar a declaração `RESTART`, o servidor MySQL se divide quando executado como serviço ou de forma independente, para permitir que um processo de monitoramento supervisione o processo do servidor. Neste caso, há dois processos `mysqld`. Se a capacidade `RESTART` não for necessária, o servidor pode ser iniciado com a opção `--no-monitor`. Consulte a Seção 15.7.8.8, “Declaração RESTART”.

Geralmente, você deve instalar o MySQL no Windows usando uma conta que tenha direitos de administrador. Caso contrário, você pode encontrar problemas com certas operações, como editar a variável de ambiente `PATH` ou acessar o **Service Control Manager**. Quando instalado, o MySQL não precisa ser executado usando um usuário com privilégios de administrador.

Para uma lista de limitações sobre o uso do MySQL na plataforma Windows, consulte a Seção 2.3.6, “Restrições da Plataforma Windows”.

Além do pacote do MySQL Server, você pode precisar ou querer componentes adicionais para usar o MySQL com seu aplicativo ou ambiente de desenvolvimento. Estes incluem, mas não estão limitados a:

* Para se conectar ao servidor MySQL usando ODBC, você deve ter um driver Connector/ODBC. Para obter mais informações, incluindo instruções de instalação e configuração, consulte o Guia de Desenvolvimento MySQL Connector/ODBC.
* Para usar o servidor MySQL com aplicativos .NET, você deve ter o driver Connector/NET. Para obter mais informações, incluindo instruções de instalação e configuração, consulte o Guia de Desenvolvimento MySQL Connector/NET.
As distribuições do MySQL para Windows podem ser baixadas em <https://dev.mysql.com/downloads/>. Consulte a Seção 2.1.3, “Como obter o MySQL”.
O MySQL para Windows está disponível em vários formatos de distribuição, detalhados aqui. De maneira geral, você deve usar o MSI para instalar o servidor MySQL e o MySQL Configurator para configurá-lo. O MSI é mais simples de usar do que o arquivo compactado, e você não precisa de ferramentas adicionais para fazer o MySQL funcionar. O MySQL Configurator configura automaticamente o MySQL Server, cria um arquivo de opções, inicia o servidor, permite que você crie contas de usuário padrão e muito mais. Para obter mais informações sobre a escolha de um pacote, consulte a Seção 2.3.1, “Escolhendo um Pacote de Instalação”.
### Considerações sobre o MySQL no Windows

* **Suporte a Tabelas Grandes**

  Se você precisar de tabelas com um tamanho maior que 4GB, instale o MySQL em um sistema de arquivos NTFS ou mais recente. Não se esqueça de usar `MAX_ROWS` e `AVG_ROW_LENGTH` ao criar tabelas.
* **MySQL e Software de Verificação de Vírus**

  Software de verificação de vírus, como o Norton/Symantec Anti-Virus, em diretórios que contêm dados do MySQL e tabelas temporárias, pode causar problemas, tanto em termos do desempenho do MySQL quanto da identificação incorreta do conteúdo dos arquivos pelo software de verificação de vírus. Isso ocorre devido ao mecanismo de impressão digital usado pelo software de verificação de vírus e à maneira como o MySQL atualiza rapidamente diferentes arquivos, que podem ser identificados como um risco potencial de segurança.

Após instalar o MySQL Server, recomenda-se desativar a varredura de vírus no diretório principal (`datadir`) usado para armazenar os dados das tabelas do MySQL. Geralmente, o software de varredura de vírus inclui um sistema para ignorar diretórios específicos.

Além disso, por padrão, o MySQL cria arquivos temporários no diretório temporário padrão do Windows. Para evitar que os arquivos temporários também sejam verificados, configure um diretório temporário separado para os arquivos temporários do MySQL e adicione esse diretório à lista de exclusão da varredura de vírus. Para fazer isso, adicione uma opção de configuração para o parâmetro `tmpdir` ao seu arquivo de configuração `my.ini`. Para mais informações, consulte a Seção 2.3.3.2, “Criando um arquivo de opção”.