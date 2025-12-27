### 2.10.2 Instalando o ActiveState Perl no Windows

No Windows, você deve fazer o seguinte para instalar o módulo `DBD` do MySQL com o ActiveState Perl:

1. Obtenha o ActiveState Perl em <http://www.activestate.com/Products/ActivePerl/> e instale-o.
2. Abra uma janela de console.
3. Se necessário, defina a variável `HTTP_proxy`. Por exemplo, você pode tentar uma configuração como esta:

   ```
   C:\> set HTTP_proxy=my.proxy.com:3128
   ```
4. Inicie o programa PPM:

   ```
   C:\> C:\perl\bin\ppm.pl
   ```
5. Se você não tiver feito isso anteriormente, instale o `DBI`:

   ```
   ppm> install DBI
   ```
6. Se isso funcionar, execute o seguinte comando:

   ```
   ppm> install DBD-mysql
   ```

Este procedimento deve funcionar com o `ActiveState Perl 5.6` ou superior.

Se você não conseguir fazer o procedimento funcionar, você deve instalar o driver ODBC e se conectar ao servidor MySQL através do ODBC:

```
use DBI;
$dbh= DBI->connect("DBI:ODBC:$dsn",$user,$password) ||
  die "Got error $DBI::errstr when connecting to $dsn\n";
```