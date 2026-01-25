### 4.2.1 Invocando Programas MySQL

Para invocar um programa MySQL a partir da linha de comando (ou seja, a partir do seu shell ou prompt de comando), digite o nome do programa seguido por quaisquer options ou outros arguments necessários para instruir o programa sobre o que você deseja que ele faça. Os comandos a seguir mostram algumas invocações de programas de exemplo. `$>` representa o prompt para o seu interpretador de comandos; ele não faz parte do que você digita. O prompt específico que você vê depende do seu interpretador de comandos. Prompts típicos são `$` para **sh**, **ksh** ou **bash**, `%` para **csh** ou **tcsh**, e `C:\>` para os interpretadores de comandos do Windows **command.com** ou **cmd.exe**.

```sql
$> mysql --user=root test
$> mysqladmin extended-status variables
$> mysqlshow --help
$> mysqldump -u root personnel
```

Arguments que começam com um traço simples ou duplo (`-`, `--`) especificam program options. Options tipicamente indicam o tipo de connection que um programa deve fazer ao server ou afetam seu modo operacional. A sintaxe de Option é descrita na Seção 4.2.2, “Especificando Program Options”.

Nonoption arguments (arguments sem traço inicial) fornecem informações adicionais ao programa. Por exemplo, o programa **mysql** interpreta o primeiro nonoption argument como um nome de Database, então o comando `mysql --user=root test` indica que você deseja usar o Database `test`.

Seções posteriores que descrevem programas individuais indicam quais options um programa suporta e descrevem o significado de quaisquer nonoption arguments adicionais.

Algumas options são comuns a vários programas. As mais frequentemente usadas são as options `--host` (ou `-h`), `--user` (ou `-u`) e `--password` (ou `-p`), que especificam os parâmetros de connection. Elas indicam o host onde o MySQL server está sendo executado, e o nome de usuário e a password da sua conta MySQL. Todos os programas client MySQL entendem essas options; elas permitem que você especifique a qual server se conectar e a conta a ser usada nesse server. Outras connection options são `--port` (ou `-P`) para especificar um número de porta TCP/IP e `--socket` (ou `-S`) para especificar um arquivo socket Unix no Unix (ou nome de named-pipe no Windows). Para mais informações sobre options que especificam connection options, consulte a Seção 4.2.4, “Conectando ao MySQL Server Usando Command Options”.

Você pode achar necessário invocar programas MySQL usando o path name para o diretório `bin` no qual eles estão instalados. É provável que este seja o caso se você receber um erro de “program not found” sempre que tentar executar um programa MySQL a partir de qualquer diretório que não seja o diretório `bin`. Para tornar o uso do MySQL mais conveniente, você pode adicionar o path name do diretório `bin` à sua configuração da variável de ambiente `PATH`. Isso permite que você execute um programa digitando apenas seu nome, e não seu path name completo. Por exemplo, se o **mysql** estiver instalado em `/usr/local/mysql/bin`, você pode executar o programa invocando-o como **mysql**, e não é necessário invocá-lo como **/usr/local/mysql/bin/mysql**.

Consulte a documentação do seu interpretador de comandos para obter instruções sobre como definir sua variável `PATH`. A sintaxe para definir environment variables é específica do interpretador. (Algumas informações são fornecidas na Seção 4.2.7, “Definindo Environment Variables”.) Após modificar sua configuração `PATH`, abra uma nova janela de console no Windows ou faça log in novamente no Unix para que a configuração entre em vigor.