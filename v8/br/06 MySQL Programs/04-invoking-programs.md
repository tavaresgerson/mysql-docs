### 6.2.1 Invocação de Programas MySQL

Para invocar um programa MySQL a partir da linha de comando (ou seja, do seu shell ou prompt de comando), digite o nome do programa seguido de quaisquer opções ou outros argumentos necessários para instruir o programa o que você deseja que ele faça. Os comandos a seguir mostram algumas invocações de programa de exemplo. `$>` representa o prompt para o seu interpretador de comando; não faz parte do que você digita. O prompt específico que você vê depende do seu interpretador de comando. Os promptes típicos são `$` para **sh**, **ksh** ou **bash**, `%` para **csh** ou **tcsh**, e `C:\>` para os interpretadores de comandos **command.com** ou **cmd.exe** do Windows.

```
$> mysql --user=root test
$> mysqladmin extended-status variables
$> mysqlshow --help
$> mysqldump -u root personnel
```

Os argumentos que começam com um traço simples ou duplo (`-`, `--`) especificam as opções do programa. As opções tipicamente indicam o tipo de conexão que um programa deve fazer com o servidor ou afetar seu modo operacional. A sintaxe da opção é descrita na Seção 6.2.2, "Especificar Opções do Programa".

Os argumentos sem opção (argumentos sem traço inicial) fornecem informações adicionais ao programa. Por exemplo, o programa `mysql` interpreta o primeiro argumento sem opção como um nome de banco de dados, então o comando `mysql --user=root test` indica que você deseja usar o banco de dados `test`.

Seções posteriores que descrevem programas individuais indicam quais opções um programa suporta e descrevem o significado de quaisquer argumentos não opcionais adicionais.

Algumas opções são comuns a vários programas. As mais frequentemente usadas são as opções `--host` (ou `-h`), `--user` (ou `-u`), e `--password` (ou `-p`) que especificam parâmetros de conexão. Indicam o host onde o servidor MySQL está sendo executado, e o nome do usuário e senha da sua conta MySQL. Todos os programas cliente MySQL entendem essas opções; eles permitem que você especifique qual servidor se conectar e a conta a ser usada nesse servidor. Outras opções de conexão são `--port` (ou \[\[PH\_CODE\_IP\_7]]) para especificar um número de porta TCP e `--socket` (ou `-S`) para especificar um arquivo de soquete no Unix (ou um nome de pixel no Windows). Para mais informações sobre as opções de conexão, consulte a Seção de

Você pode achar necessário invocar programas MySQL usando o nome do caminho para o diretório `bin` no qual eles estão instalados. É provável que esse seja o caso se você receber um erro program not found sempre que você tentar executar um programa MySQL de qualquer diretório que não seja o diretório `bin`. Para torná-lo mais conveniente para usar o MySQL, você pode adicionar o nome do caminho do diretório `bin` à sua configuração de variável de ambiente `PATH`. Isso permite que você execute um programa digitando apenas seu nome, não seu caminho inteiro. Por exemplo, se `mysql` estiver instalado em `/usr/local/mysql/bin`, você pode executar o programa invocando-o como `mysql`, e não é necessário invocá-lo como `mysql`\*\*/r/local/us/bin/mysql\*\*.

Consulte a documentação do seu interpretador de comandos para obter instruções sobre como definir sua variável `PATH`. A sintaxe para definir variáveis de ambiente é específica do interpretador. (Algumas informações são dadas na Seção 6.2.9, "Configuração de Variáveis de Ambiente") Após modificar sua configuração `PATH`, abra uma nova janela de console no Windows ou faça login novamente no Unix para que a configuração entre em vigor.
