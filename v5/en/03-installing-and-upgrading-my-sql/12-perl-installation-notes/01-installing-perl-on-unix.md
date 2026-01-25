### 2.12.1 Instalando Perl no Unix

O suporte a Perl do MySQL exige que você tenha instalado o suporte à programação de cliente MySQL (bibliotecas e arquivos de cabeçalho). A maioria dos métodos de instalação instala os arquivos necessários. Se você instalar o MySQL a partir de arquivos RPM no Linux, certifique-se de instalar o developer RPM também. Os programas de cliente estão no client RPM, mas o suporte à programação de cliente está no developer RPM.

Os arquivos de que você precisa para o suporte a Perl podem ser obtidos na CPAN (Comprehensive Perl Archive Network) em <http://search.cpan.org>.

A maneira mais fácil de instalar módulos Perl no Unix é usando o módulo `CPAN`. Por exemplo:

```sql
$> perl -MCPAN -e shell
cpan> install DBI
cpan> install DBD::mysql
```

A instalação do `DBD::mysql` executa vários testes. Esses testes tentam conectar-se ao MySQL server local usando o nome de usuário e a senha padrão. (O nome de usuário padrão é seu login name no Unix, e `ODBC` no Windows. A senha padrão é "no password"). Se você não conseguir conectar-se ao server com esses valores (por exemplo, se sua conta tiver uma password), os testes falharão. Você pode usar `force install DBD::mysql` para ignorar os testes com falha.

`DBI` requer o módulo `Data::Dumper`. Ele pode já estar instalado; caso contrário, você deve instalá-lo antes de instalar o `DBI`.

Também é possível fazer o download das distribuições dos módulos na forma de arquivos **tar** compactados e compilar os módulos manualmente. Por exemplo, para descompactar e compilar uma distribuição DBI, use um procedimento como este:

1. Descompacte a distribuição no diretório atual:

   ```sql
   $> gunzip < DBI-VERSION.tar.gz | tar xvf -
   ```

   Este comando cria um diretório chamado `DBI-VERSION`.

2. Mude para o diretório de nível superior da distribuição descompactada:

   ```sql
   $> cd DBI-VERSION
   ```

3. Compile a distribuição e compile tudo:

   ```sql
   $> perl Makefile.PL
   $> make
   $> make test
   $> make install
   ```

O comando **make test** é importante porque verifica se o módulo está funcionando. Note que, ao executar esse comando durante a instalação do `DBD::mysql` para exercitar o código de interface, o MySQL server deve estar em execução ou o teste falhará.

É uma boa prática reconstruir e reinstalar a distribuição `DBD::mysql` sempre que você instalar uma nova release do MySQL. Isso garante que as versões mais recentes das client libraries do MySQL sejam instaladas corretamente.

Se você não tiver direitos de acesso para instalar módulos Perl no diretório do sistema ou se quiser instalar módulos Perl locais, a seguinte referência pode ser útil: <http://learn.perl.org/faq/perlfaq8.html#How-do-I-keep-my-own-module-library-directory->