#### 14.6.3.1 Espaço de Tabela do Sistema

O espaço de tabela do sistema é a área de armazenamento para o dicionário de dados `InnoDB`, o buffer de escrita dupla, o buffer de alterações e os registros de desfazer. Ele também pode conter dados de tabelas e índices se as tabelas forem criadas no espaço de tabela do sistema, em vez de espaços de tabela por arquivo ou espaços de tabelas gerais.

O espaço de tabela do sistema pode ter um ou mais arquivos de dados. Por padrão, um único arquivo de dados do espaço de tabela do sistema, denominado `ibdata1`, é criado no diretório de dados. O tamanho e o número de arquivos de dados do espaço de tabela do sistema são definidos pela opção de inicialização `innodb_data_file_path`. Para informações de configuração, consulte Configuração do Arquivo de Dados do Espaço de Tabela do Sistema.

Informações adicionais sobre o espaço de tabela do sistema estão fornecidas nos tópicos a seguir na seção:

- Redimensionar o espaço de tabela do sistema
- Usando Partições de Disco Bruto para o Espaço de Tabela do Sistema

##### Redimensionar o espaço de tabela do sistema

Esta seção descreve como aumentar ou diminuir o tamanho do espaço de tabela do sistema.

###### Aumentar o espaço de tabelas do sistema

A maneira mais fácil de aumentar o tamanho do espaço de tabela do sistema é configurá-lo para ser autoextensivo. Para fazer isso, especifique o atributo `autoextend` para o último arquivo de dados na configuração `innodb_data_file_path` e reinicie o servidor. Por exemplo:

```sql
innodb_data_file_path=ibdata1:10M:autoextend
```

Quando o atributo `autoextend` é especificado, o arquivo de dados aumenta automaticamente em incrementos de 8 MB à medida que o espaço necessário é necessário. A variável `innodb_autoextend_increment` controla o tamanho do incremento.

Você também pode aumentar o tamanho do espaço de tabela do sistema adicionando outro arquivo de dados. Para fazer isso:

1. Pare o servidor MySQL.

2. Se o último arquivo de dados na configuração `innodb_data_file_path` estiver definido com o atributo `autoextend`, remova-o e modifique o atributo de tamanho para refletir o tamanho atual do arquivo de dados. Para determinar o tamanho apropriado do arquivo de dados a ser especificado, verifique o tamanho do arquivo no seu sistema de arquivos e arredonde esse valor para o valor mais próximo em MB, onde um MB é igual a 1024 x 1024 bytes.

3. Adicione um novo arquivo de dados ao ajuste `innodb_data_file_path`, especificando opcionalmente o atributo `autoextend`. O atributo `autoextend` pode ser especificado apenas para o último arquivo de dados no ajuste `innodb_data_file_path`.

4. Inicie o servidor MySQL.

Por exemplo, este tablespace tem um arquivo de dados com expansão automática:

```sql
innodb_data_home_dir =
innodb_data_file_path = /ibdata/ibdata1:10M:autoextend
```

Suponha que o arquivo de dados tenha crescido para 988 MB ao longo do tempo. Este é o ajuste `innodb_data_file_path` após a modificação do atributo de tamanho para refletir o tamanho atual do arquivo de dados e após a especificação de um novo arquivo de dados auto-extensível de 50 MB:

```sql
innodb_data_home_dir =
innodb_data_file_path = /ibdata/ibdata1:988M;/disk2/ibdata2:50M:autoextend
```

Ao adicionar um novo arquivo de dados, não especifique um nome de arquivo existente. O `InnoDB` cria e inicializa o novo arquivo de dados quando você inicia o servidor.

Nota

Você não pode aumentar o tamanho de um arquivo de dados de espaço de tabela de sistema existente alterando seu atributo de tamanho. Por exemplo, alterar o ajuste `innodb_data_file_path` de `ibdata1:10M:autoextend` para `ibdata1:12M:autoextend` produz o seguinte erro ao iniciar o servidor:

```sql
[ERROR] [MY-012263] [InnoDB] The Auto-extending innodb_system
data file './ibdata1' is of a different size 640 pages (rounded down to MB) than
specified in the .cnf file: initial 768 pages, max 0 (relevant if non-zero) pages!
```

O erro indica que o tamanho do arquivo de dados existente (expresso em páginas `InnoDB`) é diferente do tamanho do arquivo de dados especificado no arquivo de configuração. Se você encontrar esse erro, restaure o valor anterior do `innodb_data_file_path` e consulte as instruções para o redimensionamento do espaço de tabela do sistema.

###### Reduzindo o tamanho do espaço de tabela do InnoDB

Você não pode remover um arquivo de dados do espaço de tabelas do sistema. Para diminuir o tamanho do espaço de tabelas do sistema, use este procedimento:

1. Use o **mysqldump** para fazer o dump de todas as suas tabelas `InnoDB`, incluindo as tabelas `InnoDB` localizadas no esquema `mysql`. Identifique as tabelas `InnoDB` no esquema `mysql` usando a seguinte consulta:

   ```sql
   mysql> SELECT TABLE_NAME from INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='mysql' and ENGINE='InnoDB';
   +---------------------------+
   | TABLE_NAME                |
   +---------------------------+
   | engine_cost               |
   | gtid_executed             |
   | help_category             |
   | help_keyword              |
   | help_relation             |
   | help_topic                |
   | innodb_index_stats        |
   | innodb_table_stats        |
   | plugin                    |
   | server_cost               |
   | servers                   |
   | slave_master_info         |
   | slave_relay_log_info      |
   | slave_worker_info         |
   | time_zone                 |
   | time_zone_leap_second     |
   | time_zone_name            |
   | time_zone_transition      |
   | time_zone_transition_type |
   +---------------------------+
   ```

2. Pare o servidor.

3. Remova todos os arquivos do espaço de tabela existentes (`*.ibd`), incluindo os arquivos `ibdata` e `ib_log`. Não se esqueça de remover os arquivos `*.ibd` para tabelas localizadas no esquema `mysql`.

4. Remova quaisquer arquivos `.frm` para as tabelas do `InnoDB`.

5. Configure os arquivos de dados para o novo espaço de tabela do sistema. Consulte Configuração de Arquivo de Dados do Espaço de Tabela do Sistema.

6. Reinicie o servidor.

7. Importe os arquivos de dump.

Nota

Se suas bases de dados usam apenas o motor `InnoDB`, pode ser mais simples fazer o dump de **todas** as bases de dados, parar o servidor, remover todos os arquivos de log do `InnoDB`, reiniciar o servidor e importar os arquivos de dump.

Para evitar um grande espaço de tabelas do sistema, considere usar espaços de tabelas por arquivo ou espaços de tabelas gerais para seus dados. Os espaços de tabelas por arquivo são o tipo padrão de espaço de tabelas e são usados implicitamente ao criar uma tabela `InnoDB`. Ao contrário do espaço de tabelas do sistema, os espaços de tabelas por arquivo devolvem espaço em disco ao sistema operacional quando são truncados ou excluídos. Para obter mais informações, consulte a Seção 14.6.3.2, “Espaços de tabelas por arquivo”. Os espaços de tabelas gerais são espaços de tabelas multitabela que também podem ser usados como alternativa ao espaço de tabelas do sistema. Consulte a Seção 14.6.3.3, “Espaços de tabelas gerais”.

##### Usando Partições de Disco Bruto para o Espaço de Tabela do Sistema

As partições de disco bruto podem ser usadas como arquivos de dados do espaço de tabela do sistema. Essa técnica permite o I/O sem buffer em sistemas Windows e alguns sistemas Linux e Unix sem sobrecarga do sistema de arquivos. Realize testes com e sem partições brutais para verificar se elas melhoram o desempenho do seu sistema.

Ao usar uma partição de disco bruto, certifique-se de que o ID do usuário que executa o servidor MySQL tenha privilégios de leitura e escrita para essa partição. Por exemplo, se o servidor estiver sendo executado como o usuário `mysql`, a partição deve ser legível e gravável pelo `mysql`. Se o servidor estiver sendo executado com a opção `--memlock`, o servidor deve ser executado como `root`, então a partição deve ser legível e gravável pelo `root`.

Os procedimentos descritos abaixo envolvem a modificação de arquivos de opção. Para obter informações adicionais, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.

###### Alocar uma Partição de Disco Bruto em Sistemas Linux e Unix

1. Para usar um dispositivo bruto para uma nova instância do servidor, prepare primeiro o arquivo de configuração definindo `innodb_data_file_path` com a palavra-chave `raw`. Por exemplo:

   ```sql
   [mysqld]
   innodb_data_home_dir=
   innodb_data_file_path=/dev/hdd1:3Graw;/dev/hdd2:2Graw
   ```

   A partição deve ter pelo menos o tamanho especificado. Observe que 1 MB no `InnoDB` é 1024 × 1024 bytes, enquanto 1 MB nas especificações de disco geralmente significa 1.000.000 de bytes.

2. Em seguida, inicie o servidor pela primeira vez usando `--initialize` ou `--initialize-insecure`. O InnoDB percebe a palavra-chave `raw` e inicia a nova partição, e depois ele para o servidor.

3. Agora, reinicie o servidor. O `InnoDB` agora permite que alterações sejam feitas.

###### Alocar uma partição de disco bruto no Windows

Nos sistemas Windows, os mesmos passos e diretrizes que acompanham as descrições para sistemas Linux e Unix se aplicam, exceto que o ajuste `innodb_data_file_path` difere ligeiramente no Windows. Por exemplo:

```sql
[mysqld]
innodb_data_home_dir=
innodb_data_file_path=//./D::10Graw
```

O `//./` corresponde à sintaxe do Windows de `\\.\` para acessar unidades físicas. No exemplo acima, `D:` é a letra da unidade da partição.
