### 14.21.4 Considerações de segurança para o plugin InnoDB memcached

Cuidado

Consulte esta seção antes de implantar o plugin `daemon_memcached` em um servidor de produção, ou até mesmo em um servidor de teste, se a instância do MySQL contiver dados sensíveis.

Como o **memcached** não utiliza um mecanismo de autenticação por padrão e a autenticação opcional SASL não é tão forte quanto as medidas de segurança tradicionais dos SGBD, mantenha apenas os dados não sensíveis na instância do MySQL que utiliza o plugin `daemon_memcached` e isole quaisquer servidores que utilizem essa configuração de possíveis intrusos. Não permita o acesso do **memcached** a esses servidores pela Internet; permita apenas o acesso por meio de uma intranet com firewall, idealmente de uma sub-rede cuja associação você possa restringir.

#### Protegendo memcached com senha usando SASL

O suporte SASL oferece a capacidade de proteger seu banco de dados MySQL contra acesso não autenticado por meio de clientes **memcached**. Esta seção explica como habilitar o SASL com o plugin `daemon_memcached`. Os passos são quase idênticos aos realizados para habilitar o SASL em um servidor **memcached** tradicional.

SASL significa “Camada de Segurança e Autenticação Simples”, um padrão para adicionar suporte à autenticação em protocolos baseados em conexão. O **memcached** adicionou suporte a SASL na versão 1.4.3.

A autenticação SASL é suportada apenas com o protocolo binário.

Os clientes do **memcached** só conseguem acessar as tabelas do **InnoDB** que estão registradas na tabela **innodb\_memcache.containers**. Embora um DBA possa aplicar restrições de acesso a essas tabelas, o acesso através das aplicações do **memcached** não pode ser controlado. Por essa razão, o suporte SASL é fornecido para controlar o acesso às tabelas do **InnoDB** associadas ao plugin **daemon\_memcached**.

A seção a seguir mostra como construir, habilitar e testar um plugin `daemon_memcached` habilitado para SASL.

#### Construindo e habilitando SASL com o plugin memcached do InnoDB

Por padrão, um plugin `daemon_memcached` habilitado para SASL não está incluído nos pacotes de lançamento do MySQL, pois um plugin `daemon_memcached` habilitado para SASL requer a construção do **memcached** com as bibliotecas SASL. Para habilitar o suporte para SASL, faça o download do código-fonte do MySQL e reconstrua o plugin `daemon_memcached` após baixar as bibliotecas SASL:

1. Instale as bibliotecas de desenvolvimento e utilitárias do SASL. Por exemplo, no Ubuntu, use o **apt-get** para obter as bibliotecas:

   ```sql
   sudo apt-get -f install libsasl2-2 sasl2-bin libsasl2-2 libsasl2-dev libsasl2-modules
   ```

2. Construa as bibliotecas de compartilhamento do plugin `daemon_memcached` com capacidade SASL adicionando `ENABLE_MEMCACHED_SASL=1` às suas opções de **cmake**. O **memcached** também oferece suporte a senhas simples em texto claro, o que facilita o teste. Para habilitar o suporte a senhas simples em texto claro, especifique a opção **cmake** `ENABLE_MEMCACHED_SASL_PWDB=1`.

   Em resumo, adicione as seguintes três opções do **cmake**:

   ```sql
   cmake ... -DWITH_INNODB_MEMCACHED=1 -DENABLE_MEMCACHED_SASL=1 -DENABLE_MEMCACHED_SASL_PWDB=1
   ```

3. Instale o plugin `daemon_memcached`, conforme descrito na Seção 14.21.3, “Configurando o Plugin InnoDB memcached”.

4. Configure um arquivo de nome de usuário e senha. (Este exemplo usa o suporte simples de senha em texto claro do **memcached**.)

   1. Crie um arquivo com o nome `testname` e defina a senha como `testpasswd`:

      ```sql
      echo "testname:testpasswd:::::::" >/home/jy/memcached-sasl-db
      ```

   2. Configure a variável de ambiente `MEMCACHED_SASL_PWDB` para informar ao `memcached` o nome do usuário e o arquivo de senha:

      ```sql
      export MEMCACHED_SASL_PWDB=/home/jy/memcached-sasl-db
      ```

   3. Informe ao `memcached` que uma senha em texto claro é usada:

      ```sql
      echo "mech_list: plain" > /home/jy/work2/msasl/clients/memcached.conf
      export SASL_CONF_PATH=/home/jy/work2/msasl/clients
      ```

5. Ative o SASL reiniciando o servidor MySQL com a opção **memcached** `-S` codificada no parâmetro de configuração `daemon_memcached_option`:

   ```sql
   mysqld ... --daemon_memcached_option="-S"
   ```

6. Para testar a configuração, use um cliente habilitado para SASL, como [libmemcached habilitado para SASL](https://code.launchpad.net/~trond-norbye/libmemcached/sasl).

   ```sql
   memcp --servers=localhost:11211 --binary  --username=testname
     --password=password myfile.txt

   memcat --servers=localhost:11211 --binary --username=testname
     --password=password myfile.txt
   ```

   Se você especificar um nome de usuário ou senha incorreto, a operação será rejeitada com a mensagem `memcache error AUTHENTICATION FAILURE`. Nesse caso, examine a senha em texto claro definida no arquivo `memcached-sasl-db` para verificar se as credenciais fornecidas estão corretas.

Existem outros métodos para testar a autenticação SASL com o **memcached**, mas o método descrito acima é o mais simples.
