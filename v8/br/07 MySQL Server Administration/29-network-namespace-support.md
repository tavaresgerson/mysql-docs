### 7.1.14 Apoio ao espaço de nomes de rede

Um espaço de nomes de rede é uma cópia lógica da pilha de rede do sistema host. Espaços de nomes de rede são úteis para a configuração de contêineres ou ambientes virtuais. Cada espaço de nomes tem seus próprios endereços IP, interfaces de rede, tabelas de roteamento, e assim por diante. O espaço de nomes padrão ou global é aquele em que as interfaces físicas do sistema host existem.

Os espaços de endereço específicos de namespace podem levar a problemas quando as conexões MySQL cruzam os namespaces. Por exemplo, o espaço de endereço de rede para uma instância MySQL executada em um contêiner ou rede virtual pode diferir do espaço de endereço da máquina host. Isso pode produzir fenômenos como uma conexão de cliente de um endereço em um namespace que parece ao servidor MySQL estar vindo de um endereço diferente, mesmo para o cliente e o servidor executando na mesma máquina. Suponha que ambos os processos sejam executados em um host com endereço IP `203.0.113.10` mas usem diferentes namespaces. Uma conexão pode produzir um resultado como este:

```
$> mysql --user=admin --host=203.0.113.10 --protocol=tcp

mysql> SELECT USER();
+--------------------+
| USER()             |
+--------------------+
| admin@198.51.100.2 |
+--------------------+
```

Neste caso, o valor esperado de `USER()` é `admin@203.0.113.10`. Tal comportamento pode dificultar a atribuição de permissões de conta corretamente se o endereço a partir do qual uma conexão se origina não for o que parece.

Para resolver esse problema, o MySQL permite especificar o namespace de rede a ser usado para conexões TCP / IP, de modo que ambos os pontos finais das conexões usem um espaço de endereço comum acordado.

O MySQL suporta espaços de nomes de rede em plataformas que os implementam.

- O servidor MySQL.
- X Plugin.
- O cliente `mysql` e o cliente `mysqlxtest` do conjunto de testes. (Outros clientes não são suportados. Eles devem ser invocados a partir do espaço de nomes de rede do servidor ao qual eles se conectam.)
- Replicação regular.
- Replicação em grupo, apenas quando se utiliza a pilha de comunicação MySQL para estabelecer conexões de comunicação em grupo.

As seções a seguir descrevem como usar espaços de nomes de rede no MySQL:

- Pré-requisitos do sistema de acolhimento
- Configuração do MySQL
- Monitoramento do espaço de nomes da rede

#### Pré-requisitos do sistema de acolhimento

Antes de usar o suporte de namespace de rede no MySQL, esses pré-requisitos do sistema host devem ser satisfeitos:

- O sistema operacional host deve suportar espaços de nomes de rede (por exemplo, Linux).

- Qualquer espaço de nomes de rede a ser usado pelo MySQL deve primeiro ser criado no sistema host.

- A resolução do nome de host deve ser configurada pelo administrador do sistema para suportar espaços de nomes de rede.

  ::: info Note

  Uma limitação conhecida é que, dentro do MySQL, a resolução de nome de host não funciona para nomes especificados em arquivos de host específicos do espaço de nomes de rede. Por exemplo, se o endereço para um nome de host no espaço de nomes `red` for especificado no arquivo `/etc/netns/red/hosts`, a ligação ao nome falha tanto no servidor quanto no lado do cliente. A solução é usar o endereço IP em vez do nome de host.

  :::

- O administrador do sistema deve habilitar o privilégio do sistema operacional `CAP_SYS_ADMIN` para os binários MySQL que suportam espaços de nomes de rede (`mysqld`, `mysql`, `mysqlxtest`).

  Importância

  A habilitação de `CAP_SYS_ADMIN` é uma operação sensível à segurança porque permite que um processo execute outras ações privilegiadas além de definir namespaces.

  Como o `CAP_SYS_ADMIN` deve ser ativado explicitamente pelo administrador do sistema, os binários do MySQL por padrão não têm suporte de namespace de rede ativado. O administrador do sistema deve avaliar as implicações de segurança de executar processos do MySQL com o `CAP_SYS_ADMIN` antes de ativá-lo.

As instruções no exemplo a seguir configuram espaços de nomes de rede chamados `red` e `blue`. Os nomes que você escolher podem diferir, assim como os endereços de rede e interfaces em seu sistema host.

Invoque os comandos mostrados aqui como o usuário do sistema operacional `root` ou prefixando cada comando com **sudo**. Por exemplo, para invocar o comando **ip** ou **setcap** se você não for `root`, use **sudo ip** ou **sudo setcap**.

Para configurar espaços de nomes de rede, use o comando **ip**. Para algumas operações, o comando **ip** deve ser executado dentro de um espaço de nomes específico (que já deve existir).

```
ip netns exec namespace_name
```

Por exemplo, este comando é executado no espaço de nomes `red` para trazer a interface de loopback:

```
ip netns exec red ip link set lo up
```

Para adicionar espaços de nomes nomeados `red` e `blue`, cada um com seu próprio dispositivo Ethernet virtual usado como um link entre espaços de nomes e sua própria interface de loopback:

```
ip netns add red
ip link add veth-red type veth peer name vpeer-red
ip link set vpeer-red netns red
ip addr add 192.0.2.1/24 dev veth-red
ip link set veth-red up
ip netns exec red ip addr add 192.0.2.2/24 dev vpeer-red
ip netns exec red ip link set vpeer-red up
ip netns exec red ip link set lo up

ip netns add blue
ip link add veth-blue type veth peer name vpeer-blue
ip link set vpeer-blue netns blue
ip addr add 198.51.100.1/24 dev veth-blue
ip link set veth-blue up
ip netns exec blue ip addr add 198.51.100.2/24 dev vpeer-blue
ip netns exec blue ip link set vpeer-blue up
ip netns exec blue ip link set lo up

# if you want to enable inter-subnet routing...
sysctl net.ipv4.ip_forward=1
ip netns exec red ip route add default via 192.0.2.1
ip netns exec blue ip route add default via 198.51.100.1
```

Um diagrama das ligações entre espaços de nomes é o seguinte:

```
red              global           blue

192.0.2.2   <=>  192.0.2.1
(vpeer-red)      (veth-red)

                 198.51.100.1 <=> 198.51.100.2
                 (veth-blue)      (vpeer-blue)
```

Para verificar os espaços de nomes e as ligações existentes:

```
ip netns list
ip link list
```

Para ver as tabelas de roteamento para os namespaces globais e nomeados:

```
ip route show
ip netns exec red ip route show
ip netns exec blue ip route show
```

Para remover os links e espaços de nomes `red` e `blue`:

```
ip link del veth-red
ip link del veth-blue

ip netns del red
ip netns del blue

sysctl net.ipv4.ip_forward=0
```

Para que os binários do MySQL que incluem suporte de namespace de rede possam realmente usar namespaces, você deve conceder a eles a capacidade `CAP_SYS_ADMIN`. Os seguintes comandos **setcap** assumem que você mudou de localização para o diretório contendo seus binários do MySQL (ajuste o nome de caminho para o seu sistema conforme necessário):

```
cd /usr/local/mysql/bin
```

Para conceder a capacidade `CAP_SYS_ADMIN` aos binários apropriados:

```
setcap cap_sys_admin+ep ./mysqld
setcap cap_sys_admin+ep ./mysql
setcap cap_sys_admin+ep ./mysqlxtest
```

Para verificar a capacidade de `CAP_SYS_ADMIN`:

```
$> getcap ./mysqld ./mysql ./mysqlxtest
./mysqld = cap_sys_admin+ep
./mysql = cap_sys_admin+ep
./mysqlxtest = cap_sys_admin+ep
```

Para remover a capacidade de `CAP_SYS_ADMIN`:

```
setcap -r ./mysqld
setcap -r ./mysql
setcap -r ./mysqlxtest
```

Importância

Se você reinstalar binários para os quais você aplicou anteriormente \*\* setcap \*\*, você deve usar \*\* setcap \*\* novamente. Por exemplo, se você executar uma atualização do MySQL no local, a falha em conceder a capacidade `CAP_SYS_ADMIN` novamente resulta em falhas relacionadas ao namespace. O servidor falha com este erro para tentativas de se vincular a um endereço com um namespace nomeado:

```
[ERROR] [MY-013408] [Server] setns() failed with error 'Operation not permitted'
```

Um cliente invocado com a opção `--network-namespace` falha assim:

```
ERROR: Network namespace error: Operation not permitted
```

#### Configuração do MySQL

Assumindo que os pré-requisitos do sistema host anteriores foram satisfeitos, o MySQL permite configurar o espaço de nomes do lado do servidor para o lado de escuta (entrada) das conexões e o espaço de nomes do lado do cliente para o lado de saída das conexões.

No lado do servidor, as variáveis de sistema `bind_address` , `admin_address` e `mysqlx_bind_address` têm sintaxe estendida para especificar o namespace de rede a ser usado para um determinado endereço IP ou nome de host no qual ouvir as conexões de entrada.

```
[mysqld]
bind_address = 127.0.1.1,192.0.2.2/red,198.51.100.2/blue
admin_address = 102.0.2.2/red
mysqlx_bind_address = 102.0.2.2/red
```

Aplicam-se as seguintes regras:

- Um espaço de nomes de rede pode ser especificado para um endereço IP ou um nome de host.
- Não é possível especificar um espaço de nomes de rede para um endereço IP com código-fonte.
- Para um determinado endereço, o espaço de nomes de rede é opcional. Se dado, ele deve ser especificado como um sufixo `/ns` imediatamente após o endereço.
- Um endereço sem o sufixo `/ns` usa o espaço de nomes global do sistema host. O espaço de nomes global é, portanto, o padrão.
- Um endereço com um sufixo `/ns` usa o espaço de nomes chamado `ns`.
- O sistema host deve suportar espaços de nomes de rede e cada espaço de nomes nomeado deve ter sido previamente configurado.
- `bind_address` e `mysqlx_bind_address` aceitam uma lista de múltiplos endereços separados por vírgulas, o valor da variável pode especificar endereços no espaço de nomes global, em espaços de nomes nomeados ou uma mistura.

Se ocorrer um erro durante a inicialização do servidor para tentativas de usar um namespace, o servidor não inicia. Se ocorrerem erros para o X Plugin durante a inicialização do plugin, de modo que ele não seja capaz de se vincular a qualquer endereço, o plugin falha em sua sequência de inicialização e o servidor não o carrega.

Do lado do cliente, um espaço de nomes de rede pode ser especificado nestes contextos:

- Para o cliente `mysql` e para o cliente `mysqlxtest`, use a opção `--network-namespace`.

  ```
  mysql --host=192.0.2.2 --network-namespace=red
  ```

  Se a opção `--network-namespace` for omitida, a conexão usa o namespace padrão (global).
- Para conexões de replicação de servidores de réplica para servidores de origem, use a instrução `CHANGE REPLICATION SOURCE TO` e especifique a opção `NETWORK_NAMESPACE`.

  ```
  CHANGE REPLICATION SOURCE TO
    SOURCE_HOST = '192.0.2.2',
    NETWORK_NAMESPACE = 'red';
  ```

  Se a opção `NETWORK_NAMESPACE` for omitida, as conexões de replicação usam o namespace padrão (global).

O exemplo a seguir configura um servidor MySQL que escuta conexões nos namespaces global, `red` e `blue`, e mostra como configurar contas que se conectam a partir dos namespaces `red` e `blue`. É assumido que os namespaces `red` e `blue` já foram criados, conforme mostrado nos Pré-requisitos do Sistema de Hospedagem.

1. Configure o servidor para ouvir endereços em vários namespaces. Coloque estas linhas no arquivo do servidor `my.cnf` e inicie o servidor:

   ```
   [mysqld]
   bind_address = 127.0.1.1,192.0.2.2/red,198.51.100.2/blue
   ```

   O valor diz ao servidor para ouvir o endereço de loopback `127.0.0.1` no espaço de nomes global, o endereço `192.0.2.2` no espaço de nomes `red` e o endereço `198.51.100.2` no espaço de nomes `blue`.
2. Conecte-se ao servidor no espaço de nomes global e crie contas que tenham permissão para se conectar a partir de um endereço no espaço de endereços de cada espaço de nomes nomeado:

   ```
   $> mysql -u root -h 127.0.0.1 -p
   Enter password: root_password

   mysql> CREATE USER 'red_user'@'192.0.2.2'
          IDENTIFIED BY 'red_user_password';
   mysql> CREATE USER 'blue_user'@'198.51.100.2'
          IDENTIFIED BY 'blue_user_password';
   ```
3. Verifique se você pode se conectar ao servidor em cada espaço de nomes:

   ```
   $> mysql -u red_user -h 192.0.2.2 --network-namespace=red -p
   Enter password: red_user_password

   mysql> SELECT USER();
   +--------------------+
   | USER()             |
   +--------------------+
   | red_user@192.0.2.2 |
   +--------------------+
   ```

   ```
   $> mysql -u blue_user -h 198.51.100.2 --network-namespace=blue -p
   Enter password: blue_user_password

   mysql> SELECT USER();
   +------------------------+
   | USER()                 |
   +------------------------+
   | blue_user@198.51.100.2 |
   +------------------------+
   ```

   ::: info Note

   Você pode ver resultados diferentes de `USER()`, que pode retornar um valor que inclui um nome de host em vez de um endereço IP se o seu DNS estiver configurado para ser capaz de resolver o endereço para o nome de host correspondente e o servidor não estiver sendo executado com a variável de sistema `skip_name_resolve` ativada.

   :::

   Você também pode tentar invocar `mysql` sem a opção `--network-namespace` para ver se a tentativa de conexão é bem-sucedida e, em caso afirmativo, como o valor `USER()` é afetado.

#### Monitoramento do espaço de nomes da rede

Para efeitos de monitorização da replicação, estas fontes de informação têm uma coluna que exibe o espaço de nomes de rede aplicável às conexões:

- A tabela do Esquema de Desempenho `replication_connection_configuration`; ver secção 29.12.11.11, A tabela de replicação\_conexão\_configuração.
- O repositório de metadados de conexão do servidor de réplica; ver secção 19.2.4.2, "Repositórios de metadados de réplica".
- A instrução `SHOW REPLICA STATUS`.
