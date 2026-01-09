#### 25.6.19.4 Criptografia do Sistema de Arquivos do NDB Cluster

As seções a seguir fornecem informações sobre a criptografia do sistema de arquivos do nó de dados `NDB`.

##### 25.6.19.4.1 Configuração e Uso da Criptografia do Sistema de Arquivos

*Criptografia do sistema de arquivos*: Para habilitar a criptografia de um sistema de arquivos anteriormente não criptografado, são necessários os seguintes passos:

1. Defina os parâmetros necessários do nó de dados no trecho `[ndbd default]` do arquivo `config.ini`, conforme mostrado aqui:

   ```
   [ndbd default]
   EncryptedFileSystem= 1
   ```

   Esses parâmetros devem ser definidos como mostrado em todos os nós de dados.

2. Inicie o servidor de gerenciamento com `--initial` ou `--reload` para fazer com que ele leia o arquivo de configuração atualizado.

3. Realize um inicial incial rolante (ou reinicie) de todos os nós de dados (consulte a Seção 25.6.5, “Realizando um Reinício Inicial Rolante de um NDB Cluster”): Inicie cada nó de dados com `--initial`; além disso, forneça a opção `--filesystem-password` ou `--filesystem-password-from-stdin`, além de uma senha, a cada processo do nó de dados. Quando você fornece a senha na linha de comando, uma mensagem de aviso é exibida, semelhante a esta:

   ```
   > ndbmtd -c 127.0.0.1 --filesystem-password=ndbsecret
   ndbmtd: [Warning] Using a password on the command line interface can be insecure.
   2022-08-22 16:17:58 [ndbd] INFO     -- Angel connected to '127.0.0.1:1186'
   2022-08-22 16:17:58 [ndbd] INFO     -- Angel allocated nodeid: 5
   ```

   `--filesystem-password` pode aceitar a senha de um arquivo, `tty` ou `stdin`; `--filesystem-password-from-stdin` aceita a senha apenas de `stdin`. Este último protege a senha da exposição na linha de comando do processo ou no sistema de arquivos, e permite a possibilidade de passá-la de outra aplicação segura.

   Você também pode colocar a senha em um arquivo `my.cnf` que pode ser lido pelo processo do nó de dados, mas não por outros usuários do sistema. Usando a mesma senha do exemplo anterior, a parte relevante do arquivo deve parecer assim:

   ```
   [ndbd]

   filesystem-password=ndbsecret
   ```

Você também pode solicitar ao usuário que inicie o processo do nó de dados para fornecer a senha de criptografia ao fazer isso, usando a opção `--filesystem-password-from-stdin` no arquivo `my.cnf`, assim:

```
   [ndbd]

   filesystem-password-from-stdin
   ```

Neste caso, o usuário é solicitado para fornecer a senha quando iniciar o processo do nó de dados, conforme mostrado aqui:

```
   > ndbmtd -c 127.0.0.1
   Enter filesystem password: *********
   2022-08-22 16:36:00 [ndbd] INFO     -- Angel connected to '127.0.0.1:1186'
   2022-08-22 16:36:00 [ndbd] INFO     -- Angel allocated nodeid: 5
   >
   ```

Independentemente do método usado, o formato da senha de criptografia é o mesmo usado para senhas de backups criptografados (veja a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”); a senha deve ser fornecida ao iniciar cada processo do nó de dados; caso contrário, o processo do nó de dados não pode ser iniciado. Isso é indicado pela seguinte mensagem no log do nó de dados:

```
   > tail -n2 ndb_5_out.log
   2022-08-22 16:08:30 [ndbd] INFO     -- Data node configured to have encryption but password not provided
   2022-08-22 16:08:31 [ndbd] ALERT    -- Node 5: Forced node shutdown completed. Occurred during startphase 0.
   ```

Quando reiniciado como descrito anteriormente, cada nó de dados limpa seu estado no disco e o reconstrui em forma criptografada.

*Rotacionar a senha do sistema de arquivos*: Para atualizar a senha de criptografia usada pelos nós de dados, realize um reinício inicial rolante dos nós de dados, fornecendo a nova senha a cada nó de dados ao reiniciá-lo usando `--filesystem-password` ou `--filesystem-password-from-stdin`.

*Descriptografar o sistema de arquivos*: Para remover a criptografia de um sistema de arquivos criptografado, faça o seguinte:

1. Na seção `[ndbd default]` do arquivo `config.ini`, defina `EncryptedFileSystem = OFF`.

2. Reinicie o servidor de gerenciamento com `--initial` ou `--reload`.

3. Realize um reinício inicial rolante dos nós de dados. Não use opções relacionadas à senha ao reiniciar os binários do nó.

Quando reiniciado, cada nó de dados limpa seu estado no disco e o reconstrui em forma não criptografada.

Para verificar se a criptografia do sistema de arquivos está configurada corretamente, você pode usar uma consulta nas tabelas `config_values` e `config_params` do `ndbinfo` semelhante a esta:

```
mysql> SELECT v.node_id AS Node, p.param_name AS Parameter, v.config_value AS Value
    ->    FROM ndbinfo.config_values v
    ->  JOIN ndbinfo.config_params p
    ->    ON v.config_param=p.param_number
    ->  WHERE p.param_name='EncryptedFileSystem';
+------+----------------------+-------+
| Node | Parameter            | Value |
+------+----------------------+-------+
|    5 | EncryptedFileSystem  | 1     |
|    6 | EncryptedFileSystem  | 1     |
|    7 | EncryptedFileSystem  | 1     |
|    8 | EncryptedFileSystem  | 1     |
+------+----------------------+-------+
4 rows in set (0.10 sec)
```

Aqui, `EncryptedFileSystem` é igual a `1` em todos os nós de dados, o que significa que a criptografia do sistema de arquivos está habilitada para este clúster.

##### 25.6.19.4.2 Implementação da Criptografia do Sistema de Arquivos NDB

Para a Criptografia de Dados Transparente (TDE) `NDB`, os nós de dados criptografam os dados dos usuários em repouso, com segurança fornecida por uma senha (senha do sistema de arquivos), que é usada para criptografar e descriptografar um arquivo de segredos em cada nó de dados. O arquivo de segredos contém uma Chave Mestre do Nó (NMK), uma chave usada mais tarde para criptografar os diferentes tipos de arquivos usados para persistência. A TDE `NDB` criptografa arquivos de dados dos usuários, incluindo arquivos LCP, arquivos de log de redo, arquivos de espaço de tabelas e arquivos de log de undo.

Você pode usar o utilitário **ndbxfrm** para verificar se um arquivo está criptografado, como mostrado aqui:

```
> ndbxfrm -i ndb_5_fs/LCP/0/T2F0.Data
File=ndb_5_fs/LCP/0/T2F0.Data, compression=no, encryption=yes
> ndbxfrm -i ndb_6_fs/LCP/0/T2F0.Data
File=ndb_6_fs/LCP/0/T2F0.Data, compression=no, encryption=no
```

É possível obter a chave do arquivo de segredos usando o programa **ndb_secretsfile_reader**, da seguinte maneira:

```
> ndb_secretsfile_reader --filesystem-password=54kl14 ndb_5_fs/D1/NDBCNTR/S0.sysfile
ndb_secretsfile_reader: [Warning] Using a password on the command line interface can be insecure.
cac256e18b2ddf6b5ef82d99a72f18e864b78453cc7fa40bfaf0c40b91122d18
```

A hierarquia de chaves por nó pode ser representada da seguinte forma:

* Uma senha fornecida pelo usuário (P) é processada por uma função de derivação de chave usando um sal aleatório para gerar uma chave de fase de senha (PK) única.

* A PK (única para cada nó) criptografa os dados em cada nó em seu próprio arquivo de segredos.

* Os dados no arquivo de segredos incluem uma Chave Mestre do Nó (NMK) única e gerada aleatoriamente.

* A NMK criptografa (usando enrolamento) um ou mais valores de chave de criptografia de dados (DEK) gerados aleatoriamente no cabeçalho de cada arquivo criptografado (incluindo arquivos LCP e TS, e logs de redo e undo).

* Os valores das chaves de criptografia de dados (DEK0, ..., DEKn) são usados para criptografar [subconjuntos de] dados em cada arquivo.

A senha indiretamente criptografa o arquivo de segredos que contém o NMK aleatório, que criptografa uma parte do cabeçalho de cada arquivo criptografado no nó. O cabeçalho do arquivo criptografado contém chaves de dados aleatórias usadas para os dados desse arquivo.

A criptografia é implementada de forma transparente pela camada `NDBFS` nos nós de dados. Os blocos internos do cliente `NDBFS` operam com seus arquivos normalmente; `NDBFS` envolve o arquivo físico com informações de cabeçalho e rodapé extras que suportam a criptografia, e criptografa e descriptografa os dados conforme eles são lidos e escritos no arquivo. O formato de arquivo envolvido é referido como `ndbxfrm1`.

A senha do nó é processada com PBKDF2 e o sal aleatório para criptografar o arquivo de segredos, que contém o NMK gerado aleatoriamente, que é usado para criptografar a chave de criptografia de dados gerada aleatoriamente em cada arquivo criptografado.

O trabalho de criptografia e descriptografia é realizado nas threads de E/S do NDBFS (em vez de em threads de execução de sinal, como main, tc, ldm ou rep). Isso é semelhante ao que acontece com LCPs comprimidos e backups comprimidos, e normalmente resulta em aumento do uso da CPU das threads de E/S; você pode querer ajustar `ThreadConfig` (se estiver em uso) em relação às threads de E/S.

##### 25.6.19.4.3 Criptografia do Sistema de Arquivos NDB

A criptografia de dados transparente no NDB Cluster está sujeita às seguintes restrições e limitações:

* A senha do sistema de arquivos deve ser fornecida a cada nó de dados individual.

* A rotação da senha do sistema de arquivos requer um reinício inicial em rotação dos nós de dados; isso deve ser feito manualmente ou por uma aplicação externa ao `NDB`).

* Para um clúster com apenas uma replica (`NoOfReplicas = 1`), é necessário um backup e restauração completos para a rotação da senha do sistema de arquivos.

* A rotação de todas as chaves de criptografia de dados requer o reinício inicial do nó.

**NDB TDE e NDB Replication.** O uso de um sistema de arquivos criptografado não tem nenhum efeito na NDB Replication. Todos os seguintes cenários são suportados:

* Replicação de um NDB Cluster com um sistema de arquivos criptografado para um NDB Cluster cujo sistema de arquivos não está criptografado.

* Replicação de um NDB Cluster cujo sistema de arquivos não está criptografado para um NDB Cluster cujo sistema de arquivos está criptografado.

* Replicação de um NDB Cluster cujo sistema de arquivos está criptografado para um servidor MySQL autônomo usando tabelas `InnoDB` que não estão criptografadas.

* Replicação de um NDB Cluster com um sistema de arquivos não criptografado para um servidor MySQL autônomo usando tabelas `InnoDB` com criptografia de sistema de arquivos.