### 14.21.4 Considerações de Segurança para o Plugin `memcached` do InnoDB

Cuidado

Consulte esta seção antes de implantar o plugin `daemon_memcached` em um servidor de produção, ou mesmo em um servidor de teste se a instância MySQL contiver dados confidenciais.

Visto que o **memcached** não utiliza um mecanismo de autenticação por padrão, e a autenticação SASL opcional não é tão robusta quanto as medidas de segurança tradicionais de DBMS, mantenha apenas dados não confidenciais na instância MySQL que utiliza o plugin `daemon_memcached`, e isole (wall off) de intrusos em potencial quaisquer servidores que usem essa configuração. Não permita acesso **memcached** a esses servidores a partir da Internet; permita o acesso apenas de dentro de uma intranet com firewall, idealmente a partir de uma subnet cuja participação você possa restringir.

#### Protegendo o `memcached` com Senha Usando SASL

O suporte a SASL fornece a capacidade de proteger seu Database MySQL contra acesso não autenticado através de clientes **memcached**. Esta seção explica como habilitar o SASL com o plugin `daemon_memcached`. Os passos são quase idênticos aos realizados para habilitar o SASL para um servidor **memcached** tradicional.

SASL significa "Simple Authentication and Security Layer" (Camada Simples de Autenticação e Segurança), um padrão para adicionar suporte de autenticação a protocolos baseados em conexão. O **memcached** adicionou suporte a SASL na versão 1.4.3.

A autenticação SASL é suportada apenas com o protocolo binário.

Clientes **memcached** são capazes de acessar apenas as tabelas `InnoDB` que estão registradas na tabela `innodb_memcache.containers`. Mesmo que um DBA possa colocar restrições de acesso a tais tabelas, o acesso através de aplicações **memcached** não pode ser controlado. Por esta razão, o suporte a SASL é fornecido para controlar o acesso às tabelas `InnoDB` associadas ao plugin `daemon_memcached`.

A seção a seguir mostra como construir, habilitar e testar um plugin `daemon_memcached` com SASL habilitado.

#### Construindo e Habilitando SASL com o Plugin `memcached` do InnoDB

Por padrão, um plugin `daemon_memcached` com SASL habilitado não está incluído nos pacotes de lançamento do MySQL, visto que um plugin `daemon_memcached` com SASL habilitado requer a construção do **memcached** com bibliotecas SASL. Para habilitar o suporte a SASL, baixe o código-fonte do MySQL e reconstrua o plugin `daemon_memcached` após baixar as bibliotecas SASL:

1. Instale as bibliotecas de desenvolvimento e utilitários SASL. Por exemplo, no Ubuntu, use **apt-get** para obter as bibliotecas:

   ```sql
   sudo apt-get -f install libsasl2-2 sasl2-bin libsasl2-2 libsasl2-dev libsasl2-modules
   ```

2. Construa as bibliotecas compartilhadas do plugin `daemon_memcached` com capacidade SASL adicionando `ENABLE_MEMCACHED_SASL=1` às suas opções **cmake**. O **memcached** também fornece *suporte simples a senha em texto não criptografado (cleartext password support)*, o que facilita o teste. Para habilitar o suporte simples a senha em texto não criptografado, especifique a opção **cmake** `ENABLE_MEMCACHED_SASL_PWDB=1`.

   Em resumo, adicione as três seguintes opções **cmake**:

   ```sql
   cmake ... -DWITH_INNODB_MEMCACHED=1 -DENABLE_MEMCACHED_SASL=1 -DENABLE_MEMCACHED_SASL_PWDB=1
   ```

3. Instale o plugin `daemon_memcached`, conforme descrito na Seção 14.21.3, “Configurando o Plugin `memcached` do InnoDB”.

4. Configure um arquivo de nome de usuário e senha. (Este exemplo usa o suporte simples a senha em texto não criptografado do **memcached**.)

   1. Em um arquivo, crie um usuário chamado `testname` e defina a senha como `testpasswd`:

      ```sql
      echo "testname:testpasswd:::::::" >/home/jy/memcached-sasl-db
      ```

   2. Configure a variável de ambiente `MEMCACHED_SASL_PWDB` para informar ao `memcached` o nome de usuário e o arquivo de senha:

      ```sql
      export MEMCACHED_SASL_PWDB=/home/jy/memcached-sasl-db
      ```

   3. Informe ao `memcached` que uma senha em texto não criptografado está sendo usada:

      ```sql
      echo "mech_list: plain" > /home/jy/work2/msasl/clients/memcached.conf
      export SASL_CONF_PATH=/home/jy/work2/msasl/clients
      ```

5. Habilite o SASL reiniciando o servidor MySQL com a opção `-S` do **memcached** codificada no parâmetro de configuração `daemon_memcached_option`:

   ```sql
   mysqld ... --daemon_memcached_option="-S"
   ```

6. Para testar a configuração, use um cliente com SASL habilitado, como [libmemcached com SASL habilitado](https://code.launchpad.net/~trond-norbye/libmemcached/sasl).

   ```sql
   memcp --servers=localhost:11211 --binary  --username=testname
     --password=password myfile.txt

   memcat --servers=localhost:11211 --binary --username=testname
     --password=password myfile.txt
   ```

   Se você especificar um nome de usuário ou senha incorretos, a operação será rejeitada com uma mensagem `memcache error AUTHENTICATION FAILURE`. Neste caso, examine a senha em texto não criptografado definida no arquivo `memcached-sasl-db` para verificar se as credenciais fornecidas estão corretas.

Existem outros métodos para testar a autenticação SASL com **memcached**, mas o método descrito acima é o mais direto.