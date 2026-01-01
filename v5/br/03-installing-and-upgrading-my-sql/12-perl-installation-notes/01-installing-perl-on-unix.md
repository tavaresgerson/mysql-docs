### 2.12.1 Instalar o Perl no Unix

O suporte ao MySQL Perl exige que você tenha instalado o suporte de programação do cliente MySQL (bibliotecas e arquivos de cabeçalho). A maioria dos métodos de instalação instala os arquivos necessários. Se você instalar o MySQL a partir de arquivos RPM no Linux, certifique-se de instalar o RPM do desenvolvedor também. Os programas do cliente estão no RPM do cliente, mas o suporte de programação do cliente está no RPM do desenvolvedor.

Os arquivos necessários para o suporte ao Perl podem ser obtidos do CPAN (Comprehensive Perl Archive Network) em <http://search.cpan.org>.

A maneira mais fácil de instalar módulos Perl no Unix é usar o módulo `CPAN`. Por exemplo:

```sql
$> perl -MCPAN -e shell
cpan> install DBI
cpan> install DBD::mysql
```

A instalação do `DBD::mysql` executa vários testes. Esses testes tentam se conectar ao servidor MySQL local usando o nome de usuário e a senha padrão. (O nome de usuário padrão é o seu nome de login no Unix e `ODBC` no Windows. A senha padrão é “sem senha”. Se você não conseguir se conectar ao servidor com esses valores (por exemplo, se sua conta tiver uma senha), os testes falharão. Você pode usar `force install DBD::mysql` para ignorar os testes que falharam.

O `DBI` requer o módulo `Data::Dumper`. Ele pode estar instalado; se não estiver, você deve instalá-lo antes de instalar o `DBI`.

Também é possível baixar as distribuições do módulo na forma de arquivos **tar** comprimidos e construir os módulos manualmente. Por exemplo, para descompactuar e construir uma distribuição do DBI, use um procedimento como este:

1. Descompacte a distribuição no diretório atual:

   ```sql
   $> gunzip < DBI-VERSION.tar.gz | tar xvf -
   ```

   Este comando cria um diretório chamado `DBI-VERSION`.

2. Altere a localização para o diretório de nível superior da distribuição desempacotada:

   ```sql
   $> cd DBI-VERSION
   ```

3. Construa a distribuição e compile tudo:

   ```sql
   $> perl Makefile.PL
   $> make
   $> make test
   $> make install
   ```

O comando **make test** é importante porque verifica se o módulo está funcionando. Observe que, quando você executa esse comando durante a instalação do `DBD::mysql` para testar o código da interface, o servidor MySQL deve estar em execução ou o teste falhará.

É uma boa ideia reconstruir e reinstalar a distribuição `DBD::mysql` sempre que você instalar uma nova versão do MySQL. Isso garante que as versões mais recentes das bibliotecas do cliente MySQL sejam instaladas corretamente.

Se você não tiver permissão para instalar módulos Perl no diretório do sistema ou se quiser instalar módulos Perl locais, a seguinte referência pode ser útil: <http://learn.perl.org/faq/perlfaq8.html#How-do-I-keep-my-own-module-library-directory>
