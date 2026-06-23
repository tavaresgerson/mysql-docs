## 2.10 Notas de instalação do Perl

O módulo `DBI` Perl fornece uma interface genérica para acesso ao banco de dados. Você pode escrever um script `DBI` que funciona com muitos motores de banco de dados diferentes sem alterações. Para usar o `DBI`, você deve instalar o módulo `DBI`, bem como um módulo de Driver de Base de Dados (DBD) para cada tipo de servidor de banco de dados que você deseja acessar. Para MySQL, este driver é o módulo `DBD::mysql`.

Nota

O suporte ao Perl não está incluído nas distribuições do MySQL. Você pode obter os módulos necessários em <http://search.cpan.org> para Unix ou usando o programa **ppm** da ActiveState no Windows. As seções a seguir descrevem como fazer isso.

A interface `DBI`/`DBD` requer o Perl 5.6.0, e o 5.6.1 ou posterior é preferido. O DBI *não funciona* se você tiver uma versão mais antiga do Perl. Você deve usar `DBD::mysql` 4.009 ou superior. Embora versões anteriores estejam disponíveis, elas não suportam a funcionalidade completa do MySQL 8.0.

### 2.10.1 Instalar Perl em Unix

O suporte ao MySQL Perl exige que você tenha instalado o suporte de programação do cliente MySQL (bibliotecas e arquivos de cabeçalho). A maioria dos métodos de instalação instala os arquivos necessários. Se você instalar o MySQL a partir de arquivos RPM no Linux, certifique-se de instalar o RPM do desenvolvedor também. Os programas do cliente estão no RPM do cliente, mas o suporte de programação do cliente está no RPM do desenvolvedor.

Os arquivos que você precisa para suporte a Perl podem ser obtidos do CPAN (Comprehensive Perl Archive Network) em <http://search.cpan.org>.

A maneira mais fácil de instalar módulos Perl em Unix é usar o módulo `CPAN`. Por exemplo:

```
$> perl -MCPAN -e shell
cpan> install DBI
cpan> install DBD::mysql
```

A instalação do `DBD::mysql` executa uma série de testes. Esses testes tentam se conectar ao servidor MySQL local usando o nome de usuário e a senha padrão. (O nome de usuário padrão é o seu nome de login no Unix, e `ODBC` no Windows. A senha padrão é “sem senha”. Se você não conseguir se conectar ao servidor com esses valores (por exemplo, se sua conta tiver uma senha), os testes falham. Você pode usar o `force install DBD::mysql` para ignorar os testes que falharam.

`DBI` requer o módulo `Data::Dumper`. Ele pode ser instalado; se não for, você deve instalá-lo antes de instalar `DBI`.

Também é possível baixar as distribuições do módulo na forma de arquivos **tar** comprimidos e construir os módulos manualmente. Por exemplo, para descompactar e construir uma distribuição DBI, use um procedimento como este:

1. Descompacte a distribuição no diretório atual:

   ```
   $> gunzip < DBI-VERSION.tar.gz | tar xvf -
   ```

Este comando cria um diretório chamado `DBI-VERSION`.

2. Altere a localização para o diretório de nível superior da distribuição desempaquetada:

   ```
   $> cd DBI-VERSION
   ```

3. Construa a distribuição e compile tudo:

   ```
   $> perl Makefile.PL
   $> make
   $> make test
   $> make install
   ```

O comando **make test** é importante porque verifica se o módulo está funcionando. Observe que, quando você executa esse comando durante a instalação do `DBD::mysql` para exercitar o código de interface, o servidor MySQL deve estar em execução ou o teste falhará.

É uma boa ideia reconstruir e reinstalar a distribuição `DBD::mysql` sempre que você instalar uma nova versão do MySQL. Isso garante que as versões mais recentes das bibliotecas do cliente MySQL sejam instaladas corretamente.

Se você não tiver direitos de acesso para instalar módulos Perl no diretório do sistema ou se quiser instalar módulos Perl locais, a referência a seguir pode ser útil: <http://learn.perl.org/faq/perlfaq8.html#How-do-I-keep-my-own-module-library-directory->

### 2.10.2 Instalar o ActiveState Perl no Windows

Em Windows, você deve fazer o seguinte para instalar o módulo MySQL `DBD` com o ActiveState Perl:

1. Obtenha o ActiveState Perl de <http://www.activestate.com/Products/ActivePerl/> e instale-o.

2. Abra uma janela de console. 3. Se necessário, defina a variável `HTTP_proxy`. Por exemplo, você pode tentar uma configuração como esta:

   ```
   C:\> set HTTP_proxy=my.proxy.com:3128
   ```

4. Inicie o programa PPM:

   ```
   C:\> C:\perl\bin\ppm.pl
   ```

5. Se você não o fez anteriormente, instale `DBI`:

   ```
   ppm> install DBI
   ```

6. Se isso for bem-sucedido, execute o seguinte comando:

   ```
   ppm> install DBD-mysql
   ```

Este procedimento deve funcionar com o ActiveState Perl 5.6 ou superior.

Se você não conseguir fazer o procedimento funcionar, você deve instalar o driver ODBC e conectar-se ao servidor MySQL através do ODBC:

```
use DBI;
$dbh= DBI->connect("DBI:ODBC:$dsn",$user,$password) ||
  die "Got error $DBI::errstr when connecting to $dsn\n";
```

### 2.10.3 Problemas ao usar a interface Perl DBI/DBD

Se o Perl informar que não consegue encontrar o módulo `../mysql/mysql.so`, o problema provavelmente é que o Perl não consegue localizar a biblioteca compartilhada `libmysqlclient.so`. Você deve ser capaz de corrigir esse problema por um dos seguintes métodos:

* Copie `libmysqlclient.so` para o diretório onde estão localizadas suas outras bibliotecas compartilhadas (provavelmente `/usr/lib` ou `/lib`).

* Modifique as opções do `-L` usadas para compilar o `DBD::mysql` para refletir a localização real do `libmysqlclient.so`.

* Em Linux, você pode adicionar o nome do caminho do diretório onde o `libmysqlclient.so` está localizado ao arquivo `/etc/ld.so.conf`.

* Adicione o nome do caminho do diretório onde o `libmysqlclient.so` está localizado à variável de ambiente `LD_RUN_PATH`. Alguns sistemas usam `LD_LIBRARY_PATH` em vez disso.

Observe que você também pode precisar modificar as opções do `-L` se houver outras bibliotecas que o link não conseguir encontrar. Por exemplo, se o link não conseguir encontrar `libc` porque está em `/lib` e o comando de vinculação especifica `-L/usr/lib`, mude a opção do `-L` para `-L/lib` ou adicione `-L/lib` ao comando de vinculação existente.

Se você receber os seguintes erros do `DBD::mysql`, provavelmente está usando o **gcc** (ou usando um binário antigo compilado com o **gcc**):

```
/usr/bin/perl: can't resolve symbol '__moddi3'
/usr/bin/perl: can't resolve symbol '__divdi3'
```

Adicione `-L/usr/lib/gcc-lib/... -lgcc` ao comando de link quando a biblioteca `mysql.so` for compilada (verifique a saída do **make** para `mysql.so` ao compilar o cliente Perl). A opção `-L` deve especificar o nome do caminho do diretório onde `libgcc.a` está localizado no seu sistema.

Outra causa desse problema pode ser que Perl e MySQL não estejam compilados com **gcc**. Nesse caso, você pode resolver a incompatibilidade compilando ambos com **gcc**.