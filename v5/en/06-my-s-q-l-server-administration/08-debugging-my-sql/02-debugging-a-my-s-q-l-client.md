### 5.8.2 Debugging de um MySQL Client

Para ser capaz de realizar o Debugging de um MySQL Client com o pacote de debug integrado, você deve configurar o MySQL com [`-DWITH_DEBUG=1`](source-configuration-options.html#option_cmake_with_debug). Consulte a [Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”](source-configuration-options.html "2.8.7 Opções de Configuração de Fonte do MySQL").

Antes de executar um Client, você deve definir a variável de ambiente `MYSQL_DEBUG`:

```sql
$> MYSQL_DEBUG=d:t:O,/tmp/client.trace
$> export MYSQL_DEBUG
```

Isso faz com que os Clients gerem um arquivo trace em `/tmp/client.trace`.

Se você tiver problemas com seu próprio código Client, você deve tentar conectar-se ao Server e executar sua Query usando um Client que se sabe que funciona. Faça isso executando o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") no modo debugging (assumindo que você tenha compilado o MySQL com o debugging ativado):

```sql
$> mysql --debug=d:t:O,/tmp/client.trace
```

Isso fornece informações úteis caso você envie um bug report por email. Consulte a [Seção 1.5, “Como Relatar Bugs ou Problemas”](bug-reports.html "1.5 Como Relatar Bugs ou Problemas").

Se o seu Client travar em algum código que pareça 'legal' (legítimo), você deve verificar se o seu arquivo include `mysql.h` corresponde ao seu arquivo de library MySQL. Um erro muito comum é usar um arquivo `mysql.h` antigo de uma instalação MySQL antiga com uma library MySQL nova.