## 2.3 Instalação do MySQL no Microsoft Windows

O MySQL está disponível apenas para sistemas operacionais Microsoft Windows de 64 bits. Para obter informações sobre a plataforma Windows suportada, consulte \[<https://www.mysql.com/support/supportedplatforms/database.html>]

Existem diferentes métodos para instalar o MySQL no Microsoft Windows: o MSI, a distribuição binária padrão (empacotada como um arquivo compactado) contendo todos os arquivos necessários que você desempacotar, e arquivos de origem para compilar o MySQL você mesmo.

::: info Note

O MySQL 8.4 Server requer o Microsoft Visual C++ 2019 Redistributable Package para ser executado em plataformas Windows. Os usuários devem certificar-se de que o pacote foi instalado no sistema antes de instalar o servidor. O pacote está disponível no Microsoft Download Center. Além disso, os binários de depuração do MySQL exigem o Visual Studio 2019.

:::

### Método de instalação recomendado do MSI

O método mais simples e recomendado é baixar o MSI e deixá-lo instalar o MySQL Server, e então usar o MySQL Configurator que ele instala para configurar o MySQL:

1. Descarregue o MSI de <https://dev.mysql.com/downloads/> e execute-o. Isso instala o servidor MySQL, um aplicativo MySQL Configurator associado, e adiciona itens MySQL relacionados ao menu Iniciar do Microsoft Windows sob o grupo `MySQL`.
2. Após a conclusão, o assistente de instalação solicita a execução do MySQL Configurator. Execute-o agora (recomendado) ou mais tarde, ou escolha configurar o MySQL manualmente.

   ::: info Note

   O servidor MySQL não será iniciado até que seja configurado; recomenda-se executar o MySQL Configurator imediatamente após o MSI.

   :::

O MySQL está agora instalado. Se você usou o MySQL Configurator para configurar o MySQL como um serviço do Windows, o Windows inicia automaticamente o servidor MySQL toda vez que você reinicia o sistema. Além disso, o MSI instala o aplicativo MySQL Configurator no host local, que você pode usar mais tarde para reconfigurar o servidor MySQL. Ele e outros itens do menu de inicialização do MySQL foram adicionados pelo MSI.

### Layout de instalação do MySQL no Microsoft Windows

Para o MySQL 8.4 no Windows, o diretório de instalação padrão é `C:\Program Files\MySQL\MySQL Server 8.4` para instalações usando o MSI, embora o tipo de configuração MSI Custom permita usar um local diferente. Se você usar o método de arquivo ZIP para instalar o MySQL, instale-o em outro lugar, como `C:\mysql`. Independentemente disso, o layout dos subdiretórios permanece o mesmo.

Todos os arquivos estão localizados dentro deste diretório pai usando a estrutura mostrada na tabela a seguir.

**Tabela 2.4 Layout de instalação padrão do MySQL para Microsoft Windows**

<table><col style="width: 30%"/><col style="width: 40%"/><col style="width: 30%"/><thead><tr> <th scope="col">Repertório</th> <th scope="col">Conteúdo do diretório</th> <th scope="col">Notas</th> </tr></thead><tbody><tr> <th>[[<code>bin</code>]]</th> <td><span><strong>- Não ,</strong></span>programas de servidor, cliente e utilitários</td> <td></td> </tr><tr> <th>[[<code>%PROGRAMDATA%\MySQL\MySQL Server 8.4\</code>]]</th> <td>Arquivos de registo, bases de dados</td> <td>A variável do sistema Windows [[<code>%PROGRAMDATA%</code>]] é padrão para [[<code>C:\ProgramData</code>]].</td> </tr><tr> <th>[[<code>docs</code>]]</th> <td>Documentação de liberação</td> <td>Com o MSI, use o tipo [[<code>Custom</code>]] para incluir este componente opcional.</td> </tr><tr> <th>[[<code>include</code>]]</th> <td>Incluir arquivos de cabeçalho</td> <td></td> </tr><tr> <th>[[<code>lib</code>]]</th> <td>Bibliotecas</td> <td></td> </tr><tr> <th>[[<code>share</code>]]</th> <td>Arquivos de suporte diversos, incluindo mensagens de erro, arquivos de conjuntos de caracteres, arquivos de configuração de exemplo, SQL para instalação de banco de dados</td> <td></td> </tr></tbody></table>

### Métodos de instalação silenciosa

Use as opções padrão msiexec para uma instalação silenciosa. Este exemplo inclui `/i` para uma instalação normal, `/qn` para não mostrar uma GUI e evitar a interação do usuário, e `/lv` para escrever a saída de instalação verbosas para um novo arquivo de log de destino. Execute a instalação como Administrador a partir da linha de comando, por exemplo:

```
$> msiexec /i "C:\mysql\mysql-8.4.6-winx64.msi" /qn /lv "C:\mysql\install.log"
```

O MSI também suporta `INSTALLDIR` para substituir opcionalmente o caminho do diretório de instalação padrão para um local não padrão. O exemplo a seguir instala o MySQL em `C:\mysql\` em vez de `C:\Program Files\MySQL\MySQL Server 8.4\`:

```
$> msiexec  /i "C:\mysql\mysql-8.4-winx64.msi" /qn /lv "C:\mysql\install.log" INSTALLDIR="C:\mysql"
```

### Informações adicionais sobre a instalação

Por padrão, o MySQL Configurator configura o servidor MySQL como um serviço do Windows. Ao usar um serviço, você pode monitorar e controlar a operação do servidor por meio das ferramentas padrão de gerenciamento de serviços do Windows.

Para acomodar a instrução `RESTART`, o servidor MySQL se bifurca quando executado como um serviço ou autônomo, para habilitar um processo monitor para supervisionar o processo do servidor. Neste caso, existem dois processos `mysqld`. Se a capacidade `RESTART` não for necessária, o servidor pode ser iniciado com a opção `--no-monitor`.

Geralmente, você deve instalar o MySQL no Windows usando uma conta que tenha direitos de administrador. Caso contrário, você pode encontrar problemas com certas operações, como editar a variável de ambiente `PATH` ou acessar o **Service Control Manager**. Quando instalado, o MySQL não precisa ser executado usando um usuário com privilégios de administrador.

Para uma lista de limitações sobre o uso do MySQL na plataforma Windows, consulte a Seção 2.3.6, "Restrições da plataforma Windows".

Além do pacote MySQL Server, você pode precisar ou querer componentes adicionais para usar o MySQL com seu aplicativo ou ambiente de desenvolvimento. Estes incluem, mas não estão limitados a:

- Para se conectar ao servidor MySQL usando ODBC, você deve ter um driver Connector/ODBC. Para mais informações, incluindo instruções de instalação e configuração, consulte o Guia do Desenvolvedor do MySQL Connector/ODBC.
- Para usar o servidor MySQL com aplicativos .NET, você deve ter o driver do Connector/NET. Para mais informações, incluindo instruções de instalação e configuração, consulte o Guia do Desenvolvedor do MySQL Connector/NET.

As distribuições do MySQL para Windows podem ser baixadas em \[<https://dev.mysql.com/downloads/>]<https://dev.mysql.com/downloads/>. Veja a Seção 2.1.3, Como Obter o MySQL.

O MySQL para Windows está disponível em vários formatos de distribuição, detalhados aqui. De um modo geral, você deve usar o MSI para instalar o servidor MySQL e o MySQL Configurator para configurá-lo. O MSI é mais simples de usar do que o arquivo compactado, e você não precisa de ferramentas adicionais para fazer o MySQL funcionar. O MySQL Configurator configura automaticamente o MySQL Server, cria um arquivo de opções, inicia o servidor, permite que você crie contas de usuário padrão e muito mais. Para mais informações sobre a escolha de um pacote, consulte a Seção 2.3.1, Escolha de um Pacote de Instalação.

### Considerações sobre o MySQL no Windows

- \*\* Apoio de mesa grande \*\*

  Se você precisar de tabelas com um tamanho maior do que 4GB, instale o MySQL em um sistema de arquivos NTFS ou mais novo. Não se esqueça de usar `MAX_ROWS` e `AVG_ROW_LENGTH` ao criar tabelas. Veja Seção 15.1.20, CREATE TABLE Statement.
- **Software de verificação de vírus e MySQL**

  O software de varredura de vírus, como o Norton / Symantec Anti-Virus em diretórios contendo dados MySQL e tabelas temporárias, pode causar problemas, tanto em termos de desempenho do MySQL quanto do software de varredura de vírus, identificando erroneamente o conteúdo dos arquivos como contendo spam. Isso se deve ao mecanismo de impressão digital usado pelo software de varredura de vírus e à maneira como o MySQL atualiza rapidamente diferentes arquivos, o que pode ser identificado como um potencial risco de segurança.

  Depois de instalar o MySQL Server, é recomendável que você desative a verificação de vírus no diretório principal (`datadir`) usado para armazenar seus dados de tabela MySQL. Geralmente há um sistema embutido no software de verificação de vírus para permitir que diretórios específicos sejam ignorados.

  Além disso, por padrão, o MySQL cria arquivos temporários no diretório temporário padrão do Windows. Para evitar que os arquivos temporários também sejam digitalizados, configure um diretório temporário separado para arquivos temporários do MySQL e adicione esse diretório à lista de exclusão de varredura de vírus. Para fazer isso, adicione uma opção de configuração para o parâmetro `tmpdir` ao seu arquivo de configuração `my.ini`.
