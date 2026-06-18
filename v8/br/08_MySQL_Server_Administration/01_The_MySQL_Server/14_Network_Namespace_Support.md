### 7.1.14 Suporte ao Namespace de Rede

Um namespace de rede é uma cópia lógica da pilha de rede do sistema host. Os namespaces de rede são úteis para configurar contêineres ou ambientes virtuais. Cada namespace tem seus próprios endereços IP, interfaces de rede, tabelas de roteamento, entre outros. O namespace padrão ou global é o em que as interfaces físicas do sistema host existem.

Os espaços de endereçamento específicos de namespaces podem causar problemas quando as conexões do MySQL atravessam namespaces. Por exemplo, o espaço de endereçamento de rede para uma instância do MySQL que está em um contêiner ou rede virtual pode diferir do espaço de endereçamento da máquina hospedeira. Isso pode produzir fenômenos como uma conexão de cliente de um endereço em um namespace parecer para o servidor MySQL que está vindo de um endereço diferente, mesmo para clientes e servidores que estão na mesma máquina. Suponha que ambos os processos estejam em um host com o endereço IP `203.0.113.10`, mas usem namespaces diferentes. Uma conexão pode produzir um resultado como este:

```
$> mysql --user=admin --host=203.0.113.10 --protocol=tcp

mysql> SELECT USER();
+--------------------+
| USER()             |
+--------------------+
| admin@198.51.100.2 |
+--------------------+
```

Neste caso, o valor esperado do `USER()` é `admin@203.0.113.10`. Esse comportamento pode dificultar a atribuição adequada das permissões da conta se o endereço a partir do qual uma conexão se origina não for o que parece.

Para resolver esse problema, o MySQL permite especificar o espaço de nome de rede a ser usado para conexões TCP/IP, para que ambos os pontos finais das conexões utilizem um espaço de endereços comum acordado.

O MySQL 8.0.22 e versões superiores suportam namespaces de rede em plataformas que os implementam. O suporte no MySQL se aplica a:

- O servidor MySQL, **mysqld**.

- X Plugin.

- O cliente **mysql** e o cliente da suíte de testes **mysqlxtest**. (Outros clientes não são suportados. Eles devem ser invocados dentro do espaço de rede do servidor ao qual eles devem se conectar.)

- Replicação regular.

- Replicação em grupo, apenas ao usar a pilha de comunicação MySQL para estabelecer conexões de comunicação em grupo (a partir do MySQL 8.0.27).

As seções a seguir descrevem como usar namespaces de rede no MySQL:

- Requisitos do Sistema de Hospedagem
- Configuração do MySQL
- Monitoramento do Namespace de Rede

#### Requisitos do Sistema de Hospedagem

Antes de usar o suporte de namespace de rede no MySQL, é necessário atender a esses pré-requisitos do sistema de hospedagem:

- O sistema operacional do host deve suportar namespaces de rede. (Por exemplo, Linux.)

- Qualquer espaço de rede a ser usado pelo MySQL deve ser criado primeiro no sistema do host.

- A resolução do nome do host deve ser configurada pelo administrador do sistema para suportar os namespaces de rede.

  Nota

  Uma limitação conhecida é que, dentro do MySQL, a resolução de nomes de host não funciona para nomes especificados em arquivos de host específicos do namespace de rede. Por exemplo, se o endereço de um nome de host no namespace `red` for especificado no arquivo `/etc/netns/red/hosts`, a vinculação ao nome falhará tanto no lado do servidor quanto no lado do cliente. A solução é usar o endereço IP em vez do nome de host.

- O administrador do sistema deve habilitar o privilégio do sistema operacional `CAP_SYS_ADMIN` para os binários do MySQL que suportam namespaces de rede (**mysqld**, **mysql**, **mysqlxtest**).

  Importante

  Ativar `CAP_SYS_ADMIN` é uma operação sensível à segurança, pois permite que um processo realize outras ações privilegiadas além de definir namespaces. Para uma descrição de seus efeitos, consulte <https://man7.org/linux/man-pages/man7/capabilities.7.html>.

  Como o `CAP_SYS_ADMIN` deve ser habilitado explicitamente pelo administrador do sistema, os binários do MySQL, por padrão, não têm suporte ao namespace de rede habilitado. O administrador do sistema deve avaliar as implicações de segurança de executar processos do MySQL com `CAP_SYS_ADMIN` antes de habilitá-lo.

As instruções no exemplo a seguir configuram namespaces de rede chamados `red` e `blue`. Os nomes que você escolher pode ser diferente, assim como os endereços de rede e interfaces no seu sistema de hospedagem.

Invoque os comandos mostrados aqui como usuário do sistema operacional `root` ou prefixando cada comando com **sudo**. Por exemplo, para invocar os comandos **ip** ou **setcap** se você não for `root`, use **sudo ip** ou **sudo setcap**.

Para configurar namespaces de rede, use o comando **ip**. Para algumas operações, o comando **ip** deve ser executado dentro de um namespace específico (que já deve existir). Nesse caso, inicie o comando da seguinte maneira:

```
ip netns exec namespace_name
```

Por exemplo, este comando é executado dentro do namespace `red` para exibir a interface de loopback:

```
ip netns exec red ip link set lo up
```

Para adicionar namespaces com os nomes `red` e `blue`, cada um com seu próprio dispositivo Ethernet virtual usado como link entre os namespaces e sua própria interface de loopback:

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

Um diagrama dos links entre os namespaces parece assim:

```
red              global           blue

192.0.2.2   <=>  192.0.2.1
(vpeer-red)      (veth-red)

                 198.51.100.1 <=> 198.51.100.2
                 (veth-blue)      (vpeer-blue)
```

Para verificar quais namespaces e links existem:

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

Para remover os links e os namespaces `red` e `blue`:

```
ip link del veth-red
ip link del veth-blue

ip netns del red
ip netns del blue

sysctl net.ipv4.ip_forward=0
```

Para que os binários do MySQL que incluem suporte ao namespace de rede possam realmente usar namespaces, você deve conceder-lhes a capacidade `CAP_SYS_ADMIN`. Os seguintes comandos **setcap** assumem que você alterou a localização para o diretório que contém os binários do MySQL (ajuste o caminho do sistema conforme necessário):

```
cd /usr/local/mysql/bin
```

Para conceder a capacidade `CAP_SYS_ADMIN` aos binários apropriados:

```
setcap cap_sys_admin+ep ./mysqld
setcap cap_sys_admin+ep ./mysql
setcap cap_sys_admin+ep ./mysqlxtest
```

Para verificar a capacidade do `CAP_SYS_ADMIN`:

```
$> getcap ./mysqld ./mysql ./mysqlxtest
./mysqld = cap_sys_admin+ep
./mysql = cap_sys_admin+ep
./mysqlxtest = cap_sys_admin+ep
```

Para remover a capacidade `CAP_SYS_ADMIN`:

```
setcap -r ./mysqld
setcap -r ./mysql
setcap -r ./mysqlxtest
```

Importante

Se você reinstalar binários para os quais você já aplicou o **setcap**, você deve usar o **setcap** novamente. Por exemplo, se você realizar uma atualização do MySQL in-place, a falha em conceder novamente a capacidade `CAP_SYS_ADMIN` resulta em falhas relacionadas ao namespace. O servidor falha com esse erro para tentativas de vinculação a um endereço com um namespace nomeado:

```
[ERROR] [MY-013408] [Server] setns() failed with error 'Operation not permitted'
```

Um cliente invocado com a opção `--network-namespace` falha da seguinte forma:

```
ERROR: Network namespace error: Operation not permitted
```

#### Configuração do MySQL

Supondo que os pré-requisitos do sistema hospedeiro anterior tenham sido atendidos, o MySQL permite configurar o namespace do lado do servidor para o lado de escuta (entrada) das conexões e o namespace do lado do cliente para o lado de saída das conexões.

No lado do servidor, as variáveis de sistema `bind_address`, `admin_address` e `mysqlx_bind_address` têm sintaxe estendida para especificar o namespace de rede a ser usado para um determinado endereço IP ou nome de host para o qual as conexões entrantes serão ouvidas. Para especificar um namespace para um endereço, adicione uma barra e o nome do namespace. Por exemplo, um arquivo de servidor `my.cnf` pode conter essas linhas:

```
[mysqld]
bind_address = 127.0.1.1,192.0.2.2/red,198.51.100.2/blue
admin_address = 102.0.2.2/red
mysqlx_bind_address = 102.0.2.2/red
```

Estas regras se aplicam:

- Um espaço de rede pode ser especificado para um endereço IP ou um nome de host.

- Não é possível especificar um espaço de rede para um endereço IP wildcard.

- Para um endereço específico, o espaço de nome de rede é opcional. Se fornecido, ele deve ser especificado como um sufixo `/ns` imediatamente após o endereço.

- Um endereço sem o sufixo `/ns` usa o espaço de nomes global do sistema host. Portanto, o espaço de nomes global é o padrão.

- Um endereço com o sufixo `/ns` usa o namespace chamado `ns`.

- O sistema de hospedagem deve suportar namespaces de rede e cada namespace nomeado deve ter sido configurado anteriormente. Nomear um namespace inexistente produz um erro.

- `bind_address` e (a partir do MySQL 8.0.21) `mysqlx_bind_address` aceitam uma lista de endereços separados por vírgula, o valor da variável pode especificar endereços no espaço de nomes global, em espaços de nomes nomeados ou uma mistura.

Se ocorrer um erro durante a inicialização do servidor ao tentar usar um namespace, o servidor não será iniciado. Se ocorrerem erros durante a inicialização do X Plugin, de modo que ele não consiga se vincular a nenhum endereço, o plugin falhará na sequência de inicialização e o servidor não o carregará.

Do lado do cliente, um espaço de rede pode ser especificado nesses contextos:

- Para o cliente **mysql** e o cliente da suíte de testes **mysqlxtest**, use a opção `--network-namespace`. Por exemplo:

  ```
  mysql --host=192.0.2.2 --network-namespace=red
  ```

  Se a opção `--network-namespace` for omitida, a conexão usa o namespace padrão (global).

- Para conexões de replicação de servidores de replicação para servidores de origem, use a instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23) e especifique a opção `NETWORK_NAMESPACE`. Por exemplo:

  ```
  CHANGE REPLICATION SOURCE TO
    SOURCE_HOST = '192.0.2.2',
    NETWORK_NAMESPACE = 'red';
  ```

  Se a opção `NETWORK_NAMESPACE` for omitida, as conexões de replicação usarão o namespace padrão (global).

O exemplo a seguir configura um servidor MySQL que escuta conexões nos namespaces global, `red` e `blue` e mostra como configurar contas que se conectam dos namespaces `red` e `blue`. Assume-se que os namespaces `red` e `blue` já tenham sido criados, conforme mostrado nas Premissas do Sistema de Hospedagem.

1. Configure o servidor para ouvir em endereços em vários namespaces. Coloque essas linhas no arquivo do servidor `my.cnf` e inicie o servidor:

   ```
   [mysqld]
   bind_address = 127.0.1.1,192.0.2.2/red,198.51.100.2/blue
   ```

   O valor indica ao servidor que ele deve ouvir no endereço de loopback `127.0.0.1` no espaço de nomes global, no endereço `192.0.2.2` no espaço de nomes `red` e no endereço `198.51.100.2` no espaço de nomes `blue`.

2. Conecte-se ao servidor no espaço de nomes global e crie contas que tenham permissão para se conectar a partir de um endereço no espaço de endereços de cada espaço de nomes nomeado:

   ```
   $> mysql -u root -h 127.0.0.1 -p
   Enter password: root_password

   mysql> CREATE USER 'red_user'@'192.0.2.2'
          IDENTIFIED BY 'red_user_password';
   mysql> CREATE USER 'blue_user'@'198.51.100.2'
          IDENTIFIED BY 'blue_user_password';
   ```

3. Verifique se você pode se conectar ao servidor em cada namespace nomeado:

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

   Nota

   Você pode ver resultados diferentes do `USER()`, que pode retornar um valor que inclui um nome de host em vez de um endereço IP, se o seu DNS estiver configurado para resolver o endereço para o nome de host correspondente e o servidor não estiver rodando com a variável de sistema `skip_name_resolve` habilitada.

   Você também pode tentar invocar o **mysql** sem a opção `--network-namespace` para ver se a tentativa de conexão é bem-sucedida e, se for o caso, como o valor `USER()` é afetado.

#### Monitoramento do Namespace de Rede

Para fins de monitoramento de replicação, essas fontes de informações possuem uma coluna que exibe o namespace de rede aplicável para as conexões:

- A tabela do Schema de Desempenho `replication_connection_configuration`. Veja a Seção 29.12.11.10, “A tabela replication\_connection\_configuration”.

- O repositório de metadados da conexão do servidor de replicação. Consulte a Seção 19.2.4.2, "Repositórios de Metadados de Replicação".

- A instrução `SHOW REPLICA STATUS` (ou antes do MySQL 8.0.22, `SHOW SLAVE STATUS`). Veja a Seção 15.7.7.35, “Instrução SHOW REPLICA STATUS”.
