### 2.10.2 Instalação do ActiveState Perl no Windows

No Windows, você deve fazer o seguinte para instalar o módulo MySQL `DBD` com ActiveState Perl:

1. Obtenha o ActiveState Perl em <http://www.activestate.com/Products/ActivePerl/> e instale-o.
2. Abre uma janela do console.
3. Se necessário, defina a variável `HTTP_proxy` . Por exemplo, você pode tentar uma configuração como esta:

   ```
   C:\> set HTTP_proxy=my.proxy.com:3128
   ```
4. Iniciar o programa PPM:

   ```
   C:\> C:\perl\bin\ppm.pl
   ```
5. Se você não o fez anteriormente, instale `DBI`:

   ```
   ppm> install DBI
   ```
6. Se isso for bem sucedido, execute o seguinte comando:

   ```
   ppm> install DBD-mysql
   ```

Este procedimento deve funcionar com `ActiveState Perl 5.6` ou superior.

Se você não conseguir que o procedimento funcione, você deve instalar o driver ODBC em vez disso e se conectar ao servidor MySQL através de ODBC:

```
use DBI;
$dbh= DBI->connect("DBI:ODBC:$dsn",$user,$password) ||
  die "Got error $DBI::errstr when connecting to $dsn\n";
```
