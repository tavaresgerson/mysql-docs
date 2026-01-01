### 2.12.2 Instalação do ActiveState Perl no Windows

No Windows, você deve fazer o seguinte para instalar o módulo `DBD` do MySQL com o ActiveState Perl:

1. Obtenha o ActiveState Perl em <http://www.activestate.com/Products/ActivePerl/> e instale-o.

2. Abra uma janela do console.

3. Se necessário, defina a variável `HTTP_proxy`. Por exemplo, você pode tentar uma configuração como esta:

   ```sql
   C:\> set HTTP_proxy=my.proxy.com:3128
   ```

4. Comece o programa PPM:

   ```sql
   C:\> C:\perl\bin\ppm.pl
   ```

5. Se você ainda não o fez, instale o `DBI`:

   ```sql
   ppm> install DBI
   ```

6. Se isso for bem-sucedido, execute o seguinte comando:

   ```sql
   ppm> install DBD-mysql
   ```

Este procedimento deve funcionar com o ActiveState Perl 5.6 ou superior.

Se você não conseguir fazer o procedimento funcionar, você deve instalar o driver ODBC e se conectar ao servidor MySQL por meio do ODBC:

```sql
use DBI;
$dbh= DBI->connect("DBI:ODBC:$dsn",$user,$password) ||
  die "Got error $DBI::errstr when connecting to $dsn\n";
```
