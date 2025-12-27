#### 25.6.19.5 Criptografia de Link TLS para NDB Cluster

Esta seção discute a implementação e o uso da Segurança da Camada de Transporte (TLS) para proteger as comunicações de rede no MySQL NDB Cluster. Os tópicos abordados incluem chaves e certificados, ciclos de vida de chaves e certificados, autenticação de certificados e como isso é refletido na configuração do cluster, bem como o suporte do NDB Cluster à Infraestrutura de Chaves Públicas (PKI) da Internet usada para autenticar e criptografar conexões entre nós NDB e entre o servidor de gerenciamento NDB e seus clientes.

Nota

O TLS para NDB Cluster no Linux requer suporte integrado para OpenSSL 1.1 ou posterior. Por essa razão, ele não está disponível para o Enterprise Linux 7, que é construído com OpenSSL 1.0.

##### 25.6.19.5.1 Visão Geral do TLS para NDB Cluster

O TLS pode ser usado para proteger as comunicações de rede no NDB Cluster 8.3 e versões posteriores. As conexões do NDB Transporter protegidas pelo TLS usam autenticação mútua TLS, na qual cada nó valida o certificado de seu parceiro. Um certificado de nó também pode ser vinculado a um hostname específico; nesse caso, um parceiro autoriza o certificado apenas se o hostname puder ser verificado.

O próprio arquivo de certificado de um nó contém toda a cadeia de confiança que ele usa para validar os certificados de seus pares. Isso geralmente inclui apenas seu próprio certificado e o da CA emissora, mas pode incluir CAs adicionais. Como um cluster NDB é considerado um reino de confiança, a CA deve ser limitada ao escopo de um único cluster.

Para obter certificados de nó assinados, é necessário primeiro criar uma Autoridade de Certificação (CA). Quando o TLS é implantado, cada nó tem um certificado autêntico, que é assinado pela CA. Apenas o administrador (DBA) deve ter acesso à chave de assinatura privada da CA, com a qual os certificados de nó válidos são criados.

Os vinculações de hostname são criadas por padrão para certificados de nó de gerenciamento e API. Como os nós de dados do NDB Cluster já estão sujeitos a verificações de hostname como parte da alocação do ID do nó, o comportamento padrão é não adicionar uma verificação de hostname adicional para o TLS.

Um certificado não é mais válido após a data de expiração. Para minimizar o impacto da expiração do certificado na disponibilidade do sistema, um cluster deve ter vários certificados com datas de expiração escalonadas; os certificados de cliente devem expirar primeiro, seguidos pelos certificados de nó de dados e, em seguida, pelos certificados do servidor de gerenciamento. Para facilitar a expiração escalonada, cada certificado é associado a um tipo de nó; um nó específico usa chaves e certificados do tipo apropriado apenas.

As chaves privadas são criadas in loco; a cópia de arquivos contendo chaves privadas é minimizada. Tanto as chaves quanto os certificados são rotulados como ativos (correntes) ou pendentes. É possível rotular as chaves para permitir que chaves pendentes substituam chaves ativas antes da expiração das chaves ativas.

Devido ao número potencialmente grande de arquivos envolvidos, o NDB segue várias convenções de nomeação para arquivos que armazenam chaves, solicitações de assinatura e certificados. Esses nomes não são configuráveis pelo usuário, embora os diretórios onde esses arquivos são armazenados possam ser determinados pelo usuário.

Por padrão, as chaves privadas do CA do NDB são protegidas por uma senha que deve ser fornecida ao criar um certificado de nó assinado. As chaves privadas dos nós são armazenadas não criptografadas, para que possam ser abertas automaticamente no momento do início do nó. Os arquivos de chave privada são de leitura somente (modo de arquivo Unix 0400).

##### 25.6.19.5.2 Criando um CA e Chaves

Crie um CA no diretório CA:

```
$> ndb_sign_keys --create-CA --to-dir=CA
Mode of operation: create CA.
This utility will create a cluster CA private key and a public key certificate.

You will be prompted to supply a pass phrase to protect the
cluster private key. This security of the cluster depends on this.

Only the database administrator responsible for this cluster should
have the pass phrase. Knowing the pass phrase would allow an attacker
to gain full access to the database.

The passphrase must be at least 4 characters in length.

Creating CA key file NDB-Cluster-private-key in directory CA.
Enter PEM pass phrase: Verifying - Enter PEM pass phrase:
Creating CA certificate NDB-Cluster-cert in directory CA.
$> ls -l CA
total 8
-rw-r--r-- 1 mysql mysql 1082 Dec 19 07:32 NDB-Cluster-cert
-r-------- 1 mysql mysql 1854 Dec 19 07:32 NDB-Cluster-private-key
```

Em seguida, crie chaves para todos os nós neste host usando a opção `--create-key`, assim:

```
$> ndb_sign_keys --ndb-tls-search-path='CA' --create-key -c localhost:1186 --to-dir=keys
Mode of operation: create active keys and certificates.
Enter PEM pass phrase:
Creating active private key in directory keys.
Creating active certificate in directory keys.
Creating active private key in directory keys.
Creating active certificate in directory keys.
Creating active private key in directory keys.
Creating active certificate in directory keys.
Read 5 nodes from custer configuration.
Found 5 nodes configured to run on this host.
Created 3 keys and 3 certificates.
$>
```

`--create-key` faz com que o **ndb\_sign\_keys** se conecte ao servidor de gerenciamento, leia a configuração do cluster e, em seguida, crie um conjunto completo de chaves e certificados para todos os nós NDB configurados para rodar no host local. O servidor de gerenciamento do cluster deve estar em execução para que isso funcione. Se o servidor de gerenciamento não estiver em execução, o **ndb\_sign\_keys** pode ler o arquivo de configuração do cluster diretamente usando a opção `--config-file`. O **ndb\_sign\_keys** também pode criar um único par de chave-certificado para um único tipo de nó usando `--no-config` para ignorar a configuração do cluster e `--node-type` para especificar o tipo de nó (um dos `mgmd`, `db` ou `api`). Além disso, você deve especificar um nome de host para o certificado com `--bound-hostname=host_name`, ou desabilitar a vinculação de nome de host fornecendo `--bind-host=0`.

A assinatura de chave por um host remoto é realizada conectando-se ao host CA usando **ssh**.

##### 25.6.19.5.3 Usando Conexões TLS

Uma vez que você criou um CA e um certificado, pode testar a disponibilidade da conexão TLS para o servidor de gerenciamento executando o cliente **ndb\_mgm** com `--test-tls`, assim:

```
$> ndb_mgm --test-tls
No valid certificate.
```

Uma mensagem apropriada é gerada se o cliente conseguir se conectar usando TLS. Você pode precisar incluir outras opções de **ndb\_mgm**, como `--ndb-tls-search-path`, para facilitar a conexão TLS, como mostrado aqui:

```
$> ndb_mgm --test-tls --ndb-tls-search-path="CA:keys"
Connected to management server at localhost port 1186 (using TLS)
```

Se o cliente se conectar sem usar TLS, isso também é indicado, de forma semelhante ao que é mostrado aqui:

```
$> ndb_mgm
Connected to management server at localhost port 1186 (using cleartext)
$>
```

Você pode fazer com que o cluster use a CA e os certificados criados com **ndb\_sign\_keys** realizando um reinício contínuo do cluster, começando com os nós de gerenciamento, que devem ser reiniciados usando a opção `--ndb-tls-search-path`. Depois disso, reinicie os nós de dados, novamente usando `--ndb-tls-search-path`. `--ndb-tls-search-path` também é suportado para **mysqld** executado como um nó de API de cluster.

Para que o TLS funcione, cada nó que se conecta ao cluster deve ter um certificado e uma chave válidos. Isso inclui nós de dados, nós de API e programas utilitários. Os mesmos arquivos de certificado e chave podem ser usados por mais de um nó.

Os nós de dados registram a conexão TLS e incluem o caminho completo para o arquivo de certificado usado, como mostrado aqui:

```
$> ndbmtd -c localhost:1186 --ndb-tls-search-path='CA:keys'
2023-12-19 12:02:15 [ndbd] INFO     -- NDB TLS 1.3 available using certificate file 'keys/ndb-data-node-cert'
2023-12-19 12:02:15 [ndbd] INFO     -- Angel connected to 'localhost:1186'
2023-12-19 12:02:15 [ndbd] INFO     -- Angel allocated nodeid: 5
```

Você pode verificar se os nós do cluster estão usando TLS para se conectar verificando a saída do comando `TLS INFO` no cliente **ndb\_mgm**, assim:

```
$> ndb_mgm --ndb-tls-search-path="CA:keys"
-- NDB Cluster -- Management Client --
ndb_mgm> TLS INFO
Connected to management server at localhost port 1186 (using TLS)

Main interactive connection is using TLS
Event listener connection is using TLS

Server reports 6 TLS connections.

  Session ID:          32
  Peer address:        ::
  Certificate name:    NDB Node Dec 2023
  Certificate serial:  39:1E:4A:78:E5:93:45:09:FC:56
  Certificate expires: 21-Apr-2024

  Session ID:          31
  Peer address:        127.0.0.1
  Certificate name:    NDB Node Dec 2023
  Certificate serial:  39:1E:4A:78:E5:93:45:09:FC:56
  Certificate expires: 21-Apr-2024

  Session ID:          30
  Peer address:        127.0.0.1
  Certificate name:    NDB Node Dec 2023
  Certificate serial:  39:1E:4A:78:E5:93:45:09:FC:56
  Certificate expires: 21-Apr-2024

  Session ID:          18
  Peer address:        127.0.0.1
  Certificate name:    NDB Data Node Dec 2023
  Certificate serial:  57:5E:58:70:7C:49:B3:74:1A:99
  Certificate expires: 07-May-2024

  Session ID:          12
  Peer address:        127.0.0.1
  Certificate name:    NDB Data Node Dec 2023
  Certificate serial:  57:5E:58:70:7C:49:B3:74:1A:99
  Certificate expires: 07-May-2024

  Session ID:          1
  Peer address:        127.0.0.1
  Certificate name:    NDB Management Node Dec 2023
  Certificate serial:  32:10:44:3C:F4:7D:73:40:97:41
  Certificate expires: 17-May-2024


    Server statistics since restart
  Total accepted connections:        32
  Total connections upgraded to TLS: 8
  Current connections:               6
  Current connections using TLS:     6
  Authorization failures:            0
ndb_mgm>
```

Se `Conexões atuais` e `Conexões atuais usando TLS` forem as mesmas, isso significa que todas as conexões do cluster estão usando TLS.

Depois de estabelecer conexões TLS para todos os nós, você deve tornar o TLS uma exigência rigorosa. Para clientes, você pode fazer isso configurando `ndb-mgm-tls=strict` no arquivo `my.cnf` em cada host do clúster. Imponha a exigência de TLS no servidor de gerenciamento configurando `RequireTls=true` na seção `[mgm default]` do arquivo `config.ini` do clúster, e então realize um reinício em rolagem do clúster para que essa mudança entre em vigor. Faça isso também para os nós de dados, configurando `RequireTls=true` na seção `[ndbd default]` do arquivo de configuração; depois disso, realize um segundo reinício em rolagem do clúster para que as mudanças entrem em vigor nos nós de dados. Inicie o **ndb\_mgmd** com as opções `--reload` e `--config-file` ambas as vezes para garantir que cada uma das duas mudanças no arquivo de configuração seja lida pelo servidor de gerenciamento.

Para substituir uma chave privada, use **ndb\_sign\_keys** `--create-key` para criar a nova chave e certificado, com as opções `--node-id` e `--node-type` se e quando necessário para limitar a substituição a um único ID de nó, tipo de nó ou ambos. Se a ferramenta encontrar arquivos de chave e certificado existentes, ela renomeia-os para refletir seu status de aposentadoria e salva a nova chave e certificado como arquivos ativos; os novos arquivos são usados na próxima vez que o nó for reiniciado.

Para substituir um certificado sem substituir a chave privada, use **ndb\_sign\_keys** sem fornecer a opção `--create-key`. Isso cria um novo certificado para a chave existente (sem substituir a chave) e aposenta o certificado antigo.

A assinatura remota de chaves também é suportada pelo ndb\_sign\_keys. Usando o SSH, a opção `--remote-CA-host` fornece o endereço SSH do host CA no formato `user@host`. Por padrão, o processo local **ndb\_sign\_keys** usa o utilitário **ssh** do sistema e o endereço para executar **ndb\_sign\_keys** no host remoto com as opções corretas para realizar a assinatura desejada. Alternativamente, se `--remote-openssl=true`, o **openssl** é usado no host remoto em vez do **ndb\_sign\_keys**.

Ao usar a assinatura remota, os dados enviados pela rede são um pedido de assinatura PKCS#10, e não a chave privada, que nunca sai do host local.