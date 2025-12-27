#### 17.6.3.1 O Espaço de Tabelas do Sistema

O espaço de tabelas do sistema é a área de armazenamento para o buffer de alterações. Ele também pode conter dados de tabelas e índices, se as tabelas forem criadas no espaço de tabelas do sistema em vez de espaços de tabelas por arquivo ou espaços de tabelas gerais.

O espaço de tabelas do sistema pode ter um ou mais arquivos de dados. Por padrão, um único arquivo de dados do espaço de tabelas do sistema, denominado `ibdata1`, é criado no diretório de dados. O tamanho e o número de arquivos de dados do espaço de tabelas do sistema são definidos pela opção de inicialização `innodb_data_file_path`. Para informações de configuração, consulte Configuração do Arquivo de Dados do Espaço de Tabelas do Sistema.

Informações adicionais sobre o espaço de tabelas do sistema são fornecidas nos seguintes tópicos na seção:

* Redimensionar o Espaço de Tabelas do Sistema
* Usar Partições de Disco Bruto para o Espaço de Tabelas do Sistema

##### Redimensionar o Espaço de Tabelas do Sistema

Esta seção descreve como aumentar ou diminuir o tamanho do espaço de tabelas do sistema.

###### Aumentar o Tamanho do Espaço de Tabelas do Sistema

A maneira mais fácil de aumentar o tamanho do espaço de tabelas do sistema é configurá-lo para ser auto-extensivo. Para fazer isso, especifique o atributo `autoextend` para o último arquivo de dados na configuração `innodb_data_file_path`, e reinicie o servidor. Por exemplo:

```
innodb_data_file_path=ibdata1:10M:autoextend
```

Quando o atributo `autoextend` é especificado, o arquivo de dados aumenta automaticamente em tamanho em incrementos de 8 MB à medida que o espaço necessário for exigido. A variável `innodb_autoextend_increment` controla o tamanho do incremento.

Você também pode aumentar o tamanho do espaço de tabelas do sistema adicionando outro arquivo de dados. Para fazer isso:

1. Parar o servidor MySQL.
2. Se o último arquivo de dados no ajuste `innodb_data_file_path` estiver definido com o atributo `autoextend`, remova-o e modifique o atributo de tamanho para refletir o tamanho atual do arquivo de dados. Para determinar o tamanho apropriado do arquivo de dados a ser especificado, verifique o tamanho do arquivo no seu sistema de arquivos e arredonde esse valor para o valor mais próximo em MB, onde um MB é igual a 1024 x 1024 bytes.

3. Adicione um novo arquivo de dados ao ajuste `innodb_data_file_path`, optativamente especificando o atributo `autoextend`. O atributo `autoextend` pode ser especificado apenas para o último arquivo de dados no ajuste `innodb_data_file_path`.

4. Inicie o servidor MySQL.

Por exemplo, este espaço de tabelas tem um arquivo de dados auto-extensível:

```
innodb_data_home_dir =
innodb_data_file_path = /ibdata/ibdata1:10M:autoextend
```

Suponha que o arquivo de dados tenha crescido para 988 MB ao longo do tempo. Este é o ajuste `innodb_data_file_path` após a modificação do atributo de tamanho para refletir o tamanho atual do arquivo de dados, e após a especificação de um novo arquivo de dados auto-extensível de 50 MB:

```
innodb_data_home_dir =
innodb_data_file_path = /ibdata/ibdata1:988M;/disk2/ibdata2:50M:autoextend
```

Ao adicionar um novo arquivo de dados, não especifique um nome de arquivo existente. O `InnoDB` cria e inicializa o novo arquivo de dados quando você inicia o servidor.

Observação

Você não pode aumentar o tamanho de um arquivo de dados de um espaço de tabelas do sistema existente alterando seu atributo de tamanho. Por exemplo, alterar o ajuste `innodb_data_file_path` de `ibdata1:10M:autoextend` para `ibdata1:12M:autoextend` produz o seguinte erro ao iniciar o servidor:

```
[ERROR] [MY-012263] [InnoDB] The Auto-extending innodb_system
data file './ibdata1' is of a different size 640 pages (rounded down to MB) than
specified in the .cnf file: initial 768 pages, max 0 (relevant if non-zero) pages!
```

O erro indica que o tamanho do arquivo de dados existente (expresso em páginas `InnoDB`) é diferente do tamanho do arquivo de dados especificado no arquivo de configuração. Se você encontrar esse erro, restaure o ajuste `innodb_data_file_path` anterior e consulte as instruções de redimensionamento do espaço de tabelas do sistema.

###### Reduzindo o Tamanho do Espaço de Tabelas do Sistema InnoDB

A redução do tamanho de um espaço de tabelas de sistema existente não é suportada. A única opção para obter um espaço de tabelas de sistema menor é restaurar seus dados de um backup para uma nova instância do MySQL criada com a configuração desejada do tamanho do espaço de tabelas de sistema.

Para obter informações sobre a criação de backups, consulte a Seção 17.18.1, “Backup do InnoDB”.

Para obter informações sobre a configuração dos arquivos de dados para um novo espaço de tabelas de sistema. Consulte Configuração de Arquivo de Dados do Espaço de Tabelas de Sistema.

Para evitar um grande espaço de tabelas de sistema, considere usar espaços de tabelas por arquivo ou espaços de tabelas gerais para seus dados. Os espaços de tabelas por arquivo são o tipo de espaço de tabela padrão e são usados implicitamente ao criar uma tabela `InnoDB`. Ao contrário do espaço de tabelas de sistema, os espaços de tabelas por arquivo devolvem espaço em disco ao sistema operacional quando são truncados ou removidos. Para mais informações, consulte a Seção 17.6.3.2, “Espaços de Tabelas por Arquivo”. Os espaços de tabelas gerais são espaços de tabelas multitabela que também podem ser usados como alternativa ao espaço de tabelas de sistema. Consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

##### Usando Partições de Disco Bruto para o Espaço de Tabelas de Sistema

Partições de disco bruto podem ser usadas como arquivos de dados do espaço de tabelas de sistema. Essa técnica permite o I/O não bufferado no Windows e em alguns sistemas Linux e Unix sem sobrecarga do sistema de arquivos. Realize testes com e sem partições brutas para verificar se elas melhoram o desempenho do seu sistema.

Ao usar uma partição de disco bruto, garanta que o ID de usuário que executa o servidor MySQL tenha privilégios de leitura e escrita para essa partição. Por exemplo, se o servidor estiver sendo executado como o usuário `mysql`, a partição deve ser legível e gravável por `mysql`. Se o servidor estiver sendo executado com a opção `--memlock`, o servidor deve ser executado como `root`, então a partição deve ser legível e gravável por `root`.

Os procedimentos descritos abaixo envolvem a modificação do arquivo de opção. Para obter informações adicionais, consulte a Seção 6.2.2.2, “Usando arquivos de opção”.

###### Alocação de uma Partição de Disco Bruto no Linux e Sistemas Unix

1. Para usar um dispositivo bruto para uma nova instância do servidor, primeiro prepare o arquivo de configuração definindo `innodb_data_file_path` com a palavra-chave `raw`. Por exemplo:

   ```
   [mysqld]
   innodb_data_home_dir=
   innodb_data_file_path=/dev/hdd1:3Graw;/dev/hdd2:2Graw
   ```

   A partição deve ter pelo menos o tamanho que você especificar. Observe que 1MB no `InnoDB` é 1024 × 1024 bytes, enquanto 1MB nas especificações de disco geralmente significa 1.000.000 de bytes.

2. Em seguida, inicie o servidor pela primeira vez usando `--initialize` ou `--initialize-insecure`. O `InnoDB` nota a palavra-chave `raw` e inicializa a nova partição, e então ele para o servidor.

3. Agora reinicie o servidor. O `InnoDB` agora permite que alterações sejam feitas.

###### Alocação de uma Partição de Disco Bruto no Windows

Nos sistemas Windows, os mesmos passos e diretrizes que descrevemos para sistemas Linux e Unix se aplicam, exceto que o ajuste `innodb_data_file_path` difere ligeiramente no Windows. Por exemplo:

```
[mysqld]
innodb_data_home_dir=
innodb_data_file_path=//./D::10Graw
```

O `//./` corresponde à sintaxe do Windows de `\\.\` para acessar unidades físicas. No exemplo acima, `D:` é a letra da unidade da partição.