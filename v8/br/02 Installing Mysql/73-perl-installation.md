### 2.10.1 Instalação do Perl no Unix

O suporte do MySQL Perl requer que você tenha instalado suporte de programação do cliente MySQL (bibliotecas e arquivos de cabeçalho). A maioria dos métodos de instalação instala os arquivos necessários. Se você instalar o MySQL a partir de arquivos RPM no Linux, certifique-se de instalar o RPM do desenvolvedor também. Os programas do cliente estão no RPM do cliente, mas o suporte de programação do cliente está no RPM do desenvolvedor.

Os arquivos necessários para o suporte ao Perl podem ser obtidos no CPAN (Comprehensive Perl Archive Network) em \[<http://search.cpan.org>]

A maneira mais fácil de instalar módulos Perl no Unix é usar o módulo `CPAN`.

```
$> perl -MCPAN -e shell
cpan> install DBI
cpan> install DBD::mysql
```

A instalação `DBD::mysql` executa uma série de testes. Estes testes tentam se conectar ao servidor MySQL local usando o nome de usuário e senha padrão. (O nome de usuário padrão é o seu nome de login no Unix, e `ODBC` no Windows. A senha padrão é sem senha.) Se você não puder se conectar ao servidor com esses valores (por exemplo, se sua conta tiver uma senha), os testes falham. Você pode usar `force install DBD::mysql` para ignorar os testes falhados.

O `DBI` requer o `Data::Dumper` módulo. Ele pode ser instalado; se não, você deve instalá-lo antes de instalar o `DBI`.

Também é possível baixar as distribuições de módulos na forma de arquivos comprimidos e construir os módulos manualmente. Por exemplo, para desembalar e construir uma distribuição DBI, use um procedimento como este:

1. Desembalar a distribuição para o diretório atual:

   ```
   $> gunzip < DBI-VERSION.tar.gz | tar xvf -
   ```

   Este comando cria um diretório chamado `DBI-VERSION`.
2. Alterar a localização no diretório de nível superior da distribuição desembalada:

   ```
   $> cd DBI-VERSION
   ```
3. Construir a distribuição e compilar tudo:

   ```
   $> perl Makefile.PL
   $> make
   $> make test
   $> make install
   ```

O comando `make test` é importante porque verifica se o módulo está funcionando. Note que quando você executa esse comando durante a instalação `DBD::mysql` para exercer o código de interface, o servidor MySQL deve estar em execução ou o teste falha.

É uma boa ideia reconstruir e reinstalar a distribuição `DBD::mysql` sempre que você instalar uma nova versão do MySQL. Isso garante que as versões mais recentes das bibliotecas cliente do MySQL sejam instaladas corretamente.

Se você não tem direitos de acesso para instalar módulos Perl no diretório do sistema ou se você quiser instalar módulos Perl locais, a seguinte referência pode ser útil: \[<http://learn.perl.org/faq/perlfaq8.html#How-do-I-keep-my-own-module-library-directory->]
