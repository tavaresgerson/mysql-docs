### 6.2.1 Invocação de Programas MySQL

Para invocar um programa MySQL a partir da linha de comando (ou seja, do seu shell ou prompt de comando), insira o nome do programa seguido de quaisquer opções ou outros argumentos necessários para instruir o programa o que você deseja que ele faça. Os seguintes comandos mostram algumas invocações de programas de exemplo. `$>` representa o prompt do seu interpretador de comandos; ele não faz parte do que você digita. O prompt específico que você vê depende do seu interpretador de comandos. Prompts típicos são `$` para **sh**, **ksh** ou **bash**, `%` para **csh** ou **tcsh**, e `C:\>` para os interpretadores de comandos **command.com** ou **cmd.exe** do Windows.

```
$> mysql --user=root test
$> mysqladmin extended-status variables
$> mysqlshow --help
$> mysqldump -u root personnel
```

Argumentos que começam com uma ou duas barras (`-`, `--`) especificam opções de programa. As opções geralmente indicam o tipo de conexão que um programa deve fazer com o servidor ou afetam seu modo operacional. A sintaxe das opções é descrita na Seção 6.2.2, “Especificação de Opções de Programa”.

Argumentos não opcionais (argumentos sem barra inicial) fornecem informações adicionais ao programa. Por exemplo, o programa **mysql** interpreta o primeiro argumento não opcional como um nome de banco de dados, então o comando `mysql --user=root test` indica que você deseja usar o banco de dados `test`.

Seções posteriores que descrevem programas individuais indicam quais opções um programa suporta e descrevem o significado de quaisquer argumentos não opcionais adicionais.

Algumas opções são comuns a vários programas. As mais utilizadas são as opções `--host` (ou `-h`), `--user` (ou `-u`) e `--password` (ou `-p`), que especificam os parâmetros de conexão. Elas indicam o host onde o servidor MySQL está em execução e o nome de usuário e a senha da sua conta MySQL. Todos os programas clientes MySQL entendem essas opções; elas permitem que você especifique qual servidor conectar e qual conta usar nesse servidor. Outras opções de conexão são `--port` (ou `-P`) para especificar um número de porta TCP/IP e `--socket` (ou `-S`) para especificar um arquivo de soquete Unix em Unix (ou nome de canal nomeado em Windows). Para obter mais informações sobre opções que especificam opções de conexão, consulte a Seção 6.2.4, “Conectando ao Servidor MySQL Usando Opções de Comando”.

Você pode achar necessário invocar programas MySQL usando o nome do caminho para o diretório `bin` em que eles estão instalados. Isso provavelmente será o caso se você receber um erro de “programa não encontrado” sempre que tentar executar um programa MySQL de qualquer diretório que não seja o diretório `bin`. Para tornar mais conveniente usar o MySQL, você pode adicionar o nome do caminho do diretório `bin` à sua configuração da variável de ambiente `PATH`. Isso permite que você execute um programa digitando apenas seu nome, não todo o nome do caminho. Por exemplo, se o **mysql** estiver instalado em `/usr/local/mysql/bin`, você pode executar o programa invocando-o como **mysql**, e não é necessário invocá-lo como **/usr/local/mysql/bin/mysql**.

Consulte a documentação do seu interpretador de comandos para obter instruções sobre como definir a variável `PATH`. A sintaxe para definir variáveis de ambiente é específica do interpretador. (Algumas informações estão fornecidas na Seção 6.2.9, “Definindo Variáveis de Ambiente”.) Após modificar a configuração do `PATH`, abra uma nova janela do console no Windows ou faça login novamente no Unix para que a configuração entre em vigor.